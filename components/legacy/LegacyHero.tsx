"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/motion/primitives";
import { EASE, MOTION_OK } from "@/motion/ease";
import { FOUNDED_YEAR, yearsInOperation } from "@/content/company";

export function LegacyHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: EASE.primary } });

        tl.fromTo(
          scope.querySelectorAll("[data-hero-badge]"),
          { opacity: 0, y: -14 },
          { opacity: 1, y: 0, duration: 0.6, clearProps: "transform,opacity" }
        );

        tl.fromTo(
          scope.querySelectorAll("[data-hero-headline]"),
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.8, clearProps: "transform,opacity" },
          "-=0.3"
        );

        tl.fromTo(
          scope.querySelectorAll("[data-hero-lead]"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, clearProps: "transform,opacity" },
          "-=0.4"
        );

        tl.fromTo(
          scope.querySelectorAll("[data-stat-badge]"),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.75, clearProps: "transform,opacity" },
          "-=0.3"
        );
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative w-full bg-paper pt-32 sm:pt-36 md:pt-40 pb-16 sm:pb-20 border-b border-ink/10">
      <div className="frame flex flex-col gap-10 sm:gap-14">
        {/* Top Eyebrow */}
        <div data-hero-badge className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-5">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-ink/70">
              Est. {FOUNDED_YEAR} · {yearsInOperation()} Years of Built Infrastructure
            </span>
          </div>
          <div className="rounded-full border border-ink/10 bg-white/80 px-4 py-1 backdrop-blur-md shadow-xs">
            <span className="font-mono text-xs font-semibold text-brand-blue tracking-wider uppercase">
              Bengaluru Origins · National Benchmark
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-5 max-w-5xl">
          <h1 data-hero-headline className="t-statement text-ink font-semibold tracking-tight text-balance">
            The 49-Year Chronicle: <br />
            <span className="text-brand-blue">
              From Timber Pandals to Aerospace-Grade German Hangars.
            </span>
          </h1>
          <p data-hero-lead className="t-lead max-w-[58ch] text-body-light leading-relaxed">
            Founded in Bengaluru in 1977, Raja Enterprises pioneered the transformation of South Indian event infrastructure. Trace the four-decade evolution from local civic convocations to multi-acre clear-span pop-up cities for heads of state.
          </p>
        </div>

        {/* Proof Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div data-stat-badge className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-xs">
            <span className="font-mono text-[10px] uppercase text-ink/50 block mb-1">Founding Year</span>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-ink">{FOUNDED_YEAR}</p>
            <p className="text-xs text-body-light mt-1">5th Main Road, Bengaluru</p>
          </div>

          <div data-stat-badge className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-xs">
            <span className="font-mono text-[10px] uppercase text-ink/50 block mb-1">Strategic Pivot</span>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-brand-blue">1991</p>
            <p className="text-xs text-body-light mt-1">Direct German asset moat</p>
          </div>

          <div data-stat-badge className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-xs">
            <span className="font-mono text-[10px] uppercase text-ink/50 block mb-1">In-House Guild</span>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-ink">460+</p>
            <p className="text-xs text-body-light mt-1">Permanent payroll crew</p>
          </div>

          <div data-stat-badge className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-xs">
            <span className="font-mono text-[10px] uppercase text-ink/50 block mb-1">Structural Failures</span>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-accent">ZERO</p>
            <p className="text-xs text-body-light mt-1">49-year unbroken safety record</p>
          </div>
        </div>
      </div>
    </section>
  );
}
