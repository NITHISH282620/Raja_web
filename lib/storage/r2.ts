import "server-only";

/**
 * Object storage.
 *
 * Two buckets, both private. Nothing here ever returns a public URL for the
 * private one: `raja-private-documents` holds client RFPs and BOQs, and the
 * only way out is an authenticated route that streams the bytes after checking
 * the session.
 *
 * Access is by Worker binding, not by S3 credentials. A binding cannot be
 * copied out of the deployment, cannot be replayed from a laptop, and has no
 * key to rotate — which is worth more here than the convenience of the S3 API.
 *
 * WHEN THERE IS NO BINDING. Plain `next dev` on Node has no Cloudflare
 * runtime, so uploads there throw a named error rather than falling back to the
 * local disk. That fallback is exactly what this migration removed: a write
 * that silently lands on an ephemeral filesystem looks like it worked and is
 * gone at the next deploy.
 */

export type BucketName = "PUBLIC_MEDIA" | "PRIVATE_DOCS";

interface R2ObjectBody {
  body: ReadableStream | null;
  httpMetadata?: { contentType?: string };
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
}

interface R2Bucket {
  put(key: string, value: ArrayBuffer | ReadableStream | string,
      opts?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  get(key: string): Promise<R2ObjectBody | null>;
  delete(key: string): Promise<void>;
  head(key: string): Promise<{ size: number } | null>;
}

export class StorageUnavailableError extends Error {
  constructor(bucket: BucketName) {
    super(
      `R2 binding ${bucket} is not available in this runtime. ` +
        `Uploads require the Worker (wrangler dev, or a deployed Worker).`,
    );
    this.name = "StorageUnavailableError";
  }
}

/**
 * Resolves a bucket binding from the Workers runtime.
 *
 * The import is dynamic and guarded because `cloudflare:workers` does not exist
 * under Node, and a static import would break `next build` on the build machine.
 */
async function bucket(name: BucketName): Promise<R2Bucket> {
  try {
    const mod = (await import(/* webpackIgnore: true */ "cloudflare:workers")) as {
      env?: Record<string, unknown>;
    };
    const binding = mod.env?.[name];
    if (binding) return binding as R2Bucket;
  } catch {
    // not running under Workers
  }
  throw new StorageUnavailableError(name);
}

/** True when object storage can actually be written to right now. */
export async function storageAvailable(name: BucketName): Promise<boolean> {
  try {
    await bucket(name);
    return true;
  } catch {
    return false;
  }
}

export async function putObject(
  name: BucketName,
  key: string,
  body: ArrayBuffer,
  contentType?: string,
): Promise<void> {
  const b = await bucket(name);
  await b.put(key, body, contentType ? { httpMetadata: { contentType } } : undefined);
}

export async function getObject(
  name: BucketName,
  key: string,
): Promise<{ bytes: ArrayBuffer; contentType?: string } | null> {
  const b = await bucket(name);
  const obj = await b.get(key);
  if (!obj) return null;
  return { bytes: await obj.arrayBuffer(), contentType: obj.httpMetadata?.contentType };
}

export async function deleteObject(name: BucketName, key: string): Promise<void> {
  const b = await bucket(name);
  await b.delete(key);
}

/**
 * Where a private document lives.
 *
 * Namespaced by enquiry so an object key cannot be guessed from a filename, and
 * so deleting an enquiry's attachments is a prefix operation rather than a
 * lookup.
 */
export function privateKey(reference: string, filename: string): string {
  const safe = filename.replace(/[^A-Za-z0-9._-]/g, "_").slice(-120);
  return `enquiries/${reference}/${crypto.randomUUID()}-${safe}`;
}

/** Where an uploaded public image lives. */
export function publicKey(id: string, ext: string): string {
  return `uploads/${id}.${ext.replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin"}`;
}
