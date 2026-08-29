import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const EASE = {
  primary: "raja-expo",
  spring: "raja-spring",
} as const;

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
  if (typeof window !== "undefined") {
    gsap.registerPlugin(CustomEase, ScrollTrigger);
    CustomEase.create(EASE.primary, "M0,0 C0.16,1 0.3,1 1,1");
    CustomEase.create(EASE.spring, springPath());
    gsap.defaults({ ease: EASE.primary });
    registered = true;
  }
}

registerEases();

export const DUR = {
  reveal: 0.55,
  statement: 0.85,
  rule: 0.5,
  image: 1.3,
  land: 0.8,
} as const;

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

export const SHIFT = {
  y: 40,
  yLarge: 64,
  x: 28,
} as const;

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_DESKTOP = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
export const MOTION_COMPACT = "(max-width: 1023px) and (prefers-reduced-motion: no-preference)";