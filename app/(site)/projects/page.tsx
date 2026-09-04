import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import { PageMasthead, Band } from "@/components/PageShell";
import { Reveal } from "@/motion/Reveal";
import {
  publishedProjects,
  activeCategories,
  projectsByCategory,
  CATEGORY_LABELS,
  categoryBanner,
  projectsIntro,
} from "@/content/projects";
import { findPillar } from "@/content/services";
import { company } from "@/content/company";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects — Government, Exhibition & Cultural Event Infrastructure",
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
export default function ProjectsPage() {
  const all = publishedProjects();
  const categories = activeCategories();

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
      <Script
        id="projects-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageMasthead
        eyebrow={projectsIntro.eyebrow}
        statement={projectsIntro.statement}
        lead={projectsIntro.lead}
      />

      {/* Scale of the record, before any individual row. */}
      <Band>
        <div className="frame">
          <Reveal as="dl" variant="fadeUp" className="grid gap-[clamp(20px,3vw,44px)] sm:grid-cols-2 lg:grid-cols-4">
            {[
              [String(all.length), "Engagements on record"],
              [String(categories.length), "Sectors served"],
              [String(new Set(all.map((p) => p.client)).size), "Commissioning bodies"],
              ["1977", "Building since"],
            ].map(([value, label]) => (
              <div key={label} className="flex flex-col gap-1 border-t border-ink/15 pt-[clamp(12px,1.5vw,20px)]">
                <dd className="t-work font-mono text-ink">{value}</dd>
                <dt className="t-body-sm text-body-light">{label}</dt>
              </div>
            ))}
          </Reveal>
        </div>
      </Band>

      {/* Jump bar. Anchors rather than a filter: with 27 rows the whole list is
          worth seeing, and an anchor works without JavaScript. */}
      <div className="frame">
        <nav aria-label="Project sectors" className="flex flex-wrap gap-2 border-y border-ink/12 py-[clamp(14px,2vw,22px)]">
          {categories.map((c) => (
            <a
              key={c}
              href={`#${c}`}
              className="t-body-sm rounded-full border border-ink/15 px-4 py-2 text-ink transition-colors duration-300 hover:border-ink/45"
            >
              {CATEGORY_LABELS[c]}
              <span className="ml-2 font-mono text-[11px] text-body-light">
                {projectsByCategory(c).length}
              </span>
            </a>
          ))}
        </nav>
      </div>

      {categories.map((cat, ci) => {
        const rows = projectsByCategory(cat);
        const banner = categoryBanner[cat];
        return (
          <Band key={cat} tone={ci % 2 === 0 ? "paper" : "ink"}>
            <div className="frame" id={cat} style={{ scrollMarginTop: "88px" }}>
              <div className="mb-[clamp(18px,2.4vw,32px)] flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="t-work text-ink">{CATEGORY_LABELS[cat]}</h2>
                <span className="t-body-sm font-mono text-body-light">
                  {rows.length} {rows.length === 1 ? "engagement" : "engagements"}
                </span>
              </div>

              {/* A sector banner, never a project photograph. Where no honest
                  frame exists — government — the band leads with the count. */}
              {banner ? (
                <figure className="mb-[clamp(18px,2.4vw,32px)]">
                  <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[15px] bg-ink/5 sm:aspect-[24/7]">
                    <Image
                      src={banner.src}
                      alt={banner.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 96vw, 1200px"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="t-body-sm mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-body-light">
                    {banner.clearance === "licensed" ? (
                      <>
                        <span className="rounded-full bg-ink/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink/60">
                          Representative
                        </span>
                        <span>Shows this category of environment. Not a photograph of a Raja build.</span>
                      </>
                    ) : (
                      <>
                        <span className="rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white">
                          Project photograph
                        </span>
                        <span>From a build in this sector, supplied by the client.</span>
                      </>
                    )}
                  </figcaption>
                </figure>
              ) : (
                <div className="mb-[clamp(18px,2.4vw,32px)] flex items-end justify-between gap-6 rounded-[15px] bg-ink px-[clamp(20px,3vw,44px)] py-[clamp(24px,3.5vw,48px)] text-white">
                  <span className="font-mono text-[clamp(2.4rem,6vw,4.5rem)] leading-none">
                    {String(rows.length).padStart(2, "0")}
                  </span>
                  <span className="t-body-sm max-w-[34ch] text-right text-white/60">
                    Engagements for government and public-sector bodies. No representative
                    photograph is shown here rather than one that misleads.
                  </span>
                </div>
              )}

              <Reveal as="ul" variant="riseCard" className="grid gap-[clamp(12px,1.6vw,20px)] sm:grid-cols-2 lg:grid-cols-3">
                {rows.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-col gap-2 overflow-hidden rounded-[15px] border border-ink/12 bg-white p-[clamp(16px,1.9vw,24px)]"
                  >
                    {/* A project's own photographs, where Raja has supplied
                        them. Representative imagery is never used here — on a
                        project card an image reads as evidence. */}
                    {p.media.length > 0 && (
                      <span className="relative -mx-[clamp(16px,1.9vw,24px)] -mt-[clamp(16px,1.9vw,24px)] mb-3 block aspect-[16/10] overflow-hidden rounded-t-[15px] bg-ink/5">
                        <Image
                          src={p.media[0].src}
                          alt={p.media[0].alt}
                          fill
                          loading="lazy"
                          sizes="(max-width: 640px) 92vw, 30vw"
                          className="object-cover"
                        />
                        <span className="absolute bottom-2 left-2 rounded-full bg-ink/75 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-white">
                          Client photograph
                        </span>
                        {p.media.length > 1 && (
                          <span className="absolute bottom-2 right-2 rounded-full bg-ink/75 px-2 py-1 font-mono text-[9px] text-white">
                            +{p.media.length - 1}
                          </span>
                        )}
                      </span>
                    )}
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="t-eyebrow text-accent">{CATEGORY_LABELS[p.category].split(" ")[0]}</span>
                      {p.year && <span className="font-mono text-[11px] text-body-light">{p.year}</span>}
                    </span>
                    <span className="t-work text-ink">{p.event}</span>
                    <span className="t-body-sm text-body-light">{p.client}</span>
                    {p.location && (
                      <span className="t-body-sm font-mono text-[11px] text-body-light">{p.location}</span>
                    )}
                    {p.services.length > 0 && (
                      <span className="mt-2 flex flex-wrap gap-1.5 border-t border-ink/10 pt-3">
                        {p.services.map((slug) => {
                          const svc = findPillar(slug);
                          if (!svc) return null;
                          return svc.page ? (
                            <Link
                              key={slug}
                              href={`/services/${slug}`}
                              className="rounded-full bg-ink/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-ink/70 transition-colors hover:bg-ink/15"
                            >
                              {svc.title.split(" ")[0]}
                            </Link>
                          ) : (
                            <span
                              key={slug}
                              className="rounded-full bg-ink/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-ink/70"
                            >
                              {svc.title.split(" ")[0]}
                            </span>
                          );
                        })}
                      </span>
                    )}
                  </li>
                ))}
              </Reveal>
            </div>
          </Band>
        );
      })}

      <Band>
        <div className="frame flex flex-col gap-4">
          <p className="t-work text-ink">On what is shown here</p>
          <p className="t-body max-w-[64ch] text-body-light">
            Client and event are taken from Raja&rsquo;s own engagement schedule. Covered area,
            attendance, turnaround and crew figures are <strong>not</strong> shown, because they
            have not been supplied for these engagements — and a contractor&rsquo;s numbers are
            worth nothing if they cannot be checked. They appear here as Raja releases them.
          </p>
          <p className="t-body max-w-[64ch] text-body-light">
            Looking for something similar?{" "}
            <Link href="/services" className="text-brand-blue underline underline-offset-4">
              What we build
            </Link>{" "}
            &middot;{" "}
            <Link href="/inventory" className="text-brand-blue underline underline-offset-4">
              What we own
            </Link>{" "}
            &middot;{" "}
            <Link href="/contact" className="text-brand-blue underline underline-offset-4">
              Start an enquiry
            </Link>
          </p>
        </div>
      </Band>
    </main>
  );
}
