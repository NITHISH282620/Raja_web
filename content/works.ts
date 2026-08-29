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
    id: "aicog-2019",
    order: 0,
    published: true,
    featured: true,
    organization: "AICOG 2019 ’ All India Congress of Obstetrics & Gynaecology",
    eyebrow: "National congress & tent city",
    title: "AICOG 2019, Gayathri Vihar Complex",
    year: "2019",
    summary:
      "A full event city built from bare ground: land levelled and set out, clear-span German hangers and several hundred delegate Swiss tents erected, heavy-duty wooden decking and carpeting laid, exhibition stalls fabricated, and main stage lighting and audience seating delivered under one single contract.",
    hero: {
      id: "work-congress",
      src: "/media/work-congress.4850b520.webp",
      width: 1800,
      height: 1013,
      alt: "A vast arched event structure lit for a national programme, with the audience filling the ground in front of it.",
      focal: "center",
      clearance: "licensed",
    },
    gallery: [
      {
        id: "aicog-2019-tent-city-dawn",
        src: "/media/projects/aicog-2019-tent-city-dawn.webp",
        width: 1920,
        height: 1080,
        alt: "Aerial at dawn over several hundred white peaked tents in ordered rows.",
        clearance: "raja-original",
        credit: "Raja Enterprises",
      },
    ],
    video: null,
    logo: null,
    tint: "neutral",
    reverse: false,
    href: "/portfolio",
    status: "approved",
  },
  {
    id: "pm-dedication",
    order: 1,
    published: true,
    featured: true,
    organization: "Government of India & State Administration",
    eyebrow: "National programme & state dais",
    title: "Dedication to the Nation & Foundation Stone Ceremony",
    year: "2023",
    summary:
      "Ground infrastructure for the dedication and foundation stone laying of landmark public projects, inaugurated by the Hon'ble Prime Minister of India. Multi-tiered VIP dais, weatherproof German hangers, heavy-duty staging, and grand audience seating for over 25,000 attendees.",
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
    tint: "pink",
    reverse: true,
    href: "/portfolio",
    status: "approved",
  },
  {
    id: "ambedkar-jayanti",
    order: 2,
    published: true,
    featured: true,
    organization: "Government of Karnataka & Habitat Centre",
    eyebrow: "State ceremony & heritage forum",
    title: "Celebrating Ambedkar Jayanti at Vidhana Soudha",
    year: "2024",
    summary:
      "Complete ceremonial infrastructure at the iconic Vidhana Soudha: custom-fabricated stage pavilions, weatherproof canopy coverings, royal carpeting, dignitary protocols, and high-capacity public seating built to state protocol specifications.",
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
    tint: "yellow",
    reverse: false,
    href: "/portfolio",
    status: "approved",
  },
  {
    id: "isgcon-eima-agrimach",
    order: 3,
    published: true,
    featured: true,
    organization: "ISGCON Bengaluru & FICCI",
    eyebrow: "Trade expo & medical congress",
    title: "64th ISGCON & EIMA Agrimach Mega Trade Expo",
    year: "2024",
    summary:
      "End-to-end conference and industrial trade expo infrastructure: multi-track scientific plenary halls, over 150 octanorm and maxima exhibition stalls, live heavy machinery demo bays, digital registration counters, and turnkey acoustic flooring.",
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
    href: "/portfolio",
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