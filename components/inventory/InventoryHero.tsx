"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/motion/primitives";
import { EASE, MOTION_OK } from "@/motion/ease";

export function InventoryHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: EASE.primary } });

        tl.from(scope.querySelectorAll("[data-hero-badge]"), {
          opacity: 0,
          y: -14,
          duration: 0.6,
          clearProps: "all",
        });

        tl.from(
          scope.querySelectorAll("[data-hero-headline]"),
          {
            opacity: 0,
            y: 28,
            duration: 0.8,
            clearProps: "all",
          },
          "-=0.3"
        );

        tl.from(
          scope.querySelectorAll("[data-hero-lead]"),
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
            clearProps: "all",
          },
          "-=0.4"
        );

        tl.from(
          scope.querySelectorAll("[data-stat-card]"),
          {
            opacity: 0,
            y: 30,
            stagger: 0.08,
            duration: 0.75,
            clearProps: "all",
          },
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
          <p className="t-eyebrow text-xs uppercase tracking-[0.2em] text-ink/70">
            Direct Physical Asset Ownership &middot; Bengaluru Central Depot
          </p>
          <p className="t-eyebrow text-xs uppercase tracking-[0.2em] text-accent font-medium">
            Zero Third-Party Brokerage
          </p>
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-5 max-w-5xl">
          <h1 data-hero-headline className="t-statement text-ink font-semibold tracking-tight text-balance">
            The Heavy Metal Fleet: <br />
            <span className="text-brand-blue">
              Engineered Infrastructure Ready for Immediate Mobilization.
            </span>
          </h1>
          <p data-hero-lead className="t-lead max-w-[58ch] text-body-light leading-relaxed">
            Every square foot of German clear-span aluminium, modular wooden flooring, VIP staging, and mobile HVAC listed below is physically owned and stationed in our yard. Deployed by our own permanent field crew.
          </p>
        </div>

        {/* 4 Quick Stat Hero Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div
            data-stat-card
            className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-brand-blue/30 hover:shadow-md hover:-translate-y-1"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink/50 block mb-1">
              German Hangars
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-ink group-hover:text-brand-blue transition-colors">
                5,00,000
              </span>
              <span className="font-mono text-xs text-brand-blue font-semibold">Sq. Ft.</span>
            </div>
            <p className="text-[11px] text-body-light mt-1">10m to 40m clear spans</p>
          </div>

          <div
            data-stat-card
            className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-brand-blue/30 hover:shadow-md hover:-translate-y-1"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink/50 block mb-1">
              Modular Flooring
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-ink group-hover:text-brand-blue transition-colors">
                10,00,000
              </span>
              <span className="font-mono text-xs text-brand-blue font-semibold">Sq. Ft.</span>
            </div>
            <p className="text-[11px] text-body-light mt-1">Laser-aligned heavy subfloor</p>
          </div>

          <div
            data-stat-card
            className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-brand-blue/30 hover:shadow-md hover:-translate-y-1"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink/50 block mb-1">
              Mobile HVAC
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-ink group-hover:text-brand-blue transition-colors">
                3,000
              </span>
              <span className="font-mono text-xs text-brand-blue font-semibold">Tons</span>
            </div>
            <p className="text-[11px] text-body-light mt-1">Industrial chillers &amp; ducting</p>
          </div>

          <div
            data-stat-card
            className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-brand-blue/30 hover:shadow-md hover:-translate-y-1"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink/50 block mb-1">
              Dedicated Logistics
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-ink group-hover:text-brand-blue transition-colors">
                20
              </span>
              <span className="font-mono text-xs text-brand-blue font-semibold">Vehicles</span>
            </div>
            <p className="text-[11px] text-body-light mt-1">Company-owned heavy fleet</p>
          </div>
        </div>
      </div>
    </section>
  );
}
