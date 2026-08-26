"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, fadeIn, growRule, riseCard, settle, entranceTrigger, q } from "@/motion/primitives";
import { DUR, STAGGER, MOTION_OK } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";
import { CircleButton } from "@/components/Buttons";
import { WorkCard } from "@/components/WorkCard";
import { works, worksIntro } from "@/content/works";
import { SECTION_IDS } from "@/content/navigation";

/**
 * Figma 3693–4756px. "Notable works" — four 1250 x 600 cards that stack.
 *
 * In the export all four cards sit within 300px of each other at nearly the
 * same y, which is how a stack reads when it is flattened to a static frame.
 *
 * Implemented with CSS sticky rather than a pinned GSAP timeline: sticky
 * stacking is compositor-driven, survives resize without a refresh, and cannot
 * desync from the triggers below it. GSAP still owns each card's entrance.
 * Below 1024 sticky is off and the cards simply follow one another.
 */
export function Works() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {

        const intro = gsap.timeline({ scrollTrigger: entranceTrigger(scope) });
        fadeIn(intro, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.04 }, 0);
        growRule(intro, q(scope, "[data-eyebrow] [data-reveal-rule]"), {}, 0);
        fadeUp(intro, q(scope, "[data-statement]"), { duration: DUR.statement }, 0.2);
        riseCard(intro, q(scope, "[data-works-cta]"), { distance: 20, scaleFrom: 0.8 }, 0.35);

        // Each card gets its own trigger so the stack reveals as it is reached,
        // preserving the 0.14s inter-card offset from the export.
        q(scope, "[data-work]").forEach((card) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          });
          riseCard(tl, card, { distance: 56, scaleFrom: 0.96 }, 0);
          settle(tl, q(card, "[data-work-image]"), { scaleFrom: 1.1 }, 0);
          fadeUp(tl, q(card, "[data-work-meta]"), { stagger: STAGGER.works * 0.5, distance: 22 }, 0.25);
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={SECTION_IDS.works} className="relative w-full bg-paper pb-[clamp(80px,10vw,160px)]">
      <div className="frame flex items-start justify-between gap-8 pb-[clamp(40px,5vw,72px)] pt-[clamp(72px,10vw,140px)]">
        <div className="flex flex-col gap-[14px]">
          <div data-eyebrow>
            <Eyebrow items={worksIntro.eyebrow} />
          </div>
          <div data-statement data-reveal>
            <Statement segments={worksIntro.statement} className="t-statement max-w-[526px]" />
          </div>
        </div>
        <div data-works-cta data-reveal className="hidden shrink-0 pt-2 sm:block">
          <CircleButton href={null} label="View all works" />
        </div>
      </div>

      <ul className="frame flex flex-col gap-[clamp(24px,3vw,40px)]">
        {works.map((work, i) => (
          <li
            key={work.id}
            data-work
            data-reveal
            className="lg:sticky lg:h-[600px]"
            style={{
              // Each card parks slightly lower than the one before, so the
              // stack shows its edges rather than hiding them.
              top: `calc(clamp(72px, 14vh, 150px) + ${i * 16}px)`,
            }}
          >
            <WorkCard work={work} />
          </li>
        ))}
      </ul>
    </section>
  );
}
