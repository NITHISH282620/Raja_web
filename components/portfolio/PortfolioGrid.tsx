"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { notableEventsList } from "@/content/notableEvents";
import { Reveal } from "@/motion/Reveal";

export function PortfolioGrid() {
  const [activeSector, setActiveSector] = useState<string>("all");
  const gridTopRef = useRef<HTMLDivElement>(null);

  const displayedEvents =
    activeSector === "all"
      ? notableEventsList
      : notableEventsList.filter((ev) => ev.sector === activeSector);

  const handleSectorChange = (sector: string) => {
    setActiveSector(sector);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative w-full bg-paper py-16 sm:py-24 md:py-32">
      <div className="frame">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-12 sm:mb-16 max-w-3xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink/60">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>Documented Execution Record</span>
          </div>
          <h2 className="t-statement text-ink text-balance font-semibold">
            Notable Case Archives. <br className="hidden sm:inline" />
            <span className="text-brand-blue">Turnkey Delivery from Bare Ground.</span>
          </h2>
          <p className="t-body text-body-light leading-relaxed max-w-[52ch]">
            Browse selected state ceremonies, Prime Minister inaugurations, national trade expos, and monumental cultural convocations built by Raja Enterprises.
          </p>
        </div>

        {/* Sector Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none border-b border-ink/10">
          <button
            type="button"
            onClick={() => handleSectorChange("all")}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 cursor-pointer ${
              activeSector === "all"
                ? "bg-brand-blue text-white shadow-sm font-semibold"
                : "bg-white/80 border border-ink/10 text-ink/70 hover:bg-neutral-100 hover:text-ink"
            }`}
          >
            All Mandates ({notableEventsList.length})
          </button>
          <button
            type="button"
            onClick={() => handleSectorChange("state-ceremonies")}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 cursor-pointer ${
              activeSector === "state-ceremonies"
                ? "bg-brand-blue text-white shadow-sm font-semibold"
                : "bg-white/80 border border-ink/10 text-ink/70 hover:bg-neutral-100 hover:text-ink"
            }`}
          >
            State &amp; VIP Ceremonies
          </button>
          <button
            type="button"
            onClick={() => handleSectorChange("pm-dedications")}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 cursor-pointer ${
              activeSector === "pm-dedications"
                ? "bg-brand-blue text-white shadow-sm font-semibold"
                : "bg-white/80 border border-ink/10 text-ink/70 hover:bg-neutral-100 hover:text-ink"
            }`}
          >
            Prime Minister Dedications
          </button>
          <button
            type="button"
            onClick={() => handleSectorChange("expos-summits")}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 cursor-pointer ${
              activeSector === "expos-summits"
                ? "bg-brand-blue text-white shadow-sm font-semibold"
                : "bg-white/80 border border-ink/10 text-ink/70 hover:bg-neutral-100 hover:text-ink"
            }`}
          >
            Industrial Expos &amp; Summits
          </button>
          <button
            type="button"
            onClick={() => handleSectorChange("cultural-cities")}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 cursor-pointer ${
              activeSector === "cultural-cities"
                ? "bg-brand-blue text-white shadow-sm font-semibold"
                : "bg-white/80 border border-ink/10 text-ink/70 hover:bg-neutral-100 hover:text-ink"
            }`}
          >
            Cultural Mega-Convocations
          </button>
        </div>

        {/* Case Studies List */}
        <Reveal as="div" variant="riseCard" select=":scope > div > *">
        <div ref={gridTopRef} className="space-y-16 sm:space-y-24">
          {displayedEvents.map((item, index) => (
            <article
              key={item.id}
              id={item.id}
              className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-ink/10 bg-white p-6 sm:p-10 md:p-12 shadow-xs transition-all duration-500 hover:border-brand-blue/30 hover:shadow-xl"
            >
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-5 mb-8">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue">
                    {item.year}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-ink/60">
                    {item.sectorLabel}
                  </span>
                </div>
                <span className="font-mono text-xs text-ink/50 bg-neutral-100 px-3 py-1 rounded-full">
                  Client: {item.client}
                </span>
              </div>

              {/* Title & Venue */}
              <div className="space-y-2 mb-8 max-w-3xl">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-ink group-hover:text-brand-blue transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm font-mono text-ink/60">
                  📍 {item.venue}
                </p>
              </div>

              {/* 2-Column Showcase */}
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Column: Image Banner & Scale Metadata */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="relative h-[280px] sm:h-[360px] md:h-[400px] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-ink/10 bg-neutral-900">
                    <Image
                      src={item.heroImage}
                      alt={item.alt}
                      fill
                      loading="eager"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                      <span>{item.alt}</span>
                      <span className="opacity-75">{item.turnaroundTime}</span>
                    </div>
                  </div>

                  {/* 4 Architectural Scale Metrics */}
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-ink/10 bg-neutral-50/70">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-ink/50 block">Attendance</span>
                      <p className="text-xs sm:text-sm font-medium text-ink mt-0.5">{item.attendance}</p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase text-ink/50 block">Covered Footprint</span>
                      <p className="text-xs sm:text-sm font-mono font-bold text-brand-blue mt-0.5">{item.coveredArea}</p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase text-ink/50 block">Turnaround Window</span>
                      <p className="text-xs sm:text-sm font-medium text-ink mt-0.5">{item.turnaroundTime}</p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase text-ink/50 block">Security Clearance</span>
                      <p className="text-xs sm:text-sm font-medium text-ink mt-0.5">{item.securityLevel}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Case Summary, Scope Highlights & Deployed Equipment */}
                <div className="lg:col-span-6 space-y-6">
                  <p className="text-sm sm:text-base text-body-light leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Scope Highlights */}
                  <div className="space-y-3 pt-2">
                    <p className="font-mono text-xs uppercase tracking-wider text-ink/70 font-semibold">
                      Key Engineering Mandates Delivered
                    </p>
                    <ul className="space-y-2">
                      {item.scopeHighlights.map((scope) => (
                        <li key={scope} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink/80">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-blue mt-1.5 shrink-0" />
                          <span>{scope}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Equipment Deployed Grid */}
                  <div className="pt-2">
                    <p className="font-mono text-xs uppercase tracking-wider text-ink/70 font-semibold mb-3">
                      Core Asset Fleet Deployed
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {item.equipmentDeployed.map((eq) => (
                        <div key={eq.label} className="p-3 rounded-lg border border-ink/10 bg-neutral-50">
                          <span className="font-mono text-[10px] uppercase text-ink/50 block">{eq.label}</span>
                          <span className="font-mono text-sm font-bold text-ink">{eq.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-4 border-t border-ink/10 flex items-center justify-between">
                    <span className="font-mono text-xs text-ink/50">Verified Case Study #{index + 1}</span>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-brand-blue hover:text-ink transition-colors"
                    >
                      <span>Request Similar Scope Architecture</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
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
