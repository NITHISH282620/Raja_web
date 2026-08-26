import type { ContentStatus } from "./types";
import { publishable, publishableList, type MediaAsset, type VideoAsset } from "./media";

export type TintName = "pink" | "yellow" | "blue" | "purple" | "green" | "neutral";

/**
 * A project record.
 *
 * This is the shape an admin panel edits. Everything the UI needs is here:
 * ordering, publish state, featured state, hero, gallery, video and logo.
 * Sections read through the selectors at the bottom of this file and never
 * reach for a file path, so media can be replaced or reordered entirely from
 * data.
 */
export interface Project {
  id: string;
  /** Display order. Lower first. An admin panel reorders by editing this. */
  order: number;
  /** Unpublished projects never render. */
  published: boolean;
  /** Featured projects lead the section. */
  featured: boolean;

  organization: string;
  eyebrow: string;
  title: string;
  year: string;
  /** null renders <Placeholder> rather than inventing a case study. */
  summary: string | null;

  hero: MediaAsset | null;
  gallery: MediaAsset[];
  video: VideoAsset | null;
  logo: MediaAsset | null;

  tint: TintName;
  /** Figma alternates image-left / image-right down the stack. */
  reverse: boolean;
  href: string | null;

  status: ContentStatus;
  note?: string;
}

/**
 * The four scroll-stacked case study cards.
 *
 * In Figma all four carry IDENTICAL content — same eyebrow, title, body and
 * photograph. Only the first is real. The three project names below come from
 * earlier hidden frames in the same file, so they are recovered rather than
 * invented, but no copy or photography was supplied for any of them.
 *
 * Every image here is `figma-supplied` — the client's own material, arriving
 * through the approved design file. Photographs gathered during research are
 * deliberately absent: EXIF analysis showed none of them are Raja originals,
 * so they are held in client-gallery as reference and are not publishable.
 */
