import type { ContentStatus } from "./types";
import type { MediaAsset, VideoAsset } from "./media";

export interface Project {
  id: string;
  order: number;
  published: boolean;
  featured: boolean;

  organization: string;
  eyebrow: string;
  title: string;
  year: string;
  summary: string | null;

  hero: MediaAsset | null;
  gallery: MediaAsset[];
  video: VideoAsset | null;
  logo: MediaAsset | null;

  tint: "pink" | "yellow" | "blue" | "purple" | "green" | "neutral";
  /** Figma alternates image-left / image-right down the stack. */
  reverse: boolean;
  href: string | null;

  status: ContentStatus;
  note?: string;
}

/**
 * The four scroll-stacked case study cards.
 *
 * CHOSEN FOR EVIDENCE, 2026-09-04. These were previously four projects carrying
 * licensed stock — the Kempegowda Airport card was illustrated with a stock
 * photograph of an Air Canada aircraft in flight, which shows neither an
 * airport terminal nor any infrastructure Raja built, for a project that
 * appears neither on Raja's supplied schedule nor on Raja's own website.
 *
 * The four here are the engagements Raja has actually supplied photographs of.
 * The homepage's flagship proof section now shows real work.
 * Selected from Raja Enterprises' verified client/event list —
 * government inaugurations, international trade expos, cultural festivals,
 * and film festivals showcasing infrastructure scale.
 */
export const projects: Project[] = [
  {
    id: "kanha-shanti-vanam",
    order: 0,
    published: true,
    featured: true,
    organization: "Kanha Shanti Vanam",
    eyebrow: "Clear-span structures & flooring",
    title: "Tent City, Kanha Shanti Vanam",
    year: "2024",
    summary:
      "Clear-span cover and levelled flooring for an assembly of many thousands — column-free across the full floor plate, with seating, services and circulation planned into the same scope.",
    hero: {
      id: "work-kanha",
      src: "/media/events/kanha-canopy-assembly-aerial.56be51e1.webp",
      width: 644,
      height: 388,
      alt: "Aerial view over an immense clear-span canopy sheltering a seated assembly of many thousands.",
      focal: "center",
      clearance: "client-approved",
    },
    gallery: [],
    video: null,
    logo: null,
    tint: "blue",
    reverse: false,
    href: "/projects",
    status: "approved",
  },
  {
    id: "eima-agrimach",
    order: 1,
    published: true,
    featured: true,
    organization: "Federation of Indian Chambers of Commerce & Industry (FICCI)",
    eyebrow: "Exhibition infrastructure",
    title: "EIMA Agrimach 2024",
    year: "2024",
    summary:
      "Exhibition ground build for an international agricultural machinery fair — fabricated stands, fascia and flooring across an open site carrying heavy machinery displays.",
    hero: {
      id: "work-agrimach-expo",
      src: "/media/events/eima-expo-crowd.11d4b8f2.webp",
      width: 595,
      height: 336,
      alt: "A crowded outdoor trade-fair ground with exhibitor stands and agricultural machinery.",
      focal: "center",
      clearance: "client-approved",
    },
    gallery: [],
    video: null,
    logo: null,
    tint: "pink",
    reverse: true,
    href: "/projects",
    status: "approved",
  },
  {
    id: "la-renon",
    order: 2,
    published: true,
    featured: true,
    organization: "La Renon Healthcare",
    eyebrow: "Stall fabrication",
    title: "La Renon Exhibition Stalls",
    year: "",
    summary:
      "Fabricated exhibition stalls: branded shell, printed fascia panels, product display counters, lighting and seating, delivered against the exhibitor's own opening date.",
    hero: {
      id: "work-larenon",
      src: "/media/events/larenon-stall-counter.33e301ef.webp",
      width: 1800,
      height: 1468,
      alt: "An exhibition stall interior: branded back wall, display counters, seating and planting.",
      focal: "center",
      clearance: "client-approved",
    },
    gallery: [],
    video: null,
    logo: null,
    tint: "yellow",
    reverse: false,
    href: "/projects",
    status: "approved",
  },
  {
    id: "art-of-living",
    order: 3,
    published: true,
    featured: true,
    organization: "The Art of Living Trust",
    eyebrow: "Mass-gathering infrastructure",
    title: "Navaratri Function",
    year: "2023",
    summary:
      "Infrastructure for a mass gathering — covered assembly, flooring and staging laid out for participants numbering in the tens of thousands.",
    hero: {
      id: "work-aol",
      src: "/media/events/aol-assembly-rows.7e11d21d.webp",
      width: 1200,
      height: 800,
      alt: "Row after row of seated participants across an immense covered gathering.",
      focal: "center",
      clearance: "client-approved",
    },
    gallery: [],
    video: null,
    logo: null,
    tint: "purple",
    reverse: true,
    href: "/projects",
    status: "approved",
  },
];


/* -------------------------------------------------------------------------
   Selectors
   ------------------------------------------------------------------------- */

/** Published projects, featured first, then by order. */
export function publishedProjects(): Project[] {
  return projects
    .filter((p) => p.published)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);
}

export const featuredProjects = (limit = 4): Project[] => publishedProjects().slice(0, limit);

export const worksIntro = {
  eyebrow: ["notable", "works"] as const,
  statement: [
    { text: "You don\u2019t see " },
    { text: "us.", accent: true },
    { text: "\nYou see what we " },
    { text: "build.", accent: true },
  ],
};
