import Link from "next/link";
import { moveRecord, removeRecord, setPublished } from "./actions";
import type { COLLECTIONS } from "@/lib/store";

type Collection = keyof typeof COLLECTIONS;

/**
 * The pieces every collection screen is assembled from.
 *
 * Seven collections share one list screen and one editor because they are the
 * same job seven times: show the records, reorder them, publish or unpublish
 * one, open one, save it. Writing seven bespoke screens would mean seven places
 * for the publish toggle to behave slightly differently.
 */

export function PageHead({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="admin-head">
      <div>
        <h1 className="admin-h1">{title}</h1>
        {sub && (
          <p className="admin-sub" style={{ marginTop: 8 }}>
            {sub}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}

export function Notice({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "error";
  children: React.ReactNode;
}) {
  return (
    <div className="admin-notice" data-tone={tone} role={tone === "error" ? "alert" : undefined}>
      <span>{children}</span>
    </div>
  );
}

/** A row in a collection list, with its publish / reorder / open controls. */
export function RecordRow({
  collection,
  id,
  index,
  total,
  published,
  title,
  meta,
  thumb,
}: {
  collection: Collection;
  id: string;
  index: number;
  total: number;
  published: boolean;
  title: string;
  meta?: string;
  thumb?: string | null;
}) {
  return (
    <div className="admin-list-row">
      {thumb ? (
        // A plain <img>: these are admin thumbnails at a fixed 56px, and
        // routing them through next/image would spin up an optimisation
        // pipeline per row for no benefit the editor can see.
        // eslint-disable-next-line @next/next/no-img-element
        <img className="admin-thumb" src={thumb} alt="" />
      ) : (
        <span className="admin-thumb" aria-hidden />
      )}

      <div style={{ minWidth: 0 }}>
        <Link
          href={`/admin/${collection}/${encodeURIComponent(id)}`}
          style={{ fontWeight: 500, fontSize: 14.5, textDecoration: "none", color: "inherit" }}
        >
          {title}
        </Link>
        <p style={{ fontSize: 12, color: "var(--color-body-dark)", marginTop: 3 }}>
          {meta ? `${meta} · ` : ""}
          <span style={{ fontFamily: "var(--font-mono)" }}>{id}</span>
        </p>
      </div>

      <div className="admin-actions">
        <span className="admin-chip" data-tone={published ? "live" : "draft"}>
          {published ? "Live" : "Draft"}
        </span>

        <form
          action={async () => {
            "use server";
            await moveRecord(collection, id, -1);
          }}
        >
          <button
            type="submit"
            className="admin-btn"
            data-variant="ghost"
            style={{ height: 32, padding: "0 11px" }}
            disabled={index === 0}
            aria-label="Move up"
          >
            ↑
          </button>
        </form>
        <form
          action={async () => {
            "use server";
            await moveRecord(collection, id, 1);
          }}
        >
          <button
            type="submit"
            className="admin-btn"
            data-variant="ghost"
            style={{ height: 32, padding: "0 11px" }}
            disabled={index === total - 1}
            aria-label="Move down"
          >
            ↓
          </button>
        </form>

        <form
          action={async () => {
            "use server";
            await setPublished(collection, id, !published);
          }}
        >
          <button type="submit" className="admin-btn" data-variant="ghost" style={{ height: 32 }}>
            {published ? "Unpublish" : "Publish"}
          </button>
        </form>

        <Link
          href={`/admin/${collection}/${encodeURIComponent(id)}`}
          className="admin-btn"
          data-variant="primary"
          style={{ height: 32 }}
        >
          Edit
        </Link>
      </div>
    </div>
  );
}

/** The delete control, kept out of the row so it cannot be hit by accident. */
export function DeleteRecord({ collection, id }: { collection: Collection; id: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await removeRecord(collection, id);
      }}
    >
      <button type="submit" className="admin-btn" data-variant="danger">
        Delete this record
      </button>
    </form>
  );
}
