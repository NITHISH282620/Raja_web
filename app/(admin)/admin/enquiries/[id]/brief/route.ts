import { query } from "@/lib/db/neon";
import { currentUser } from "@/lib/auth";
import { getObject } from "@/lib/storage/r2";
import { recordAudit } from "@/lib/audit";

/**
 * Serves an attached brief back to a signed-in administrator.
 *
 * The file now lives in `raja-private-documents`, which has no public access,
 * no r2.dev URL and no custom domain — this route is the only way out, and it
 * checks the session before touching storage.
 *
 * Content-Disposition is `attachment` and the type is forced to a generic
 * octet-stream rather than echoing the browser-supplied MIME back: serving an
 * uploaded file inline, under the site's own origin, with a type the uploader
 * chose, is how an upload field becomes a stored-XSS hole.
 *
 * A 404 rather than a 403 for an unauthenticated caller, so the route does not
 * confirm which enquiry ids exist.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await currentUser();
  if (!user) return new Response("Not found", { status: 404 });

  const { id } = await params;

  const rows = await query<{ object_key: string; original_filename: string }>(
    `SELECT object_key, original_filename
       FROM enquiry_files WHERE enquiry_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [id],
  );
  const row = rows[0];
  if (!row) return new Response("Not found", { status: 404 });

  const object = await getObject("PRIVATE_DOCS", row.object_key);
  if (!object) return new Response("Not found", { status: 404 });

  // Opening a client's commercial document is exactly the kind of act that has
  // to be attributable later.
  await recordAudit(user, "document_access", "enquiry", id, { key: row.object_key });

  return new Response(object.bytes, {
    headers: {
      "content-type": "application/octet-stream",
      "content-disposition": `attachment; filename="${row.original_filename.replace(/"/g, "")}"`,
      "cache-control": "private, no-store",
    },
  });
}
