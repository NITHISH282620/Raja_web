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
    body: "Clear-span aluminium hangers imported for large-format deployment. Column-free interiors take staging, seating and services without breaking sightlines, and the shell is weatherproof enough to",
    image: {
      src: "/media/inventory-german-hanger.webp",
      width: 500,
      height: 500,
      alt: "Isometric render of a clear-span aluminium hanger structure.",
    },
    tint: "blue",
    area: { col: "1 / 2", row: "1 / 3" },
    fit: "contain-bottom",
    layout: "text-top",
    status: "provisional",
    note: "Body copy is truncated mid-sentence in the Figma file ('weatherproof enough to').",
  },
  {
    id: "flooring-platforms",
    eyebrow: "Ground works",
    index: "02",
    title: "Flooring & Platforms",
    body: "Clear-span aluminium hangers imported for large-format deployment. Column-free interiors take staging, seating and services",
    image: {
      src: "/media/inventory-wooden-floor.webp",
      width: 500,
      height: 500,
      alt: "Isometric render of a raised wooden platform on a scaffold sub-frame with turf infill.",
    },
    tint: "yellow",
    area: { col: "2 / 4", row: "1 / 2" },
    fit: "contain-bottom",
    layout: "image-left",
    status: "provisional",
    note: "Body copy is duplicated from tile 01 and describes hangers, not flooring.",
  },
  {
    id: "stalls-interiors",
    eyebrow: "Fabrication",
    index: "03",
    title: "Stalls & Interiors",
    body: null,
    image: {
      src: "/media/inventory-octonorm-stalls.webp",
      width: 500,
      height: 500,
      alt: "Isometric render of an octonorm exhibition stall build with branded fascia panels.",
    },
    tint: "green",
    area: { col: "2 / 3", row: "2 / 3" },
    fit: "cover",
    layout: "image-top",
    status: "pending",
    note: "No body copy in the Figma file.",
  },
  {
    id: "lighting",
    eyebrow: "Lighting",
    index: "04",
    title: "Lighting",
    body: null,
    image: {
      src: "/media/inventory-lighting.webp",
      width: 640,
      height: 357,
      alt: "Isometric render of a truss lighting rig surrounding an LED stage wall.",
    },
    tint: "pink",
    area: { col: "3 / 4", row: "2 / 3" },
    fit: "cover",
    layout: "text-top",
    status: "pending",
    note: "No body copy in the Figma file.",
  },
  {
    id: "audience-seating",
    eyebrow: "Audience",
    index: "05",
    title: "Flooring & Platforms",
    body: "Clear-span aluminium hangers imported for large-format deployment. Column-free interiors take staging, seating and services",
    image: {
      src: "/media/inventory-stage.webp",
      width: 669,
      height: 373,
      alt: "Isometric render of an auditorium layout with barricading, rows of chairs and a stage with LED wall.",
    },
    tint: "purple",
    area: { col: "1 / 3", row: "3 / 4" },
    fit: "cover",
    layout: "text-left",
    status: "provisional",
    note: 'Title duplicates tile 02 but the tag reads "audience" and the artwork shows seating and barricading. Likely should be "Seating & Barricading" — not renamed without approval.',
  },
  {
    id: "catering",
    eyebrow: "Hospitality",
    index: "06",
    title: "Catering",
    body: null,
    image: {
      src: "/media/inventory-catering.webp",
      width: 640,
      height: 427,
      alt: "Buffet service laid out under a draped hanger during a large function.",
    },
    tint: "neutral",
    area: { col: "3 / 4", row: "3 / 4" },
    fit: "cover-scrim",
    layout: "overlay",
    overlay: true,
    status: "pending",
    note: "No body copy in the Figma file.",
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
