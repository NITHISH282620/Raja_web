"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, q, ScrollTrigger } from "@/motion/primitives";
import { MOTION_OK } from "@/motion/ease";
import type { InventoryCategory } from "@/content/inventoryCatalog";
import { clsx } from "@/lib/clsx";

interface InventoryShowcaseProps {
  categories: InventoryCategory[];
}

const FILTER_GROUPS = [
  { id: "all", label: "All Systems" },
  { id: "Structures", label: "Structures" },
  { id: "Staging & Rigging", label: "Staging & Rigging" },
  { id: "Lighting & AV", label: "Lighting & AV" },
  { id: "Ground Works", label: "Ground Works" },
  { id: "Fabrication", label: "Fabrication" },
  { id: "Support & Systems", label: "Support & Systems" },
] as const;

export function InventoryShowcase({ categories }: InventoryShowcaseProps) {
  const root = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredCategories = useMemo(() => {
    if (activeFilter === "all") return categories;
    return categories.filter((c) => c.group === activeFilter);
  }, [categories, activeFilter]);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(q(scope, "[data-showcase-header]"), {
          y: 20,
          opacity: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: scope,
            start: "top 90%",
            once: true,
          },
          clearProps: "all",
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative w-full bg-paper py-14 sm:py-20 md:py-28">
      <div className="frame flex flex-col gap-10 sm:gap-14">
        
        {/* Section Header */}
        <div data-showcase-header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-ink/10 pb-8 sm:pb-10">
          <div className="flex flex-col gap-3 sm:gap-4 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="inline-block h-2 w-2 rounded-full bg-brand-blue" />
              <p className="t-eyebrow text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                Direct Physical Fleet &middot; Technical Specifications
              </p>
            </div>
            <h2 className="t-statement text-ink text-balance font-semibold">
              Engineered Asset Systems. <br className="hidden sm:inline" />
              <span className="text-brand-blue">Tested Under Extreme Field Loads.</span>
            </h2>
            <p className="t-body text-body-light leading-relaxed max-w-[58ch]">
              Every asset is manufactured to strict industrial standards and verified under load. Click any system below to open its dedicated page with engineering blueprints and full deployment specifications.
            </p>
          </div>

          <div className="flex items-center gap-2 text-ink/60 font-mono text-xs uppercase tracking-wider self-start md:self-end">
            <span>Showing:</span>
            <span className="font-bold text-ink bg-white px-3 py-1 rounded-full border border-ink/10 shadow-xs">
              {filteredCategories.length} Systems Available
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div data-filter-bar className="sticky top-4 sm:top-6 z-[60] pointer-events-none flex justify-center w-full transition-transform">
          <div className="pointer-events-auto flex items-center justify-start px-4 sm:px-8 bg-white/95 backdrop-blur-xl border border-ink/10 rounded-full shadow-[0_10px_34px_-12px_rgba(16,16,20,0.15)] overflow-x-auto scrollbar-none w-[calc(100vw-32px)] lg:w-[95vw] xl:w-[75vw] max-w-[1100px] h-[64px] lg:h-[76px]">
            <div className="flex items-center justify-between gap-3 sm:gap-4 shrink-0 w-full min-w-max">
              {FILTER_GROUPS.map((group) => {
                const count =
                  group.id === "all"
                    ? categories.length
                    : categories.filter((c) => c.group === group.id).length;
                const isActive = activeFilter === group.id;

                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setActiveFilter(group.id)}
                    className={clsx(
                      "group relative flex items-center gap-1.5 sm:gap-2 rounded-full px-3 py-2 sm:px-5 sm:py-2.5 text-[12px] sm:text-[13px] transition-all duration-300 whitespace-nowrap cursor-pointer outline-none shrink-0",
                      isActive
                        ? "text-white font-medium shadow-sm bg-brand-blue"
                        : "text-ink/60 hover:text-ink hover:bg-neutral-100 font-medium"
                    )}
                  >
                    <span className="relative z-10 tracking-tight">{group.label}</span>
                    {group.id === "all" && (
                      <span
                        className={clsx(
                          "relative z-10 rounded-full px-1.5 py-0.5 sm:px-2 text-[9px] sm:text-[10px] tabular-nums font-bold transition-colors",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-ink/5 text-ink/50 group-hover:bg-ink/10 group-hover:text-ink/70"
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Asset Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {filteredCategories.map((category) => {
            const targetUrl = category.href || `/services/${category.id}`;
            const topSpecs = category.specs.slice(0, 4);

            return (
              <article
                key={category.id}
                data-asset-card
                className="group relative flex flex-col h-full overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-ink/5 bg-white shadow-sm hover:shadow-2xl hover:shadow-brand-blue/10 hover:border-brand-blue/30 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                {/* Visual Media Header */}
                <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full bg-mist overflow-hidden shrink-0">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.alt || category.name}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-1"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center p-6 text-center">
                      <span className="text-4xl opacity-40">{category.icon}</span>
                    </div>
                  )}

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Floating Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3.5 py-1.5 font-mono text-[10px] sm:text-[11px] font-medium tracking-wider text-white border border-white/20 shadow-lg">
                      <span className="text-brand-yellow font-bold">{category.index || "01"}</span>
                      <span className="text-white/40">&middot;</span>
                      <span className="uppercase">{category.group || "Systems"}</span>
                    </span>

                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-lg">
                      {category.icon}
                    </span>
                  </div>

                  {/* Bottom Capacity Banner Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div>
                      <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-white/70 mb-0.5">
                        Total Capacity
                      </p>
                      <p className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-md">
                        {category.totalCapacity}{" "}
                        <span className="text-xs uppercase font-mono tracking-wider text-white/80 font-normal">
                          {category.unit}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-col flex-1 p-5 sm:p-7 gap-5 sm:gap-6 justify-between bg-white z-20 relative">
                  {/* Subtle top inner shadow for depth */}
                  <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/[0.02] to-transparent pointer-events-none" />

                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-serif text-2xl sm:text-[1.75rem] text-ink font-semibold leading-tight group-hover:text-brand-blue transition-colors duration-300">
                        <Link href={targetUrl} className="focus:outline-none">
                          <span className="absolute inset-0 z-20 cursor-pointer" aria-hidden="true" />
                          {category.name}
                        </Link>
                      </h3>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-blue/5 text-brand-blue flex items-center justify-center shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 group-hover:shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 sm:w-5 sm:h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-out"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    <p className="text-sm text-body-light leading-relaxed line-clamp-2">
                      {category.tagline}
                    </p>

                    {/* Specifications Grid */}
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
                      {topSpecs.map((spec, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-start gap-1 p-3 sm:p-4 rounded-2xl bg-neutral-50/80 border border-ink/5 group-hover:bg-brand-blue/[0.03] group-hover:border-brand-blue/10 transition-colors duration-500"
                        >
                          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-ink/50">
                            {spec.label}
                          </span>
                          <span className="text-xs sm:text-[13px] text-ink font-medium leading-snug">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Enterprise Mobilization Banner */}
        <div className="mt-6 sm:mt-10 rounded-3xl bg-neutral-900 text-white p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 max-w-6xl">
            <div className="flex flex-col gap-3 sm:gap-4 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-brand-yellow font-medium">
                Direct Ownership Mobilization Guarantee
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-medium leading-tight">
                Need a custom structural configuration or emergency site mobilization?
              </h3>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                Our in-house engineers assess ground topology, calculate clear-span wind ratings, and deploy our direct-owned fleet across pan-India venues within 24 to 48 hours.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <Link
                href="/contact"
                className="inline-flex h-12 sm:h-13 items-center justify-center gap-3 rounded-full bg-white px-8 font-mono text-xs uppercase tracking-wider font-semibold text-ink transition-all duration-300 hover:bg-neutral-200 hover:shadow-lg"
              >
                <span>Request Site Inspection</span>
                <span aria-hidden>&rarr;</span>
              </Link>
              <Link
                href="/services"
                className="inline-flex h-12 sm:h-13 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 font-mono text-xs uppercase tracking-wider text-white transition-all duration-300 hover:bg-white/10"
              >
                <span>All Services</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
