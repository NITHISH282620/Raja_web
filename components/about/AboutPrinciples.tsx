"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/motion/primitives";
import { EASE, MOTION_OK } from "@/motion/ease";
import { principles } from "@/content/about";

export function AboutPrinciples() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          scope.querySelectorAll("[data-principle-item]"),
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
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
        {/* Section Header */}
        <div className="flex flex-col gap-3 mb-16 sm:mb-20 max-w-3xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink/60">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>Operational Doctrine</span>
          </div>
          <h2 className="t-statement text-ink text-balance font-semibold">
            How We Deliver. <br className="hidden sm:inline" />
            <span className="text-brand-blue">The Four Uncompromised Principles.</span>
          </h2>
          <p className="t-body text-body-light leading-relaxed max-w-[48ch]">
            When you build for heads of state, international delegations, and millions of citizens, operational discipline is the only margin that matters.
          </p>
        </div>

        {/* 4 Architectural Principle Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {principles.map((p) => (
            <div
              key={p.index}
              data-principle-item
              className="flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-ink/10 bg-white p-7 sm:p-9 shadow-xs transition-all duration-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-6">
                  <span className="font-mono text-xs font-bold text-accent">
                    PRIN. {p.index}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-ink/50">
                    Non-Negotiable
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-ink mb-2">
                  {p.title}
                </h3>
                <p className="text-sm font-medium text-brand-blue mb-4">
                  {p.lead}
                </p>
                <p className="text-xs sm:text-sm text-body-light leading-relaxed">
                  {p.body}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-ink/10 flex items-center justify-between text-xs font-mono text-ink/50">
                <span>Raja Enterprises Protocol</span>
                <span className="text-brand-blue font-medium">Verified Operational Metric</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
