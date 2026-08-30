import type { Sourced, ContentStatus } from "./types";
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
 * Populated with verified event programmes across national congresses, state ceremonies,
 * mega trade expos, and high-capacity temporary city builds.
 */
export const projects: Project[] = [
  {
    id: "science-congress",
    order: 0,
    published: true,
    featured: true,
    organization: "University of Agricultural Sciences, Bangalore",
    eyebrow: "Mega-scale science congress",
    title: "107th Indian Science Congress",
    year: "2020",
    summary:
      "A massive temporary infrastructure build spanning multiple venues: monumental entry arches, clear-span German hangers for plenary sessions, grand staging and seating, structured exhibition areas, and operational infrastructure across the campus.",
    hero: {
      id: "work-congress",
      src: "/media/work-congress.4850b520.webp",
      width: 1800,
      height: 1013,
      alt: "A vast arched event structure lit for a national programme.",
      focal: "center",
      clearance: "licensed",
    },
    gallery: [],
    video: null,
    logo: null,
    tint: "neutral",
    reverse: false,
    href: null,
    status: "approved",
  },
  {
    id: "kempegowda-airport",
    order: 1,
    published: true,
    featured: true,
    organization: "Government of Karnataka",
    eyebrow: "Airport inauguration infrastructure",
    title: "Kempegowda International Airport Inauguration",
    year: "2023",
    summary:
      "Heavy-duty physical infrastructure supporting the high-profile inauguration of Terminal 2 and the Kempegowda Statue. Scope included massive clear-span hangers, levelled staging, premium event flooring, and high-security protocol environments.",
    hero: {
      id: "capability-structure",
      src: "/media/capability-structure.3aa80a08.webp",
      width: 1600,
      height: 1000,
      alt: "Clear-span German hanger and exhibition pavilion structure.",
      focal: "center",
      clearance: "licensed",
    },
    gallery: [],
    video: null,
    logo: null,
    tint: "pink",
    reverse: true,
    href: null,
    status: "approved",
  },
  {
    id: "pm-inauguration",
    order: 2,
    published: true,
    featured: true,
    organization: "Government of India & State Administration",
    eyebrow: "National programme execution",
    title: "PWD Programme / Hon'ble Prime Minister Inauguration",
    year: "2022",
    summary:
      "Complete ground infrastructure for landmark public projects inaugurated by the Hon'ble Prime Minister of India. Multi-tiered VIP dais, weatherproof German hangers, heavy-duty staging, and grand audience seating.",
    hero: {
      id: "work-ceremony",
      src: "/media/work-ceremony.24729b14.webp",
      width: 1800,
      height: 1013,
      alt: "A seated audience facing the stage at a formal national programme.",
      focal: "center",
      clearance: "licensed",
    },
    gallery: [],
    video: null,
    logo: null,
    tint: "yellow",
    reverse: false,
    href: null,
    status: "approved",
  },
  {
    id: "vishwa-kannada-sammelana",
    order: 3,
    published: true,
    featured: true,
    organization: "Government of Karnataka",
    eyebrow: "Historical scale & cultural gathering",
    title: "Vishwa Kannada Sammelana, Belgaum",
    year: "2011",
    summary:
      "A defining historical project demonstrating ultimate scale. End-to-end event infrastructure including colossal open-air stage builds, immense public seating arrangements, and vast exhibition environments for a landmark state gathering.",
    hero: {
      id: "capability-exhibition",
      src: "/media/capability-exhibition.4378e5d7.webp",
      width: 1600,
      height: 1000,
      alt: "Fabricated exhibition stalls and walkways inside a massive event hall.",
      focal: "center",
      clearance: "licensed",
    },
    gallery: [],
    video: null,
    logo: null,
    tint: "blue",
    reverse: true,
    href: null,
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
    { text: "You don’t see " },
    { text: "us.", accent: true },
    { text: "\nYou see what we " },
    { text: "build.", accent: true },
  ],
};