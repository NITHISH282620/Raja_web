import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageMasthead, Band } from "@/components/PageShell";
import {
  findLocation,
  locationLabel,
  projectsAt,
  VERIFICATION_LABELS,
} from "@/content/locations";
import { type InventoryLine } from "@/content/inventorySchedule";
import { getSchedule, getSolutions, getLocations } from "@/lib/store";

import { company } from "@/content/company";
import { CTA } from "@/content/site";
import { abs, SITE_URL } from "@/lib/site";

/**
 * A city page.
 *
 * GATED ON EVIDENCE, NOT ON AMBITION. Only locations that carry an explicit
 * `seoTitle` in `content/locations.ts` get a route. That field is the editorial
 * gate: it is set for a city once the record actually holds enough about Raja's
 * work there to fill a page a buyer would find useful. Every other location
 * still appears as a point on the footprint map and nothing more.
 *
 * The alternative — a page per city because the keyword exists — produces a set
 * of near-identical pages with the city name swapped in. That is the pattern
 * search engines treat as doorway pages, and it is also just untrue: Raja has a
 * yard in Bengaluru and travels from it.
 */

export function generateStaticParams() {
  return getLocations()
    .filter((l) => l.seoTitle)
    .map((l) => ({ city: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const l = findLocation(city);
  if (!l?.seoTitle) return {};
  return {
    title: l.seoTitle,
    description: l.seoDescription ?? undefined,
    alternates: { canonical: abs(`/locations/${l.id}`) },
    openGraph: {
      title: l.seoTitle,
      description: l.seoDescription ?? undefined,
      url: abs(`/locations/${l.id}`),
      type: "website",
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const location = findLocation(city);
  if (!location || !location.published || !location.seoTitle) notFound();

  const projects = projectsAt(location);
  const label = locationLabel(location);
  const held = getSchedule().filter(
    (r: InventoryLine) => r.capacity && r.status === "approved",
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        name: company.name,
        url: abs(`/locations/${location.id}`),
        address: {
          "@type": "PostalAddress",
          addressLocality: location.city,
          addressRegion: location.state,
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: location.lat,
          longitude: location.lng,
        },
        areaServed: { "@type": "City", name: location.city },
        foundingDate: "1977",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Locations", item: abs("/locations") },
          {
            "@type": "ListItem",
            position: 3,
            name: label,
            item: abs(`/locations/${location.id}`),
          },
        ],
      },
    ],
  };

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav aria-label="Breadcrumb" className="frame pt-[clamp(96px,10vw,140px)]">
        <ol className="t-body-sm flex flex-wrap items-center gap-2 text-body-light">
          <li>
            <Link href="/" className="transition-colors hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/locations" className="transition-colors hover:text-ink">
              Locations
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-ink">
            {label}
          </li>
        </ol>
      </nav>

      <PageMasthead
        eyebrow={["Event infrastructure", `in ${label}`]}
        statement={[
          { text: "Built from a " },
          { text: label, accent: true },
          { text: " yard." },
        ]}
        lead={location.blurb ?? undefined}
      />

      {held.length > 0 && (
        <Band tone="ink">
          <h2 className="t-work text-white">Held in stock, deployed from here</h2>
          <p className="t-body-sm mt-2 max-w-[56ch] text-white/60">
            Raja&rsquo;s own published schedule. Owning the stock rather than re-hiring it is
            what makes a build date a commitment rather than an availability check.
          </p>
          <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {held.map((row: InventoryLine) => (
              <div key={row.item} className="border-t border-white/20 pt-4">
                <dd className="t-work font-mono text-white">
                  {row.capacity}
                  <span className="t-body-sm ml-2 text-white/50">{row.unit}</span>
                </dd>
                <dt className="t-body-sm mt-1 text-white/60">{row.item}</dt>
              </div>
            ))}
          </dl>
        </Band>
      )}

      <Band>
        <h2 className="t-work text-ink">What we build in {label}</h2>
        <ul className="mt-6 grid gap-[clamp(12px,1.4vw,20px)] sm:grid-cols-2 lg:grid-cols-3">
          {getSolutions().map((s) => (
            <li key={s.slug}>
              <Link
                href={`/solutions/${s.slug}`}
                className="group flex h-full flex-col rounded-[15px] border border-ink/12 bg-white p-[clamp(18px,2vw,26px)] transition-colors duration-300 hover:border-brand-blue/50"
              >
                <h3 className="t-work text-ink">{s.label}</h3>
                <p className="t-body-sm mt-2.5 flex-1 text-body-light">{s.scope[0]}</p>
                <span className="t-body-sm mt-4 inline-flex items-center gap-2 text-brand-blue">
                  Details
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      {location.image && (
        <Band>
          <figure>
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[15px] bg-ink/5">
              <Image
                src={location.image.src}
                alt={location.image.alt}
                fill
                sizes="(max-width: 1024px) 94vw, 1180px"
                className="object-cover"
              />
            </div>
            <figcaption className="t-body-sm mt-3 text-body-light">
              <span className="mr-2 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white">
                Project photograph
              </span>
              From work at this location.
            </figcaption>
          </figure>
        </Band>
      )}

      {projects.length > 0 && (
        <Band>
          <h2 className="t-work text-ink">Projects on record in {label}</h2>
          <p className="t-body-sm mt-2 max-w-[56ch] text-body-light">
            {VERIFICATION_LABELS[location.verification]}. Only engagements the project record
            holds are listed &mdash; this is not a client list.
          </p>
          <ul className="mt-6 flex flex-col">
            {projects.slice(0, 12).map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-ink/12 py-4"
              >
                <span className="t-body text-ink">{p.event}</span>
                <span className="t-body-sm font-mono text-body-light">
                  {[p.client, p.year].filter(Boolean).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        </Band>
      )}

      <Band>
        <div className="rounded-[15px] border border-ink/12 bg-white p-[clamp(24px,3vw,44px)]">
          <h2 className="t-work max-w-[24ch] text-ink">
            Building something in {label}?
          </h2>
          <p className="t-body mt-3 max-w-[54ch] text-body-light">
            Send the brief, the floor plan or the BOQ. We will come back with quantities
            against your drawing rather than a brochure.
          </p>
          <Link
            href={CTA.primary.href}
            data-analytics="cta-primary"
            data-analytics-location={`city-${location.id}`}
            className="group mt-7 inline-flex h-[54px] items-center gap-3 rounded-full bg-brand-blue px-8 text-white transition-colors duration-300 hover:bg-ink"
          >
            <span className="t-body">{CTA.primary.label}</span>
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </Band>
    </main>
  );
}
