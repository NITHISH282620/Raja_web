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
    left: 17.5,
    top: 4.5,
    width: 23.0,
    height: 21.0,
    image: {
      src: "/media/events/kanha-canopy-night.0c0ccba9.webp",
      width: 720,
      height: 1280,
      alt: "A tensile canopy structure lit from within at night.",
      clearance: "client-approved",
    },
  },
  {
    id: "national-congress",
    left: 63.5,
    top: 7.5,
    width: 23.0,
    height: 21.0,
    image: {
      src: "/media/events/isgcon-stage-lamp.5633cdec.webp",
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
      src: "/media/events/eima-mahindra-stall.526d34c1.webp",
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
      src: "/media/events/aol-assembly-rows.7e11d21d.webp",
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
      src: "/media/projects/aicog-2019-tent-city-dawn.webp",
      width: 1920,
      height: 1080,
      alt: "Aerial view of high-capacity event complex and temporary infrastructure.",
      clearance: "licensed",
    },
  },
  {
    id: "corporate-summit-stage",
    left: 54.0,
    top: 66.5,
    width: 22.0,
    height: 21.0,
    image: {
      src: "/media/events/larenon-stall-arch.0f7c47d8.webp",
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