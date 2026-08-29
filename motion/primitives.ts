import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { DUR, EASE, SHIFT } from "./ease";

export interface RevealOptions {
  stagger?: number;
  duration?: number;
  distance?: number;
  /** Rotation applied per index — used by the collage landing. */
  rotate?: number | ((index: number) => number);
  scaleFrom?: number;
  /**
   * Distributes a multi-element stagger on a curve instead of a fixed
   * interval. A flat interval reads as mechanical once more than about four
   * elements are involved; easing the distribution makes the group arrive as
   * one move. Figma authored the interval, not the distribution — this is a
   * smoothness refinement, applied only to the large groups.
   */
  staggerEase?: string;
}

/** Builds the stagger value, eased across the group when asked for. */
function staggerOf(o: RevealOptions): number | gsap.StaggerVars {
  const each = o.stagger ?? 0;
  if (!each || !o.staggerEase) return each;
  return { each, ease: o.staggerEase, from: "start" };
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
      stagger: staggerOf(o),
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
      stagger: staggerOf(o),
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
      stagger: staggerOf(o),
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
      stagger: staggerOf(o),
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
      stagger: staggerOf(o),
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
      stagger: staggerOf(o),
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
  // On a fast scroll the reveal would otherwise still be mid-flight when the
  // section has already left the viewport, so the visitor arrives to a section
  // that is visibly catching up. fastScrollEnd lets it settle immediately.
  fastScrollEnd: true,
});

/** Query helper scoped to a section root. */
export const q = <T extends Element = HTMLElement>(scope: Element, selector: string): T[] =>
  Array.from(scope.querySelectorAll<T>(selector));

export { gsap };

/* ---------------------------------------------------------------------------
   Refinements added on top of the Figma vocabulary.

   The five builders above reproduce what the design authored. The four below
   are the difference between "the elements arrive" and "the page feels built":
   they were not in the export because a static Figma frame cannot express
   them, not because the design rejected them.
--------------------------------------------------------------------------- */

/**
 * Per-line masked reveal for large type.
 *
 * A headline that fades up as one block reads as a div moving. The same
 * headline revealed line by line from behind its own baseline reads as
 * typesetting, which is what every considered site does with its display copy.
 *
 * `mask: "lines"` makes SplitText build the overflow-hidden wrapper per line,
 * so nothing has to be styled for it. `aria: "auto"` keeps the original string
 * on the element for assistive tech, so splitting is invisible to a screen
 * reader. `autoSplit` re-splits on font load and on resize — without it a line
 * break that moves after Poppins swaps in leaves a word stranded in the wrong
 * mask.
 *
 * Returns a cleanup that reverts the DOM to its original markup.
 */
export function revealLines(
  targets: Targets,
  o: { delay?: number; stagger?: number; duration?: number; trigger?: ScrollTrigger.Vars } = {},
): () => void {
  const nodes = normalise(targets);
  if (!nodes.length) return () => {};

  const splits = nodes.map((node) =>
    SplitText.create(node, {
      type: "lines",
      mask: "lines",
      aria: "auto",
      autoSplit: true,
      linesClass: "raja-line",
      onSplit(self) {
        // The element carries `[data-lines]`, which CSS pre-hides so the
        // server-rendered headline cannot flash unmasked between paint and
        // hydration. Once the per-line masks exist they do the hiding, so the
        // element itself must come back to full opacity.
        gsap.set(node, { opacity: 1 });
        return gsap.fromTo(
          self.lines,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: o.duration ?? 1.05,
            stagger: o.stagger ?? 0.085,
            ease: EASE.primary,
            delay: o.delay ?? 0,
            ...(o.trigger ? { scrollTrigger: o.trigger } : {}),
          },
        );
      },
    }),
  );

  return () => splits.forEach((s) => s.revert());
}

/**
 * Counts a figure up to its final value.
 *
 * Only ever applied to quantities. A founding year is not a quantity — rolling
 * 1900 → 1977 means the page displays "Since 1953" to anyone who stops
 * scrolling mid-tween, which is a false statement about the company. Years get
 * `revealLines` instead.
 *
 * Reads the final value out of the DOM so the server-rendered markup stays the
 * source of truth: with JS off, or reduced motion on, the correct number is
 * already on the page and nothing here runs.
 */
export function countUp(
  tl: gsap.core.Timeline,
  node: Element,
  o: { duration?: number } = {},
  at?: Position,
) {
  const final = (node.textContent ?? "").trim();
  // Split into the numeric core and whatever brackets it ("1,00,000" + "+").
  const match = final.match(/^([^\d]*)([\d,]+)(.*)$/);
  if (!match) return tl;
  const [, prefix, digits, suffix] = match;
  const target = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(target) || target === 0) return tl;

  // Indian grouping (1,00,000) is not what toLocaleString("en-US") produces,
  // and the design uses it throughout, so format against the authored string.
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
      // Restores the authored string exactly, so a value the formatter would
      // render differently from how it was written cannot survive the tween.
      onComplete: () => {
        node.textContent = final;
      },
    },
    at,
  );
}

/**
 * Depth parallax on a scrub.
 *
 * `yPercent` rather than `y` so the distance scales with the element instead of
 * being a fixed pixel figure that reads as a lot on a phone and as nothing on a
 * 27" display. Always paired with `ease: "none"` — a scrubbed tween that also
 * eases fights the scroll position and is the classic source of "sticky"
 * parallax.
 */
export function parallax(
  targets: Targets,
  o: { from?: number; to?: number; trigger: Element; start?: string; end?: string } ,
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

/**
 * Releases the compositor layers `[data-reveal]` asks for in CSS.
 *
 * `will-change` is a promise to the browser that something is about to move.
 * Leaving it on every revealed element for the life of the page means the page
 * ends up holding fifty-odd layers it will never animate again, which is a
 * memory cost on desktop and a scroll-jank cost on mobile. Every entrance
 * timeline hands its nodes here when it finishes.
 */
export function release(targets: Targets) {
  const nodes = normalise(targets);
  if (nodes.length) gsap.set(nodes, { willChange: "auto" });
}

/** Convenience: run `release` over a whole section once its entrance is done. */
export const releaseScope = (scope: Element) => () =>
  release(q(scope, "[data-reveal], [data-reveal-rule]"));
