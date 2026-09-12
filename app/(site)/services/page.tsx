import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageMasthead, Band } from "@/components/PageShell";
import {
  groupedCapabilities,
  markets,
  servicesIntro,
} from "@/content/services";
import { getStats, getPagedServices } from "@/lib/store";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Event Infrastructure Services",
  description:
    "German hangers, exhibition stalls, event flooring, staging, scaffolding and turnkey event infrastructure. Owned inventory and in-house crew, Bengaluru since 1977.",
  alternates: { canonical: abs("/services") },
};

/**
 * The services hub.
 *
 * Three tiers, matching `content/services.ts`: pillars get cards and, where
 * `page` is true, their own route; grouped capabilities are listed plainly
 * because nobody commissions barricading on its own; markets answer the
 * separate question of whether Raja builds for events like yours.
 */
export default async function ServicesPage() {
  const stats = await getStats();

  return (
    <main id="main">
      <PageMasthead
        eyebrow={servicesIntro.eyebrow}
        statement={servicesIntro.statement}
        lead={servicesIntro.lead}
      />

      <div className="py-20 sm:py-28 lg:py-40 bg-paper">
        <div className="frame mb-12 sm:mb-20">
          <div className="flex items-center gap-4">
            <span className="h-[2px] w-8 sm:w-12 bg-brand-blue" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-brand-blue font-bold">
              Core services
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-24 sm:gap-32 lg:gap-40 mb-16 sm:mb-24 lg:mb-28">
          {(await getPagedServices()).map((s, idx) => {
            const isReversed = idx % 2 !== 0;
            
            const InnerVisual = s.image ? (
              <div className="aspect-[4/3] lg:aspect-[16/10] w-full relative bg-ink/5 overflow-hidden rounded-[2rem] shadow-2xl border border-ink/5 group">
                <Image
                  src={s.image.src}
                  alt={s.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
                />
                {s.image.clearance !== "licensed" && (
                  <span className="absolute bottom-6 left-6 rounded-full bg-ink/75 backdrop-blur-md px-4 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-white shadow-lg">
                    {s.image.clearance === "raja-original" ? "Raja site photograph" : "Project photograph"}
                  </span>
                )}
              </div>
            ) : (
              <div className="aspect-[4/3] lg:aspect-[16/10] w-full relative overflow-hidden rounded-[2rem] shadow-2xl border border-white/10 group flex flex-col justify-end p-10 sm:p-16 lg:p-20" style={{background: "linear-gradient(135deg, #12305a 0%, #163660 50%, #1d4a82 100%)"}}>
                <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]" style={{ backgroundSize: "32px 32px" }} />
                <div className="relative z-10 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.02]">
                  <span className="font-mono text-6xl sm:text-8xl lg:text-9xl tracking-tighter leading-none text-white block mb-4">
                    {s.capacity[0]?.value ?? s.title.split(" ")[0]}
                  </span>
                  <span className="font-mono text-sm sm:text-base uppercase tracking-widest text-sky-300 block">
                    {s.capacity[0]?.label ?? "Owned and crewed in house"}
                  </span>
                </div>
              </div>
            );

            return (
              <div key={s.slug} className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24 frame`}>
                
                {/* Visual Side */}
                <div className="w-full lg:w-[55%] relative">
                  {s.page ? (
                    <Link href={`/services/${s.slug}`} className="block relative w-full">
                      {InnerVisual}
                    </Link>
                  ) : (
                    InnerVisual
                  )}
                </div>

                {/* Text Side */}
                <div className="w-full lg:w-[45%] flex flex-col justify-center">
                  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-brand-blue font-semibold mb-4 sm:mb-6 block">
                    {String(s.order + 1).padStart(2, "0")} &mdash; CORE SERVICE
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-ink mb-6 sm:mb-8 text-balance leading-[1.1]">
                    {s.title}
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-body-light mb-10 max-w-lg text-balance">
                    {s.summary}
                  </p>
                  
                  {s.page && (
                    <div>
                      <Link
                        href={`/services/${s.slug}`}
                        className="group inline-flex items-center gap-3 rounded-full border border-ink/20 px-7 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-wide text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white hover:shadow-xl hover:-translate-y-0.5"
                      >
                        <span>View Infrastructure Capabilities</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivered as part of a build */}
      <div className="py-24 sm:py-32 relative overflow-hidden text-white" style={{background: "linear-gradient(135deg, #12305a 0%, #163660 50%, #1d4a82 100%)"}}>
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]" style={{ backgroundSize: "32px 32px" }} />
        
        <div className="frame relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 sm:mb-24">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="h-[2px] w-8 sm:w-12 bg-sky-400" />
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-sky-400 font-bold">
                  Integrated Capabilities
                </span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-medium text-white tracking-tight">
                Delivered as part of a build
              </h2>
            </div>
            <p className="text-white/70 max-w-md text-sm sm:text-base leading-relaxed pb-2">
              We provide complete turnkey execution. These essential services are engineered into the structure's load rather than bolted on as an afterthought.
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groupedCapabilities.map((c) => (
              <div
                key={c.title}
                className="group relative overflow-hidden rounded-[1.5rem] bg-white/[0.04] border border-white/10 p-8 sm:p-10 transition-all duration-500 hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-1 shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
              >
                <h3 className="font-display text-2xl sm:text-3xl mb-4 text-white">{c.title}</h3>
                <p className="text-white/70 leading-relaxed text-sm sm:text-base">{c.body}</p>
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-sky-400 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left ease-out" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who we build for */}
      <div className="py-24 sm:py-32 bg-paper">
        <div className="frame">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 sm:mb-24">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="h-[2px] w-8 sm:w-12 bg-brand-blue" />
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-brand-blue font-bold">
                  Client Sectors
                </span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-medium text-ink tracking-tight">
                Who we build for
              </h2>
            </div>
          </div>
          
          <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {markets.map((m, idx) => (
              <div key={m.title} className="group flex flex-col relative pl-6">
                <div className="absolute left-0 top-2 bottom-0 w-[2px] bg-ink/10 transition-colors duration-500 group-hover:bg-brand-blue" />
                <span className="font-mono text-5xl text-ink/10 font-light mb-4 transition-colors duration-500 group-hover:text-brand-blue/30 leading-none">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-ink mb-4">{m.title}</h3>
                <p className="text-body-light leading-relaxed text-sm sm:text-base">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Owned, not sub-hired */}
      <div className="py-20 sm:py-32 bg-white border-t border-ink/5">
        <div className="frame">
          <div className="flex items-center gap-4 mb-12 sm:mb-16">
            <span className="h-[2px] w-8 sm:w-12 bg-brand-blue" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-brand-blue font-bold">
              Scale & Capacity
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10 border border-ink/10 rounded-[2rem] overflow-hidden shadow-sm">
            {stats.map((s) => (
              <div key={s.label} className="bg-white p-10 sm:p-12 flex flex-col justify-center transition-colors duration-500 hover:bg-slate-50 group">
                <dd className="font-mono text-4xl sm:text-5xl lg:text-[2.75rem] tracking-tighter text-ink mb-4 leading-none transition-transform duration-500 group-hover:-translate-y-1">
                  {s.value}
                </dd>
                <dt className="text-xs sm:text-sm font-semibold text-body-light uppercase tracking-widest leading-relaxed">
                  {s.label}
                </dt>
              </div>
            ))}
          </div>
        </div>
      </div>

    </main>
  );
}
