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
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: scope,
              start: "top 82%",
              once: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="w-full">
      <div className="frame">
        <div
          data-cta-card
          className="relative overflow-hidden rounded-[20px] sm:rounded-[26px] md:rounded-[30px] bg-gradient-to-b from-[#1862FF] via-[#0E54EC] to-[#083CA8] px-6 py-6 sm:px-9 sm:py-7 md:px-12 md:py-8 shadow-[0_20px_50px_-10px_rgba(13,84,236,0.36),0_8px_20px_-6px_rgba(0,0,0,0.12)] border border-white/25"
        >
          {/* Subtle top light bloom */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.3),transparent_70%)]"
          />

          {/* Concentric spherical ripple rings (scaled down for sleek banner) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
          >
            <div className="absolute h-[180px] w-[180px] rounded-full border border-white/[0.12]" />
            <div className="absolute h-[320px] w-[320px] rounded-full border border-white/[0.08]" />
            <div className="absolute h-[480px] w-[480px] rounded-full border border-white/[0.06]" />
            <div className="absolute h-[680px] w-[680px] rounded-full border border-white/[0.04]" />
            <div className="absolute h-[900px] w-[900px] rounded-full border border-white/[0.02]" />
          </div>

          {/* Bottom subtle ambient cyan glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(circle_at_50%_100%,rgba(56,189,248,0.18),transparent_70%)]"
          />

          {/* Main Card Content */}
          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-3 sm:gap-3.5 md:gap-4 text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-0.5 backdrop-blur-md shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] sm:text-[10px] font-mono font-medium uppercase tracking-widest text-white/95">
                Monumental Event Infrastructure
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-balance font-display text-[clamp(1.4rem,2.3vw,2.15rem)] font-bold leading-[1.08] tracking-tight text-white uppercase">
              Ready to build at<br className="hidden sm:inline" /> monumental scale?
            </h2>

            {/* Subheading */}
            <p className="max-w-[46ch] text-balance text-xs sm:text-[13px] md:text-sm leading-normal text-white/90">
              From 100,000+ attendee national summits to high-precision industrial expos, our 49-year in-house crew and direct-owned inventory deliver turnkey execution across India.
            </p>

            {/* Primary Action Button */}
            <div className="pt-0.5">
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 font-display text-[11px] sm:text-xs font-semibold tracking-wider text-white uppercase shadow-lg transition-all duration-300 hover:scale-105 hover:bg-black hover:shadow-[0_0_24px_rgba(0,0,0,0.4)] active:scale-95"
              >
                <span>Discuss Your Event</span>
                <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </Link>
            </div>

            {/* Reassurance Trust Points */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-0.5 text-[10px] sm:text-[11px] font-mono text-white/80">
              <span className="inline-flex items-center gap-1">
                <svg className="h-2.5 w-2.5 text-emerald-300 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                </svg>
                Direct Owned Inventory
              </span>
              <span className="inline-flex items-center gap-1">
                <svg className="h-2.5 w-2.5 text-emerald-300 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                </svg>
                Zero Sub-Rentals
              </span>
              <span className="inline-flex items-center gap-1">
                <svg className="h-2.5 w-2.5 text-emerald-300 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                </svg>
                49+ Years Proven Execution
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
