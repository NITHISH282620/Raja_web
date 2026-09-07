import { getObject } from "@/lib/storage/r2";

/**
 * Serves an uploaded image out of R2.
 *
 * The bucket has no public access, no r2.dev URL and no custom domain — which
 * is deliberate — so an uploaded photograph needs a way back out. This is it.
 *
 * The 107 images that shipped with the site still come straight from
 * `public/media` as static files; only images the owner uploads afterwards go
 * through here.
 *
 * Keys are content-addressed (a UUID chosen at upload), so the bytes behind a
 * URL never change and the response can be cached for a year. That matters:
 * without it every visitor would re-fetch every uploaded image through the
 * origin on every page view.
 *
 * The content type is taken from what R2 stored, not from the request, and
 * anything unexpected is served as a download rather than rendered inline —
 * serving an uploaded file inline under the site's own origin with a type the
 * uploader chose is how an upload field becomes a stored-XSS hole.
 */

const RENDERABLE = new Set([
  "image/webp", "image/png", "image/jpeg", "image/gif", "image/avif", "image/svg+xml",
  "video/mp4", "video/webm",
]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const key = `uploads/${path.join("/")}`;

  // No traversal, no absolute keys: the path segments come from the URL.
  if (path.some((p) => p === ".." || p === "." || p.includes("\\"))) {
    return new Response("Not found", { status: 404 });
  }

  let object;
  try {
    object = await getObject("PUBLIC_MEDIA", key);
  } catch (error) {
    console.error(`[uploads] could not read ${key}`, error);
    return new Response("Unavailable", { status: 503 });
  }
  if (!object) return new Response("Not found", { status: 404 });

  const type = object.contentType ?? "application/octet-stream";
  const renderable = RENDERABLE.has(type);

  return new Response(object.bytes, {
    headers: {
      "content-type": renderable ? type : "application/octet-stream",
      ...(renderable ? {} : { "content-disposition": "attachment" }),
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
    },
  });
}
