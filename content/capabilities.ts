import type { Sourced } from "./types";
import type { MediaAsset } from "./media";

export interface Capability extends Sourced {
  id: string;
  index: string;
  title: string;
  /** One line naming what is actually delivered. Optional — never invented. */
  summary: string | null;
  image: MediaAsset | null;
}

/**
 * The pinned horizontal carousel in "What we build".
 *
 * Figma shipped only TWO slides — "Exhibition Design" and "Structural Build" —
 * and gave both the same photograph, while the section heading promised "Four
 * elements" and the body copy named them: "Structures, flooring, stages and
 * exhibitions".
 *
 * The four slides below use those four elements exactly as the approved copy
 * states them.
 *
 * PHOTOGRAPHY, 2026-08-27. Two passes have run over these four slides.
 *
 * The original build shipped four stock/AI photographs — a North American
 * marina, a truss stage branded "Global Leadership Summit 2026" — labelled
 * `clearance: "raja-original"` and credited to Raja Enterprises. That was a
 * false attribution and it was removed.
 *
 * They were then replaced with frames lifted from Raja's own AICOG 2019 film,
 * which were genuinely Raja's work but were 720p video stills with
 * "RAJA ENTERPRISES" burned across the middle of each one.
 *
 * What is here now is licensed photography (Pexels License: free for
 * commercial use, no attribution required, modification permitted), sized and
 * cropped for these cards. It is ILLUSTRATIVE — it shows the category of work,
 * not Raja's own sites — which is why the clearance says `licensed` and there
 * is no Raja credit. Raja replaces these with his own photographs through the
 * admin's media library, which is the point at which this section becomes
 * evidence rather than illustration.
 */
export const capabilities: Capability[] = [
  {
    id: "structural-build",
    index: "01",
    title: "German Hangers & Temporary Structures",
    summary: "Imported German hangers and clear-span structures, erected on prepared ground.",
    image: {
      id: "capability-structure",
      src: "/media/capability-structure.3aa80a08.webp",
      width: 1600,
      height: 1000,
      alt: "A clear-span temporary structure covering an exhibition ground, with visitors arriving beneath its open frontage.",
      focal: "center",
      clearance: "licensed",
    },
    status: "approved",
  },
  {
    id: "flooring-platforms",
    index: "02",
    title: "Event Flooring & Platforms",
    summary: "Wooden decking, levelled platforms and carpeting laid across the full floor plate.",
    image: {
      id: "capability-flooring",
      src: "/media/capability-flooring.8970a089.webp",
      width: 1600,
      height: 1000,
      alt: "Carpeted platform steps photographed close to the surface.",
      focal: "center",
      clearance: "licensed",
    },
    status: "approved",
  },
  {
    id: "staging",
    index: "03",
    title: "Staging & Audience Infrastructure",
    summary: "Dais, stage, lighting rig and audience seating, delivered as one package.",
    image: {
      id: "capability-staging",
      src: "/media/capability-staging.b729b543.webp",
      width: 1600,
      height: 1000,
      alt: "Arched event structure lit by beam lighting above a full standing audience.",
      focal: "center",
      clearance: "licensed",
    },
    status: "approved",
  },
  {
    id: "exhibition-design",
    index: "04",
    title: "Exhibition Stall Fabrication",
    summary: "Octonorm and Maxima stalls fabricated, fitted and struck on schedule.",
    image: {
      id: "capability-exhibition",
      src: "/media/capability-exhibition.4378e5d7.webp",
      width: 1600,
      height: 1000,
      alt: "Exhibition hall filled with modular stall builds beneath a glazed roof.",
      focal: "center",
      clearance: "licensed",
    },
    status: "approved",
  },
];

export const capabilitiesIntro = {
  eyebrow: ["what we", "build"] as const,
  statement: [
    { text: "Four elements. One " },
    { text: "in-house", accent: true },
    { text: " crew." },
  ],
  /**
   * The headcount previously stated here was "our own 460-person crew", which
   * contradicted the approved stat band ("Field workforce 300+"). The band is
   * the approved figure, so the copy now agrees with it rather than asserting a
   * second, higher number the company has not confirmed.
   */
  body: "Structures, flooring, staging, and exhibitions ┠ delivered by our field crews using our own substantial inventory. Complete turnkey physical execution.",
  status: "provisional" as const,
  note: "Headcount aligned to the approved 300+ field workforce stat. Confirm whether the 460 figure from the Figma copy is total headcount including workshop and office staff; if so, both can be stated.",
};
