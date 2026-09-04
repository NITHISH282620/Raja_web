import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { recentExecutions } from "@/content/events";
import { Eyebrow } from "@/components/Eyebrow";
import { Band } from "@/components/PageShell";
import { company } from "@/content/company";
import { abs, SITE_URL } from "@/lib/site";

/**
 * A single recent execution.
 *
 * WHAT CHANGED AND WHY. This page previously rendered invented prose — "This is
 * a placeholder description for {project}. Raja Enterprises was proud to
 * deliver world-class infrastructure…" — identically across all eleven records,
 * asserting rapid deployment, safety standards and an absence of sub-rental for
 * events nobody had checked. Eleven such pages were statically generated and
 * linked from the homepage.
 *
 * Everything this page now shows is either a verified field on the record
 * (name, year, image) or a statement about Raja that is true of the company
 * generally and is written as such. There is no per-project description,
 * because none has been supplied. When Raja provides scope and photographs for
 * a given event, this page grows a real body; until then it says what is known
 * and routes the visitor somewhere useful rather than filling the gap.
 */

export function generateStaticParams() {
  return recentExecutions.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = recentExecutions.find((e) => e.slug === slug);
  if (!event) return {};
  return {
    title: `${event.project} (${event.year})`,
    description: `${event.project} — event infrastructure delivered by ${company.name}, ${event.year}. Structures, flooring, staging and exhibition build from owned inventory.`,
    alternates: { canonical: abs(`/events/${event.slug}`) },
    openGraph: {
      title: `${event.project} — ${company.name}`,
      description: `Event infrastructure delivered by ${company.name} in ${event.year}.`,
      url: abs(`/events/${event.slug}`),
      type: "article",
    },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = recentExecutions.find((e) => e.slug === slug);
  if (!event) notFound();

  const others = recentExecutions.filter((e) => e.slug !== event.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Projects", item: abs("/projects") },
      { "@type": "ListItem", position: 3, name: event.project, item: abs(`/events/${event.slug}`) },
    ],
  };

  return (
    <main id="main" className="relative bg-paper">
      <Script
        id={`event-${event.slug}-jsonld`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            <li className="text-ink">{event.project}</li>
          </ol>
        </nav>

        <div data-reveal className="flex flex-col gap-5">
          <Eyebrow items={["Recent execution", event.year]} tone="dark" />
          <h1 className="text-[clamp(2rem,5vw,4.5rem)] font-display font-semibold uppercase leading-[1.02] tracking-tight text-ink">
            {event.project}
          </h1>
        </div>

        <figure className="mt-[clamp(24px,3.5vw,52px)]">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] border border-ink/10 bg-ink/5 sm:aspect-[21/9]">
            <Image
              src={event.image}
              alt={`Event infrastructure of the kind built for ${event.project}.`}
              fill
              priority
              sizes="(max-width: 1024px) 96vw, 1280px"
              className="object-cover"
            />
          </div>
          {/* Every image on this route is licensed stock. Saying so on the page
              is the difference between context and a false claim of authorship. */}
          <figcaption className="t-body-sm mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-light">
            <span className="rounded-full bg-ink/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink/60">
              Representative
            </span>
            <span>
              Shows the type of environment described. Not a photograph of this event.
            </span>
          </figcaption>
        </figure>
      </div>

      <Band>
        <div className="frame grid gap-[clamp(28px,4vw,72px)] lg:grid-cols-[0.85fr_1.15fr]">
          <dl data-band-item className="flex flex-col self-start">
            <p className="t-eyebrow mb-3 text-ink/50">On record</p>
            {[
              ["Event", event.project],
              ["Year", event.year],
              ["Contractor", company.name],
            ].map(([k, v]) => (
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
            <p className="t-work text-ink">What a build like this involves</p>
            <p className="t-body max-w-[62ch] text-body-light">
              Raja builds the physical infrastructure underneath events of this kind — clear-span
              structures, levelled flooring, staging and audience seating, raised and struck by a
              crew on its own payroll. The inventory is owned rather than sub-hired, which is what
              lets a fixed opening date hold.
            </p>
            <p className="t-body max-w-[62ch] text-body-light">
              Scope, covered area and crew figures for this particular event have not been
              published. Where those are confirmed they appear on the{" "}
              <Link href="/projects" className="text-brand-blue underline underline-offset-4">
                projects index
              </Link>
              , which carries the verified record for each build.
            </p>
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
            <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-ink/50">Other recent builds</p>
            <ul className="grid gap-[clamp(16px,2vw,28px)] sm:grid-cols-3">
              {others.map((o) => (
                <li key={o.slug} data-band-item>
                  <Link
                    href={`/events/${o.slug}`}
                    className="group flex flex-col gap-3 rounded-[15px] border border-ink/12 bg-white p-3 transition-colors duration-300 hover:border-ink/30"
                  >
                    <span className="relative block aspect-[16/10] overflow-hidden rounded-[10px] bg-ink/5">
                      <Image
                        src={o.image}
                        alt=""
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 92vw, 30vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </span>
                    <span className="px-1 pb-1">
                      <span className="t-eyebrow block text-accent">{o.year}</span>
                      <span className="t-work mt-1 block text-ink">{o.project}</span>
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
