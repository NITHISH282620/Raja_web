"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  fadeUp,
  fadeIn,
  growRule,
  riseCard,
  settle,
  revealLines,
  release,
  entranceTrigger,
  q,
} from "@/motion/primitives";
import { STAGGER, MOTION_OK, MOTION_DESKTOP } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";
import { WorkCard } from "@/components/WorkCard";
import { worksIntro, type Project } from "@/content/works";
import { ROUTES, SECTION_IDS } from "@/content/navigation";

/**
 * Notable Works Section - Stacked case study cards:
 * 
 * - Centered header with "notable works" eyebrow & "You don't see us. You see what we build."
 * - Prominent "Explore All Notable Events" button linking to /portfolio.
 * - 4 fully populated real-world case study cards stacking on scroll.
 */
export function WorksView({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const intro = gsap.timeline({
          scrollTrigger: entranceTrigger(scope),
          onComplete: () => release(q(scope, "[data-eyebrow] [data-reveal], [data-works-cta]")),
        });
        fadeIn(intro, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.04 }, 0);
        growRule(intro, q(scope, "[data-eyebrow] [data-reveal-rule]"), {}, 0);
        riseCard(intro, q(scope, "[data-works-cta]"), { distance: 20, scaleFrom: 0.85 }, 0.35);

        // Each card gets its own trigger so the stack reveals as it is reached
        q(scope, "[data-work]").forEach((card) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
            onComplete: () => release([card, ...q(card, "[data-work-meta]")]),
          });
          riseCard(tl, card, { distance: 56, scaleFrom: 0.96 }, 0);
          settle(tl, q(card, "[data-work-image]"), { scaleFrom: 1.1 }, 0);
          fadeUp(tl, q(card, "[data-work-meta]"), { stagger: STAGGER.works * 0.5, distance: 22 }, 0.25);
        });

        const revert = revealLines(q(scope, "[data-statement] h2"), {
          stagger: 0.09,
          trigger: { trigger: scope, start: "top 78%", once: true },
        });
        return () => revert();
      });

      // Desktop sticky depth stack
      mm.add(MOTION_DESKTOP, () => {
        const cards = q(scope, "[data-work]");
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return;
          gsap.to(card.firstElementChild, {
            scale: 0.94,
            filter: "brightness(0.9)",
            ease: "none",
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top bottom",
              end: "top 30%",
              scrub: 0.5,
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={SECTION_IDS.works} className="relative w-full bg-paper pb-[clamp(80px,10vw,160px)]">
      {/* Centered Statement and Header */}
      <div className="frame flex flex-col items-center text-center gap-5 pb-[clamp(44px,6vw,80px)] pt-[clamp(72px,10vw,140px)]">
        <div data-eyebrow className="flex justify-center">
          <Eyebrow items={worksIntro.eyebrow} align="center" />
        </div>
        <div data-statement>
          <Statement
            segments={worksIntro.statement}
            className="t-statement max-w-[28ch] text-center mx-auto"
          />
        </div>
        <div data-works-cta data-reveal className="mt-2 flex justify-center">
          <Link
            href={ROUTES.portfolio}
            className="group inline-flex items-center gap-3 rounded-full bg-brand-blue px-7 py-3.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-brand-blue/90 hover:shadow-xl hover:scale-105"
          >
            <span>Explore All Notable Events</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path d="M7 17l9.2-9.2M17 17V7.8H7.8" />
            </svg>
          </Link>
        </div>
      </div>

      {/* 4 Stacked Real Case Study Cards */}
      <ul className="frame flex flex-col gap-[clamp(24px,3vw,40px)]">
        {projects.map((work, i) => (
          <li
            key={work.id}
            data-work
            data-reveal
            className="lg:sticky lg:h-[600px]"
            style={{
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