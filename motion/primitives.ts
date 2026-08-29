import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, SHIFT } from "./ease";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface RevealOptions {
  stagger?: number;
  duration?: number;
  distance?: number;
  rotate?: number | ((index: number) => number);
  scaleFrom?: number;
  staggerEase?: string;
}

function staggerOf(o: RevealOptions): number | gsap.StaggerVars {
  const each = o.stagger ?? 0;
  if (!each || !o.staggerEase) return each;
  return { each, ease: o.staggerEase, from: "start" };
}

type Targets = Element[] | Element | null | undefined;
type Position = gsap.Position | undefined;

function normalise(targets: Targets): Element[] {
  if (!targets) return [];
  return Array.isArray(targets) ? targets.filter(Boolean) : [targets];
}

/** opacity + y entrance */
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
      stagger: staggerOf(o),
      ease: EASE.primary,
    },
    at,
  );
}

/** opacity entrance (no translation) */
export function fadeIn(tl: gsap.core.Timeline, targets: Targets, o: RevealOptions = {}, at?: Position) {
  const nodes = normalise(targets);
  if (!nodes.length) return tl;
  return tl.fromTo(
    nodes,
    { opacity: 0 },
    {
      opacity: 1,
      duration: o.duration ?? DUR.reveal,
      stagger: staggerOf(o),
      ease: EASE.primary,
    },
    at,
  );
}

/** opacity + y + scale. Card and tile entrances */
export function riseCard(tl: gsap.core.Timeline, targets: Targets, o: RevealOptions = {}, at?: Position) {
  const nodes = normalise(targets);
  if (!nodes.length) return tl;
  return tl.fromTo(
    nodes,
    {
      opacity: 0,
      y: o.distance ?? 42,
      scale: o.scaleFrom ?? 0.94,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: o.duration ?? DUR.reveal,
      stagger: staggerOf(o),
      ease: EASE.primary,
    },
    at,
  );
}

/** opacity + y + rotate + scale. Collage photographs landing on the arcs */
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
      stagger: staggerOf(o),
      ease: EASE.primary,
    },
    at,
  );
}

/** scaleX from 0. Hairline rules and dividers */
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
      stagger: staggerOf(o),
      ease: EASE.primary,
    },
    at,
  );
}

/** scale settling inside frames */
export function settle(tl: gsap.core.Timeline, targets: Targets, o: RevealOptions = {}, at?: Position) {
  const nodes = normalise(targets);
  if (!nodes.length) return tl;
  return tl.fromTo(
    nodes,
    { scale: o.scaleFrom ?? 1.12 },
    {
      scale: 1,
      duration: o.duration ?? DUR.image,
      stagger: staggerOf(o),
      ease: EASE.spring,
    },
    at,
  );
}

/** Default entrance scrollTrigger */
export const entranceTrigger = (trigger: Element): ScrollTrigger.Vars => ({
  trigger,
  start: "top 78%",
  once: true,
  fastScrollEnd: true,
});

/** Query helper scoped to a section root */
export const q = <T extends Element = HTMLElement>(scope: Element, selector: string): T[] =>
  Array.from(scope.querySelectorAll<T>(selector));

/**
 * Clean baseline reveal for large headlines across all browsers
 */
export function revealLines(
  targets: Targets,
  o: { delay?: number; stagger?: number; duration?: number; trigger?: ScrollTrigger.Vars } = {},
): () => void {
  const nodes = normalise(targets);
  if (!nodes.length) return () => {};

  const tweens = nodes.map((node) => {
    gsap.set(node, { opacity: 1 });
    return gsap.fromTo(
      node,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: o.duration ?? 1.05,
        stagger: o.stagger ?? 0.085,
        ease: EASE.primary,
        delay: o.delay ?? 0,
        ...(o.trigger ? { scrollTrigger: o.trigger } : {}),
      },
    );
  });

  return () => {
    tweens.forEach((t) => t.kill());
  };
}

/** Number count-up animation */
export function countUp(
  tl: gsap.core.Timeline,
  node: Element,
  o: { duration?: number } = {},
  at?: Position,
) {
  const final = (node.textContent ?? "").trim();
  const match = final.match(/^([^\d]*)([\d,]+)(.*)$/);
  if (!match) return tl;
  const [, prefix, digits, suffix] = match;
  const target = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(target) || target === 0) return tl;

  const format = (n: number) => prefix + Math.round(n).toLocaleString("en-IN") + suffix;
  const state = { value: 0 };

  return tl.to(
    state,
    {
      value: target,
      duration: o.duration ?? 1.9,
      ease: EASE.primary,
      onUpdate: () => {
        node.textContent = format(state.value);
      },
      onComplete: () => {
        node.textContent = final;
      },
    },
    at,
  );
}

/** Parallax scrub helper */
export function parallax(
  targets: Targets,
  o: { from?: number; to?: number; trigger: Element; start?: string; end?: string },
) {
  const nodes = normalise(targets);
  if (!nodes.length) return;
  return gsap.fromTo(
    nodes,
    { yPercent: o.from ?? -8 },
    {
      yPercent: o.to ?? 8,
      ease: "none",
      scrollTrigger: {
        trigger: o.trigger,
        start: o.start ?? "top bottom",
        end: o.end ?? "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    },
  );
}

/** Releases will-change layer after entrance */
export function release(targets: Targets) {
  const nodes = normalise(targets);
  if (nodes.length) gsap.set(nodes, { willChange: "auto" });
}

export const releaseScope = (scope: Element) => () =>
  release(q(scope, "[data-reveal], [data-reveal-rule]"));

export { gsap, ScrollTrigger };