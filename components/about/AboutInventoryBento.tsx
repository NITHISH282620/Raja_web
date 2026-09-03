"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/motion/primitives";
import { EASE, MOTION_OK } from "@/motion/ease";
import { inventoryHighlights } from "@/content/about";

export function AboutInventoryBento() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          scope.querySelectorAll("[data-bento-card]"),
          { opacity: 0, y: 36, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: EASE.primary,
            scrollTrigger: {
              trigger: scope,
              start: "top 78%",
              once: true,
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative w-full bg-paper py-20 sm:py-28 md:py-36 border-t border-ink/10">
      <div className="frame">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 sm:mb-18">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink/60">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>Verified Capacity Moat</span>
            </div>
            <h2 className="t-statement text-ink text-balance font-semibold">
              The Heavy Metal: <br className="hidden sm:inline" />
              <span className="text-brand-blue">Owned Infrastructure at National Scale.</span>
            </h2>
          </div>
          <p className="t-body text-body-light leading-relaxed max-w-[42ch]">
            Every metric below represents physical assets stationed in our owned yards and deployed by our own permanent brigade. Zero sub-rentals.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {inventoryHighlights.map((item, index) => (
            <div
              key={item.label}
              data-bento-card
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-brand-blue/30"
            >
              {/* Top Tag & Index */}
              <div className="flex items-center justify-between gap-2 border-b border-ink/10 pb-4 mb-6">
                <span className="font-mono text-[11px] uppercase tracking-wider text-brand-blue font-semibold px-2.5 py-0.5 rounded-full bg-brand-blue/5 group-hover:bg-brand-blue/10 transition-colors">
                  {item.tag}
                </span>
                <span className="font-mono text-xs text-ink/40 group-hover:text-brand-blue transition-colors">0{index + 1}</span>
              </div>

              {/* Stat Number & Unit */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-ink group-hover:text-brand-blue transition-colors duration-300">
                    {item.number}
                  </span>
                  <span className="font-mono text-sm sm:text-base font-medium text-brand-blue">
                    {item.unit}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-ink mt-1">
                  {item.label}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-body-light leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Bottom Archival Image Thumbnail Preview */}
              <div className="relative h-32 sm:h-36 w-full overflow-hidden rounded-xl border border-ink/10 bg-neutral-900">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/0 transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Logistics Banner */}
        <div className="mt-8 rounded-2xl border border-ink/10 bg-white/70 p-6 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-white font-mono text-sm font-bold">
              ✓
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Permanent Field Workforce of 460+ Personnel</p>
              <p className="text-xs text-body-light">300 Riggers · 100 Skilled Fabricators · 50 Field Supervisors · 10 Project Directors</p>
            </div>
          </div>
          <span className="font-mono text-xs text-ink/60 uppercase tracking-wider bg-neutral-100 px-3.5 py-1.5 rounded-full">
            100% Payroll Employees · Zero Subcontracting
          </span>
        </div>
      </div>
    </section>
  );
}
