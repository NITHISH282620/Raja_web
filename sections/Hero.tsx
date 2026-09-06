"use client";

import Link from "next/link";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, fadeIn, growRule, riseCard, q } from "@/motion/primitives";
import { MOTION_OK } from "@/motion/ease";
import { HeroMedia } from "@/components/HeroMedia";
import { FOUNDED_YEAR, yearsInOperation } from "@/content/company";
import { SECTION_IDS } from "@/content/navigation";
import { CTA } from "@/content/site";
import type { HeroSettings } from "@/lib/store";

/**
 * Figma 0-898px.
 *
 * The only section whose entrance is time-based rather than scroll-bound - it
 * plays on mount, matching the 0.15s-1.40s opening of the authored timeline.
 */
export function HeroView({ hero }: { hero: HeroSettings }) {
  const root = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const support = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline();
        fadeIn(tl, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.05 }, 0.15);
        growRule(tl, q(scope, "[data-eyebrow] [data-reveal-rule]"), {}, 0.2);
        riseCard(tl, headline.current, { distance: 46, scaleFrom: 0.96, duration: 0.9 }, 0.35);
        fadeUp(tl, support.current, {}, 0.75);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={SECTION_IDS.hero}
      className="relative h-svh min-h-[560px] max-h-[1080px] w-full overflow-hidden bg-ink"
    >
      <HeroMedia />
      {/*
        Figma authored a flat 72% scrim over a bright festival photograph. The
        hero image is now Raja's own dawn aerial, which is already dark and
        low-contrast, and 72% flattened the tent field into near-black. Lowered
        to 58% with a slight bottom weighting so the headline keeps its contrast
        while the scale of the build still reads. Flat, not decorative - the
        design's intent preserved, the value adapted to the new source.
      */}
      <div aria-hidden className="absolute inset-0 bg-ink/[0.58]" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0) 70%)" }}
      />

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center sm:justify-end text-center px-5 sm:px-[clamp(20px,5vw,80px)] pb-12 sm:pb-[clamp(44px,9vh,100px)] pt-24 sm:pt-[120px]">
        <div data-eyebrow className="mb-4 sm:mb-[clamp(16px,2vw,24px)] flex items-center justify-center gap-3 sm:gap-[clamp(12px,1.5vw,20px)]">
          <span aria-hidden data-reveal-rule className="block h-[1px] w-6 sm:w-[clamp(20px,3vw,40px)] bg-accent/80" />
          <span data-reveal className="t-eyebrow text-[10px] sm:text-[11px] md:text-[13px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/90">
            ESTABLISHED {FOUNDED_YEAR}
            <span aria-hidden className="mx-2 md:mx-3 opacity-40">
              -
            </span>
            {yearsInOperation()} YEARS OF LEGACY
          </span>
          <span aria-hidden data-reveal-rule className="block h-[1px] w-6 sm:w-[clamp(20px,3vw,40px)] bg-accent/80" />
        </div>
        
        <h1 ref={headline} data-reveal className="t-hero text-white mb-4 sm:mb-[clamp(16px,2vw,24px)] leading-[1.15] sm:leading-tight text-[clamp(1.5rem,5.2vw,4.5rem)] max-w-[900px] text-balance">
          <span className="block sm:inline">Building the physical</span>{" "}
          <span className="block sm:inline">infrastructure</span>{" "}
          <span className="block sm:inline">behind large-scale events.</span>
        </h1>
        
        <p ref={support} data-reveal className="t-body max-w-[760px] text-white/90 text-xs sm:text-[clamp(15px,1.25vw,19px)] leading-relaxed font-light px-2">
          {hero.supporting}
        </p>

        <p data-reveal className="t-body-sm mt-2 max-w-[760px] px-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/55 sm:text-xs">
          {hero.body}
        </p>

        {/*
          The primary action on the site's first screen. It asks for a brief
          rather than "contact", because naming the thing Raja wants to receive
          is what turns an enquiry into a qualified one — and buyers who are not
          ready to do that have a second door next to it rather than no door.
        */}
        <div data-reveal className="mt-6 flex flex-col gap-3 px-2 sm:mt-[clamp(24px,2.6vw,40px)] sm:flex-row sm:items-center">
          <Link
            href={CTA.primary.href}
            data-analytics="cta-primary"
            data-analytics-location="hero"
            className="group inline-flex h-[54px] items-center justify-center gap-3 rounded-full bg-white px-8 text-ink transition-colors duration-300 hover:bg-accent hover:text-white"
          >
            <span className="t-body font-medium">{CTA.primary.label}</span>
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
          <Link
            href={CTA.secondary.href}
            data-analytics="cta-secondary"
            data-analytics-location="hero"
            className="inline-flex h-[54px] items-center justify-center gap-3 rounded-full border border-white/35 px-8 text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
          >
            <span className="t-body">{CTA.secondary.label}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}