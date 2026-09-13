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
  area: { col: string; row: string };
  fit: "contain-bottom" | "cover" | "cover-scrim";
  layout: "text-top" | "image-top" | "image-left" | "text-left" | "overlay";
  overlay?: boolean;
}

export const inventoryTiles: InventoryTile[] = [
  {
    id: "german-hangers",
    eyebrow: "Infrastructure",
    index: "01",
    title: "German Hangars & Structures",
    body: "Imported aluminum clear-span hangars for large-scale events.",
    image: {
      src: "/media/events/german-hanger-aerial.webp",
      width: 1280,
      height: 720,
      alt: "German Hangars",
      clearance: "client-approved",
    },
    tint: "blue",
    area: { col: "1 / 2", row: "1 / 3" },
    fit: "cover",
    layout: "text-top",
    status: "approved",
  },
  {
    id: "wooden-platforms",
    eyebrow: "Ground Works",
    index: "02",
    title: "Wooden Platforms & Flooring",
    body: "Company-owned fleet for heavy-duty substructure and premium finishes.",
    image: {
      src: "/media/events/kanha-assembly-floor-aerial.da511112.webp",
      width: 837,
      height: 650,
      alt: "Wooden Platforms",
      clearance: "client-approved",
    },
    tint: "yellow",
    area: { col: "2 / 4", row: "1 / 2" },
    fit: "cover",
    layout: "image-left",
    status: "approved",
  },
  {
    id: "octonorm-stalls",
    eyebrow: "Fabrication",
    index: "03",
    title: "Octonorm Exhibition Stalls",
    body: "Flexible and modular stalls for trade shows and expos.",
    image: {
      src: "/media/events/larenon-stall-wide.ae5daaa7.webp",
      width: 1021,
      height: 605,
      alt: "Octonorm Stalls",
      clearance: "client-approved",
    },
    tint: "green",
    area: { col: "2 / 3", row: "2 / 3" },
    fit: "cover",
    layout: "image-top",
    status: "approved",
  },
  {
    id: "maxima-stalls",
    eyebrow: "Fabrication",
    index: "04",
    title: "Maxima Exhibition Stalls",
    body: "Premium modular stalls with elegant design and branding flexibility.",
    image: {
      src: "/media/representative/inventory-fleet.13f2e483.webp",
      width: 1021,
      height: 605,
      alt: "Maxima Stalls",
      clearance: "representative",
    },
    tint: "pink",
    area: { col: "3 / 4", row: "2 / 3" },
    fit: "cover",
    layout: "text-top",
    status: "provisional",
  },
  {
    id: "staging-dais",
    eyebrow: "Staging",
    index: "05",
    title: "Staging & Dais",
    body: "Modular stages, VIP dais, ramps and stage infrastructure for all event types.",
    image: {
      src: "/media/inventory-stage.b737c675.webp",
      width: 800,
      height: 600,
      alt: "Staging & Dais",
      clearance: "representative",
    },
    tint: "purple",
    area: { col: "1 / 3", row: "3 / 4" },
    fit: "cover",
    layout: "text-left",
    status: "approved",
  },
  {
    id: "seating-solutions",
    eyebrow: "Audience",
    index: "06",
    title: "Seating Solutions",
    body: "Wide range of seating including plastic chairs, cushioned chairs and premium VIP seating.",
    image: {
      src: "/media/events/kanha-canopy-interior.0403268d.webp",
      width: 800,
      height: 600,
      alt: "Seating Solutions",
      clearance: "representative",
    },
    tint: "neutral",
    area: { col: "3 / 4", row: "3 / 4" },
    fit: "cover",
    layout: "image-top",
    status: "provisional",
  },
];

export const inventoryIntro = {
  eyebrow: ["What", "we deploy"] as const,
  statement: [
    { text: "Owned inventory. " },
    { text: "In-house", accent: true },
    { text: " crew. One contract." },
  ],
  cta: { label: "View full inventory", href: "/inventory" as string | null },
};

export const inventoryPhotoSources = [
  { slug: "inventory-german-hanger", source: "pexels", id: "36839425", url: "https://www.pexels.com/photo/36839425/" },
  { slug: "inventory-wooden-floor", source: "pexels", id: "16820353", url: "https://www.pexels.com/photo/16820353/" },
  { slug: "inventory-octonorm-stalls", source: "pexels", id: "35138560", url: "https://www.pexels.com/photo/35138560/" },
  { slug: "inventory-lighting", source: "pexels", id: "12787862", url: "https://www.pexels.com/photo/12787862/" },
  { slug: "inventory-stage", source: "pexels", id: "16859956", url: "https://www.pexels.com/photo/16859956/" },
  { slug: "inventory-catering", source: "pexels", id: "29086309", url: "https://www.pexels.com/photo/29086309/" },
] as const;
