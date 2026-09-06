import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

/**
 * Serves an attached brief back to a signed-in administrator.
 *
 * The attachment is held as a blob beside its enquiry and is deliberately not
 * reachable from anywhere public — this route is the only way out, and it
 * checks the session first. Content-Disposition is `attachment` and the type is
 * forced to a generic octet-stream rather than echoing the browser-supplied
 * MIME back: serving an uploaded file inline, under the site's own origin, with
 * a type the uploader chose, is how an upload field becomes a stored-XSS hole.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await currentUser())) return new Response("Not found", { status: 404 });

  const { id } = await params;
  const row = db()
    .prepare(`SELECT filename, data FROM enquiry_files WHERE enquiry_id = ? ORDER BY id DESC LIMIT 1`)
    .get(Number(id)) as { filename: string; data: Uint8Array } | undefined;

  if (!row) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(row.data), {
    headers: {
      "content-type": "application/octet-stream",
      "content-disposition": `attachment; filename="${row.filename.replace(/"/g, "")}"`,
      "cache-control": "private, no-store",
    },
  });
}
