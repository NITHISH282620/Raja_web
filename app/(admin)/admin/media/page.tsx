import { db } from "@/lib/db";
import { deleteMedia, updateMediaAlt, uploadMedia } from "../actions";
import { Notice, PageHead } from "../ui";

export const dynamic = "force-dynamic";

interface MediaRow {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  kind: string;
  bytes: number;
  created_at: string;
}

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ uploaded?: string; saved?: string; error?: string }>;
}) {
  const { uploaded, saved, error } = await searchParams;
  const rows = db()
    .prepare(`SELECT id, src, width, height, alt, kind, bytes, created_at FROM media ORDER BY created_at DESC`)
    .all() as unknown as MediaRow[];

  return (
    <>
      <PageHead
        title="Media library"
        sub="Upload photographs and video here, then choose them on any project, capability or inventory card. Images are converted to WebP and resized automatically."
      />

      {uploaded && <Notice tone="ok">Uploaded. It is now selectable on any card.</Notice>}
      {saved && <Notice tone="ok">Description saved.</Notice>}
      {error === "size" && <Notice tone="error">That file is too large. The limit is 200 MB.</Notice>}
      {error === "empty" && <Notice tone="error">No file was selected.</Notice>}

      <form
        action={uploadMedia}
        className="admin-card"
        style={{ marginBottom: 28, maxWidth: 760 }}
      >
        <h2 className="admin-h2" style={{ marginBottom: 14 }}>Upload</h2>

        <div className="admin-field">
          <label htmlFor="file">Photograph or video</label>
          <input
            id="file"
            name="file"
            type="file"
            accept="image/*,video/mp4,video/webm"
            required
            className="admin-input"
            style={{ padding: 9 }}
          />
          <p className="hint">
            JPEG, PNG, WebP or HEIC for photographs; MP4 or WebM for video. Photographs straight
            off a phone are fine — they are resized on upload.
          </p>
        </div>

        <div className="admin-field">
          <label htmlFor="alt">Description</label>
          <input id="alt" name="alt" className="admin-input" placeholder="Crew raising a hanger canopy at Gayathri Vihar" />
          <p className="hint">
            Say what is in the photograph. This is read aloud to visitors using a screen reader and
            is what search engines index the image on.
          </p>
        </div>

        <button type="submit" className="admin-btn" data-variant="primary">
          Upload
        </button>
      </form>

      {rows.length === 0 ? (
        <div className="admin-card">
          <p className="admin-sub">
            Nothing uploaded yet. The photographs currently on the site came with the build and stay
            selectable whether or not you upload anything.
          </p>
        </div>
      ) : (
        <div className="admin-media-grid">
          {rows.map((m) => (
            <div key={m.id} className="admin-media-item">
              {m.kind === "video" ? (
                <video src={m.src} muted playsInline preload="metadata" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.src} alt={m.alt} loading="lazy" />
              )}
              <div className="admin-media-meta">
                {m.width > 0 ? `${m.width}×${m.height} · ` : ""}
                {kb(m.bytes)}
              </div>
              <div style={{ padding: "0 11px 11px" }}>
                <form action={updateMediaAlt}>
                  <input type="hidden" name="id" value={m.id} />
                  <input
                    name="alt"
                    className="admin-input"
                    defaultValue={m.alt}
                    placeholder="Description"
                    style={{ fontSize: 12, padding: "7px 9px" }}
                  />
                  <div className="admin-actions" style={{ marginTop: 8 }}>
                    <button type="submit" className="admin-btn" data-variant="ghost" style={{ height: 30, fontSize: 12.5 }}>
                      Save
                    </button>
                  </div>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await deleteMedia(m.id);
                  }}
                  style={{ marginTop: 6 }}
                >
                  <button type="submit" className="admin-btn" data-variant="danger" style={{ height: 30, fontSize: 12.5 }}>
                    Remove
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
