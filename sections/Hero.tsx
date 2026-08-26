"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, fadeIn, growRule, riseCard, q } from "@/motion/primitives";
import { MOTION_OK } from "@/motion/ease";
import { HeroMedia } from "@/components/HeroMedia";
import { Eyebrow } from "@/components/Eyebrow";
import { company, FOUNDED_YEAR } from "@/content/company";
import { SECTION_IDS } from "@/content/navigation";

/**
 * Figma 0–898px.
 *
 * The only section whose entrance is time-based rather than scroll-bound — it
 * plays on mount, matching the 0.15s–1.40s opening of the authored timeline.
 */
export function Hero() {
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
      className="relative h-svh min-h-[560px] w-full overflow-hidden bg-ink"
    >
      <HeroMedia />
      {/*
        Figma authored a flat 72% scrim over a bright festival photograph. The
        hero image is now Raja's own dawn aerial, which is already dark and
        low-contrast, and 72% flattened the tent field into near-black. Lowered
        to 58% with a slight bottom weighting so the headline keeps its contrast
        while the scale of the build still reads. Flat, not decorative — the
        design's intent preserved, the value adapted to the new source.
      */}
      <div aria-hidden className="absolute inset-0 bg-ink/[0.58]" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 45%)" }}
      />

      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-6 px-[clamp(20px,2.08vw,30px)] pb-[clamp(40px,5.7vw,51px)] md:flex-row md:items-end md:justify-between md:gap-16">
        <div className="flex flex-col gap-[clamp(10px,1.4vw,18px)]">
          <div data-eyebrow>
            <Eyebrow items={["Our legacy", `Established in ${FOUNDED_YEAR}`]} tone="light" />
          </div>
          <h1 ref={headline} data-reveal className="t-hero max-w-[620px] text-white">
            Established in {FOUNDED_YEAR}
          </h1>
        </div>
        <p ref={support} data-reveal className="t-lead max-w-[380px] text-white md:text-right">
          {company.legacyStatement}
        </p>
      </div>
    </section>
  );
}
