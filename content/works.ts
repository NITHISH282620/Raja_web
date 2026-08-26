import type { ImageAsset, Sourced } from "./types";

export interface Work extends Sourced {
  id: string;
  eyebrow: string;
  title: string;
  /** null renders <Placeholder> rather than inventing a case study. */
  summary: string | null;
  image: ImageAsset | null;
  tint: "pink" | "yellow" | "blue" | "purple" | "green" | "neutral";
  /** Figma alternates image-left / image-right down the stack. */
  reverse: boolean;
  href: string | null;
}

/**
 * The four scroll-stacked case study cards.
 *
 * In Figma all four cards carry IDENTICAL content — same eyebrow, same title,
 * same ₹3,600 crore body, same photograph. Only the first is real. The three
 * project names below come from earlier hidden frames in the same file
 * ("Celebrating Ambedkar Jayanti at Vidhana Soudha", "107th Indian Science
 * Congress", "DS Max Anniversary 2023"), so they are recovered, not invented —
 * but no copy or photography was supplied for any of them.
 */
export const works: Work[] = [
  {
    id: "pm-dedication",
    eyebrow: "National programme",
    title: "Dedication to the Nation & foundation stone laying",
    summary:
      "Ground infrastructure for the dedication and foundation stone laying of projects worth over ₹3,600 crore, inaugurated by the Hon'ble Prime Minister of India. Hanger, dais, staging and audience seating under one contract.",
    image: {
      src: "/media/work-pm-dedication.webp",
      width: 1250,
      height: 563,
      alt: "The Prime Minister addressing a gathering from a covered dais built for the foundation stone laying ceremony.",
    },
    tint: "pink",
    reverse: false,
    href: null,
    status: "approved",
  },
  {
    id: "ambedkar-jayanti",
    eyebrow: "State ceremony",
    title: "Celebrating Ambedkar Jayanti at Vidhana Soudha",
    summary: null,
    image: {
      src: "/media/legacy-ambedkar-jayanti.webp",
      width: 700,
      height: 752,
      alt: "Garlanded statue of Dr. B. R. Ambedkar dressed with floral tributes for Ambedkar Jayanti.",
    },
    tint: "yellow",
    reverse: true,
    href: null,
    status: "pending",
    note: "Title recovered from a hidden Figma frame. No summary copy or dedicated photography supplied; image borrowed from the legacy collage.",
  },
  {
    id: "indian-science-congress",
    eyebrow: "National conference",
    title: "107th Indian Science Congress",
    summary: null,
    image: null,
    tint: "yellow",
    reverse: true,
    href: null,
    status: "pending",
    note: "Title recovered from a hidden Figma frame. No summary copy and no photograph exists in the file.",
  },
  {
    id: "dsmax-anniversary",
    eyebrow: "Corporate",
    title: "DS Max Anniversary 2023",
    summary: null,
    image: {
      src: "/media/legacy-dsmax-anniversary.webp",
      width: 700,
      height: 391,
      alt: "Award recipients on stage at the DS Max anniversary celebration.",
    },
    tint: "blue",
    reverse: false,
    href: null,
    status: "pending",
    note: "Title recovered from a hidden Figma frame. No summary copy supplied; image borrowed from the legacy collage.",
  },
];

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
