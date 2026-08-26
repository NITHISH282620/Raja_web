import type { ImageAsset, Sourced } from "./types";

export interface ProcessStep extends Sourced {
  id: string;
  index: string;
  label: string;
  caption: string | null;
  image: ImageAsset | null;
}

const vidhanaSoudha: ImageAsset = {
  src: "/media/process-vidhana-soudha.webp",
  width: 900,
  height: 600,
  alt: "A large white hanger structure erected on the grounds in front of Vidhana Soudha.",
};

/**
 * "The making of an event" — the step-through sequence.
 *
 * Figma defines exactly THREE steps (00 empty, 01 structure, 02 flooring) and
 * gives all three the same photograph and the same caption. The labels imply a
 * longer build sequence (empty ground -> structure -> flooring -> staging ->
 * dressed), but no further steps, captions or photography were supplied, so the
 * three authored steps are reproduced as-is rather than extended.
 *
 * This section only works with one photograph of the SAME site at each stage.
 * That is the single most valuable missing asset in the whole design.
 */
export const processSteps: ProcessStep[] = [
  {
    id: "empty",
    index: "00",
    label: "Empty",
    caption: null,
    image: vidhanaSoudha,
    status: "pending",
    note: "Figma repeats the structure photograph and caption here. Needs a photograph of the bare ground before build.",
  },
  {
    id: "structure",
    index: "01",
    label: "Structure",
    caption: "Imported German hangers will be place to build the base structure",
    image: vidhanaSoudha,
    status: "provisional",
    note: "Caption is the only one authored in the file and is reused across all three steps. Grammar needs a pass.",
  },
  {
    id: "flooring",
    index: "02",
    label: "Flooring",
    caption: null,
    image: vidhanaSoudha,
    status: "pending",
    note: "Figma repeats the structure photograph and caption here. Needs a flooring-stage photograph and its own caption.",
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
