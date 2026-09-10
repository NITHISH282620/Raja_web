import "server-only";
import { AwsClient } from "aws4fetch";

/**
 * Object storage.
 *
 * Two buckets, both private. Nothing here ever returns a public URL for either
 * one: `raja-private-documents` holds client RFPs and BOQs, and uploaded images
 * are streamed back through an application route that sets its own cache
 * headers. Neither bucket has r2.dev public access or a custom domain.
 *
 * TWO WAYS IN, because the application runs in two places.
 *
 *   On Cloudflare Workers, a native R2 binding. A binding cannot be copied out
 *   of the deployment, cannot be replayed from a laptop, and has no key to
 *   rotate — which is worth more than the convenience of the S3 API.
 *
 *   Anywhere else (Vercel, a local Node server), the S3-compatible API with
 *   signed requests. Bindings simply do not exist off Workers, and the
 *   alternative — writing uploads to local disk — is what this migration
 *   removed: a write that lands on an ephemeral filesystem looks like it worked
 *   and is gone at the next deploy.
 *
 * The binding is preferred whenever it is present, so moving to Workers later
 * costs nothing and the credentials stop being used.
 */

export type BucketName = "PUBLIC_MEDIA" | "PRIVATE_DOCS";

const BUCKET_FOR: Record<BucketName, string> = {
  PUBLIC_MEDIA: "raja-public-media",
  PRIVATE_DOCS: "raja-private-documents",
};

interface R2ObjectBody {
  httpMetadata?: { contentType?: string };
  arrayBuffer(): Promise<ArrayBuffer>;
}

interface R2Bucket {
  put(key: string, value: ArrayBuffer, opts?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  get(key: string): Promise<R2ObjectBody | null>;
  delete(key: string): Promise<void>;
}

export class StorageUnavailableError extends Error {
  constructor(bucket: BucketName) {
    super(
      `Object storage for ${bucket} is not configured. Provide either an R2 ` +
        `binding (Workers) or R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY.`,
    );
    this.name = "StorageUnavailableError";
  }
}

/* ------------------------------------------------------------- binding -- */

/**
 * The Workers R2 binding, when running under Workers.
 *
 * The import is dynamic and guarded because `cloudflare:workers` does not exist
 * under Node, and a static import would break the build on the build machine.
 */
async function binding(name: BucketName): Promise<R2Bucket | null> {
  try {
    const mod = (await import(/* webpackIgnore: true */ "cloudflare:workers")) as {
      env?: Record<string, unknown>;
    };
    return (mod.env?.[name] as R2Bucket) ?? null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------ S3 client -- */

function s3(): { client: AwsClient; endpoint: string } | null {
  const account = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!account || !accessKeyId || !secretAccessKey) return null;
  return {
    // R2's S3 endpoint ignores the region, but SigV4 requires one to sign with.
    client: new AwsClient({ accessKeyId, secretAccessKey, service: "s3", region: "auto" }),
    endpoint: `https://${account}.r2.cloudflarestorage.com`,
  };
}

const objectUrl = (endpoint: string, name: BucketName, key: string) =>
  `${endpoint}/${BUCKET_FOR[name]}/${key.split("/").map(encodeURIComponent).join("/")}`;

/* --------------------------------------------------------------- API -- */

/** True when object storage can actually be reached right now. */
export async function storageAvailable(name: BucketName): Promise<boolean> {
  return Boolean((await binding(name)) ?? s3());
}

export async function putObject(
  name: BucketName,
  key: string,
  body: ArrayBuffer,
  contentType?: string,
): Promise<void> {
  const b = await binding(name);
  if (b) {
    await b.put(key, body, contentType ? { httpMetadata: { contentType } } : undefined);
    return;
  }

  const aws = s3();
  if (!aws) throw new StorageUnavailableError(name);
  /*
   * Content-Length is set explicitly, and that is not optional.
   *
   * R2's S3 endpoint answers 411 "Length Required" to a PUT without one. Small
   * bodies happen to get the header for free, because the runtime inlines them
   * and can measure them; anything large enough to be streamed goes out with
   * chunked encoding and no length, and is refused. The result was an upload
   * that worked for a 20 KB file and failed for a 100 KB one — which reads
   * like a size limit and is really a missing header.
   */
  const headers: Record<string, string> = {
    "content-length": String(body.byteLength),
  };
  if (contentType) headers["content-type"] = contentType;

  const res = await aws.client.fetch(objectUrl(aws.endpoint, name, key), {
    method: "PUT",
    body,
    headers,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`R2 put failed (${res.status}) for ${key}${detail ? `: ${detail.slice(0, 160)}` : ""}`);
  }
}

export async function getObject(
  name: BucketName,
  key: string,
): Promise<{ bytes: ArrayBuffer; contentType?: string } | null> {
  const b = await binding(name);
  if (b) {
    const obj = await b.get(key);
    if (!obj) return null;
    return { bytes: await obj.arrayBuffer(), contentType: obj.httpMetadata?.contentType };
  }

  const aws = s3();
  if (!aws) throw new StorageUnavailableError(name);
  const res = await aws.client.fetch(objectUrl(aws.endpoint, name, key));
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`R2 get failed (${res.status}) for ${key}`);
  return {
    bytes: await res.arrayBuffer(),
    contentType: res.headers.get("content-type") ?? undefined,
  };
}

export async function deleteObject(name: BucketName, key: string): Promise<void> {
  const b = await binding(name);
  if (b) {
    await b.delete(key);
    return;
  }
  const aws = s3();
  if (!aws) throw new StorageUnavailableError(name);
  const res = await aws.client.fetch(objectUrl(aws.endpoint, name, key), { method: "DELETE" });
  if (!res.ok && res.status !== 404) throw new Error(`R2 delete failed (${res.status}) for ${key}`);
}

/**
 * Where a private document lives.
 *
 * Namespaced by enquiry so a key cannot be guessed from a filename, and so
 * removing an enquiry's attachments is a prefix operation rather than a lookup.
 */
export function privateKey(reference: string, filename: string): string {
  const safe = filename.replace(/[^A-Za-z0-9._-]/g, "_").slice(-120);
  return `enquiries/${reference}/${crypto.randomUUID()}-${safe}`;
}

/** Where an uploaded public image lives. */
export function publicKey(id: string, ext: string): string {
  return `uploads/${id}.${ext.replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin"}`;
}
