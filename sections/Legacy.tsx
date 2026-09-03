"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, fadeIn, growRule, land, q } from "@/motion/primitives";
import { EASE, MOTION_DESKTOP, MOTION_COMPACT } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";
import { arcs, legacyIntro, type CollagePhoto } from "@/content/legacy";
import { yearsInOperation } from "@/content/company";
import { SECTION_IDS } from "@/content/navigation";
import { clsx } from "@/lib/clsx";

const pct = (n: number) => `${n}%`;

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
 * Sticky pinned: stays in place while subsequent sections scroll over it.
 * Fast entrance animations for immediate visual impact.
 * Desktop parallax drift on cards while section is in view.
 */
export function LegacyView({ collage }: { collage: CollagePhoto[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();

      /* Desktop: fast entrance + parallax drift */
      mm.add(MOTION_DESKTOP, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: scope, start: "top 85%", once: true },
        });

        // Arcs fade in quickly
        const arcNodes = q(scope, "[data-arc]");
        if (arcNodes.length) {
          tl.fromTo(
            arcNodes,
            { opacity: 0, scale: 0.7 },
            { opacity: 1, scale: 1, duration: 0.8, stagger: 0.06, ease: EASE.spring },
            0,
          );
        }

        // Text appears fast
        growRule(tl, q(scope, "[data-reveal-rule]"), { duration: 0.5 }, 0.2);
        fadeIn(tl, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.03, duration: 0.4 }, 0.2);
        fadeUp(tl, q(scope, "[data-statement]"), { duration: 0.6, distance: 16 }, 0.3);

        // Cards land FAST - staggered but quick
        land(tl, q(scope, "[data-collage]"), {
          stagger: 0.08,
          duration: 0.6,
          distance: 30,
          scaleFrom: 0.92,
          staggerEase: "power1.inOut",
          rotate: (i: number) => (i % 2 === 0 ? -3 : 3),
        }, 0.35);

        // Subtle parallax drift while pinned
        const cards = q(scope, "[data-collage]");
        cards.forEach((card, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          const amount = 4 + (i % 3) * 2.5;
          gsap.to(card, {
            yPercent: dir * amount,
            ease: "none",
            scrollTrigger: {
              trigger: scope,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          });
        });
      });

      /* Mobile/Tablet: fast entrance only, no sticky */
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: scope, start: "top 85%", once: true },
        });

        const arcNodes = q(scope, "[data-arc]");
        if (arcNodes.length) {
          tl.fromTo(
            arcNodes,
            { opacity: 0, scale: 0.7 },
            { opacity: 1, scale: 1, duration: 0.8, stagger: 0.06, ease: EASE.spring },
            0,
          );
        }

        growRule(tl, q(scope, "[data-reveal-rule]"), { duration: 0.5 }, 0.2);
        fadeIn(tl, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.03, duration: 0.4 }, 0.2);
        fadeUp(tl, q(scope, "[data-statement]"), { duration: 0.6, distance: 16 }, 0.3);

        land(tl, q(scope, "[data-collage]"), {
          stagger: 0.08,
          duration: 0.6,
          distance: 30,
          scaleFrom: 0.92,
          staggerEase: "power1.inOut",
          rotate: (i: number) => (i % 2 === 0 ? -3 : 3),
        }, 0.35);
      });

      /* Mobile: Stagger entrance + scroll-scrub parallax drift */
      mm.add(MOTION_COMPACT, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: scope, start: "top 80%", once: true },
        });
        fadeIn(tl, q(scope, "[data-mobile-legacy-wrap] [data-reveal]"), { stagger: 0.05 }, 0);

        const cards = q(scope, "[data-mobile-legacy-card]");
        if (cards.length >= 4) {
          gsap.to(cards[0], { yPercent: -15, xPercent: -10, ease: "none", scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: 0.5 } });
          gsap.to(cards[1], { yPercent: -15, xPercent: 10, ease: "none", scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: 0.5 } });
          gsap.to(cards[2], { yPercent: 15, xPercent: -10, ease: "none", scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: 0.5 } });
          gsap.to(cards[3], { yPercent: 15, xPercent: 10, ease: "none", scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: 0.5 } });
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
      className="sticky top-0 z-10 w-full h-svh min-h-[580px] max-h-[950px] overflow-hidden bg-paper flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      {/* Desktop Artboard: Pinned Canvas with Arcs & Drifting Cards */}
      <div className="hidden lg:flex relative w-full max-w-[1480px] h-[92vh] max-h-[880px] aspect-[1440/884] mx-auto items-center justify-center">
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

        {/* 6 Event Photo Cards */}
        {collage.map((photo: CollagePhoto, i: number) => {
          const mob = mobilePositions[i] || photo;
          return (
            <div
              key={photo.id}
              data-collage
              data-reveal
              className="group absolute overflow-hidden rounded-[8px] sm:rounded-[10px] md:rounded-[14px] bg-ink/5 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1),0_16px_36px_-8px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.05] transition-all duration-500 hover:scale-[1.05] hover:z-30 hover:shadow-[0_20px_48px_-10px_rgba(0,0,0,0.18)]"
              style={{
                left: `var(--card-left, ${pct(photo.left)})`,
                top: `var(--card-top, ${pct(photo.top)})`,
                width: `var(--card-width, ${pct(photo.width)})`,
                height: `var(--card-height, ${pct(photo.height)})`,
                // @ts-expect-error - ignore this error - ignore this error
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
                priority={i < 4}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          );
        })}

        {/* Central Text */}
        <div
          data-statement-wrap
          className="absolute left-1/2 top-[22%] sm:top-[24%] w-[66%] sm:w-[60%] -translate-x-1/2 text-center z-20 pointer-events-none"
        >
          <div data-eyebrow className="pointer-events-auto mb-[2%] flex justify-center">
            <Eyebrow items={eyebrow} align="center" />
          </div>
          <div data-statement data-reveal className="pointer-events-auto">
            <Statement segments={legacyIntro.statement} className="t-intro" />
          </div>
          <div data-reveal className="pointer-events-auto mt-[3%]">
            <Link
              href="/about"
              className="group inline-flex items-center gap-2.5 rounded-full bg-brand-blue px-7 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-brand-blue/90 hover:shadow-xl hover:scale-105"
            >
              <span>About Us</span>
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Presentation: Pinned constellation of 4 drifting memory cards around the central statement */}
      <div data-mobile-legacy-wrap className="lg:hidden relative w-full h-full max-w-[420px] mx-auto flex flex-col items-center justify-center py-6 select-none overflow-hidden">
        {/* 4 Drifting Floating Photograph Cards */}
        {collage.slice(0, 4).map((photo, i) => {
          const positions = [
            "top-[3%] left-[1%] -rotate-6 w-[36vw] max-w-[135px]",
            "top-[5%] right-[1%] rotate-6 w-[38vw] max-w-[145px]",
            "bottom-[5%] left-[1%] rotate-3 w-[40vw] max-w-[150px]",
            "bottom-[3%] right-[1%] -rotate-3 w-[36vw] max-w-[135px]",
          ];
          return (
            <div
              key={photo.id}
              data-mobile-legacy-card
              className={clsx(
                "absolute aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-ink/10 bg-neutral-900 pointer-events-none transition-transform duration-500",
                positions[i]
              )}
            >
              <Image
                src={photo.image.src}
                alt={photo.image.alt}
                fill
                sizes="40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </div>
          );
        })}

        {/* Central Statement & CTA */}
        <div className="relative z-20 flex flex-col items-center text-center gap-4 px-4 max-w-[290px]">
          <div data-eyebrow className="flex justify-center">
            <Eyebrow items={eyebrow} align="center" />
          </div>
          <div data-statement data-reveal>
            <Statement segments={legacyIntro.statement} className="t-statement text-ink text-balance text-[1.4rem] sm:text-[1.7rem] font-bold leading-[1.18]" />
          </div>
          <div data-reveal className="mt-1">
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-brand-blue/90 hover:shadow-lg active:scale-95"
            >
              <span>Discover Our 49-Year Journey</span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}