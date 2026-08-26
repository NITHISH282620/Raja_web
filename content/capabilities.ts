import type { ImageAsset, Sourced } from "./types";

export interface Capability extends Sourced {
  id: string;
  index: string;
  title: string;
  image: ImageAsset | null;
}

/**
 * The pinned horizontal carousel in "What we build".
 *
 * The Figma file contains exactly TWO slides — "Exhibition Design" (indexed 01)
 * and "Structural Build" (unindexed) — and both reuse the same photograph. The
 * section heading promises "Four elements", so two slides are missing along with
 * their imagery and indices.
 *
 * Not invented here. Add entries to this array and the carousel, its pin length,
 * and its index counter all follow automatically.
 */
export const capabilities: Capability[] = [
  {
    id: "exhibition-design",
    index: "01",
    title: "Exhibition Design",
    image: {
      src: "/media/capability-hanger-interior.webp",
      width: 1900,
      height: 1267,
      alt: "Interior of a clear-span hanger erected for an exhibition, with draped ceiling and audience seating below.",
    },
    status: "provisional",
    note: "Slide artwork is shared with the Structural Build slide — the file supplies only one photograph for the whole carousel.",
  },
  {
    id: "structural-build",
    index: "02",
    title: "Structural Build",
    image: {
      src: "/media/capability-hanger-interior.webp",
      width: 1900,
      height: 1267,
      alt: "Interior of a clear-span hanger erected for an exhibition, with draped ceiling and audience seating below.",
    },
    status: "provisional",
    note: "Unindexed in Figma; index 02 assigned by position. Artwork duplicated from slide 01.",
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
  note: 'Copy promises four elements but only two slides exist. The "460-person crew" figure conflicts with the 300+ field workforce stat.',
};
