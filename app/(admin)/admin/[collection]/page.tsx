import Link from "next/link";
import { notFound } from "next/navigation";
import { readAll, COLLECTIONS } from "@/lib/store";
import { PageHead, Notice, RecordRow } from "../ui";
import { categoryBanner } from "@/content/projects";
import { FIELDS } from "../fields";

export const dynamic = "force-dynamic";

type Collection = keyof typeof COLLECTIONS;

/** Per-collection labelling and the fields to summarise a row with. */
export const META: Record<
  Collection,
  {
    title: string;
    sub: string;
    label: (d: Record<string, unknown>) => string;
    meta?: (d: Record<string, unknown>) => string;
    /** Overrides the thumbnail when the picture does not live on the record. */
    thumb?: (d: Record<string, unknown>) => string | null;
  }
> = {
  pageImages: {
    title: "Page photographs",
    sub: "Single photographs that sit on one page — the top of Legacy, the Careers picture, the one beside the contact form. Change the picture and its description here.",
    label: (d) => String(d.label ?? d.id ?? "Untitled"),
    meta: (d) => String(d.image ?? "").split("/").pop() ?? "",
    thumb: (d) => (d.image as string) || null,
  },
  recentEvents: {
    title: "Recent events grid",
    sub: "The photo grid on the homepage. Each tile is one completed job; the size setting controls how much of the grid it takes.",
    label: (d) => String(d.project ?? "Untitled"),
    meta: (d) => [d.year, d.size].filter(Boolean).join(" · "),
  },
  eventFormats: {
    title: "Event format cards",
    sub: "The four large photo cards on the homepage — the event types Raja builds for. Each card links to a service or solution page.",
    label: (d) => String(d.title ?? "Untitled"),
    meta: (d) => String(d.href ?? ""),
  },
  highlights: {
    title: "Inventory highlights",
    sub: "The owned-equipment figures shown on the About page.",
    label: (d) => String(d.label ?? d.title ?? "Untitled"),
    meta: (d) => [d.number, d.unit].filter(Boolean).join(" "),
  },
  copy: {
    title: "Paragraphs",
    sub: "The long-form narrative on About and Legacy. One paragraph per row — edit the words, the layout stays as designed.",
    label: (d) => String(d.label ?? d.id ?? "Untitled"),
    meta: (d) => String(d.body ?? "").slice(0, 60) + "…",
  },
  catalog: {
    title: "Equipment catalogue",
    sub: "The detailed equipment categories on /inventory, including their specifications.",
    label: (d) => String(d.name ?? "Untitled"),
    meta: (d) => [d.totalCapacity, d.unit].filter(Boolean).join(" "),
  },
  timeline: {
    title: "Timeline",
    sub: "The eras on the About page.",
    label: (d) => String(d.headline ?? "Untitled"),
    meta: (d) => String(d.period ?? ""),
  },
  milestones: {
    title: "Milestones",
    sub: "The notable moments listed on the About page.",
    label: (d) => String(d.title ?? "Untitled"),
    meta: (d) => String(d.year ?? ""),
  },
  principles: {
    title: "Principles",
    sub: "How Raja delivers — the four principles on the About page.",
    label: (d) => String(d.title ?? "Untitled"),
  },
  locations: {
    title: "Locations",
    sub: "Places on the footprint map. A location only gets its own page when it has a search title.",
    label: (d) => String(d.city ?? "Untitled"),
    meta: (d) => String(d.state ?? ""),
  },
  disciplines: {
    title: "Careers",
    sub: "The kinds of work listed on the careers page.",
    label: (d) => String(d.title ?? "Untitled"),
  },
  partnerPoints: {
    title: "Partners — reasons",
    sub: "The four cards making the case to agencies.",
    label: (d) => String(d.heading ?? "Untitled"),
  },
  partnerSteps: {
    title: "Partners — steps",
    sub: "The numbered steps on the partners page.",
    label: (d) => String(d.label ?? "Untitled"),
  },
  seo: {
    title: "Page SEO",
    sub: "Override the search title and description for one page. Add a row only for a page you want to control — every other page keeps the wording it writes for itself.",
    label: (d) => String(d.route ?? "/"),
    meta: (d) => String(d.title ?? ""),
  },
  services: {
    title: "Service pages",
    sub: "The six service pages. Editing the title or body here changes that page directly.",
    label: (d) => String(d.title ?? "Untitled"),
    meta: (d) => String(d.slug ?? ""),
  },
  solutions: {
    title: "Solution pages",
    sub: "The five audience pages — corporate, exhibitions, conferences, launches, institutional. Each borrows the photograph for its category unless you set one.",
    label: (d) => String(d.title ?? "Untitled"),
    meta: (d) => String(d.slug ?? ""),
    // A solution without its own image still shows one on the site — the shared
    // banner for its category. Listing it as blank would say the opposite.
    thumb: (d) =>
      (d.image as string) ||
      categoryBanner[d.category as keyof typeof categoryBanner]?.src ||
      null,
  },
  schedule: {
    title: "Capacity figures",
    sub: "The owned-stock numbers shown on the homepage, /inventory, /partners and the Bengaluru page. Leave a capacity blank and that line stops showing a number rather than showing a wrong one.",
    label: (d) => String(d.item ?? "Untitled"),
    meta: (d) => [d.capacity, d.unit].filter(Boolean).join(" "),
  },
  projects: {
    title: "Featured projects",
    sub: "The case studies on the homepage and the portfolio page. Order here is the order they appear in.",
    label: (d) => String(d.title ?? "Untitled"),
    meta: (d) => [d.organization, d.year].filter(Boolean).join(" · "),
  },
  events: {
    title: "Recent engagements table",
    sub: "The recent-engagements table at the foot of the homepage. Add a row each time a job completes.",
    label: (d) => String(d.organisation ?? "Untitled"),
    meta: (d) => String(d.event ?? ""),
  },
  capabilities: {
    title: "Capability cards",
    sub: "The four cards in the pinned carousel — what Raja builds.",
    label: (d) => String(d.title ?? "Untitled"),
    meta: (d) => String(d.index ?? ""),
  },
  inventory: {
    title: "Resource tiles",
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
    title: "Client logos",
    sub: "Logos shown above the closing call to action.",
    label: (d) => String(d.name ?? "Untitled"),
  },
  collage: {
    title: "Photo collage",
    sub: "The scattered photographs in the 'Since 1977' section. Position is stored on each record.",
    label: (d) => String((d.image as { alt?: string })?.alt ?? d.id ?? "Photo"),
  },
};

/** True when this collection's editor offers an image field of any kind. */
function collectionHasImage(collection: Collection): boolean {
  return FIELDS[collection].some((f) => f.type === "image" || f.type === "imagePath");
}

function thumbOf(data: Record<string, unknown>): string | null {
  // Two shapes in play. Most collections store an asset object with a `src`;
  // the About timeline, milestones, inventory highlights and the equipment
  // catalogue store a bare path string. Reading only `.src` meant every one of
  // those listed with an empty grey square, which reads as "this record has no
  // picture" when it has one.
  for (const c of [data.image, data.hero, data.logo]) {
    if (typeof c === "string" && c) return c;
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
                thumb={
                  // Only collections whose editor offers a picture get a slot.
                  // Derived from the field definitions rather than a second
                  // list, so the two cannot drift apart.
                  collectionHasImage(key)
                    ? (meta.thumb?.(data) ?? thumbOf(data))
                    : undefined
                }
              />
            );
          })}
        </div>
      )}
    </>
  );
}
