import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageMasthead, Band } from "@/components/PageShell";
import { Reveal } from "@/motion/Reveal";
import {
  CATEGORY_LABELS,
  categoryBanner,
  projectsIntro,
  type ProjectCategory,
} from "@/content/projects";
import { getProjects } from "@/lib/store";
import { findPillar } from "@/content/services";
import { company } from "@/content/company";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects on Record",
  description:
    "Twenty-seven engagements: government programmes, trade fairs, congresses and cultural festivals across Karnataka and India, built by Raja Enterprises since 1977.",
  alternates: { canonical: abs("/projects") },
};

/**
 * The project index.
 *
 * FACT-LED, NOT PHOTOGRAPH-LED, and that is a decision rather than a shortfall.
 * No cleared photography of Raja's own work exists yet, and a card carrying
 * licensed stock would present somebody else's event as evidence of Raja's. The
 * client and the event are real and verifiable; they carry the page on their
 * own until Raja supplies photographs, at which point the card grows an image
 * without the layout changing.
 *
 * Grouped by category rather than listed flat: a visitor arrives asking "do you
 * build events like mine", and the grouping answers that before they read a
 * single row.
 */
export default async function ProjectsPage() {
  const all = await getProjects();
  
  // Compute active categories dynamically from the fetched DB projects
  const seenCategories = new Set(all.map((p) => p.category));
  const categories = (Object.keys(CATEGORY_LABELS) as ProjectCategory[]).filter((c) => seenCategories.has(c));
  
  // Helper to filter fetched projects
  const projectsByCategory = (cat: ProjectCategory) => all.filter((p) => p.category === cat);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Projects — ${company.name}`,
    numberOfItems: all.length,
    itemListElement: all.slice(0, 27).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${p.event} — ${p.client}`,
    })),
  };

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* STICKY HEADER SECTION (Matches the homepage "Legacy" scroll effect) */}
      {/* On desktop, this sticks and the projects slide over it. On mobile, it scrolls normally to prevent content cutoff. */}
      <div className="md:sticky md:top-0 z-10 w-full flex flex-col bg-paper pb-16">
        <PageMasthead
          eyebrow={projectsIntro.eyebrow}
          statement={projectsIntro.statement}
          lead={projectsIntro.lead}
        />

        {/* Scale of the record, before any individual row. */}
        <div className="w-full mt-10 sm:mt-16">
          <div className="frame">
            <dl className="grid gap-[clamp(20px,3vw,44px)] sm:grid-cols-2 lg:grid-cols-4">
              {[
                [String(all.length), "Engagements on record"],
                [String(categories.length), "Sectors served"],
                [String(new Set(all.map((p) => p.client)).size), "Commissioning bodies"],
                ["1977", "Building since"],
              ].map(([value, label]) => (
                <div key={label} className="flex flex-col gap-1 border-t border-ink/15 pt-[clamp(12px,1.5vw,20px)] animate-fade-up" style={{ animationFillMode: "both", animationDelay: "0.2s" }}>
                  <dd className="font-mono text-3xl sm:text-4xl text-ink tracking-tight">{value}</dd>
                  <dt className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-body-light">{label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* OVERLAPPING SCROLL SECTION (Slides over the sticky header) */}
      <div className="relative z-20 w-full bg-paper rounded-t-[2.5rem] md:rounded-t-[3.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.08)] border-t border-ink/5 pt-10 sm:pt-16">

      {/* Jump bar. Anchors rather than a filter: with 27 rows the whole list is
          worth seeing, and an anchor works without JavaScript. */}
      {/* Jump bar */}
      <div className="frame">
        <nav aria-label="Project sectors" className="flex flex-wrap gap-3 border-y border-ink/10 py-6 sm:py-8">
          {categories.map((c) => (
            <a
              key={c}
              href={`#${c}`}
              className="group flex items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-medium tracking-wide text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white hover:shadow-lg"
            >
              {CATEGORY_LABELS[c]}
              <span className="font-mono text-[10px] text-ink/40 transition-colors group-hover:text-white/60">
                {projectsByCategory(c).length}
              </span>
            </a>
          ))}
        </nav>
      </div>

      <div className="relative w-full pb-32">
        {categories.map((cat, ci) => {
          const rows = projectsByCategory(cat);
          const banner = categoryBanner[cat];
          return (
            <div 
              key={cat} 
              className="w-full bg-paper pt-16 sm:pt-24 pb-10"
            >
              <div className="frame" id={cat} style={{ scrollMarginTop: "120px" }}>
                <div className="mb-10 sm:mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-4xl sm:text-5xl text-ink tracking-tight mb-3">
                      {CATEGORY_LABELS[cat]}
                    </h2>
                    <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-brand-blue font-bold">
                      {rows.length} {rows.length === 1 ? "engagement" : "engagements"}
                    </span>
                  </div>
                </div>

                {/* A sector banner, never a project photograph. Where no honest
                    frame exists — government — the band leads with the count. */}
                {banner ? (
                  <figure className="mb-10 sm:mb-16">
                    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[2rem] bg-ink/5 sm:aspect-[24/7] shadow-xl border border-ink/5">
                      <Image
                        src={banner.src}
                        alt={banner.alt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 1024px) 96vw, 1200px"
                        className="object-cover transition-transform duration-1000 hover:scale-[1.02]"
                      />
                    </div>
                    <figcaption className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-body-light">
                      {banner.clearance === "licensed" ? (
                        <>
                          <span className="rounded-full bg-ink/5 border border-ink/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink/70">
                            Representative
                          </span>
                          <span>Shows this category of environment. Not a photograph of a Raja build.</span>
                        </>
                      ) : (
                        <>
                          <span className="rounded-full bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white shadow-sm">
                            Project photograph
                          </span>
                          <span>From a build in this sector, supplied by the client.</span>
                        </>
                      )}
                    </figcaption>
                  </figure>
                ) : (
                  <div className="mb-10 sm:mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6 rounded-[2rem] shadow-xl p-10 sm:p-16 lg:p-20 text-white overflow-hidden relative" style={{background: "linear-gradient(135deg, #12305a 0%, #163660 50%, #1d4a82 100%)"}}>
                    <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]" style={{ backgroundSize: "32px 32px" }} />
                    <span className="relative z-10 font-mono text-7xl sm:text-9xl tracking-tighter leading-none">
                      {String(rows.length).padStart(2, "0")}
                    </span>
                    <span className="relative z-10 text-sm sm:text-base max-w-sm text-white/70 leading-relaxed sm:text-right">
                      Engagements for government and public-sector bodies. No representative
                      photograph is shown here rather than one that misleads.
                    </span>
                  </div>
                )}

                <Reveal as="ul" variant="monumentalCard" className="flex overflow-x-auto snap-x snap-mandatory gap-6 sm:gap-8 pb-10 pt-4 -mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 hide-scrollbar">
                  {rows.map((p) => (
                    <li
                      key={p.id}
                      className="shrink-0 snap-start w-[85vw] sm:w-[380px] lg:w-[420px] group relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] bg-white border border-ink/10 p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:shadow-[0_30px_80px_rgba(29,74,130,0.12)] hover:-translate-y-2 hover:border-brand-blue/30"
                    >
                      {/* Glowing hover backdrop */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-blue/[0.02] opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none" />

                      <div className="relative z-10">
                        {/* A project's own photographs */}
                        {p.media.length > 0 && (
                          <span className="relative -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6 block aspect-[16/10] overflow-hidden rounded-t-[1.5rem] bg-ink/5 border-b border-ink/5">
                            <Image
                              src={p.media[0].src}
                              alt={p.media[0].alt}
                              fill
                              loading="lazy"
                              sizes="(max-width: 640px) 92vw, 30vw"
                              className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                            />
                            <span className="absolute inset-0 bg-brand-blue/10 mix-blend-overlay opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none" />
                            <span className="absolute bottom-3 left-3 rounded-full bg-ink/80 backdrop-blur-md px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-white shadow-sm transition-transform duration-700 group-hover:-translate-y-1">
                              Client photograph
                            </span>
                            {p.media.length > 1 && (
                              <span className="absolute bottom-3 right-3 rounded-full bg-ink/80 backdrop-blur-md px-2 py-1 font-mono text-[9px] text-white transition-transform duration-700 group-hover:-translate-y-1">
                                +{p.media.length - 1}
                              </span>
                            )}
                          </span>
                        )}
                        
                        <div className="flex items-baseline justify-between gap-3 mb-4">
                          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-brand-blue font-bold">
                            {CATEGORY_LABELS[p.category].split(" ")[0]}
                          </span>
                          {p.year && <span className="font-mono text-[10px] sm:text-xs text-ink/40 font-medium transition-colors duration-500 group-hover:text-brand-blue/60">{p.year}</span>}
                        </div>
                        
                        <h3 className="font-display text-2xl sm:text-[1.75rem] text-ink mb-3 leading-[1.15] tracking-tight transition-colors duration-500 group-hover:text-brand-blue">
                          {p.event}
                        </h3>
                        <p className="text-body-light text-sm sm:text-base leading-relaxed">
                          {p.client}
                        </p>
                        {p.location && (
                          <p className="font-mono text-xs text-ink/50 mt-3 transition-colors duration-500 group-hover:text-brand-blue/70">
                            {p.location}
                          </p>
                        )}
                      </div>
                      
                      {p.services.length > 0 && (
                        <div className="mt-8 pt-5 border-t border-ink/5 flex flex-wrap gap-2 relative z-10">
                          {p.services.map((slug) => {
                            const svc = findPillar(slug);
                            if (!svc) return null;
                            return svc.page ? (
                              <Link
                                key={slug}
                                href={`/services/${slug}`}
                                className="rounded-full bg-slate-50 border border-ink/10 px-3 py-1 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-ink/70 transition-all duration-300 hover:bg-brand-blue hover:text-white hover:border-brand-blue hover:shadow-md"
                              >
                                {svc.title.split(" ")[0]}
                              </Link>
                            ) : (
                              <span
                                key={slug}
                                className="rounded-full bg-slate-50 border border-ink/10 px-3 py-1 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-ink/70"
                              >
                                {svc.title.split(" ")[0]}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </li>
                  ))}
                </Reveal>
              </div>
            </div>
          );
        })}
      </div>

    </div>
    </main>
  );
}
