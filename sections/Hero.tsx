"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, growRule, riseCard, q } from "@/motion/primitives";
import { STAGGER, MOTION_OK } from "@/motion/ease";
import { SiteHeader } from "@/components/SiteHeader";
import { company } from "@/content/company";
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
        fadeUp(tl, q(scope, "[data-hero-logo]"), { distance: 18 }, 0.15);
        growRule(tl, q(scope, "[data-reveal-rule]"), { stagger: STAGGER.navRules }, 0.3);
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
      <Image
        src="/media/hero-crowd.webp"
        alt="A crowd with hands raised in front of a covered main stage during an outdoor event."
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Flat 72% scrim, exactly as authored — not a gradient. */}
      <div aria-hidden className="absolute inset-0 bg-ink/[0.72]" />

      <SiteHeader />

      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-6 px-[clamp(20px,2.08vw,30px)] pb-[clamp(40px,5.7vw,51px)] md:flex-row md:items-end md:justify-between md:gap-16">
        <h1 ref={headline} data-reveal className="t-hero max-w-[498px] text-white">
          {company.tagline}
        </h1>
        <p ref={support} data-reveal className="t-lead max-w-[334px] text-white md:text-right">
          {company.description}
        </p>
      </div>
    </section>
  );
}
