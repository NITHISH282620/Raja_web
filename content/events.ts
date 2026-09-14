import type { ImageAsset } from "./types";

/** Kept as an alias so existing imports keep working; the shape is the shared one. */
export type EventImage = ImageAsset;

export interface EventCategory {
  id: string;
  title: string;
  summary: string;
  image: EventImage;
  /**
   * Where the card goes.
   *
   * This section used to be a display case: four formats, real photography,
   * and no way out of it. The buyer who recognised their own event in one of
   * these cards had nowhere to click. Each now lands on the page written for
   * that kind of work, which is also what stopped this section and a separate
   * "Who we build for" grid from being two answers to the same question.
   */
  href: string;
}

export const eventsWeBuildFor: EventCategory[] = [
  {
    id: "national-programmes",
    title: "National Programmes",
    summary: "High-security infrastructure for Prime Ministerial visits and state inaugurations.",
    href: "/services/government-events",
    image: {
      src: "/media/projects/22-13-hampiutsav2024-whatsapp-image-2024-02-02-at-15-36-50-5e3f1cc5-jpg.webp",
      width: 1280,
      height: 720,
      alt: "The commissioning of ICGS Akshay at Goa Shipyard, ceremonial parade beneath a canopied dais.",
      clearance: "client-approved",
    },
  },
  {
    id: "mega-exhibitions",
    title: "Mega Exhibitions",
    summary: "Massive stall fabrications and pavilion builds for industrial trade fairs.",
    href: "/solutions/exhibitions-and-trade-fairs",
    image: {
      src: "/media/projects/07-05-ficci-eima-india-s-farm-equipment-market-to-grow-to-18-bn-by-2025-report.webp",
      width: 595,
      height: 336,
      alt: "A crowded outdoor trade-fair ground with exhibitor stands and agricultural machinery.",
      clearance: "client-approved",
    },
  },
  {
    id: "corporate-forums",
    title: "Corporate Forums",
    summary: "Plenary halls, staging, and VIP environments for global summits.",
    href: "/solutions/conferences-and-summits",
    image: {
      src: "/media/projects/05-04-firstcircle-fcexpo-3.webp",
      width: 547,
      height: 365,
      alt: "A wide conference hall with a lit stage, carpeted aisle and a full seated audience.",
      clearance: "client-approved",
    },
  },
  {
    id: "cultural-gatherings",
    title: "Cultural Gatherings",
    summary: "Open-air infrastructure and high-capacity audience seating for state festivals.",
    href: "/solutions/institutional-and-cultural-events",
    image: {
      src: "/media/projects/08-06-kanha-shanti-vanam-images.webp",
      width: 275,
      height: 183,
      alt: "A stadium-scale covered gathering seen from above, seating filled to the edges.",
      clearance: "client-approved",
    },
  },
];

export interface RecentExecution {
  slug: string;
  year: string;
  project: string;
  image: string;
  /** Controls grid placement: "tall" spans 2 rows, "wide" spans 2 cols, "normal" is 1x1 */
  size?: "tall" | "wide" | "normal";
}

export const recentExecutions: RecentExecution[] = [
  // Block A: 1x2 (Perfectly fills column)
  { slug: "ambedkar-jayanti", year: "2024", project: "Ambedkar Jayanti at Vidhana Soudha", image: "/media/projects/22-13-hampiutsav2024-whatsapp-image-2024-02-02-at-15-36-50-5e3f1cc5-jpg.webp", size: "tall" },
  
  // Block B: 2x1 + two 1x1 (Perfectly fills 2 columns)
  { slug: "vishwa-vokkaligara-mahasammelana", year: "2024", project: "Vishwa Vokkaligara Mahasammelana", image: "/media/projects/08-06-kanha-shanti-vanam-images.webp", size: "wide" },
  { slug: "collegedunia-learn-expo", year: "2024", project: "Collegedunia Learn Expo", image: "/media/events/eima-stall-frontage.ac25251f.webp" },
  { slug: "gte-expo", year: "2024", project: "GTE Expo (Garment Technology)", image: "/media/projects/07-05-ficci-eima-india-s-farm-equipment-market-to-grow-to-18-bn-by-2025-report.webp" },
  
  // Block A: 1x2 (Perfectly fills column)
  { slug: "kanha-shanti-vanam", year: "2024", project: "Kanha Shanti Vanam (Spiritual Gathering)", image: "/media/projects/08-06-kanha-shanti-vanam-images.webp", size: "tall" },
  
  // Block B: 2x1 + two 1x1 (Perfectly fills 2 columns)
  { slug: "biffes", year: "2024", project: "International Film Festival (BIFFES)", image: "/media/projects/05-04-firstcircle-fcexpo-3.webp", size: "wide" },
  { slug: "isgcon-bengaluru", year: "2024", project: "ISGCON Bengaluru", image: "/media/projects/02-02-isgcon-bengaluru-1764810125216.webp" },
  { slug: "tribe-vibe-fest", year: "2024", project: "Tribe Vibe Corporate Fest", image: "/media/projects/06-04-firstcircle-fcexpo-images-2.webp" },
  
  // Block C: two 1x1 (Perfectly fills column)
  { slug: "art-of-living-conference", year: "2024", project: "Art of Living \u2014 Human Values Conference", image: "/media/projects/01-01-artofliving-navaratri-g2aevntbcaam9cy.webp" },
  { slug: "dr-rajkumar-punya-smarane", year: "2025", project: "Dr. Rajkumar Punya Smarane", image: "/media/projects/02-02-isgcon-bengaluru-1764810125216.webp" },
  
  // Block A: 1x2 (Perfectly fills column)
  { slug: "suttur-jathra-mahotsava", year: "2025", project: "Suttur Jathra Mahotsava", image: "/media/projects/08-06-kanha-shanti-vanam-images.webp", size: "tall" },
];
