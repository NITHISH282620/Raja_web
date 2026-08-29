"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, fadeIn, growRule, land, entranceTrigger, q } from "@/motion/primitives";
import { DUR, EASE, STAGGER, MOTION_OK } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";
import { arcs, legacyIntro, LEGACY_BOX } from "@/content/legacy";
import { yearsInOperation } from "@/content/company";
import { SECTION_IDS } from "@/content/navigation";

const pct = (n: number) => `${n}%`;

/**
 * Legacy Section (Since 1977)
 *
 * Pinned curtain composition:
 * - On entrance, the arcs sweep in and photo cards land into place.
 * - As the user scrolls, Legacy stays PINNED (pin: true, pinSpacing: false)
 *   while the incoming section ("What We Build", on z-30) slides upward directly over it.
 * - During this upward curtain slide, the 6 cards disperse outward with 3D rotation and parallax.
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
        // 1. Entrance reveal timeline
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

        // Photographs initial landing
        land(entranceTl, q(scope, "[data-collage]"), {
          stagger: STAGGER.collage,
          staggerEase: "power1.inOut",
          rotate: (i: number) => (i % 2 === 0 ? -3.5 : 3.5),
        }, 1.2);

        // 2. Scroll-scrubbed Pinning & 3D Card Reactivity
        const cards = q(scope, "[data-collage]");
        const statementWrap = q(scope, "[data-statement-wrap]");

        // Bulletproof GSAP Pinning: Scope remains pinned at top:0 while next section slides over it
        const pinTl = gsap.timeline({
          scrollTrigger: {
            trigger: scope,
            start: "top top",
            end: "+=100%",
            pin: true,
            pinSpacing: false,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Dynamic outward card tilt & parallax dispersion while section is covered
        if (cards.length >= 6) {
          pinTl
            .to(cards[0], { xPercent: -18, yPercent: -15, rotate: -8, scale: 0.94, ease: "none" }, 0)
            .to(cards[1], { xPercent: 18, yPercent: -15, rotate: 8, scale: 0.94, ease: "none" }, 0)
            .to(cards[2], { xPercent: -22, yPercent: 4, rotate: -7, scale: 0.94, ease: "none" }, 0)
            .to(cards[3], { xPercent: 22, yPercent: 4, rotate: 7, scale: 0.94, ease: "none" }, 0)
            .to(cards[4], { xPercent: -15, yPercent: 20, rotate: -6, scale: 0.92, ease: "none" }, 0)
            .to(cards[5], { xPercent: 15, yPercent: 20, rotate: 6, scale: 0.92, ease: "none" }, 0);
        }

        if (arcNodes.length) {
          pinTl.to(arcNodes, { scale: 1.18, opacity: 0.3, ease: "none" }, 0);
        }

        if (statementWrap.length) {
          pinTl.to(statementWrap, { yPercent: -10, opacity: 0.5, scale: 0.98, ease: "none" }, 0);
        }
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
      className="relative z-10 w-full h-screen min-h-[680px] max-h-[1050px] overflow-hidden bg-paper flex items-center justify-center px-4 sm:px-6 lg:px-8"
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

        {/* 6 Harmonious Floating Event Photo Cards */}
        {collage.map((photo) => (
          <div
            key={photo.id}
            data-collage
            data-reveal
            className="group absolute overflow-hidden rounded-[8px] sm:rounded-[10px] md:rounded-[14px] bg-ink/5 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1),0_16px_36px_-8px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.05] transition-all duration-500 hover:scale-[1.04] hover:z-30 hover:shadow-[0_20px_48px_-10px_rgba(0,0,0,0.18)]"
            style={{ left: pct(photo.left), top: pct(photo.top), width: pct(photo.width), height: pct(photo.height) }}
          >
            <Image
              src={photo.image.src}
              alt={photo.image.alt}
              fill
              sizes="(max-width: 768px) 30vw, (max-width: 1440px) 25vw, 340px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        ))}

        {/* Central Eyebrow & Clean Statement Design */}
        <div
          data-statement-wrap
          className="absolute left-1/2 top-[28.5%] w-[60%] -translate-x-1/2 text-center z-20 pointer-events-none"
        >
          <div data-eyebrow className="pointer-events-auto mb-[2%] flex justify-center">
            <Eyebrow
              items={eyebrow}
              align="center"
            />
          </div>
          <div data-statement data-reveal className="pointer-events-auto">
            <Statement
              segments={legacyIntro.statement}
              className="t-intro"
            />
          </div>
        </div>
      </div>
    </section>
  );
}