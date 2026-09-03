"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/motion/primitives";
import { EASE, MOTION_OK } from "@/motion/ease";

export function PortfolioHero() {
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
              Monumental Proof · 49 Years of Physical Execution
            </span>
          </div>
          <div className="rounded-full border border-ink/10 bg-white/80 px-4 py-1 backdrop-blur-md shadow-xs">
            <span className="font-mono text-xs font-semibold text-brand-blue tracking-wider uppercase">
              100% Sourced from Owned Yards
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-5 max-w-5xl">
          <h1 data-hero-headline className="t-statement text-ink font-semibold tracking-tight text-balance">
            Where the Nation Gathered: <br />
            <span className="text-brand-blue">
              Proven Across India&rsquo;s Most Demanding Mandates.
            </span>
          </h1>
          <p data-hero-lead className="t-lead max-w-[58ch] text-body-light leading-relaxed">
            From Prime Minister airport and statue dedications to 50,000-seat stadium swearing-in conversions and 100,000-delegate temporary cities, examine the physical environments engineered and delivered by Raja Enterprises.
          </p>
        </div>

        {/* 3 Proof Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div
            data-stat-badge
            className="rounded-2xl border border-ink/10 bg-white p-6 shadow-xs"
          >
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50 block mb-1">
              Historical Mandates
            </span>
            <p className="font-mono text-3xl sm:text-4xl font-bold text-ink">100+</p>
            <p className="text-xs text-body-light mt-1">State, national, and VIP builds</p>
          </div>

          <div
            data-stat-badge
            className="rounded-2xl border border-ink/10 bg-white p-6 shadow-xs"
          >
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50 block mb-1">
              Citizens Hosted
            </span>
            <p className="font-mono text-3xl sm:text-4xl font-bold text-brand-blue">10,00,000+</p>
            <p className="text-xs text-body-light mt-1">Across stadiums and open fields</p>
          </div>

          <div
            data-stat-badge
            className="rounded-2xl border border-ink/10 bg-white p-6 shadow-xs"
          >
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50 block mb-1">
              Safety Record
            </span>
            <p className="font-mono text-3xl sm:text-4xl font-bold text-ink">49 Years</p>
            <p className="text-xs text-body-light mt-1">Zero structural failures</p>
          </div>
        </div>
      </div>
    </section>
  );
}
