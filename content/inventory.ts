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
    body: "Clear-span aluminium hangars imported for large-format deployment. Column-free interiors carry staging, seating and services without breaking a sightline, and the shell holds through monsoon weather.",
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
    id: "scaffolding",
    eyebrow: "Scaffolding",
    index: "02",
    title: "layer Ring lock Scaffolding",
    body: "Large Event Portable Stage and Concert Stage featuring a heavy-duty ringlock structure for safe, stable, and professional event setups.",
    image: {
      src: "/media/inventory-lighting.25f99edf.webp",
      width: 1400,
      height: 788,
      alt: "Scaffolding",
      clearance: "client-approved",
    },
    tint: "yellow",
    area: { col: "2 / 3", row: "1 / 3" },
    fit: "cover",
    layout: "image-top",
    status: "approved",
  },
  {
    id: "flooring-platforms",
    eyebrow: "Ground Works",
    index: "03",
    title: "Flooring & Platforms",
    body: "Levelled wooden platforms and decking over a scaffold sub-frame, carpeted to finish. Ten lakh square feet in stock, laid across ground that is rarely flat to begin with.",
    image: {
      src: "/media/events/kanha-assembly-floor-aerial.da511112.webp",
      width: 837,
      height: 650,
      alt: "Wooden Platforms",
      clearance: "client-approved",
    },
    tint: "yellow",
    area: { col: "1 / 2", row: "3 / 4" },
    fit: "cover",
    layout: "image-top",
    status: "approved",
  },
  {
    id: "lighting",
    eyebrow: "Lighting",
    index: "04",
    title: "Lighting",
    body: "Truss, rigging, stage lighting, line-array sound and LED fascia, specified and operated by our own technicians.",
    image: {
      src: "/media/inventory/lighting_av.jpg",
      width: 1024,
      height: 768,
      alt: "Lighting",
      clearance: "client-approved",
    },
    tint: "neutral",
    area: { col: "2 / 3", row: "3 / 4" },
    fit: "cover",
    layout: "image-top",
    status: "approved",
  },
  {
    id: "stalls-interiors",
    eyebrow: "Fabrication",
    index: "05",
    title: "Stalls & Interiors",
    body: "Octonorm and Maxima stall systems, fabricated, fitted with fascia and graphics, and struck to schedule. Fifteen thousand square metres in the fleet.",
    image: {
      src: "/media/events/larenon-stall-wide.ae5daaa7.webp",
      width: 1021,
      height: 605,
      alt: "Stalls & Interiors",
      clearance: "client-approved",
    },
    tint: "green",
    area: { col: "3 / 4", row: "3 / 4" },
    fit: "cover",
    layout: "image-top",
    status: "approved",
  },
  {
    id: "stage-seating",
    eyebrow: "Audience",
    index: "06",
    title: "Stage and Seating",
    body: "Audience seating, barricading and crowd routing for gatherings from a few hundred to several thousand, set out to the sightlines the stage needs.",
    image: {
      src: "/media/events/kanha-canopy-interior.0403268d.webp",
      width: 800,
      height: 600,
      alt: "Stage and Seating",
      clearance: "representative",
    },
    tint: "purple",
    area: { col: "4 / 5", row: "3 / 4" },
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
