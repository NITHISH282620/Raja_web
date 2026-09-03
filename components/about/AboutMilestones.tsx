"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/motion/primitives";
import { EASE, MOTION_OK } from "@/motion/ease";
import { milestoneMoments } from "@/content/about";

export function AboutMilestones() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          scope.querySelectorAll("[data-milestone-card]"),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
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
        {/* Section Header */}
        <div className="flex flex-col gap-3 mb-16 sm:mb-20 max-w-3xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink/60">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>Proven National Mandates</span>
          </div>
          <h2 className="t-statement text-ink text-balance font-semibold">
            Hall of Monumental Moments. <br className="hidden sm:inline" />
            <span className="text-brand-blue">Where History Stood On Our Ground.</span>
          </h2>
          <p className="t-body text-body-light leading-relaxed max-w-[50ch]">
            When the nation watches and security protocols are paramount, government ministries, international boards, and cultural trusts rely on Raja Enterprises to build the environment.
          </p>
        </div>

        {/* Milestones Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {milestoneMoments.map((item) => (
            <div
              key={item.id}
              data-milestone-card
              className="group flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-ink/10 bg-white shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-brand-blue/30"
            >
              {/* Card Image Banner */}
              <div className="relative h-[260px] sm:h-[300px] w-full overflow-hidden bg-neutral-900">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="font-mono text-xs font-semibold px-3 py-1 rounded-full bg-white/95 text-brand-blue shadow-sm backdrop-blur-md group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                    {item.year}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="font-mono text-[11px] text-white/75 block uppercase tracking-wider">
                    {item.venue}
                  </span>
                  <span className="text-xs font-mono font-medium text-white/90">
                    Scale: {item.scale}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-col justify-between flex-grow p-6 sm:p-8">
                <div className="space-y-3 mb-6">
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-ink group-hover:text-brand-blue transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-body-light leading-relaxed">
                    {item.scope}
                  </p>
                </div>

                <div className="pt-4 border-t border-ink/10 flex items-center justify-between text-xs font-mono text-ink/60">
                  <span>Turnkey Physical Execution</span>
                  <span className="inline-flex items-center gap-1.5 text-brand-blue font-semibold">
                    <span>Verified Case Study</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
