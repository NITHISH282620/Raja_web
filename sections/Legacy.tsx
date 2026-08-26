"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, fadeIn, growRule, land, entranceTrigger, q } from "@/motion/primitives";
import { DUR, EASE, STAGGER, MOTION_OK } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";
import { arcs, collage, legacyIntro, LEGACY_BOX } from "@/content/legacy";
import { yearsInOperation } from "@/content/company";
import { SECTION_IDS } from "@/content/navigation";

const pct = (n: number) => `${n}%`;

/**
 * Figma 898–1782px. Four coral arcs sweep in behind the statement, then six
 * photographs land along them with a rotation settle.
 *
 * Desktop reproduces the absolute composition inside a 1440 x 884 box that
 * scales as a single unit. Below 1024 that scatter stops working — at any
 * readable type size the photographs collide with the statement — so the same
 * six images become a snap rail beneath it. The section's point (a long, dense
 * body of work) survives; the unreadable overlap does not.
 */
export function Legacy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {

        const tl = gsap.timeline({ scrollTrigger: entranceTrigger(scope) });

        // Arcs scale up on the damped spring — 1.20s to 3.45s, 0.20s apart.
        const arcNodes = q(scope, "[data-arc]");
        if (arcNodes.length) {
          tl.fromTo(
            arcNodes,
            { opacity: 0, scale: 0.55 },
            { opacity: 1, scale: 1, duration: 1.7, stagger: STAGGER.arcs, ease: EASE.spring },
            0,
          );
        }

        growRule(tl, q(scope, "[data-reveal-rule]"), {}, 0.7);
        fadeIn(tl, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.04 }, 0.7);
        fadeUp(tl, q(scope, "[data-statement]"), { duration: DUR.statement }, 0.95);

        // Photographs land: opacity + y + rotate + scale, 0.09s apart.
        land(tl, q(scope, "[data-collage]"), {
          stagger: STAGGER.collage,
          staggerEase: "power1.inOut",
          rotate: (i: number) => (i % 2 === 0 ? -5 : 5),
        }, 1.25);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const eyebrow = [`${yearsInOperation()} years`, legacyIntro.eyebrow[1]] as const;

  return (
    <section ref={root} id={SECTION_IDS.legacy} className="relative w-full overflow-hidden bg-paper">
      {/* ---------- Desktop: the authored composition ---------- */}
      <div
        className="relative mx-auto hidden w-full max-w-[1440px] lg:block"
        style={{ aspectRatio: `${LEGACY_BOX.width} / ${LEGACY_BOX.height}` }}
      >
        {arcs.map((arc) => (
          <div
            key={arc.src}
            data-arc
            aria-hidden
            className="absolute"
            style={{ left: pct(arc.left), top: pct(arc.top), width: pct(arc.width), height: pct(arc.height) }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative vector stretched to a non-intrinsic box */}
            <img src={arc.src} alt="" className="h-full w-full" />
          </div>
        ))}

        {collage.map((photo) => (
          <div
            key={photo.id}
            data-collage
            data-reveal
            className="absolute overflow-hidden rounded-[10px] shadow-[15px_15px_18.9px_0_rgba(0,0,0,0.05)]"
            style={{ left: pct(photo.left), top: pct(photo.top), width: pct(photo.width), height: pct(photo.height) }}
          >
            <Image
              src={photo.image.src}
              alt={photo.image.alt}
              fill
              sizes="(max-width: 1440px) 25vw, 340px"
              className="object-cover"
              style={photo.flip ? { transform: "scaleX(-1)" } : undefined}
            />
          </div>
        ))}

        <div className="absolute left-1/2 top-[33%] w-[62%] -translate-x-1/2 text-center">
          <div data-eyebrow>
            <Eyebrow items={eyebrow} align="center" />
          </div>
          <div data-statement data-reveal className="mt-[3.5%]">
            <Statement segments={legacyIntro.statement} className="t-intro" />
          </div>
        </div>
      </div>

      {/* ---------- Below 1024: statement first, evidence as a rail ---------- */}
      <div className="lg:hidden">
        <div className="frame flex flex-col items-center gap-5 py-[clamp(72px,14vw,120px)] text-center">
          <div data-eyebrow>
            <Eyebrow items={eyebrow} align="center" />
          </div>
          <div data-statement data-reveal>
            <Statement segments={legacyIntro.statement} className="t-intro" />
          </div>
        </div>
        <ul
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(20px,5.55vw,80px)] pb-[clamp(56px,12vw,96px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Recent builds"
        >
          {collage.map((photo) => (
            <li
              key={photo.id}
              data-collage
              data-reveal
              className="relative aspect-[16/10] w-[76vw] max-w-[420px] shrink-0 snap-center overflow-hidden rounded-[10px]"
            >
              <Image src={photo.image.src} alt={photo.image.alt} fill sizes="76vw" className="object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
