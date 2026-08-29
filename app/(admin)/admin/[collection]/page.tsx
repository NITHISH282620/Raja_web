import Link from "next/link";
import { notFound } from "next/navigation";
import { readAll, COLLECTIONS } from "@/lib/store";
import { PageHead, Notice, RecordRow } from "../ui";

export const dynamic = "force-dynamic";

type Collection = keyof typeof COLLECTIONS;

/** Per-collection labelling and the fields to summarise a row with. */
export const META: Record<
  Collection,
  { title: string; sub: string; label: (d: Record<string, unknown>) => string; meta?: (d: Record<string, unknown>) => string }
> = {
  projects: {
    title: "Projects",
    sub: "The case studies on the homepage and the portfolio page. Order here is the order they appear in.",
    label: (d) => String(d.title ?? "Untitled"),
    meta: (d) => [d.organization, d.year].filter(Boolean).join(" · "),
  },
  events: {
    title: "Client events",
    sub: "The recent-engagements table at the foot of the homepage. Add a row each time a job completes.",
    label: (d) => String(d.organisation ?? "Untitled"),
    meta: (d) => String(d.event ?? ""),
  },
  capabilities: {
    title: "Capabilities",
    sub: "The four cards in the pinned carousel — what Raja builds.",
    label: (d) => String(d.title ?? "Untitled"),
    meta: (d) => String(d.index ?? ""),
  },
  inventory: {
    title: "Inventory",
    sub: "The owned-equipment tiles on the inventory page.",
    label: (d) => String(d.title ?? "Untitled"),
    meta: (d) => String(d.eyebrow ?? ""),
  },
  process: {
    title: "Build process",
    sub: "The three stages shown on the homepage: bare ground, structure, flooring.",
    label: (d) => String(d.label ?? d.title ?? "Untitled"),
    meta: (d) => String(d.index ?? ""),
  },
  clients: {
    title: "Clients",
    sub: "Logos shown above the closing call to action.",
    label: (d) => String(d.name ?? "Untitled"),
  },
  collage: {
    title: "Legacy photos",
    sub: "The scattered photographs in the 'Since 1977' section. Position is stored on each record.",
    label: (d) => String((d.image as { alt?: string })?.alt ?? d.id ?? "Photo"),
  },
};

function thumbOf(data: Record<string, unknown>): string | null {
  const candidates = [data.image, data.hero, data.logo];
  for (const c of candidates) {
    const src = (c as { src?: string } | null)?.src;
    if (src) return src;
  }
  return null;
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ saved?: string; removed?: string }>;
}) {
  const { collection } = await params;
  if (!(collection in COLLECTIONS)) notFound();
  const key = collection as Collection;
  const meta = META[key];
  const { saved, removed } = await searchParams;

  const rows = readAll(key).sort((a, b) => a.position - b.position);

  return (
    <>
      <PageHead
        title={meta.title}
        sub={meta.sub}
        action={
          <Link href={`/admin/${key}/new`} className="admin-btn" data-variant="primary">
            Add new
          </Link>
        }
      />

      {saved && <Notice tone="ok">Saved. The change is live on the site.</Notice>}
      {removed && <Notice tone="ok">Record deleted.</Notice>}

      {rows.length === 0 ? (
        <div className="admin-card">
          <p className="admin-sub">Nothing here yet. Use “Add new” to create the first record.</p>
        </div>
      ) : (
        <div className="admin-list">
          {rows.map((row, i) => {
            const data = row.data as unknown as Record<string, unknown>;
            return (
              <RecordRow
                key={row.id}
                collection={key}
                id={row.id}
                index={i}
                total={rows.length}
                published={row.published}
                title={meta.label(data)}
                meta={meta.meta?.(data)}
                thumb={thumbOf(data)}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
