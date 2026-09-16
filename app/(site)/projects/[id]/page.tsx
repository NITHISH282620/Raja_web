import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/Eyebrow";
import { Band } from "@/components/PageShell";
import { Placeholder, PlaceholderImage } from "@/components/Placeholder";
import { CATEGORY_LABELS } from "@/content/projects";
import { findPillar } from "@/content/services";
import { company } from "@/content/company";
import { abs, SITE_URL } from "@/lib/site";
import { getProjects, findProjectById } from "@/lib/store";
import { isEvidence } from "@/content/media";

/**
 * A single project's case study.
 *
 * Every field here is either a verified fact on the record (client, year,
 * location, services) or an honest gap — `scope` and `media` are `null`/`[]`
 * until Raja supplies them, and this page says so rather than inventing
 * turnaround times or attendance figures to fill the space. `note`, where
 * present, carries exactly the verification caveat recorded for this project
 * (what's confirmed, what's client-stated, what photographs actually show),
 * because that caveat is precisely what a case study is for.
 */

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await findProjectById(id);
  if (!project) return {};
  return {
    title: `${project.event} — ${project.client}`,
    description: project.scope
      ? project.scope
      : `${project.event} for ${project.client}${project.year ? `, ${project.year}` : ""} — on Raja Enterprises' project record.`,
    alternates: { canonical: abs(`/projects/${project.id}`) },
    openGraph: {
      title: `${project.event} — ${company.name}`,
      description: `${CATEGORY_LABELS[project.category]} engagement delivered by ${company.name}${project.year ? ` in ${project.year}` : ""}.`,
      url: abs(`/projects/${project.id}`),
      type: "article",
    },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await findProjectById(id);
  if (!project) notFound();

  const all = await getProjects();
  const others = all.filter((p) => p.category === project.category && p.id !== project.id).slice(0, 3);
  const hero = project.media[0] ?? null;
  const gallery = project.media.slice(1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Projects", item: abs("/projects") },
      { "@type": "ListItem", position: 3, name: project.event, item: abs(`/projects/${project.id}`) },
    ],
  };

  return (
    <main id="main" className="relative bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="frame pt-[clamp(96px,10vw,140px)]">
        <nav aria-label="Breadcrumb" className="mb-[clamp(24px,3vw,44px)]">
          <ol className="t-body-sm flex flex-wrap items-center gap-2 text-body-light">
            <li>
              <Link href="/" className="transition-colors hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/projects" className="transition-colors hover:text-ink">
                Projects
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-ink">{project.event}</li>
          </ol>
        </nav>

        <div data-reveal className="flex flex-col gap-5">
          <Eyebrow
            items={project.year ? [CATEGORY_LABELS[project.category], project.year] : [CATEGORY_LABELS[project.category]]}
            tone="dark"
          />
          <h1 className="text-[clamp(2rem,5vw,4.5rem)] font-display font-semibold leading-[1.05] tracking-tight text-ink text-balance">
            {project.event}
          </h1>
          <p className="t-body max-w-[52ch] text-body-light">{project.client}</p>
        </div>

        <figure className="mt-[clamp(24px,3.5vw,52px)]">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] border border-ink/10 bg-ink/5 sm:aspect-[21/9]">
            {hero ? (
              <Image
                src={hero.src}
                alt={hero.alt}
                fill
                priority
                sizes="(max-width: 1024px) 96vw, 1280px"
                style={hero.focal ? { objectPosition: hero.focal } : undefined}
                className="object-cover"
              />
            ) : (
              <PlaceholderImage className="absolute inset-0 h-full w-full" note={project.note} />
            )}
          </div>
          {hero && (
            <figcaption className="t-body-sm mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-light">
              <span
                className={
                  isEvidence(hero)
                    ? "rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white"
                    : "rounded-full bg-ink/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink/60"
                }
              >
                {isEvidence(hero) ? "Client photograph" : "Representative"}
              </span>
              <span>
                {isEvidence(hero)
                  ? "Supplied by the client."
                  : "Shows this type of event. Not a photograph of this job."}
              </span>
              {hero.credit && <span className="text-ink/40">&middot; {hero.credit}</span>}
            </figcaption>
          )}
        </figure>

        {gallery.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {gallery.map((m) => (
              <div
                key={m.src}
                className="relative aspect-[4/3] overflow-hidden rounded-[12px] border border-ink/10 bg-ink/5"
              >
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 46vw, 22vw"
                  style={m.focal ? { objectPosition: m.focal } : undefined}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Band>
        <div className="frame grid gap-[clamp(28px,4vw,72px)] lg:grid-cols-[0.85fr_1.15fr]">
          <dl data-band-item className="flex flex-col self-start">
            <p className="t-eyebrow mb-3 text-ink/50">On record</p>
            {[
              ["Event", project.event],
              ["Client", project.client],
              ["Year", project.year],
              ["Location", project.location],
              ["Category", CATEGORY_LABELS[project.category]],
              ["Contractor", company.name],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div
                  key={k}
                  className="grid gap-x-4 border-t border-ink/15 py-[clamp(10px,1.3vw,16px)] sm:grid-cols-[auto_1fr] sm:items-baseline"
                >
                  <dt className="t-body text-body-light">{k}</dt>
                  <dd className="t-work text-ink sm:text-right">{v}</dd>
                </div>
              ))}
          </dl>

          <div data-band-item className="flex flex-col gap-[clamp(14px,1.6vw,22px)]">
            <p className="t-work text-ink">Scope of work</p>
            {project.scope ? (
              <p className="t-body max-w-[62ch] text-body-light">{project.scope}</p>
            ) : (
              <Placeholder label="Scope not yet published" note={project.note} lines={3} className="max-w-[62ch]" />
            )}

            {project.services.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {project.services.map((slug) => {
                  const svc = findPillar(slug);
                  if (!svc) return null;
                  return svc.page ? (
                    <Link
                      key={slug}
                      href={`/services/${slug}`}
                      className="rounded-full border border-ink/15 bg-white px-4 py-1.5 t-body-sm text-ink transition-colors duration-300 hover:border-brand-blue hover:text-brand-blue"
                    >
                      {svc.title}
                    </Link>
                  ) : (
                    <span
                      key={slug}
                      className="rounded-full border border-ink/15 bg-white px-4 py-1.5 t-body-sm text-ink/70"
                    >
                      {svc.title}
                    </span>
                  );
                })}
              </div>
            )}

            {project.note && (
              <p className="t-body-sm max-w-[62ch] text-ink/40">{project.note}</p>
            )}

            <div className="mt-2 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="group inline-flex h-[52px] items-center gap-3 rounded-full bg-brand-blue px-7 text-white transition-colors duration-300 hover:bg-ink"
              >
                <span className="t-body">Enquire about a similar build</span>
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
              <Link
                href="/services"
                className="inline-flex h-[52px] items-center rounded-full border border-ink/20 px-7 text-ink transition-colors duration-300 hover:border-ink/50"
              >
                <span className="t-body">What we build</span>
              </Link>
            </div>
          </div>
        </div>
      </Band>

      {others.length > 0 && (
        <Band tone="ink">
          <div className="frame">
            <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-ink/50">
              Other {CATEGORY_LABELS[project.category].toLowerCase()} engagements
            </p>
            <ul className="grid gap-[clamp(16px,2vw,28px)] sm:grid-cols-3">
              {others.map((o) => (
                <li key={o.id} data-band-item>
                  <Link
                    href={`/projects/${o.id}`}
                    className="group flex flex-col gap-3 rounded-[15px] border border-ink/12 bg-white p-3 transition-colors duration-300 hover:border-ink/30"
                  >
                    <span className="relative block aspect-[16/10] overflow-hidden rounded-[10px] bg-ink/5">
                      {o.media[0] ? (
                        <Image
                          src={o.media[0].src}
                          alt=""
                          fill
                          loading="lazy"
                          sizes="(max-width: 640px) 92vw, 30vw"
                          style={o.media[0].focal ? { objectPosition: o.media[0].focal } : undefined}
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <PlaceholderImage className="absolute inset-0 h-full w-full" />
                      )}
                    </span>
                    <span className="px-1 pb-1">
                      {o.year && <span className="t-eyebrow block text-accent">{o.year}</span>}
                      <span className="t-work mt-1 block text-ink">{o.event}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Band>
      )}
    </main>
  );
}
