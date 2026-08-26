import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

/**
 * The two easing curves authored in the Figma timeline, reproduced exactly
 * rather than approximated. Every motion in the design uses one of them —
 * there is no third curve, and none should be added.
 */
export const EASE = {
  /** cubic-bezier(0.16, 1, 0.3, 1) — expo-out. Carries opacity and position. */
  primary: "raja-expo",
  /** Damped spring. Carries scale, and is why scale-ins overshoot slightly. */
  spring: "raja-spring",
} as const;

/**
 * Figma exports the scale easing as a closed-form damped oscillator:
 *
 *   f(t) = 1 - e^(-7.6657t) * (cos(6.7605t) + 1.1339 * sin(6.7605t))
 *
 * CustomEase takes an SVG path, so the curve is sampled into a polyline. 96
 * samples keeps the overshoot and the settle visually identical to Figma while
 * staying cheap to parse.
 */
const DAMPING = 7.6657;
const OMEGA = 6.7605;
const PHASE = 1.1339;
const SAMPLES = 96;

function springPath(): string {
  const points: string[] = ["M0,0"];
  for (let i = 1; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const y = 1 - Math.exp(-DAMPING * t) * (Math.cos(OMEGA * t) + PHASE * Math.sin(OMEGA * t));
    points.push(`L${t.toFixed(5)},${y.toFixed(5)}`);
  }
  return points.join(" ");
}

let registered = false;

export function registerEases() {
  if (registered) return;
  gsap.registerPlugin(CustomEase);
  CustomEase.create(EASE.primary, "M0,0 C0.16,1 0.3,1 1,1");
  CustomEase.create(EASE.spring, springPath());
  registered = true;
}

/**
 * Durations and staggers lifted from the 19s Figma cohort. Section timelines
 * reference these instead of hardcoding numbers, so the whole choreography can
 * be retimed from one place without restructuring any timeline.
 */
export const DUR = {
  /** Standard text/element entrance — 0.55s in Figma. */
  reveal: 0.55,
  /** Longer entrance used for headline statements — 0.85s. */
  statement: 0.85,
  /** Hairline rules growing from zero width — 0.5s. */
  rule: 0.5,
  /** Image scale settling inside a card — 1.3s. */
  image: 1.3,
  /** Collage photographs landing — 0.8s. */
  land: 0.8,
} as const;

/** Stagger intervals, measured between consecutive nodes in the Figma export. */
export const STAGGER = {
  navRules: 0.06,
  arcs: 0.2,
  collage: 0.09,
  capabilities: 0.15,
  stats: 0.16,
  works: 0.14,
  process: 0.13,
  bento: 0.11,
  clients: 0.045,
} as const;

/** Distances, in px at 1440. Kept small — the design moves things, not far. */
export const SHIFT = {
  y: 40,
  yLarge: 64,
  x: 28,
} as const;

/**
 * Media conditions every section registers its timelines under.
 *
 * Reduced motion is handled here, once, rather than in eight places: when the
 * visitor has asked for it, no timeline is ever built and no pin is ever
 * created. `[data-reveal]` is never pre-hidden in that state either (the
 * inline script in the layout skips the `motion-ready` class), so the page
 * renders complete and static.
 */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_DESKTOP = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
export const MOTION_COMPACT = "(max-width: 1023px) and (prefers-reduced-motion: no-preference)";
