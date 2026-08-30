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
 * PHOTOGRAPHY, 2026-08-27: licensed photography (Pexels License), replacing
 * video stills from Raja's AICOG 2019 film that carried a burned-in watermark
 * across the middle of every frame.
 *
 * The section's argument depends on these being ONE site at three stages. These
 * three are not — they are three different sites that read as a sequence. That
 * is the weakest thing on the page and the first set Raja should replace with
 * his own photographs of a single build, which the admin now makes a five
 * minute job.
 */
export const processSteps: ProcessStep[] = [
  {
    id: "empty",
    index: "00",
    label: "Empty",
    caption: "Raw ground levelled and set out before a single structure goes up.",
    image: {
      id: "process-empty",
      src: "/media/process-empty.8eb0657f.webp",
      width: 1600,
      height: 1200,
      alt: "Excavator working open ground, levelling a site before a build begins.",
      focal: "center",
      clearance: "licensed",
    },
    status: "approved",
  },
  {
    id: "structure",
    index: "01",
    label: "Structure",
    caption: "Our own crew raises the canopies and clear-span structures on the prepared ground.",
    image: {
      id: "process-structure",
      src: "/media/process-structure.534fbe86.webp",
      width: 1600,
      height: 1200,
      alt: "A draped structure standing over a finished floor, mid fit-out.",
      focal: "center",
      clearance: "licensed",
    },
    status: "approved",
  },
  {
    id: "flooring",
    index: "02",
    label: "Flooring",
    caption: "Flooring and carpeting go down inside the structure, turning a frame into a room.",
    image: {
      id: "process-flooring",
      src: "/media/process-flooring.a11a90ab.webp",
      width: 1600,
      height: 1200,
      alt: "Carpet laid over levelled platform steps.",
      focal: "center",
      clearance: "licensed",
    },
    status: "approved",
  },
];

export const processIntro = {
  eyebrow: ["The making", "of an event"] as const,
  /**
   * Previously "How we plan and structure things?" — a question that is not
   * quite a question and reads as a translation. The section does not ask
   * anything; it shows the same site at three stages, so the heading states
   * that instead.
   */
  statement: [
    { text: "Three moves.\nBare ground to a " },
    { text: "finished venue", accent: true },
    { text: "." },
  ],
  /**
   * This line used to read "These three frames are one site — the same ground,
   * photographed as it was levelled, structured and floored." That was true of
   * the AICOG stills it was written for and is NOT true of the licensed
   * photography now in place. A caption that asserts something the pictures
   * above it do not support is the kind of small dishonesty a buyer notices, so
   * it states the sequence rather than claiming the provenance.
   */
  body: "Every build begins on the ground: survey and set-out, structure, then flooring. Each stage is completed and signed off before the next begins.",
};
