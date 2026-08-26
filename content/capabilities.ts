import type { Sourced } from "./types";
import type { MediaAsset } from "./media";

export interface Capability extends Sourced {
  id: string;
  index: string;
  title: string;
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
 * states them, each with a distinct frame from Raja's own AICOG 2019 project
 * film. Nothing is invented: the names come from the design's own body copy and
 * the photographs are Raja's own work.
 */
export const capabilities: Capability[] = [
  {
    id: "structural-build",
    index: "01",
    title: "Structural Build",
    image: {
      id: "aicog-2019-hanger-complex-aerial",
      src: "/media/projects/aicog-2019-hanger-complex-aerial.webp",
      width: 1800,
      height: 1013,
      alt: "Aerial view of a large clear-span hanger complex with white roofs over green flooring.",
      focal: "center",
      clearance: "raja-original",
      credit: "Raja Enterprises",
    },
    status: "approved",
  },
  {
    id: "flooring-platforms",
    index: "02",
    title: "Flooring & Platforms",
    image: {
      id: "aicog-2019-flooring-install",
      src: "/media/projects/aicog-2019-flooring-install.webp",
      width: 1800,
      height: 1013,
      alt: "Crew unrolling red carpet across the floor of a completed draped tent interior.",
      focal: "center",
      clearance: "raja-original",
      credit: "Raja Enterprises",
    },
    status: "approved",
  },
  {
    id: "staging",
    index: "03",
    title: "Staging",
    image: {
      id: "aicog-2019-hanger-interior-audience",
      src: "/media/projects/aicog-2019-hanger-interior-audience.webp",
      width: 1800,
      height: 1013,
      alt: "Interior of a large hanger with a lit stage and a full seated audience.",
      focal: "center",
      clearance: "raja-original",
      credit: "Raja Enterprises",
    },
    status: "approved",
  },
  {
    id: "exhibition-design",
    index: "04",
    title: "Exhibition Design",
    image: {
      id: "aicog-2019-exhibition-stalls",
      src: "/media/projects/aicog-2019-exhibition-stalls.webp",
      width: 1800,
      height: 1013,
      alt: "Exhibition aisle lined with fabricated stalls and branded fascia under a hanger roof.",
      focal: "center",
      clearance: "raja-original",
      credit: "Raja Enterprises",
    },
    status: "approved",
  },
];

export const capabilitiesIntro = {
  eyebrow: ["what we", "build?"] as const,
  statement: [
    { text: "Four elements. One " },
    { text: "in-house", accent: true },
    { text: " crew." },
  ],
  body: "Structures, flooring, stages and exhibitions — built and struck by our own 460-person crew, not subcontracted.",
  status: "provisional" as const,
  note: 'The "460-person crew" figure still conflicts with the 300+ field workforce stat in the resources band. Confirm which is total headcount and which is field crew.',
};
