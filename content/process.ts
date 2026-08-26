import type { Sourced } from "./types";
import type { MediaAsset } from "./media";

export interface ProcessStep extends Sourced {
  id: string;
  index: string;
  label: string;
  caption: string | null;
  image: MediaAsset | null;
}

/**
 * "The making of an event" — the step-through sequence.
 *
 * Figma defined three steps (00 empty, 01 structure, 02 flooring) but gave all
 * three the same photograph and the same caption, which was the single biggest
 * content gap in the design.
 *
 * That gap is now closed with real frames from Raja's own AICOG 2019 project
 * film, which happens to document exactly this arc: raw ground being graded,
 * the crew raising a canopy, and the crew laying flooring inside it. Same site,
 * same build, in sequence — which is precisely what the section was designed to
 * show and what no stock or third-party photograph could have provided.
 */
export const processSteps: ProcessStep[] = [
  {
    id: "empty",
    index: "00",
    label: "Empty",
    caption: "Raw ground levelled and set out before a single structure goes up.",
    image: {
      id: "aicog-2019-site-grading",
      src: "/media/projects/aicog-2019-site-grading.webp",
      width: 1800,
      height: 1013,
      alt: "Aerial view of earth-movers grading open farmland into level plots ahead of the build.",
      focal: "center",
      clearance: "raja-original",
      credit: "Raja Enterprises",
    },
    status: "approved",
  },
  {
    id: "structure",
    index: "01",
    label: "Structure",
    caption: "Our own crew raises the canopies and clear-span structures on the prepared ground.",
    image: {
      id: "aicog-2019-hanger-erection",
      src: "/media/projects/aicog-2019-hanger-erection.webp",
      width: 1800,
      height: 1013,
      alt: "Raja Enterprises crew in branded shirts raising a white canopy over its frame on site.",
      focal: "center",
      clearance: "raja-original",
      credit: "Raja Enterprises",
    },
    status: "approved",
  },
  {
    id: "flooring",
    index: "02",
    label: "Flooring",
    caption: "Flooring and carpeting go down inside the structure, turning a frame into a room.",
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
];

export const processIntro = {
  eyebrow: ["The making", "of an event"] as const,
  statement: [
    { text: "How we " },
    { text: "plan and structure", accent: true },
    { text: " things?" },
  ],
};
