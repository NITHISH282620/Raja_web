"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, fadeIn, growRule, land, entranceTrigger, q } from "@/motion/primitives";
import { DUR, EASE, STAGGER, MOTION_OK, MOTION_DESKTOP, MOTION_COMPACT } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";
import { arcs, legacyIntro, LEGACY_BOX } from "@/content/legacy";
import { yearsInOperation } from "@/content/company";
import { SECTION_IDS } from "@/content/navigation";

const pct = (n: number) => `${n}%`;

/**
 * Legacy Section (Since 1977)
 *
 * Responsive across all viewports:
 * - Desktop (>= 1024px): Authored absolute scatter composition with 4 coral arcs and 6 floating event cards.
 *   Pinned curtain effect on scroll with 3D card tilt & parallax dispersion.
 * - Mobile & Tablet (< 1024px): Prominent centered statement followed by wide, landscape event photo cards
 *   (aspect 16:10) ensuring images are clear, wide, and perfectly proportioned.
 */
export function LegacyView({ collage }: { collage: any[] }) {
  const root = useRef<HTMLElement>(null);
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();

      // ==========================================
      // Desktop: Pinned Curtain & 3D Card Reactivity
      // ==========================================
      mm.add(MOTION_DESKTOP, () => {
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

        land(entranceTl, q(scope, "[data-collage]"), {
          stagger: STAGGER.collage,
          staggerEase: "power1.inOut",
          rotate: (i: number) => (i % 2 === 0 ? -3.5 : 3.5),
        }, 1.2);

        const cards = q(scope, "[data-collage]");
        const statementWrap = q(scope, "[data-statement-wrap]");

        // GSAP Pinning on Desktop: pinned at top:0 while next section slides over it
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

      // ==========================================
      // Mobile & Tablet: Clean Entrance without Pinned Overlap
      // ==========================================
      mm.add(MOTION_COMPACT, () => {
        const compactTl = gsap.timeline({ scrollTrigger: entranceTrigger(scope) });
        growRule(compactTl, q(scope, "[data-reveal-rule]"), {}, 0.3);
        fadeIn(compactTl, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.04 }, 0.4);
        fadeUp(compactTl, q(scope, "[data-statement]"), { duration: DUR.statement }, 0.6);
        fadeUp(compactTl, q(scope, "[data-mobile-card]"), { stagger: 0.08, distance: 30 }, 0.8);
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
      className="relative z-10 w-full overflow-hidden bg-paper"
    >
      {/* ------------------------------------------------------------------
          1. DESKTOP VIEW (>= 1024px): Authored absolute scatter composition
         ------------------------------------------------------------------ */}
      <div className="hidden lg:flex h-screen min-h-[680px] max-h-[1050px] w-full items-center justify-center px-6 xl:px-8">
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

          {/* 6 Floating Event Photo Cards */}
          {collage.map((photo) => (
            <div
              key={photo.id}
              data-collage
              data-reveal
              className="group absolute overflow-hidden rounded-[10px] xl:rounded-[14px] bg-ink/5 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1),0_16px_36px_-8px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.05] transition-all duration-500 hover:scale-[1.04] hover:z-30 hover:shadow-[0_20px_48px_-10px_rgba(0,0,0,0.18)]"
              style={{ left: pct(photo.left), top: pct(photo.top), width: pct(photo.width), height: pct(photo.height) }}
            >
              <Image
                src={photo.image.src}
                alt={photo.image.alt}
                fill
                sizes="25vw"
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
              <Eyebrow items={eyebrow} align="center" />
            </div>
            <div data-statement data-reveal className="pointer-events-auto">
              <Statement segments={legacyIntro.statement} className="t-intro" />
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          2. MOBILE & TABLET VIEW (< 1024px): Centered statement + Wide Landscape Cards
         ------------------------------------------------------------------ */}
      <div className="lg:hidden py-[clamp(56px,10vw,96px)] px-5 sm:px-8">
        {/* Centered Statement Header */}
        <div className="max-w-[720px] mx-auto text-center mb-[clamp(32px,6vw,52px)]">
          <div data-eyebrow className="mb-4 flex justify-center">
            <Eyebrow items={eyebrow} align="center" />
          </div>
          <div data-statement data-reveal>
            <Statement
              segments={legacyIntro.statement}
              className="text-[clamp(1.75rem,5.5vw,2.5rem)] font-normal leading-[1.18] tracking-[-0.02em]"
            />
          </div>
        </div>

        {/* Wide Landscape Cards Showcase (Aspect 16:10) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-[1000px] mx-auto">
          {collage.map((photo) => (
            <div
              key={photo.id}
              data-mobile-card
              data-reveal
              className="group relative aspect-[16/10] w-full overflow-hidden rounded-[14px] bg-ink/5 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.06] transition-all duration-300 hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.14)] hover:scale-[1.02]"
            >
              <Image
                src={photo.image.src}
                alt={photo.image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}