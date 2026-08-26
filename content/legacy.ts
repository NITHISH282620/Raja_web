import type { ImageAsset, Sourced } from "./types";

/**
 * The "Since 1977" section: four decorative arcs with six event photographs
 * scattered along them.
 *
 * Figma positions every element absolutely inside the 1440 frame. Those
 * coordinates are stored here as percentages of the section box (1440 x 884)
 * so the whole composition scales as one unit instead of drifting apart, and
 * so a position can be nudged without touching the component.
 */
export const LEGACY_BOX = { width: 1440, height: 884 } as const;

export interface Placed {
  /** All values are % of LEGACY_BOX. */
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface CollagePhoto extends Placed {
  id: string;
  image: ImageAsset;
  /** Figma applies a horizontal flip to this layer. */
  flip?: boolean;
}

/** Order matters: it is the entrance stagger order authored in Figma. */
export const collage: CollagePhoto[] = [
  {
    id: "uttarakhand-gis",
    left: 18.264,
    top: 5.656,
    width: 22.431,
    height: 19.796,
    image: {
      src: "/media/legacy-uttarakhand-gis.webp",
      width: 700,
      height: 379,
      alt: "Dancers in formation before the Uttarakhand Global Investors Summit 2023 signage.",
    },
  },
  {
    id: "cm-authority-meeting",
    left: 65.486,
    top: 11.878,
    width: 21.111,
    height: 19.344,
    image: {
      src: "/media/legacy-cm-authority-meeting.webp",
      width: 700,
      height: 394,
      alt: "Dignitaries seated at a draped dais beneath a red welcome backdrop.",
    },
  },
  {
    id: "aicog-2019",
    left: -0.764,
    top: 36.765,
    width: 16.25,
    height: 19.796,
    image: {
      src: "/media/legacy-aicog-2019.webp",
      width: 700,
      height: 525,
      alt: "AICOG 2019 entrance signage set into a landscaped forecourt.",
    },
  },
  {
    id: "felicitation",
    left: 83.611,
    top: 44.118,
    width: 20.694,
    height: 22.398,
    image: {
      src: "/media/legacy-felicitation.webp",
      width: 700,
      height: 465,
      alt: "A felicitation ceremony on stage in front of a printed backdrop.",
    },
  },
  {
    id: "ambedkar-jayanti",
    left: 20.903,
    top: 66.516,
    width: 17.153,
    height: 30.09,
    flip: true,
    image: {
      src: "/media/legacy-ambedkar-jayanti.webp",
      width: 700,
      height: 752,
      alt: "Garlanded statue of Dr. B. R. Ambedkar dressed with floral tributes.",
    },
  },
  {
    id: "dsmax-anniversary",
    left: 54.375,
    top: 72.172,
    width: 20.625,
    height: 18.778,
    image: {
      src: "/media/legacy-dsmax-anniversary.webp",
      width: 700,
      height: 391,
      alt: "Award recipients on stage at the DS Max anniversary celebration.",
    },
  },
];

/** The four arcs, in Figma paint order. */
export const arcs: (Placed & { src: string })[] = [
  { src: "/vector/arc-1.svg", left: -5.764, top: -64.593, width: 111.528, height: 91.176 },
  { src: "/vector/arc-3.svg", left: -99.444, top: 2.149, width: 111.528, height: 91.176 },
  { src: "/vector/arc-4.svg", left: 88.472, top: 2.149, width: 111.528, height: 91.176 },
  { src: "/vector/arc-2.svg", left: -5.764, top: 81.335, width: 111.528, height: 91.176 },
];

export const legacyIntro: { eyebrow: readonly [string, string]; statement: { text: string; accent?: boolean }[] } & Sourced = {
  eyebrow: ["47 years", "thousands of builds"],
  statement: [
    { text: "Since 1977, Raja Enterprises has been " },
    { text: "building the", accent: true },
    { text: " physical environments where India's most " },
    { text: "important gatherings", accent: true },
    { text: " happen." },
  ],
  status: "provisional",
  note: 'The "47 years" eyebrow is hardcoded in Figma and already stale — rendered from the founding year instead.',
};
