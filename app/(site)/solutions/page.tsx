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

export default async function SolutionsIndex() {
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

      <div className="py-20 sm:py-28 lg:py-40 bg-paper">
        <div className="flex flex-col gap-24 sm:gap-32 lg:gap-40 mb-16 sm:mb-24 lg:mb-28">
          {(await getSolutions()).map((s, idx) => {
            const isReversed = idx % 2 !== 0;
            
            return (
              <div key={s.slug} className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24 frame`}>
                
                {/* Image Side */}
                <div className="w-full lg:w-[55%] relative group">
                  <Link href={`/solutions/${s.slug}`} className="block relative w-full overflow-hidden rounded-[2rem] shadow-2xl border border-ink/5">
                    <div className="aspect-[4/3] lg:aspect-[16/10] w-full relative bg-ink/5">
                      {(s.image || categoryBanner[s.category]) && (
                        <Image
                          src={s.image || categoryBanner[s.category]!.src}
                          alt={s.image ? s.summary : categoryBanner[s.category]!.alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 55vw"
                          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
                        />
                      )}
                    </div>
                  </Link>
                </div>

                {/* Text Side */}
                <div className="w-full lg:w-[45%] flex flex-col justify-center">
                  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-sky-500 font-semibold mb-4 sm:mb-6 block">
                    0{idx + 1} &mdash; {s.label}
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-ink mb-6 sm:mb-8 text-balance leading-[1.1]">
                    {s.title}
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-body-light mb-10 max-w-lg text-balance">
                    {s.summary}
                  </p>
                  
                  <div>
                    <Link
                      href={`/solutions/${s.slug}`}
                      className="inline-flex items-center gap-3 rounded-full bg-brand-blue text-white px-7 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-ink hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <span>View Infrastructure Capabilities</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Elegant Divider */}
        <div className="frame mb-12 sm:mb-16 lg:mb-20">
          <div className="w-full h-[1px] bg-gradient-to-r from-ink/0 via-ink/10 to-ink/0" />
        </div>

        {/* Partners CTA Section */}
        <div className="frame">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 md:gap-16">
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <span className="h-[2px] w-8 sm:w-12 bg-brand-blue" />
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-brand-blue font-bold">
                  For Agencies
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-medium tracking-tight text-ink leading-[1.1] text-balance">
                Agencies &amp; production partners
              </h2>
            </div>
            
            <div className="w-full md:w-1/2 md:pt-2">
              <p className="text-base sm:text-lg leading-relaxed text-body-light mb-10 max-w-lg text-balance">
                Your client. Our infrastructure. Delivery capacity behind your name. We work seamlessly with event agencies and production houses as their dedicated execution partner.
              </p>
              
              <Link
                href="/partners"
                className="group inline-flex items-center gap-3 rounded-full border border-ink/20 px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-wide text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>How we work together</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
