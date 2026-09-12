"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, q } from "@/motion/primitives";
import { MOTION_OK } from "@/motion/ease";

export function CallToAction() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          q(scope, "[data-cta-card]"),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: scope,
              start: "top 85%",
              once: true,
            },
          }
        );
        
        gsap.fromTo(
          q(scope, "[data-cta-spec]"),
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: scope,
              start: "top 75%",
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
    <div ref={root} className="w-full">
      <div className="frame">
        <div
          data-cta-card
          className="relative overflow-hidden rounded-[2rem] text-white flex flex-col md:flex-row shadow-2xl border border-white/10"
          style={{background: "linear-gradient(135deg, #12305a 0%, #163660 50%, #1d4a82 100%)"}}
        >
          {/* Left: Huge Typography */}
          <div className="flex-1 p-6 sm:p-10 md:p-12 flex flex-col justify-between relative z-10">
            <div>
              <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-sky-300 font-semibold mb-3 sm:mb-4">
                Monumental Event Infrastructure
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.05] mb-4 sm:mb-5 text-balance">
                Ready to build at <br className="hidden md:block" />
                <i className="font-serif text-sky-300 pr-2">monumental scale?</i>
              </h2>
              <p className="text-white/70 text-sm sm:text-base max-w-lg leading-relaxed text-balance">
                From 100,000+ attendee national summits to high-precision industrial expos, our 49-year in-house crew and direct-owned inventory deliver turnkey execution across India.
              </p>
            </div>

            <div className="mt-8 sm:mt-10">
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-between w-full sm:w-auto sm:min-w-[280px] bg-white text-ink rounded-full px-6 py-3.5 sm:py-4 font-semibold tracking-wide hover:bg-sky-400 hover:text-white transition-colors duration-500 shadow-xl shadow-black/10"
              >
                <span className="uppercase font-mono text-[11px] sm:text-xs tracking-widest">Discuss Your Event</span>
                <span className="text-lg transition-transform duration-500 group-hover:translate-x-2">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Right: The Grid / Features */}
          <div className="w-full md:w-[40%] lg:w-[45%] relative bg-black/15 border-t md:border-t-0 md:border-l border-white/10 p-6 sm:p-10 md:p-12 flex flex-col justify-center">
            {/* Blueprint grid background */}
            <div
              className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)]"
              style={{ backgroundSize: "32px 32px" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />

            <div className="relative z-10 flex flex-col gap-6 sm:gap-8">
              {/* Trust points styled as engineering specs */}
              <div data-cta-spec className="border-t border-white/20 pt-3 group">
                <span className="font-mono text-[9px] text-sky-300 uppercase tracking-[0.2em] block mb-1 transition-colors duration-300 group-hover:text-accent">
                  Asset Status
                </span>
                <span className="text-xl font-medium text-white/90">
                  100% Direct Owned
                </span>
              </div>
              
              <div data-cta-spec className="border-t border-white/20 pt-3 group">
                <span className="font-mono text-[9px] text-sky-300 uppercase tracking-[0.2em] block mb-1 transition-colors duration-300 group-hover:text-accent">
                  Execution Model
                </span>
                <span className="text-xl font-medium text-white/90">
                  Zero Sub-Rentals
                </span>
              </div>
              
              <div data-cta-spec className="border-t border-white/20 pt-3 group">
                <span className="font-mono text-[9px] text-sky-300 uppercase tracking-[0.2em] block mb-1 transition-colors duration-300 group-hover:text-accent">
                  Track Record
                </span>
                <span className="text-xl font-medium text-white/90">
                  49+ Years Proven
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
