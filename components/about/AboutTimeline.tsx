"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/motion/primitives";
import { MOTION_OK } from "@/motion/ease";
import { aboutTimeline } from "@/content/about";
import { FOUNDED_YEAR, yearsInOperation } from "@/content/company";

export function AboutTimeline() {
  const root = useRef<HTMLElement>(null);
  const [activeEra, setActiveEra] = useState<number>(0);
  const progressLineRef = useRef<HTMLDivElement>(null);

  const scrollToEra = (index: number) => {
    const target = root.current?.querySelector(`[data-era-card="${index}"]`);
    if (target) {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
      const offset = isMobile ? 130 : 110;
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const eraCards = scope.querySelectorAll<HTMLElement>("[data-era-card]");
        const progressBar = progressLineRef.current;

        // Animate the vertical progress bar based on overall timeline scroll
        if (progressBar) {
          gsap.fromTo(
            progressBar,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: scope.querySelector("[data-timeline-track]"),
                start: "top center",
                end: "bottom center",
                scrub: 0.3,
              },
            }
          );
        }

        // Each era card slide-in entrance & active tracking
        eraCards.forEach((card, index) => {
          // Slide & reveal entrance for the cards on scroll
          gsap.fromTo(
            card,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                once: true,
              },
            }
          );

          // Subtle parallax on archival images inside cards
          const img = card.querySelector("[data-archival-img]");
          if (img) {
            gsap.fromTo(
              img,
              { y: -15 },
              {
                y: 15,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          }

          // Active era highlight in sticky rail
          ScrollTrigger.create({
            trigger: card,
            start: index === 0 ? "top 80%" : "top 50%",
            end: index === eraCards.length - 1 ? "bottom 20%" : "bottom 50%",
            onToggle: (self) => {
              if (self.isActive) setActiveEra(index);
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative w-full bg-paper py-20 sm:py-28 md:py-36 border-t border-ink/10">
      <div className="frame">
        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-16 sm:mb-20 max-w-3xl">
          <p className="t-eyebrow text-xs uppercase tracking-[0.2em] text-accent font-medium">
            Choreography of Scale
          </p>
          <h2 className="t-statement text-ink text-balance font-semibold">
            The 49-Year Heritage. <br className="hidden sm:inline" />
            <span className="text-brand-blue">Four Defining Eras.</span>
          </h2>
          <p className="t-body text-body-light leading-relaxed max-w-[50ch]">
            From local civic convocations in 1977 to constructing multi-acre pop-up cities for Prime Ministers and state ceremonies, explore the structural milestones that defined Raja Enterprises.
          </p>
        </div>

        {/* Mobile Credentials Overview Card (In-flow before timeline cards) */}
        <div className="lg:hidden mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-ink/10 shadow-xs">
          <div className="flex items-center justify-between border-b border-ink/10 pb-3 mb-3.5">
            <span className="t-eyebrow text-xs uppercase tracking-wider text-ink/60 font-medium">Four Defining Eras</span>
            <span className="font-mono text-xs font-bold text-brand-blue">{aboutTimeline[0].year} — Today</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="text-left">
              <p className="font-mono text-xl sm:text-2xl font-bold text-ink">{yearsInOperation()}</p>
              <p className="t-eyebrow text-[9px] sm:text-[10px] text-ink/50 uppercase">Years Proven</p>
            </div>
            <div className="border-x border-ink/10 px-2">
              <p className="font-mono text-xl sm:text-2xl font-bold text-brand-blue">{FOUNDED_YEAR}</p>
              <p className="t-eyebrow text-[9px] sm:text-[10px] text-ink/50 uppercase">Founded</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xl sm:text-2xl font-bold text-ink">100%</p>
              <p className="t-eyebrow text-[9px] sm:text-[10px] text-ink/50 uppercase">Direct Owned</p>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Era Header (Docked flush to top with solid background & rich active era content) */}
        <div className="lg:hidden sticky top-0 z-30 -mx-4 sm:-mx-8 px-4 sm:px-8 pt-3 pb-3.5 mb-8 bg-paper border-b border-ink/10 shadow-sm transition-all duration-200">
          {/* Row 1: Tracker Title, Counter, and Period */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="t-eyebrow text-[10px] uppercase tracking-wider text-ink/50 font-semibold">
                Era Tracker
              </span>
              <span className="h-1 w-1 rounded-full bg-ink/20" />
              <span className="font-mono text-xs font-bold text-brand-blue">
                0{activeEra + 1} / 0{aboutTimeline.length}
              </span>
            </div>
            <span className="font-mono text-[10px] font-semibold text-ink/60 bg-ink/5 px-2 py-0.5 rounded-full">
              {aboutTimeline[activeEra].period}
            </span>
          </div>

          {/* Row 2: Active Era Headline */}
          <div className="mb-2.5">
            <p className="text-sm font-semibold text-ink tracking-tight truncate">
              {aboutTimeline[activeEra].headline}
            </p>
          </div>

          {/* Row 3: Era Navigation Pills */}
          <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] -mx-1 px-1">
            {aboutTimeline.map((era, index) => {
              const isActive = activeEra === index;
              return (
                <button
                  key={era.year}
                  type="button"
                  onClick={() => scrollToEra(index)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-brand-blue text-white font-semibold shadow-xs"
                      : "bg-white border border-ink/10 text-ink/70 hover:bg-neutral-100"
                  }`}
                >
                  <span>{era.year}</span>
                  {isActive && (
                    <span className="text-[10px] font-sans font-medium text-white/80 border-l border-white/20 pl-1.5 truncate max-w-[120px]">
                      {era.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-Column Layout: Sticky Tracker on Left, Scrolling Cards on Right */}
        <div data-timeline-track className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Sticky Navigator on Desktop */}
          <div className="hidden lg:block lg:col-span-4 self-start sticky top-28 z-20 space-y-6 pr-4">
            <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-white/90 p-6 backdrop-blur-md shadow-xs transition-all duration-300 hover:border-ink/20">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-6">
                <span className="t-eyebrow text-xs uppercase tracking-wider text-ink/60">Era Tracker</span>
                <span className="t-eyebrow text-xs font-semibold text-brand-blue">
                  0{activeEra + 1} / 0{aboutTimeline.length}
                </span>
              </div>

              {/* Step Navigation Pill List with Progress Rail */}
              <div className="relative pl-5 space-y-3">
                {/* Background Rail */}
                <div className="absolute left-1.5 top-3 bottom-3 w-[2px] bg-ink/10 rounded-full" />
                {/* Scrubbed Progress Rail */}
                <div
                  ref={progressLineRef}
                  className="absolute left-1.5 top-3 bottom-3 w-[2px] bg-brand-blue rounded-full origin-top"
                />

                {aboutTimeline.map((era, index) => {
                  const isActive = activeEra === index;
                  return (
                    <button
                      key={era.year}
                      type="button"
                      onClick={() => scrollToEra(index)}
                      className={`group relative w-full text-left flex items-start gap-3.5 p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "bg-brand-blue text-white shadow-md translate-x-1"
                          : "text-ink/60 hover:bg-neutral-100 hover:text-ink"
                      }`}
                    >
                      {/* Rail Dot */}
                      <span
                        className={`absolute -left-[18px] top-4 h-2 w-2 rounded-full border transition-all duration-300 ${
                          isActive
                            ? "bg-brand-blue border-white ring-4 ring-brand-blue/20 scale-125"
                            : "bg-white border-ink/30 group-hover:border-ink/60"
                        }`}
                      />

                      <span
                        className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md transition-colors ${
                          isActive ? "bg-white/20 text-white" : "bg-ink/5 text-ink group-hover:bg-ink/10"
                        }`}
                      >
                        {era.year}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[10px] font-mono uppercase tracking-wider ${isActive ? "text-white/80" : "text-ink/45"}`}>
                          {era.period}
                        </p>
                        <p className={`text-xs sm:text-sm font-medium leading-snug line-clamp-1 ${isActive ? "text-white" : "text-ink"}`}>
                          {era.headline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 49 Years Stat Footnote */}
              <div className="mt-8 pt-6 border-t border-ink/10 flex items-center justify-between">
                <div>
                  <p className="font-mono text-2xl font-bold text-ink">{yearsInOperation()}</p>
                  <p className="t-eyebrow text-[10px] text-ink/50 uppercase">Years Proven</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-bold text-brand-blue">{FOUNDED_YEAR}</p>
                  <p className="t-eyebrow text-[10px] text-ink/50 uppercase">Founded</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-bold text-ink">100%</p>
                  <p className="t-eyebrow text-[10px] text-ink/50 uppercase">Direct Owned</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Timeline Cards Progression (Slides Past as You Scroll) */}
          <div className="lg:col-span-8 space-y-12 sm:space-y-16">
            {aboutTimeline.map((era, index) => {
              const isActive = activeEra === index;
              return (
                <article
                  key={era.year}
                  data-era-card={index}
                  className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border bg-white p-6 sm:p-9 md:p-10 transition-all duration-500 ${
                    isActive
                      ? "border-brand-blue/30 shadow-lg ring-1 ring-brand-blue/10"
                      : "border-ink/10 shadow-xs hover:border-ink/20 hover:shadow-md"
                  }`}
                >
                  {/* Top Accent Line on Active */}
                  <div
                    className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-blue to-accent transition-opacity duration-500 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  {/* Header with Era Badge & Year */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-5 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue text-white font-mono text-xs font-bold shadow-xs">
                        0{index + 1}
                      </span>
                      <span className="t-eyebrow text-xs uppercase tracking-widest text-brand-blue font-semibold">
                        {era.tag}
                      </span>
                    </div>
                    <span className="t-eyebrow text-xs text-ink/60 bg-neutral-100 px-3 py-1 rounded-full group-hover:bg-neutral-200 transition-colors">
                      {era.period}
                    </span>
                  </div>

                  {/* Headline & Description */}
                  <div className="space-y-4 mb-8">
                    <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink group-hover:text-brand-blue transition-colors duration-300">
                      {era.headline}
                    </h3>
                    <p className="text-base text-body-light leading-relaxed max-w-[56ch]">
                      {era.description}
                    </p>
                  </div>

                  {/* Archival Project Visual with Parallax Zoom */}
                  <div className="relative h-[240px] sm:h-[320px] md:h-[380px] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-ink/10 mb-8 bg-neutral-900">
                    <div data-archival-img className="relative w-full h-[115%] -top-[7%]">
                      <Image
                        src={era.image}
                        alt={era.alt}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs pointer-events-none">
                      <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 t-eyebrow text-[10px]">
                        {era.alt}
                      </span>
                      <span className="hidden sm:inline-block opacity-75 t-eyebrow text-[10px]">
                        Historical Record
                      </span>
                    </div>
                  </div>

                  {/* Key Deliverables */}
                  <div className="space-y-3">
                    <p className="t-eyebrow text-xs uppercase tracking-wider text-ink/50">
                      Key Historical Deliverables
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-2.5">
                      {era.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2.5 text-xs sm:text-[13px] text-ink/80 bg-neutral-50/80 border border-ink/5 rounded-lg px-3 py-2.5 transition-all duration-300 hover:bg-brand-blue/5 hover:border-brand-blue/20 hover:text-ink hover:translate-x-0.5"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-blue shrink-0 group-hover:scale-125 transition-transform" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
