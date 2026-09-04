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
 * Selected from Raja Enterprises' verified client/event list —
 * government inaugurations, international trade expos, cultural festivals,
 * and film festivals showcasing infrastructure scale.
 */
export const projects: Project[] = [
  {
    id: "kempegowda-airport",
    order: 0,
    published: true,
    featured: true,
    organization: "Government of Karnataka",
    eyebrow: "Government inauguration infrastructure",
    title: "Kempegowda International Airport Inauguration",
    year: "2023",
    summary:
      "Heavy-duty physical infrastructure supporting the high-profile inauguration of Terminal 2 and the Kempegowda Statue. Scope included massive clear-span German hangers, levelled staging, premium event flooring, high-security VIP protocol environments, and full AV staging for the ceremony.",
    hero: {
      id: "work-airport-inauguration",
      src: "/media/work-airport-inauguration.webp",
      width: 1800,
      height: 1200,
      alt: "Modern airport terminal interior with architectural infrastructure for the Kempegowda Airport inauguration event.",
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
    id: "eima-agrimach",
    order: 1,
    published: true,
    featured: true,
    organization: "Federation of Indian Chambers of Commerce & Industry (FICCI)",
    eyebrow: "International trade expo",
    title: "EIMA AGRIMACH 2024",
    year: "2024",
    summary:
      "End-to-end exhibition infrastructure for India\u2019s largest international agricultural machinery expo organized by FICCI. Massive German hanger pavilions, precision-levelled flooring across exhibition halls, Octonorm stall fabrication for 200+ exhibitors, and full AV staging for the inauguration ceremony.",
    hero: {
      id: "work-agrimach-expo",
      src: "/media/events/eima-delegates-stand.5c782f20.webp",
      width: 853,
      height: 470,
      alt: "Delegates beside a tractor on an exhibitor stand at an agricultural machinery fair.",
      focal: "center",
      clearance: "client-approved",
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
    id: "hampi-utsav",
    order: 2,
    published: true,
    featured: true,
    organization: "Karnataka State Habitat Centre",
    eyebrow: "Heritage cultural festival",
    title: "Hampi Utsav 2024",
    year: "2024",
    summary:
      "Open-air temporary infrastructure for Karnataka\u2019s flagship heritage festival at the UNESCO World Heritage Site. Grand outdoor stages, high-capacity audience seating, festival lighting rigs, exhibition pavilions, and full hospitality infrastructure \u2014 all built and dismantled without impact to the protected site.",
    hero: {
      id: "work-hampi-utsav",
      src: "/media/work-hampi-utsav.webp",
      width: 1800,
      height: 1200,
      alt: "A lit ceremonial stage at a night-time cultural festival.",
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
    id: "biffes",
    order: 3,
    published: true,
    featured: true,
    organization: "Karnataka Chalanachitra Academy",
    eyebrow: "International film festival",
    title: "17th Bengaluru International Film Festival",
    year: "2024",
    summary:
      "Full venue transformation for BIFFES \u2014 one of India\u2019s premier international film festivals. Multiple screening halls fitted with precision staging, VIP lounge environments, red-carpet infrastructure, branded entry arches, and delegate hospitality zones across the festival campus.",
    hero: {
      id: "work-film-festival",
      src: "/media/work-film-festival.webp",
      width: 1800,
      height: 1200,
      alt: "Cinema hall with professional stage lighting and audience seating for the Bengaluru International Film Festival.",
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
    { text: "You don\u2019t see " },
    { text: "us.", accent: true },
    { text: "\nYou see what we " },
    { text: "build.", accent: true },
  ],
};
