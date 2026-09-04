"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, release } from "@/motion/primitives";
import { EASE, MOTION_OK } from "@/motion/ease";

/**
 * The standard entrance, applied to a group of siblings.
 *
 * Nine interior sections needed the same behaviour the `/about` components
 * already had. Copying that `useGSAP` block nine times would have produced nine
 * slightly different easings within a month, so it lives here once and the
 * sections declare which variant they want.
 *
 * Direct children animate by default. Pass `select` to target something deeper.
 * Everything is gated behind `MOTION_OK`, so with reduced motion the timeline
 * never registers and the children sit at their natural opacity — which is also
 * what a visitor with JavaScript disabled gets, since nothing is hidden in CSS.
 */

const VARIANTS = {
  /** The default. Blocks entering view. */
  fadeUp: { from: { opacity: 0, y: 32 }, duration: 0.8, stagger: 0.1 },
  /** Cards and tiles. Slightly further, slightly slower. */
  riseCard: { from: { opacity: 0, y: 48 }, duration: 0.9, stagger: 0.09 },
  /** Logos, marks, badges. Settles rather than travels. */
  land: { from: { opacity: 0, y: 16, scale: 0.96 }, duration: 0.7, stagger: 0.06 },
  /** Table rows and dividers. The rule draws, the row follows. */
  growRule: { from: { opacity: 0, scaleX: 0.92, y: 12 }, duration: 0.7, stagger: 0.055 },
} as const;

export type RevealVariant = keyof typeof VARIANTS;

export function Reveal({
  children,
  as: Tag = "div",
  variant = "fadeUp",
  select,
  start = "top 80%",
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  variant?: RevealVariant;
  /** CSS selector for the items to animate. Defaults to direct children. */
  select?: string;
  start?: string;
  className?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const spec = VARIANTS[variant];
      const items = select
        ? Array.from(scope.querySelectorAll(select))
        : Array.from(scope.children);
      if (items.length === 0) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          items,
          { ...spec.from, willChange: "transform, opacity" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            scaleX: 1,
            duration: spec.duration,
            stagger: spec.stagger,
            ease: EASE.primary,
            scrollTrigger: { trigger: scope, start, once: true },
            // Hand the compositor layers back once the entrance is done, so a
            // long page does not accumulate layers it will never animate again.
            onComplete: () => release(items),
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <Tag ref={root} className={className}>
      {children}
    </Tag>
  );
}
