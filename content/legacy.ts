import type { ImageAsset, Sourced } from "./types";
import { yearsInOperation } from "./company";

/**
 * The "Since 1977" section: four decorative arcs with six event photographs
 * scattered along them.
 *
 * Coordinates are stored as percentages of the section box (1440 x 884)
 * so the whole composition scales as one unit.
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

/** 
 * Six curated event photography highlights proportioned and positioned
 * safely away from viewport edges:
 */
export const collage: CollagePhoto[] = [
  {
    id: "structural-hanger",
    left: 15.5,
    top: 1.5,
    width: 21.0,
    height: 19.0,
    image: {
      src: "/media/projects/2x/art-of-living-navaratri-2023.webp",
      width: 1280,
      height: 720,
      alt: "Aerial view of engineered German clear-span hangar structures.",
      clearance: "client-approved",
    },
  },
  {
    id: "national-congress",
    left: 65.5,
    top: 3.0,
    width: 21.0,
    height: 19.0,
    image: {
      src: "/media/projects/2x/isgcon-2023.webp",
      width: 800,
      height: 533,
      alt: "A lamp-lighting ceremony on a conference stage in front of a large printed backdrop.",
      clearance: "client-approved",
    },
  },
  {
    id: "exhibition-hall",
    left: 3.5,
    top: 34.5,
    width: 18.0,
    height: 21.0,
    image: {
      src: "/media/projects/2x/la-renon-company-event.webp",
      width: 1000,
      height: 603,
      alt: "A fabricated exhibition stall with branded fascia and machinery on display at an agricultural trade fair.",
      clearance: "client-approved",
    },
  },
  {
    id: "state-ceremony",
    left: 75.0,
    top: 39.5,
    width: 22.0,
    height: 23.0,
    image: {
      src: "/media/projects/2x/fc-expo-2024.webp",
      width: 1200,
      height: 800,
      alt: "Row after row of seated participants across an immense covered gathering.",
      clearance: "client-approved",
    },
  },
  {
    id: "tent-city-complex",
    left: 19.0,
    top: 63.5,
    width: 21.0,
    height: 22.0,
    image: {
      src: "/media/projects/2x/eima-agrimach-2024.webp",
      width: 1920,
      height: 1080,
      alt: "Aerial view of high-capacity event complex and temporary infrastructure.",
      clearance: "raja-original",
      credit: "Raja Enterprises",
    },
  },
  {
    id: "corporate-summit-stage",
    left: 54.0,
    top: 66.5,
    width: 22.0,
    height: 21.0,
    image: {
      src: "/media/projects/2x/kanha-shanti-vanam-tent-city.webp",
      width: 1800,
      height: 1350,
      alt: "An arched-fascia exhibition stall with visitors passing its frontage.",
      clearance: "client-approved",
    },
  },
];

/** The four arcs, with the bottom arc adjusted higher up into view. */
export const arcs: (Placed & { src: string })[] = [
  { src: "/vector/arc-1.svg", left: -5.764, top: -64.593, width: 111.528, height: 91.176 },
  { src: "/vector/arc-3.svg", left: -99.444, top: 2.149, width: 111.528, height: 91.176 },
  { src: "/vector/arc-4.svg", left: 88.472, top: 2.149, width: 111.528, height: 91.176 },
  { src: "/vector/arc-2.svg", left: -5.764, top: 69.5, width: 111.528, height: 91.176 },
];

export const legacyIntro: {
  eyebrow: readonly [string, string];
  statement: { text: string; accent?: boolean; id?: string }[];
} & Sourced = {
  eyebrow: [`${yearsInOperation()} years`, "thousands of builds"],
  statement: [
    { text: "Since " },
    { text: "1977", accent: true },
    { text: ",\nwe have built the ground\nIndia’s largest gatherings\nstand on." },
  ],
  status: "approved",
  note: "Year computed from the founding date so the figure cannot go stale.",
};