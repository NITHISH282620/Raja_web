import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageMasthead, Band } from "@/components/PageShell";
import { company } from "@/content/company";
import { CTA } from "@/content/site";
import { type InventoryLine } from "@/content/inventorySchedule";
import { getSchedule, getPartnerPoints, getPartnerSteps, pageImage } from "@/lib/store";
import { abs, SITE_URL } from "@/lib/site";

/**
 * The agency and production-partner page.
 *
 * A different proposition from the solution pages, which is why it is not one
 * of them. An agency is not buying staging; it is buying the certainty that
 * what it has already promised a client will physically exist on the day, with
 * someone else carrying the yard, the stock and the crew. The page is written
 * to that anxiety rather than to a product list.
 *
 * Capacity figures come from the approved inventory schedule and nowhere else.
 */

export const metadata: Metadata = {
  title: "Your Client. Our Infrastructure.",
  description:
    "Infrastructure delivery for event agencies, experiential agencies, production houses and exhibition agencies. Owned stock, in-house crew, delivered behind your client relationship.",
  alternates: { canonical: abs("/partners") },
  openGraph: {
    title: "Your Client. Our Infrastructure. — Raja Enterprises",
    description:
      "Infrastructure delivery capacity for event agencies and production houses. Bengaluru, since 1977.",
    url: abs("/partners"),
    type: "website",
  },
};

export default function PartnersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Event infrastructure delivery for agencies and production houses",
        description:
          "White-label event infrastructure supply and installation for event agencies, experiential agencies, exhibition agencies and production houses.",
        serviceType: "Event infrastructure subcontracting",
        areaServed: { "@type": "Country", name: "India" },
        provider: { "@type": "Organization", name: company.name, url: SITE_URL },
        url: abs("/partners"),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Partners", item: abs("/partners") },
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
          <li aria-current="page" className="text-ink">
            Partners
          </li>
        </ol>
      </nav>

      <PageMasthead
        eyebrow={["For agencies", "and production"]}
        statement={[
          { text: "Your client. " },
          { text: "Our", accent: true },
          { text: " infrastructure." },
        ]}
        lead="Event agencies, experiential agencies, exhibition agencies and production houses use Raja as the physical delivery layer behind work they have already sold. The relationship stays yours."
      />

      {/*
        A genuine Raja photograph, and the reason this page can make the claim
        it makes: the crew in shot are wearing Raja's own shirts, on Raja's own
        build. Nothing representative would carry the same weight here.
      */}
      <Band>
        <figure>
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[15px] bg-ink/5">
            <Image
              src={pageImage("partners-hero")?.image ?? "/media/projects/aicog-2019-hanger-erection.webp"}
              alt={pageImage("partners-hero")?.alt ?? ""}
              fill
              sizes="(max-width: 1024px) 94vw, 1180px"
              className="object-cover"
            />
          </div>
          <figcaption className="t-body-sm mt-3 text-body-light">
            <span className="mr-2 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white">
              Raja crew
            </span>
            Raja&rsquo;s own field crew on site during installation.
          </figcaption>
        </figure>
      </Band>

      <Band>
        <div className="grid gap-[clamp(14px,1.6vw,22px)] sm:grid-cols-2">
          {getPartnerPoints().map((w) => (
            <div
              key={w.heading}
              className="rounded-[15px] border border-ink/12 bg-white p-[clamp(20px,2.2vw,30px)]"
            >
              <h2 className="t-work text-ink">{w.heading}</h2>
              <p className="t-body-sm mt-3 text-body-light">{w.body}</p>
            </div>
          ))}
        </div>
      </Band>

      <Band tone="ink">
        <h2 className="t-work text-white">What you are drawing on</h2>
        <p className="t-body-sm mt-2 max-w-[54ch] text-white/60">
          Raja&rsquo;s own schedule of held stock. These are the figures the business publishes;
          nothing here is estimated.
        </p>
        {/* Only lines with a confirmed figure are shown. The schedule also
            carries items Raja publishes without a capacity — listing those with
            a blank number would read as a missing fact rather than an absent
            one. */}
        <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {getSchedule()
            .filter((row: InventoryLine) => row.capacity && row.status === "approved")
            .map((row: InventoryLine) => (
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

      <Band>
        <div className="grid gap-[clamp(20px,3vw,56px)] lg:grid-cols-[0.42fr_0.58fr]">
          <h2 className="t-work max-w-[18ch] text-ink">How a partnership runs</h2>
          <div>
            <ol className="flex flex-col">
              {getPartnerSteps().map((step, i) => (
                <li
                  key={step.label}
                  className="t-body flex items-start gap-5 border-t border-ink/12 py-4 text-ink"
                >
                  <span className="t-body-sm mt-0.5 font-mono text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{step.label}</span>
                </li>
              ))}
            </ol>

            <Link
              href={CTA.primary.href}
              data-analytics="cta-primary"
              data-analytics-location="partners"
              className="group mt-8 inline-flex h-[54px] items-center gap-3 rounded-full bg-brand-blue px-8 text-white transition-colors duration-300 hover:bg-ink"
            >
              <span className="t-body">Send us a project to price</span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </Band>
    </main>
  );
}
