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
      className="frame pb-[clamp(32px,4vw,56px)] pt-[clamp(104px,11vw,152px)]"
    >
      <div data-eyebrow className="mb-[clamp(12px,1.5vw,20px)]">
        <Eyebrow items={eyebrow} />
      </div>
      <div className="grid items-end gap-[clamp(16px,2.4vw,48px)] lg:grid-cols-[1.15fr_0.85fr]">
        <div data-statement>
          <Statement as="h1" segments={statement} className="t-statement max-w-[16ch]" />
        </div>
        {lead && (
          <p data-lead data-reveal className="t-lead max-w-[46ch] text-body-light lg:pb-2 lg:text-right">
            {lead}
          </p>
        )}
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
        tone === "ink" ? "bg-mist text-ink" : "bg-surface text-ink",
        "py-[clamp(56px,8vw,120px)]",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
