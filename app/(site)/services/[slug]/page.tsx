import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageMasthead, Band } from "@/components/PageShell";
import { findPillar, pagedPillars, hangerInUse } from "@/content/services";
import { company } from "@/content/company";
import { abs, SITE_URL } from "@/lib/site";

/**
 * A service page.
 *
 * Only pillars flagged `page: true` in `content/services.ts` get a route. The
 * rest appear on the hub. That flag is the whole gate: adding a service page is
 * a content decision plus the copy to fill it, not a new template.
 *
 * Sections the data cannot yet support are omitted rather than filled — a
 * capacity band renders only when confirmed figures exist, which is why
 * scaffolding currently has none.
 */

export function generateStaticParams() {
  return pagedPillars().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = findPillar(slug);
  if (!s) return {};
  return {
    title: `${s.title} in Bengaluru & India`,
    description: s.summary,
    alternates: { canonical: abs(`/services/${s.slug}`) },
    openGraph: {
      title: `${s.title} — ${company.name}`,
      description: s.summary,
      url: abs(`/services/${s.slug}`),
      type: "website",
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = findPillar(slug);
  if (!service || !service.page) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.title,
        description: service.summary,
        serviceType: service.title,
        areaServed: { "@type": "Country", name: "India" },
        provider: { "@type": "Organization", name: company.name, url: SITE_URL },
        url: abs(`/services/${service.slug}`),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Services", item: abs("/services") },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: abs(`/services/${service.slug}`),
          },
        ],
      },
    ],
  };

  return (
    <main id="main">
      <Script
        id={`service-${service.slug}-jsonld`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            <Link href="/services" className="transition-colors hover:text-ink">
              Services
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-ink">{service.title}</li>
        </ol>
      </nav>

      <PageMasthead
        eyebrow={["Service", "Bengaluru"]}
        statement={[{ text: service.heading }]}
        lead={service.summary}
      />

      {service.image && (
        <figure className="frame mt-[clamp(20px,3vw,44px)]">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-ink/5 sm:aspect-[16/9] lg:aspect-[21/9]">
            <Image
              src={service.image.src}
              alt={service.image.alt}
              fill
              priority
              sizes="(max-width: 1024px) 96vw, 1280px"
              className="object-cover"
            />
          </div>
          <figcaption className="t-body-sm mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-light">
            {service.image.clearance === "raja-original" ? (
              <>
                <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white">
                  Raja site photograph
                </span>
                <span>A Raja hanger frame going up on open ground, before cladding.</span>
              </>
            ) : (
              <>
                <span className="rounded-full bg-ink/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink/60">
                  Representative
                </span>
                <span>Shows the type of infrastructure described. Not a Raja project photograph.</span>
              </>
            )}
          </figcaption>
        </figure>
      )}

      <Band>
        <div className="frame grid gap-[clamp(28px,4vw,72px)] lg:grid-cols-[1.15fr_0.85fr]">
          <div data-band-item className="flex min-w-0 flex-col gap-[clamp(14px,1.6vw,22px)]">
            {service.body.map((p) => (
              <p key={p.slice(0, 32)} className="t-body max-w-[62ch] text-body-light">
                {p}
              </p>
            ))}
          </div>

          {service.capacity.length > 0 && (
            <dl data-band-item className="flex min-w-0 flex-col self-start">
              <p className="t-eyebrow mb-3 text-ink/50">Capacity</p>
              {service.capacity.map((c) => (
                <div
                  key={c.label}
                  className="grid grid-cols-1 gap-x-4 gap-y-0.5 border-t border-ink/15 py-[clamp(10px,1.3vw,16px)] sm:grid-cols-[1fr_auto] sm:items-baseline"
                >
                  <dt className="t-body text-body-light">{c.label}</dt>
                  <dd className="t-work font-mono text-ink sm:text-right">{c.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </Band>

      {service.slug === "german-hangers" && (
        <Band>
          <figure className="frame grid items-center gap-[clamp(24px,4vw,64px)] lg:grid-cols-[0.9fr_1.1fr]">
            <figcaption className="flex flex-col gap-3">
              <p className="t-eyebrow text-ink/50">In use</p>
              <p className="t-work text-ink">A frame becomes a hall.</p>
              <p className="t-body max-w-[46ch] text-body-light">
                Clad, floored and lit, the same clear span carries an exhibition floor, a
                conference audience or a ceremonial dais — with no column anywhere in the room.
              </p>
              <p className="t-body-sm text-body-light">
                <span className="mr-2 rounded-full bg-ink/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink/60">
                  Representative
                </span>
                Not a Raja project photograph.
              </p>
            </figcaption>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-ink/5">
              <Image
                src={hangerInUse.src}
                alt={hangerInUse.alt}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 96vw, 640px"
                className="object-cover"
              />
            </div>
          </figure>
        </Band>
      )}

      {service.bundled.length > 0 && (
        <Band tone="ink">
          <div className="frame">
            <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-ink/50">
              Normally delivered with
            </p>
            <ul className="flex flex-wrap gap-x-3 gap-y-3">
              {service.bundled.map((b) => (
                <li
                  key={b}
                  data-band-item
                  className="t-body rounded-full border border-ink/15 bg-white px-5 py-2 text-ink"
                >
                  {b}
                </li>
              ))}
            </ul>
            <p className="t-body mt-[clamp(20px,2.4vw,32px)] max-w-[58ch] text-body-light">
              Specified as one scope, by one contractor, on one schedule. See{" "}
              <Link href="/inventory" className="text-brand-blue underline underline-offset-4">
                what we own
              </Link>{" "}
              or{" "}
              <Link href="/projects" className="text-brand-blue underline underline-offset-4">
                where we have built it
              </Link>
              .
            </p>
          </div>
        </Band>
      )}

    </main>
  );
}
