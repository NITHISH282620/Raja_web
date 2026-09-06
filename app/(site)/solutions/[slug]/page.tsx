import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageMasthead, Band } from "@/components/PageShell";
import { findSolutionBySlug, getSolutions } from "@/lib/store";
import { projectsByCategory, categoryBanner, CATEGORY_LABELS } from "@/content/projects";
import { company } from "@/content/company";
import { CTA } from "@/content/site";
import { abs, SITE_URL } from "@/lib/site";

/**
 * A solution page — the same capabilities as `/services`, indexed by occasion.
 *
 * The proof band pulls real projects out of `content/projects.ts` by category
 * rather than restating them in prose. That is deliberate: a page cannot claim
 * work the project record does not hold, and when the record for a category is
 * thin the band simply renders fewer rows. Nothing here fabricates a filler
 * project to balance a layout.
 */

export function generateStaticParams() {
  return getSolutions().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = findSolutionBySlug(slug);
  if (!s) return {};
  return {
    title: s.seoTitle,
    description: s.seoDescription,
    alternates: { canonical: abs(`/solutions/${s.slug}`) },
    openGraph: {
      title: s.seoTitle,
      description: s.seoDescription,
      url: abs(`/solutions/${s.slug}`),
      type: "website",
    },
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = findSolutionBySlug(slug);
  if (!solution) notFound();

  const proof = projectsByCategory(solution.category).slice(0, 6);
  // The solution's own photograph when it has one, otherwise the shared banner
  // for its category — so an unset image is a sensible default, not a gap.
  const banner = solution.image
    ? { src: solution.image, alt: solution.summary }
    : categoryBanner[solution.category];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: solution.title,
        description: solution.summary,
        serviceType: solution.title,
        areaServed: { "@type": "Country", name: "India" },
        provider: { "@type": "Organization", name: company.name, url: SITE_URL },
        url: abs(`/solutions/${solution.slug}`),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Solutions", item: abs("/solutions") },
          {
            "@type": "ListItem",
            position: 3,
            name: solution.label,
            item: abs(`/solutions/${solution.slug}`),
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
            <Link href="/solutions" className="transition-colors hover:text-ink">
              Solutions
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-ink">
            {solution.label}
          </li>
        </ol>
      </nav>

      <PageMasthead
        eyebrow={["Who we", "build for"]}
        statement={[{ text: solution.title }]}
        lead={solution.summary}
      />

      <Band>
        <div className="grid gap-[clamp(28px,4vw,64px)] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-[120px] lg:self-start">
            <p className="t-eyebrow text-ink/50">Written for</p>
            <p className="t-body mt-3 max-w-[42ch] text-body-light">{solution.audience}</p>

            <Link
              href={CTA.primary.href}
              data-analytics="cta-primary"
              data-analytics-location={`solution-${solution.slug}`}
              className="group mt-7 inline-flex h-[54px] items-center gap-3 rounded-full bg-brand-blue px-8 text-white transition-colors duration-300 hover:bg-ink"
            >
              <span className="t-body">{CTA.primary.label}</span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </div>

          <div>
            <h2 className="t-work text-ink">What we install</h2>
            <ul className="mt-5 flex flex-col">
              {solution.scope.map((item) => (
                <li
                  key={item}
                  className="t-body flex items-start gap-4 border-t border-ink/12 py-3.5 text-body-light"
                >
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Band>

      {banner && (
        <Band>
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[15px] bg-ink/5">
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              sizes="(max-width: 1024px) 94vw, 1180px"
              className="object-cover"
            />
          </div>
        </Band>
      )}

      {solution.sections.map((section) => (
        <Band key={section.heading}>
          <div className="grid gap-[clamp(20px,3vw,56px)] lg:grid-cols-[0.42fr_0.58fr]">
            <h2 className="t-work max-w-[20ch] text-ink">{section.heading}</h2>
            <div>
              <p className="t-body max-w-[62ch] text-body-light">{section.body}</p>
              {section.items && (
                <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                  {section.items.map((i) => (
                    <li key={i} className="t-body-sm border-t border-ink/12 py-2.5 text-ink">
                      {i}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Band>
      ))}

      {proof.length > 0 && (
        <Band>
          <h2 className="t-work text-ink">
            {CATEGORY_LABELS[solution.category]} projects on record
          </h2>
          <p className="t-body-sm mt-2 max-w-[54ch] text-body-light">
            Drawn from Raja&rsquo;s project record. Only engagements the record holds are listed.
          </p>
          <ul className="mt-6 flex flex-col">
            {proof.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-ink/12 py-4"
              >
                <span className="t-body text-ink">{p.event}</span>
                <span className="t-body-sm font-mono text-body-light">
                  {[p.client, p.location, p.year].filter(Boolean).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/projects"
            className="t-body mt-6 inline-flex items-center gap-2 text-brand-blue transition-colors hover:text-ink"
          >
            View the full project record <span aria-hidden>&rarr;</span>
          </Link>
        </Band>
      )}
    </main>
  );
}
