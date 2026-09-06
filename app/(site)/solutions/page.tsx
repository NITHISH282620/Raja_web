import type { Metadata } from "next";
import Link from "next/link";
import { PageMasthead, Band } from "@/components/PageShell";
import Image from "next/image";
import { getSolutions } from "@/lib/store";
import { categoryBanner } from "@/content/projects";
import { company } from "@/content/company";
import { abs, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Who We Build For",
  description:
    "Exhibitions, conferences, corporate events, product launches and institutional programmes. The same owned inventory and in-house crew, indexed by what you are building.",
  alternates: { canonical: abs("/solutions") },
  openGraph: {
    title: "Who We Build For — Raja Enterprises",
    description:
      "Event infrastructure for exhibitions, conferences, corporate events, launches and institutional programmes.",
    url: abs("/solutions"),
    type: "website",
  },
};

export default function SolutionsIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Solutions", item: abs("/solutions") },
    ],
  };

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageMasthead
        eyebrow={["Who we", "build for"]}
        statement={[
          { text: "One yard. " },
          { text: "Every", accent: true },
          { text: " kind of ground." },
        ]}
        lead={`${company.name} supplies the same structures, flooring, staging and stalls across every sector below. These pages describe what that looks like for each.`}
      />

      <Band>
        <ul className="grid gap-[clamp(14px,1.6vw,22px)] sm:grid-cols-2 lg:grid-cols-3">
          {getSolutions().map((s) => (
            <li key={s.slug}>
              <Link
                href={`/solutions/${s.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[15px] border border-ink/12 bg-white transition-colors duration-300 hover:border-brand-blue/50"
              >
                {/* The card image is the same client-approved category banner the
                    detail page uses, so the index shows real Raja work rather
                    than a sourced stand-in. */}
                {categoryBanner[s.category] && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink/5">
                    <Image
                      src={categoryBanner[s.category]!.src}
                      alt={categoryBanner[s.category]!.alt}
                      fill
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 360px"
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-[clamp(20px,2.2vw,30px)]">
                <h2 className="t-work text-ink">{s.label}</h2>
                <p className="t-body-sm mt-3 flex-1 text-body-light">{s.summary}</p>
                <span className="t-body-sm mt-5 inline-flex items-center gap-2 text-brand-blue">
                  What we install
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </span>
                </div>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/partners"
              className="group flex h-full flex-col rounded-[15px] border border-ink/20 bg-ink p-[clamp(20px,2.2vw,30px)] text-white transition-colors duration-300 hover:bg-brand-blue"
            >
              <h2 className="t-work">Agencies &amp; production partners</h2>
              <p className="t-body-sm mt-3 flex-1 text-white/70">
                Your client. Our infrastructure. Delivery capacity behind your name.
              </p>
              <span className="t-body-sm mt-5 inline-flex items-center gap-2">
                How we work together
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </span>
            </Link>
          </li>
        </ul>
      </Band>
    </main>
  );
}
