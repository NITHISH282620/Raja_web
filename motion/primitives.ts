import { gsap } from "gsap";
import { DUR, EASE, SHIFT } from "./ease";

export interface RevealOptions {
  stagger?: number;
  duration?: number;
  distance?: number;
  /** Rotation applied per index — used by the collage landing. */
  rotate?: number | ((index: number) => number);
  scaleFrom?: number;
}

type Targets = Element[] | Element | null | undefined;
type Position = gsap.Position | undefined;

/**
 * The vocabulary of the Figma timeline.
 *
 * Every animated node in the 150-node export does one of these five things, so
 * this is the complete set — nothing is added because nothing else exists in
 * the design.
 *
 * These are `fromTo` builders on purpose. Elements are pre-hidden in CSS via
 * `[data-reveal]` so nothing flashes before hydration; a plain `from()` would
 * read that CSS as the destination and animate to opacity 0. Stating the end
 * state explicitly is what makes the pre-hide and the timeline agree.
 */

function normalise(targets: Targets): Element[] {
  if (!targets) return [];
  return Array.isArray(targets) ? targets.filter(Boolean) : [targets];
}

/** opacity + y. The most common entrance in the file by a wide margin. */
export function fadeUp(tl: gsap.core.Timeline, targets: Targets, o: RevealOptions = {}, at?: Position) {
  const nodes = normalise(targets);
  if (!nodes.length) return tl;
  return tl.fromTo(
    nodes,
    { opacity: 0, y: o.distance ?? SHIFT.y },
    {
      opacity: 1,
      y: 0,
      duration: o.duration ?? DUR.reveal,
      stagger: o.stagger ?? 0,
      ease: EASE.primary,
    },
    at,
  );
}

/** opacity + x. Eyebrow labels sliding in either side of their rule. */
export function fadeIn(tl: gsap.core.Timeline, targets: Targets, o: RevealOptions = {}, at?: Position) {
  const nodes = normalise(targets);
  if (!nodes.length) return tl;
  return tl.fromTo(
    nodes,
    { opacity: 0, x: o.distance ?? SHIFT.x },
    {
      opacity: 1,
      x: 0,
      duration: o.duration ?? DUR.reveal,
      stagger: o.stagger ?? 0,
      ease: EASE.primary,
    },
    at,
  );
}

/** opacity + y + scale. Cards and framed groups entering. */
export function riseCard(tl: gsap.core.Timeline, targets: Targets, o: RevealOptions = {}, at?: Position) {
  const nodes = normalise(targets);
  if (!nodes.length) return tl;
  return tl.fromTo(
    nodes,
    { opacity: 0, y: o.distance ?? SHIFT.yLarge, scale: o.scaleFrom ?? 0.94 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: o.duration ?? DUR.statement,
      stagger: o.stagger ?? 0,
      ease: EASE.primary,
    },
    at,
  );
}

/** opacity + y + rotate + scale. The collage photographs landing on the arcs. */
export function land(tl: gsap.core.Timeline, targets: Targets, o: RevealOptions = {}, at?: Position) {
  const nodes = normalise(targets);
  if (!nodes.length) return tl;
  return tl.fromTo(
    nodes,
    {
      opacity: 0,
      y: o.distance ?? 54,
      scale: o.scaleFrom ?? 0.9,
      rotate: o.rotate ?? 0,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      duration: o.duration ?? DUR.land,
      stagger: o.stagger ?? 0,
      ease: EASE.primary,
    },
    at,
  );
}

/** scaleX from 0. Every hairline rule and divider in the design. */
export function growRule(tl: gsap.core.Timeline, targets: Targets, o: RevealOptions = {}, at?: Position) {
  const nodes = normalise(targets);
  if (!nodes.length) return tl;
  return tl.fromTo(
    nodes,
    { scaleX: 0 },
    {
      scaleX: 1,
      transformOrigin: "left center",
      duration: o.duration ?? DUR.rule,
      stagger: o.stagger ?? 0,
      ease: EASE.primary,
    },
    at,
  );
}

/** scale on the damped spring. Artwork settling inside its frame. */
export function settle(tl: gsap.core.Timeline, targets: Targets, o: RevealOptions = {}, at?: Position) {
  const nodes = normalise(targets);
  if (!nodes.length) return tl;
  return tl.fromTo(
    nodes,
    { scale: o.scaleFrom ?? 1.12 },
    {
      scale: 1,
      duration: o.duration ?? DUR.image,
      stagger: o.stagger ?? 0,
      ease: EASE.spring,
    },
    at,
  );
}

/**
 * Default trigger for a one-shot section entrance. Sections that pin or scrub
 * declare their own; everything else shares this so the reveal threshold stays
 * consistent down the whole page.
 */
export const entranceTrigger = (trigger: Element): ScrollTrigger.Vars => ({
  trigger,
  start: "top 78%",
  once: true,
});

/** Query helper scoped to a section root. */
export const q = <T extends Element = HTMLElement>(scope: Element, selector: string): T[] =>
  Array.from(scope.querySelectorAll<T>(selector));

export { gsap };
