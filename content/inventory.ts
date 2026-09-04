import type { ImageAsset, Sourced } from "./types";

export type TileTint = "blue" | "yellow" | "green" | "pink" | "purple" | "neutral";

export interface InventoryTile extends Sourced {
  id: string;
  eyebrow: string;
  index: string;
  title: string;
  body: string | null;
  image: ImageAsset | null;
  tint: TileTint;
  /** Grid placement on the 1440 desktop bento, expressed as CSS grid lines. */
  area: { col: string; row: string };
  /** How the artwork sits in the tile — matches the Figma crop behaviour. */
  fit: "contain-bottom" | "cover" | "cover-scrim";
  /** Internal arrangement, read off the Figma tile geometry. */
  layout: "text-top" | "image-top" | "image-left" | "text-left" | "overlay";
  /** Text sits over the artwork rather than above it (catering tile). */
  overlay?: boolean;
}

/**
 * "What we deploy" — the six-tile bento.
 *
 * PHOTOGRAPHY, 2026-08-27: the six tiles previously carried AI-generated
 * isometric renders. They did not survive inspection — the stall render's
 * fascia panels read "EXHIBITION 2024" and "EXPO CONNECT" in malformed
 * lettering, and none of the six depicted equipment Raja actually owns. They
 * are replaced with photographs of the real thing, licensed under the Pexels
 * License (free for commercial use, no attribution required, modification
 * permitted). Source ids are recorded in `inventoryPhotoSources` below so any
 * one of them can be traced or re-licensed.
 *
 * These are ILLUSTRATIVE, not evidential: they show the category of equipment,
 * not Raja's own stock. The moment Raja uploads photographs of his own
 * inventory through the admin, they should replace these.
 *
 * Tile 05 is tagged `audience` but titled "Flooring & Platforms", identical to
 * tile 02. The artwork shows barricading and rows of chairs, so the title is
 * almost certainly wrong — flagged, not silently corrected.
 *
 * Tiles 03, 04 and 06 have no body copy at all in Figma. Tiles 01, 02 and 05
 * share one duplicated paragraph about clear-span hangers, which is only
 * accurate for tile 01.
 */