export const projects: Project[] = [
  {
    id: "aicog-2019",
    order: 0,
    published: true,
    featured: true,
    organization: "AICOG 2019 — All India Congress of Obstetrics & Gynaecology",
    eyebrow: "National congress",
    title: "AICOG 2019, Gayathri Vihar",
    year: "2019",
    summary:
      "A full event city built from bare ground: land levelled and set out, clear-span hangers and several hundred delegate tents erected, flooring and carpeting laid, exhibition stalls fabricated, and staging, lighting and audience seating delivered under one contract.",
    hero: {
      id: "aicog-2019-hanger-complex-aerial",
      src: "/media/projects/aicog-2019-hanger-complex-aerial.webp",
      width: 1800,
      height: 1013,
      alt: "Aerial view of the AICOG 2019 clear-span hanger complex, white roofs over green flooring.",
      focal: "center",
      clearance: "raja-original",
      credit: "Raja Enterprises",
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
      {
        id: "aicog-2019-hanger-erection",
        src: "/media/projects/aicog-2019-hanger-erection.webp",
        width: 1800,
        height: 1013,
        alt: "Raja Enterprises crew raising a canopy over its frame on site.",
        clearance: "raja-original",
        credit: "Raja Enterprises",
      },
      {
        id: "aicog-2019-exhibition-stalls",
        src: "/media/projects/aicog-2019-exhibition-stalls.webp",
        width: 1800,
        height: 1013,
        alt: "Exhibition aisle lined with fabricated stalls under a hanger roof.",
        clearance: "raja-original",
        credit: "Raja Enterprises",
      },
      {
        id: "aicog-2019-vip-lounge",
        src: "/media/projects/aicog-2019-vip-lounge.webp",
        width: 1600,
        height: 900,
        alt: "Finished VIP lounge interior with panelled ceiling, downlights and carpeting.",
        clearance: "raja-original",
        credit: "Raja Enterprises",
      },
    ],
    video: {
      id: "aicog-2019-tent-city-loop",
      src: "/video/aicog-2019-tent-city.mp4",
      width: 1280,
      height: 720,
      description: "Aerial drift over the AICOG 2019 tent city at dawn.",
      clearance: "raja-original",
      credit: "Raja Enterprises",
    },
    logo: null,
    tint: "neutral",
    reverse: false,
    href: null,
    status: "approved",
    note: "The only project on the list with verified Raja execution evidence: sourced from Raja's own project film, watermarked throughout and ending on the card 'Infrastructure provided by Raja Enterprises'.",
  },
  {
    id: "pm-dedication",
    order: 1,
    published: true,
    featured: true,
    organization: "Government of India",
    eyebrow: "National programme",
    title: "Dedication to the Nation & foundation stone laying",
    year: "",
    summary:
      "Ground infrastructure for the dedication and foundation stone laying of projects worth over ₹3,600 crore, inaugurated by the Hon'ble Prime Minister of India. Hanger, dais, staging and audience seating under one contract.",
    hero: {
      id: "work-pm-dedication",
      src: "/media/work-pm-dedication.webp",
      width: 1250,
      height: 563,
      alt: "The Prime Minister addressing a gathering from a covered dais built for the foundation stone laying ceremony.",
      clearance: "figma-supplied",
    },
    gallery: [],
    video: null,
    logo: null,
    tint: "pink",
    reverse: false,
    href: null,
    status: "approved",
  },
  {
    id: "ambedkar-jayanti",
    order: 2,
    published: true,
    featured: false,
    organization: "Government of Karnataka",
    eyebrow: "State ceremony",
    title: "Celebrating Ambedkar Jayanti at Vidhana Soudha",
    year: "",
    summary: null,
    hero: {
      id: "legacy-ambedkar-jayanti",
      src: "/media/legacy-ambedkar-jayanti.webp",
      width: 700,
      height: 752,
      alt: "Garlanded statue of Dr. B. R. Ambedkar dressed with floral tributes for Ambedkar Jayanti.",
      focal: "center",
      clearance: "figma-supplied",
    },
    gallery: [],
    video: null,
    logo: null,
    tint: "yellow",
    reverse: true,
    href: null,
    status: "pending",
    note: "Title recovered from a hidden Figma frame. No summary copy or dedicated photography supplied; image borrowed from the legacy collage.",
  },
  {
    id: "indian-science-congress",
    order: 3,
    published: true,
    featured: false,
    organization: "Indian Science Congress Association",
    eyebrow: "National conference",
    title: "107th Indian Science Congress",
    year: "",
    summary: null,
    hero: null,
    gallery: [],
    video: null,
    logo: null,
    tint: "yellow",
    reverse: true,
    href: null,
    status: "pending",
    note: "Title recovered from a hidden Figma frame. No summary copy and no photograph exists in the file. NOTE: this is NOT the same event as ISGCON 2023 (Indian Society of Gastroenterology) in the client dossier — do not substitute that imagery.",
  },
  {
    id: "dsmax-anniversary",
    order: 4,
    published: true,
    featured: false,
    organization: "DS Max Properties",
    eyebrow: "Corporate",
    title: "DS Max Anniversary 2023",
    year: "2023",
    summary: null,
    hero: {
      id: "legacy-dsmax-anniversary",
      src: "/media/legacy-dsmax-anniversary.webp",
      width: 700,
      height: 391,
      alt: "Award recipients on stage at the DS Max anniversary celebration.",
      clearance: "figma-supplied",
    },
    gallery: [],
    video: null,
    logo: null,
    tint: "blue",
    reverse: false,
    href: null,
    status: "pending",
    note: "Title recovered from a hidden Figma frame. No summary copy supplied; image borrowed from the legacy collage.",
  },
];

/* -------------------------------------------------------------------------
   Selectors — the only way sections should reach project data.
   ------------------------------------------------------------------------- */

/** Published projects, featured first, then by order. */
export function publishedProjects(): Project[] {
  return projects
    .filter((p) => p.published)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
    .map((p) => ({
      ...p,
      hero: publishable(p.hero),
      gallery: publishableList(p.gallery),
      video: publishable(p.video),
      logo: publishable(p.logo),
    }));
}

export const featuredProjects = (limit = 4): Project[] => publishedProjects().slice(0, limit);

export const worksIntro = {
  eyebrow: ["notable", "works"] as const,
  statement: [
    { text: "You don’t " },
    { text: "see", accent: true },
    { text: " " },
    { text: "us.", accent: true },
    { text: "\nyou see what we " },
    { text: "build", accent: true },
  ],
};
