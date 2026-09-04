"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/motion/primitives";
import { EASE, MOTION_OK } from "@/motion/ease";
import { aboutIntro } from "@/content/about";
import { yearsInOperation, FOUNDED_YEAR } from "@/content/company";

export function AboutHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: EASE.primary } });

        // Eyebrow & Badge reveal
        tl.fromTo(
          scope.querySelectorAll("[data-hero-badge]"),
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 0.6 }
        );

        // Main heading lines stagger
        tl.fromTo(
          scope.querySelectorAll("[data-hero-line]"),
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, clearProps: "transform,opacity" },
          "-=0.3"
        );

        // Subheading paragraph
        tl.fromTo(
          scope.querySelectorAll("[data-hero-lead]"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, clearProps: "transform,opacity" },
          "-=0.4"
        );

        // Dual hero images scale & reveal
        tl.fromTo(
          scope.querySelectorAll("[data-hero-img-wrap]"),
          { opacity: 0, y: 36, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.12, clearProps: "transform,opacity" },
          "-=0.5"
        );

        // Manifesto banner card
        tl.fromTo(
          scope.querySelectorAll("[data-hero-manifesto]"),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.75, clearProps: "transform,opacity" },
          "-=0.3"
        );
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative w-full bg-paper pt-24 sm:pt-28 md:pt-36 pb-16 sm:pb-20 md:pb-24">
      <div className="frame flex flex-col gap-10 sm:gap-14">
        {/* Top Eyebrow & Live Operation Pill */}
        <div data-hero-badge className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-5">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-ink/70">
              Est. {FOUNDED_YEAR} · Bengaluru, Karnataka
            </span>
          </div>
          <div className="rounded-full border border-ink/10 bg-white/70 px-4 py-1 backdrop-blur-md shadow-xs">
            <span className="font-mono text-xs font-medium text-brand-blue tracking-wider uppercase">
              {yearsInOperation()} Years of Continuous Execution
            </span>
          </div>
        </div>

        {/* Monumental Editorial Headline */}
        <div className="flex flex-col gap-6 max-w-5xl">
          <h1 className="t-statement text-ink font-semibold tracking-tight text-balance">
            <span data-hero-line className="inline sm:block">
              Building the physical ground{" "}
            </span>
            <span data-hero-line className="inline sm:block text-brand-blue">
              where India&rsquo;s largest moments stand.
            </span>
          </h1>
          <p data-hero-lead className="t-lead max-w-[54ch] text-body-light leading-relaxed">
            {aboutIntro.lead}
          </p>
        </div>

        {/* Dual Architectural Image Showpiece */}
        <div className="grid gap-6 md:grid-cols-12 items-stretch">
          {/* Main Primary Image: PM / State Dedication */}
          <div
            data-hero-img-wrap
            className="group relative md:col-span-7 h-[360px] sm:h-[440px] md:h-[500px] overflow-hidden rounded-2xl sm:rounded-3xl border border-ink/10 bg-white shadow-sm"
          >
            <Image
              src="/media/work-airport-inauguration.webp"
              alt="Prime Minister dedication at monumental airport pavilion by Raja Enterprises"
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 text-white">
              <div>
                <span className="font-mono text-[11px] tracking-wider uppercase text-white/70 block mb-1">
                  National Landmark Dedication
                </span>
                <p className="text-base sm:text-lg font-medium text-white max-w-[32ch]">
                  Kempegowda International Airport &amp; 108-ft Statue Dedication
                </p>
              </div>
              <span className="hidden sm:inline-block rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-mono">
                50,000+ Attendees
              </span>
            </div>
          </div>

          {/* Secondary Image: Heavy German Hanger Infrastructure */}
          <div
            data-hero-img-wrap
            className="group relative md:col-span-5 h-[320px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-2xl sm:rounded-3xl border border-ink/10 bg-white shadow-sm"
          >
            <Image
              src="/media/capability-structure.3aa80a08.webp"
              alt="Engineered clear-span German hangar structure"
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-mono text-[11px] tracking-wider uppercase text-white/70 block mb-1">
                Direct Owned Assets
              </span>
              <p className="text-base sm:text-lg font-medium text-white">
                5,00,000 Sq. Ft. German Clear-Span Hangers
              </p>
              <p className="text-xs text-white/70 mt-1">
                Engineered for wind resistance, acoustic damping &amp; column-free sightlines.
              </p>
            </div>
          </div>
        </div>

        {/* The Contractor Manifesto Bar */}
        <div
          data-hero-manifesto
          className="relative overflow-hidden rounded-2xl border border-ink/10 bg-white p-6 sm:p-8 md:p-10 shadow-xs"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-blue font-semibold">
                Our Core Doctrine
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
                A contractor, not a middleman.
              </h2>
              <p className="text-sm sm:text-base text-body-light leading-relaxed">
                Most event companies broker equipment from third-party yards. Raja owns its structures, employs its field crew, and carries single-contract accountability from bare ground to handover.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 shrink-0 border-t lg:border-t-0 lg:border-l border-ink/10 pt-4 lg:pt-0 lg:pl-8">
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-ink">100%</p>
                <p className="text-xs text-ink/60 uppercase tracking-wider font-mono">Owned Assets</p>
              </div>
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-ink">In&nbsp;house</p>
                <p className="text-xs text-ink/60 uppercase tracking-wider font-mono">In-House Crew</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="font-mono text-2xl sm:text-3xl font-bold text-brand-blue">0</p>
                <p className="text-xs text-ink/60 uppercase tracking-wider font-mono">Sub-Rentals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
