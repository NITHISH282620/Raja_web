"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, fadeIn, growRule, land, entranceTrigger, q } from "@/motion/primitives";
import { DUR, EASE, STAGGER, MOTION_OK } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";
import { arcs, legacyIntro } from "@/content/legacy";
import { yearsInOperation } from "@/content/company";
import { SECTION_IDS } from "@/content/navigation";

const pct = (n: number) => `${n}%`;

/** Responsive mobile coordinates providing wide landscape cards */
const mobilePositions = [
  { left: 4, top: 7, width: 36, height: 13.5 },
  { left: 60, top: 9, width: 36, height: 13.5 },
  { left: 2, top: 38, width: 29, height: 12.5 },
  { left: 69, top: 41, width: 29, height: 12.5 },
  { left: 10, top: 76, width: 36, height: 13.5 },
  { left: 54, top: 78, width: 36, height: 13.5 },
];

/**
 * Legacy Section (Since 1977)
 *
 * Preserves the exact signature 4-arc & 6-card scatter composition on all screen sizes.
 * On mobile/tablet, cards have wide landscape proportions (16:10 / 4:3) so images are never squeezed.
 */
export function LegacyView({ collage }: { collage: any[] }) {
  const root = useRef<HTMLElement>(null);
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Entrance reveal timeline
        const entranceTl = gsap.timeline({ scrollTrigger: entranceTrigger(scope) });

        const arcNodes = q(scope, "[data-arc]");
        if (arcNodes.length) {
          entranceTl.fromTo(
            arcNodes,
            { opacity: 0, scale: 0.55 },
            { opacity: 1, scale: 1, duration: 1.7, stagger: STAGGER.arcs, ease: EASE.spring },
            0,
          );
        }

        growRule(entranceTl, q(scope, "[data-reveal-rule]"), {}, 0.7);
        fadeIn(entranceTl, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.04 }, 0.7);
        fadeUp(entranceTl, q(scope, "[data-statement]"), { duration: DUR.statement }, 0.95);

        // Photographs landing
        land(entranceTl, q(scope, "[data-collage]"), {
          stagger: STAGGER.collage,
          staggerEase: "power1.inOut",
          rotate: (i: number) => (i % 2 === 0 ? -3.5 : 3.5),
        }, 1.2);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const eyebrow = [`${yearsInOperation()} years`, legacyIntro.eyebrow[1]] as const;

  return (
    <section
      ref={root}
      id={SECTION_IDS.legacy}
      className="relative z-10 w-full h-screen min-h-[660px] max-h-[1050px] overflow-hidden bg-paper flex items-center justify-center px-3 sm:px-6 lg:px-8"
    >
      <div
        ref={container}
        className="relative w-full max-w-[1480px] h-[92vh] max-h-[880px] aspect-[1440/884] mx-auto flex items-center justify-center"
      >
        {/* 4 Background Arcs */}
        {arcs.map((arc) => (
          <div
            key={arc.src}
            data-arc
            aria-hidden
            className="absolute pointer-events-none opacity-80"
            style={{ left: pct(arc.left), top: pct(arc.top), width: pct(arc.width), height: pct(arc.height) }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={arc.src} alt="" className="h-full w-full" />
          </div>
        ))}

        {/* 6 Harmonious Floating Event Photo Cards (Desktop vs Mobile Coordinate sets for wide aspect) */}
        {collage.map((photo, i) => {
          const mob = mobilePositions[i] || photo;
          return (
            <div
              key={photo.id}
              data-collage
              data-reveal
              className="group absolute overflow-hidden rounded-[8px] sm:rounded-[10px] md:rounded-[14px] bg-ink/5 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1),0_16px_36px_-8px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.05] transition-all duration-500 hover:scale-[1.05] hover:z-30 hover:shadow-[0_20px_48px_-10px_rgba(0,0,0,0.18)]"
              style={{
                // Responsive positioning via CSS variables for desktop vs mobile
                left: `var(--card-left, ${pct(photo.left)})`,
                top: `var(--card-top, ${pct(photo.top)})`,
                width: `var(--card-width, ${pct(photo.width)})`,
                height: `var(--card-height, ${pct(photo.height)})`,
                // @ts-ignore
                "--card-left": pct(photo.left),
                "--card-top": pct(photo.top),
                "--card-width": pct(photo.width),
                "--card-height": pct(photo.height),
              }}
            >
              <style jsx>{`
                @media (max-width: 1023px) {
                  div {
                    --card-left: ${pct(mob.left)} !important;
                    --card-top: ${pct(mob.top)} !important;
                    --card-width: ${pct(mob.width)} !important;
                    --card-height: ${pct(mob.height)} !important;
                  }
                }
              `}</style>
              <Image
                src={photo.image.src}
                alt={photo.image.alt}
                fill
                sizes="(max-width: 768px) 38vw, (max-width: 1440px) 25vw, 340px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          );
        })}

        {/* Central Eyebrow & Clean Statement Design */}
        <div
          data-statement-wrap
          className="absolute left-1/2 top-[27%] sm:top-[28.5%] w-[66%] sm:w-[60%] -translate-x-1/2 text-center z-20 pointer-events-none"
        >
          <div data-eyebrow className="pointer-events-auto mb-[2%] flex justify-center">
            <Eyebrow items={eyebrow} align="center" />
          </div>
          <div data-statement data-reveal className="pointer-events-auto">
            <Statement segments={legacyIntro.statement} className="t-intro" />
          </div>
        </div>
      </div>
    </section>
  );
}