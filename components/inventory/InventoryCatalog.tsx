"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { inventoryCategories } from "@/content/inventoryCatalog";
import { Reveal } from "@/motion/Reveal";

export function InventoryCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const listRef = useRef<HTMLDivElement>(null);

  const displayedCategories =
    selectedCategory === "all"
      ? inventoryCategories
      : inventoryCategories.filter((c) => c.id === selectedCategory);

  const handleFilter = (catId: string) => {
    setSelectedCategory(catId);
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative w-full bg-paper py-16 sm:py-24 md:py-32">
      <div className="frame">
        {/* Section Title */}
        <div className="flex flex-col gap-4 mb-12 sm:mb-16 max-w-3xl">
          <p className="t-eyebrow text-xs uppercase tracking-[0.2em] text-accent font-medium">
            Technical Asset Catalog
          </p>
          <h2 className="t-statement text-ink text-balance font-semibold">
            Architectural Specifications. <br className="hidden sm:inline" />
            <span className="text-brand-blue">Tested Under Extreme Field Loads.</span>
          </h2>
          <p className="t-body text-body-light leading-relaxed max-w-[52ch]">
            Browse our core equipment families below. Each asset is manufactured to rigorous industrial standards and accompanied by certified structural test reports.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none border-b border-ink/10">
          <button
            type="button"
            onClick={() => handleFilter("all")}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 cursor-pointer ${
              selectedCategory === "all"
                ? "bg-brand-blue text-white shadow-sm font-semibold"
                : "bg-white/80 border border-ink/10 text-ink/70 hover:bg-neutral-100 hover:text-ink"
            }`}
          >
            All Systems (6)
          </button>
          {inventoryCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleFilter(c.id)}
              className={`font-mono text-xs uppercase tracking-wider px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedCategory === c.id
                  ? "bg-brand-blue text-white shadow-sm font-semibold"
                  : "bg-white/80 border border-ink/10 text-ink/70 hover:bg-neutral-100 hover:text-ink"
              }`}
            >
              {c.shortName}
            </button>
          ))}
        </div>

        {/* Catalog Items Progression */}
        <Reveal as="div" variant="riseCard" select=":scope > div > *">
        <div ref={listRef} className="space-y-16 sm:space-y-24">
          {displayedCategories.map((item, index) => (
            <article
              key={item.id}
              id={item.id}
              className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-ink/10 bg-white p-6 sm:p-10 md:p-12 shadow-xs transition-all duration-300 hover:border-brand-blue/30 hover:shadow-xl"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/10 pb-6 mb-8">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl">{item.icon}</span>
                    <span className="font-mono text-xs uppercase tracking-widest text-brand-blue font-semibold">
                      Asset Family 0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-ink">
                    {item.name}
                  </h3>
                  <p className="text-sm sm:text-base font-medium text-brand-blue">
                    {item.tagline}
                  </p>
                </div>

                {/* Direct Owned Capacity Pill */}
                <div className="rounded-2xl border border-brand-blue/20 bg-brand-blue/5 px-5 py-3 text-right">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink/60">
                    Direct Owned Inventory
                  </p>
                  <p className="font-mono text-2xl sm:text-3xl font-bold text-brand-blue">
                    {item.totalCapacity} <span className="text-sm font-medium">{item.unit}</span>
                  </p>
                </div>
              </div>

              {/* Two Column Layout: Visual & Overview vs. Technical Specs */}
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left: Image & Description */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="relative h-[280px] sm:h-[360px] md:h-[400px] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-ink/10 bg-neutral-900">
                    {item.image ? (
                      <>
                        <Image
                          src={item.image}
                          alt={item.alt}
                          fill
                          /* Only the first category is above the fold; the rest
                             were all `eager`, which fetched six full-size images
                             before anything was scrolled to. */
                          loading={index === 0 ? "eager" : "lazy"}
                          priority={index === 0}
                          sizes="(max-width: 1024px) 94vw, 620px"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-mono">
                          {item.alt}
                        </div>
                      </>
                    ) : (
                      /* No honest photograph exists for this category. The tile
                         leads with the verified figure rather than with a stock
                         image that would only be decoration. */
                      <div className="flex h-full flex-col justify-between p-6 sm:p-8">
                        <span className="font-mono text-[11px] uppercase tracking-widest text-white/45">
                          {item.shortName}
                        </span>
                        <span>
                          <span className="block font-mono text-[clamp(2.2rem,5vw,3.6rem)] leading-none text-white">
                            {item.totalCapacity}
                          </span>
                          <span className="mt-2 block font-mono text-[11px] uppercase tracking-widest text-white/55">
                            {item.unit}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-body-light leading-relaxed">
                    {item.description}
                  </p>

                  {/* Typical Applications */}
                  <div className="space-y-2 pt-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-ink/50 block">
                      Proven Applications
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {item.applications.map((app) => (
                        <span
                          key={app}
                          className="font-mono text-xs px-3 py-1 rounded-full bg-neutral-100 text-ink/75"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Technical Specification Table & Engineering Features */}
                <div className="lg:col-span-6 space-y-8">
                  {/* Specs Table */}
                  <div className="rounded-xl sm:rounded-2xl border border-ink/10 bg-neutral-50/70 p-5 sm:p-6">
                    <p className="font-mono text-xs uppercase tracking-wider text-brand-blue font-semibold mb-4 border-b border-ink/10 pb-2">
                      Engineering Specifications
                    </p>
                    <dl className="divide-y divide-ink/10">
                      {item.specs.map((spec) => (
                        <div
                          key={spec.label}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-2.5 text-xs sm:text-[13px]"
                        >
                          <dt className="font-mono text-ink/60">{spec.label}</dt>
                          <dd className="font-medium text-ink sm:text-right">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <p className="font-mono text-xs uppercase tracking-wider text-ink/60">
                      Key Engineering Features
                    </p>
                    <ul className="space-y-2.5">
                      {item.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-ink/80"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-blue mt-1.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Specification Action Button */}
                  <div className="pt-2">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-mono font-medium text-white transition-all duration-300 hover:bg-brand-blue hover:shadow-md"
                    >
                      <span>Request Availability &amp; Engineering Specs</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        </Reveal>
      </div>
    </section>
  );
}