export const inventoryTiles: InventoryTile[] = [
  {
    id: "german-hangers",
    eyebrow: "Infrastructure",
    index: "01",
    title: "German Hangers & Structures",
    body:
      "Clear-span aluminium hangers imported for large-format deployment. Column-free interiors carry staging, seating and services without breaking a sightline, and the shell holds through monsoon weather.",
    image: {
      src: "/media/events/kanha-canopy-seating.7a22707d.webp",
      width: 516,
      height: 387,
      alt: "A wide clear-span canopy over rank upon rank of seating, open at the sides.",
      clearance: "client-approved",
    },
    tint: "blue",
    area: { col: "1 / 2", row: "1 / 3" },
    fit: "cover",
    layout: "text-top",
    status: "approved",
  },
  {
    id: "flooring-platforms",
    eyebrow: "Ground works",
    index: "02",
    title: "Flooring & Platforms",
    body:
      "Levelled wooden platforms and decking over a scaffold sub-frame, carpeted to finish. Ten lakh square feet in stock, laid across ground that is rarely flat to begin with.",
    image: {
      src: "/media/events/kanha-assembly-floor-aerial.da511112.webp",
      width: 837,
      height: 650,
      alt: "Aerial of a vast covered assembly floor laid out in patterned seating blocks.",
      clearance: "client-approved",
    },
    tint: "yellow",
    area: { col: "2 / 4", row: "1 / 2" },
    fit: "cover",
    layout: "image-left",
    status: "approved",
  },
  {
    id: "stalls-interiors",
    eyebrow: "Fabrication",
    index: "03",
    title: "Stalls & Interiors",
    body:
      "Octonorm and Maxima stall systems, fabricated, fitted with fascia and graphics, and struck to schedule. Fifteen thousand square metres in the fleet.",
    image: {
      src: "/media/events/larenon-stall-wide.ae5daaa7.webp",
      width: 1021,
      height: 605,
      alt: "A fabricated exhibition stall shell with printed panels and seating.",
      clearance: "client-approved",
    },
    tint: "green",
    area: { col: "2 / 3", row: "2 / 3" },
    fit: "cover",
    layout: "image-top",
    status: "approved",
  },
  {
    id: "lighting",
    eyebrow: "Lighting",
    index: "04",
    title: "Lighting",
    body:
      "Truss, rigging, stage lighting, line-array sound and LED fascia, specified and operated by our own technicians.",
    image: {
      src: "/media/inventory-lighting.25f99edf.webp",
      width: 1400,
      height: 788,
      alt: "Truss-mounted lighting and line-array speakers rigged above an open-air stage.",
      clearance: "licensed",
    },
    tint: "pink",
    area: { col: "3 / 4", row: "2 / 3" },
    fit: "cover",
    layout: "text-top",
    status: "approved",
  },
  {
    id: "audience-seating",
    eyebrow: "Audience",
    index: "05",
    title: "Flooring & Platforms",
    body:
      "Audience seating, barricading and crowd routing for gatherings from a few hundred to several thousand, set out to the sightlines the stage needs.",
    image: {
      src: "/media/events/kanha-canopy-interior.0403268d.webp",
      width: 515,
      height: 388,
      alt: "The interior of a tensile clear-span structure, its fabric roof carried on a steel frame.",
      clearance: "client-approved",
    },
    tint: "purple",
    area: { col: "1 / 3", row: "3 / 4" },
    fit: "cover",
    layout: "text-left",
    status: "approved",
    note: 'Title duplicates tile 02 but the tag reads "audience" and the artwork shows seating and barricading. Likely should be "Seating & Barricading" — not renamed without approval.',
  },
  {
    id: "scaffolding",
    eyebrow: "Access",
    index: "06",
    title: "Scaffolding & Access Structures",
    body:
      "Camera and broadcast platforms, lighting towers, raked seating decks, backdrops and entrance gantries — erected and struck by the same crew, on the same schedule as the structure they serve.",
    image: {
      src: "/media/events/eima-ground-dusk.284dd6b2.webp",
      width: 680,
      height: 451,
      alt: "An outdoor exhibition ground at dusk, machinery displays under exhibitor structures.",
      clearance: "client-approved",
    },
    tint: "neutral",
    area: { col: "9 / 13", row: "3 / 4" },
    fit: "cover",
    layout: "image-top",
    status: "provisional",
    note: "Scaffolding confirmed by Raja 2026-09-04. No tonnage, height or span figures supplied, so none are stated.",
  },
];

export const inventoryIntro = {
  eyebrow: ["What", "we deploy"] as const,
  statement: [
    { text: "Owned inventory. " },
    { text: "In-house", accent: true },
    { text: " crew. One contract." },
  ],
  cta: { label: "View full inventory", href: null as string | null },
};

/**
 * Provenance for the tile photography above.
 *
 * Pexels License: free for commercial and non-commercial use, no attribution
 * required, modification permitted. Recorded anyway — an image on a company's
 * own site should always be traceable to where it came from.
 */
export const inventoryPhotoSources = [
  { slug: "inventory-german-hanger", source: "pexels", id: "36839425", url: "https://www.pexels.com/photo/36839425/" },
  { slug: "inventory-wooden-floor", source: "pexels", id: "16820353", url: "https://www.pexels.com/photo/16820353/" },
  { slug: "inventory-octonorm-stalls", source: "pexels", id: "35138560", url: "https://www.pexels.com/photo/35138560/" },
  { slug: "inventory-lighting", source: "pexels", id: "12787862", url: "https://www.pexels.com/photo/12787862/" },
  { slug: "inventory-stage", source: "pexels", id: "16859956", url: "https://www.pexels.com/photo/16859956/" },
  { slug: "inventory-catering", source: "pexels", id: "29086309", url: "https://www.pexels.com/photo/29086309/" },
] as const;
