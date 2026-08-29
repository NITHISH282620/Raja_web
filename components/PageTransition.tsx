"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/motion/primitives";
import { EASE } from "@/motion/ease";

/**
 * The between-pages transition.
 *
 * WHAT THIS REPLACED. The first version swept six vertical navy bands across
 * the viewport. On paper it matched the reference site; in practice, at any
 * moment mid-wipe the screen showed staggered rectangles slicing through a
 * headline and half a nav bar, and it read as a rendering fault rather than as
 * a transition. Anything that covers the page has to be *finished* being read
 * as deliberate within a few frames, and a staggered hard-edged wipe never is.
 *
 * What is here now covers nothing. The incoming page simply resolves from
 * transparent, which is legible at every frame of its life because there is
 * never a moment where two things are fighting for the same pixels.
 *
 * OPACITY ONLY — deliberately, and this is the important constraint. Adding a
 * `y` offset would put a transform on an ancestor of the whole page, and a
 * transformed ancestor breaks `position: sticky`, which is what the Works card
 * stack is built on. Opacity creates a stacking context but not a containing
 * block, so sticky and fixed both keep working.
 *
 * The first paint is skipped: fading in the landing page would put an animation
 * in front of the LCP for no benefit.
 */
const REDUCED = "(prefers-reduced-motion: reduce)";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const wrap = useRef<HTMLDivElement>(null);
  const previous = useRef<string | null>(null);

  const enabled = useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(REDUCED);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => !window.matchMedia(REDUCED).matches,
    () => false,
  );

  useEffect(() => {
    const node = wrap.current;
    if (!node) return;

    if (!enabled || previous.current === null) {
      previous.current = pathname;
      gsap.set(node, { clearProps: "opacity" });
      return;
    }
    previous.current = pathname;

    const tween = gsap.fromTo(
      node,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.42,
        ease: EASE.primary,
        // Leaving an inline opacity behind would pin a compositor layer on the
        // whole page for the rest of the session.
        clearProps: "opacity",
      },
    );

    /**
     * The incoming page's ScrollTriggers were measured while the outgoing
     * page's height was still on the document. Without a refresh, a short page
     * arriving after a long one can have its first section already past its own
     * trigger point, so that section never reveals at all.
     */
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => {
      window.clearTimeout(id);
      tween.kill();
    };
  }, [pathname, enabled]);

  return <div ref={wrap}>{children}</div>;
}

// Imported for its side effect of being registered by MotionProvider; the
// refresh above is the only place the page transition touches it.
import { ScrollTrigger } from "gsap/ScrollTrigger";
