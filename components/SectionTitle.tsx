"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, revealLines, growRule, q } from "@/motion/primitives";
import { MOTION_OK } from "@/motion/ease";
import { clsx } from "@/lib/clsx";

/**
 * The oversized two-tone section title.
 *
 * Two words, the first set in the brand blue at a lighter weight and the second
 * in ink, stacked and tracked tight — the device the reference site uses to
 * open every band, and the thing that makes a long scrolling page read as
 * chapters instead of as one continuous column.
 *
 * It is deliberately NOT the `t-statement` serif used for the argument copy.
 * A section title is a label, not a sentence; setting it in the display sans at
 * this size keeps the serif reserved for the lines that are actually making a
 * claim, which is what stops the page from having two competing voices.
 */
export function SectionTitle({
  lead,
  trail,
  align = "start",
  rule = true,
  className,
}: {
  lead: string;
  trail: string;
  align?: "start" | "center";
  rule?: boolean;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: scope, start: "top 85%", once: true },
        });
        growRule(tl, q(scope, "[data-reveal-rule]"), { duration: 0.9 }, 0.35);
        const revert = revealLines(q(scope, "[data-lines]"), {
          stagger: 0.08,
          duration: 1.05,
          trigger: { trigger: scope, start: "top 85%", once: true },
        });
        return () => revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={clsx("w-full", className)}>
      <h2
        data-lines
        className={clsx(
          "font-display font-semibold uppercase leading-[0.92] tracking-[-0.035em]",
          "text-[clamp(2.5rem,7.4vw,6.5rem)]",
          align === "center" && "text-center",
        )}
      >
        <span className="block text-brand-blue/45">{lead}</span>
        <span className="block text-ink">{trail}</span>
      </h2>
      {rule && (
        <span
          aria-hidden
          data-reveal-rule
          className="mt-[clamp(14px,1.8vw,26px)] block h-px w-full origin-left bg-ink/15"
        />
      )}
    </div>
  );
}
