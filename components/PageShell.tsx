"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, fadeIn, growRule, revealLines, release, q } from "@/motion/primitives";
import { DUR, EASE, MOTION_OK } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement, type Segment } from "@/components/Statement";

/**
 * The masthead every interior page opens with.
 *
 * Interior pages are lighter than the homepage but must read as the same site,
 * so they reuse the design's own vocabulary exactly: the mono eyebrow pair, the
 * large Poppins statement with a coral fragment, and the same expo-eased
 * entrance. Nothing new is invented for these pages.
 *
 * The top padding clears the fixed header, which the homepage does not need
 * because its hero sits behind it.
 */
export function PageMasthead({
  eyebrow,
  statement,
  lead,
}: {
  eyebrow: readonly [string, string];
  statement: readonly Segment[];
  lead?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          onComplete: () => release(q(scope, "[data-reveal], [data-reveal-rule]")),
        });
        fadeIn(tl, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.05 }, 0.05);
        growRule(tl, q(scope, "[data-eyebrow] [data-reveal-rule]"), {}, 0.1);
        fadeUp(tl, q(scope, "[data-lead]"), { duration: DUR.statement }, 0.4);

        // Interior mastheads get the same per-line reveal as the homepage
        // statements, so an interior page opens with the site's own gesture
        // rather than with a generic fade.
        const revert = revealLines(q(scope, "[data-statement] h1"), {
          delay: 0.18,
          stagger: 0.09,
        });
        return () => revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <header
      ref={root}
      className="relative overflow-hidden border-b border-ink/10 pb-16 pt-32 sm:pb-24 sm:pt-48 bg-paper"
    >
      {/* Subtle blueprint grid in top right background */}
      <div className="absolute top-0 right-0 bottom-0 w-1/2 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(0,0,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,1)_1px,transparent_1px)]" style={{ backgroundSize: "32px 32px" }} />

      <div className="frame relative z-10">
        <div data-eyebrow className="mb-10 sm:mb-16">
          <div className="flex items-center gap-4">
            <span className="h-[2px] w-8 sm:w-16 bg-brand-blue/60" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-brand-blue font-bold">
              {eyebrow.join(" ")}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 lg:gap-20">
          <div data-statement className="flex-1 max-w-4xl">
            <Statement as="h1" segments={statement} className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[5.5rem] font-medium tracking-tight text-ink leading-[1.05] text-balance" />
          </div>
          {lead && (
            <div className="w-full lg:w-[40%] xl:w-[35%]">
              <p data-lead data-reveal className="text-sm sm:text-base text-body-light leading-relaxed max-w-md lg:pb-3">
                {lead}
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/**
 * A standard content band. Alternating grounds are how the homepage separates
 * sections, so interior pages use the same device rather than inventing one.
 */
export function Band({
  tone = "paper",
  children,
  className,
}: {
  tone?: "paper" | "ink";
  children: React.ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = q(scope, "[data-band-item]");
        if (!items.length) return;
        gsap.fromTo(
          items,
          { opacity: 0, y: 44 },
          {
            opacity: 1,
            y: 0,
            duration: DUR.statement,
            stagger: { each: 0.08, ease: "power1.inOut" },
            ease: EASE.primary,
            scrollTrigger: { trigger: scope, start: "top 82%", once: true },
            onComplete: () => release(items),
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className={[
        tone === "ink" ? "bg-ink/[0.055] text-ink" : "bg-paper text-ink",
        "py-20 sm:py-28 lg:py-36",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
