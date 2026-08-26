import type { ImageAsset, Sourced } from "./types";

export interface Client extends Sourced {
  id: string;
  name: string;
  logo: ImageAsset;
  /** On-screen box for the logo inside the 130x100 tile, from Figma. */
  box: { width: number; height: number };
}

/**
 * The client logo field behind the closing CTA.
 *
 * Figma lays out an 18-tile grid (6 x 3) but contains only THREE unique logos,
 * repeated six times each to fill it. The three below are real; the remaining
 * fifteen slots are NOT filled with invented clients.
 *
 * `GRID_SLOTS` keeps the composition — the dense field is what the circular
 * spotlight mask reads against — while empty slots render as bare tiles. Add
 * real clients here and they fill the grid in order.
 */
export const clients: Client[] = [
  {
    id: "karnataka-govt",
    name: "Government of Karnataka",
    logo: {
      src: "/media/client-karnataka-govt.webp",
      width: 256,
      height: 256,
      alt: "Government of Karnataka emblem",
    },
    box: { width: 81, height: 81 },
    status: "approved",
  },
  {
    id: "collegedunia-learn",
    name: "Collegedunia Learn",
    logo: {
      src: "/media/client-collegedunia-learn.webp",
      width: 300,
      height: 170,
      alt: "Collegedunia Learn logo",
    },
    box: { width: 122, height: 69 },
    status: "approved",
  },
  {
    id: "government-of-india",
    name: "Government of India",
    logo: {
      src: "/media/client-government-of-india.webp",
      width: 300,
      height: 136,
      alt: "Government of India emblem",
    },
    box: { width: 112, height: 51 },
    status: "approved",
  },
];

/** 6 columns x 3 rows, as laid out in Figma. */
export const GRID_COLUMNS = 6;
export const GRID_ROWS = 3;
export const GRID_SLOTS = GRID_COLUMNS * GRID_ROWS;

export const clientsMeta = {
  status: "pending" as const,
  note: `Figma repeats 3 logos across ${GRID_SLOTS} tiles. ${GRID_SLOTS - clients.length} slots render empty pending the real client list.`,
};

export const closingCta = {
  eyebrow: "impressed?",
  statement: [
    { text: "Let’s build the ground " },
    { text: "your event stands", accent: true },
    { text: " on." },
  ],
  label: "Contact Us",
};
