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
      src: "/media/capability-structure.3aa80a08.webp",
      width: 1600,
      height: 1000,
      alt: "Clear-span German hanger and exhibition pavilion structure.",
      clearance: "licensed",
    },
  },
  {
    id: "national-congress",
    left: 63.5,
    top: 7.5,
    width: 23.0,
    height: 21.0,
    image: {
      src: "/media/work-congress.4850b520.webp",
      width: 1800,
      height: 1013,
      alt: "National congress stage and seating for thousands of delegates.",
      clearance: "licensed",
    },
  },
  {
    id: "exhibition-hall",
    left: 3.5,
    top: 34.5,
    width: 18.0,
    height: 21.0,
    image: {
      src: "/media/capability-exhibition.4378e5d7.webp",
      width: 1600,
      height: 1000,
      alt: "Fabricated exhibition stalls and walkways inside a massive event hall.",
      clearance: "licensed",
    },
  },
  {
    id: "state-ceremony",
    left: 75.0,
    top: 39.5,
    width: 22.0,
    height: 23.0,
    image: {
      src: "/media/work-ceremony.24729b14.webp",
      width: 1800,
      height: 1013,
      alt: "Government dedication programme and high-capacity audience infrastructure.",
      clearance: "licensed",
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
      src: "/media/work-corporate.fca2ff69.webp",
      width: 1800,
      height: 1013,
      alt: "Illuminated stage and auditorium infrastructure for a mega event.",
      clearance: "licensed",
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