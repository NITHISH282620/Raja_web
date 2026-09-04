import type { ImageAsset } from "./types";

/** Kept as an alias so existing imports keep working; the shape is the shared one. */
export type EventImage = ImageAsset;

export interface EventCategory {
  id: string;
  title: string;
  summary: string;
  image: EventImage;
}

export const eventsWeBuildFor: EventCategory[] = [
  {
    id: "national-programmes",
    title: "National Programmes",
    summary: "High-security infrastructure for Prime Ministerial visits and state inaugurations.",
    image: {
      src: "/media/event-national-programme.webp",
      width: 1600,
      height: 1067,
      alt: "Grand stage and seating infrastructure for a national programme event",
      clearance: "licensed",
    },
  },
  {
    id: "mega-exhibitions",
    title: "Mega Exhibitions",
    summary: "Massive stall fabrications and pavilion builds for industrial trade fairs.",
    image: {
      src: "/media/event-mega-exhibition.webp",
      width: 1600,
      height: 1067,
      alt: "Large-scale exhibition hall with stalls and pavilions at a trade fair",
      clearance: "licensed",
    },
  },
  {
    id: "corporate-forums",
    title: "Corporate Forums",
    summary: "Plenary halls, staging, and VIP environments for global summits.",
    image: {
      src: "/media/event-corporate-forum.webp",
      width: 1600,
      height: 1067,
      alt: "Corporate summit with staging and audience seating in a conference hall",
      clearance: "licensed",
    },
  },
  {
    id: "cultural-gatherings",
    title: "Cultural Gatherings",
    summary: "Open-air infrastructure and high-capacity audience seating for state festivals.",
    image: {
      src: "/media/event-cultural-gathering.webp",
      width: 1600,
      height: 1067,
      alt: "Open-air cultural festival with large-scale lighting and crowd infrastructure",
      clearance: "licensed",
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
  { slug: "ambedkar-jayanti", year: "2024", project: "Ambedkar Jayanti at Vidhana Soudha", image: "/media/event-national-programme.webp", size: "tall" },
  
  // Block B: 2x1 + two 1x1 (Perfectly fills 2 columns)
  { slug: "vishwa-vokkaligara-mahasammelana", year: "2024", project: "Vishwa Vokkaligara Mahasammelana", image: "/media/event-cultural-gathering.webp", size: "wide" },
  { slug: "collegedunia-learn-expo", year: "2024", project: "Collegedunia Learn Expo", image: "/media/event-mega-exhibition.webp" },
  { slug: "gte-expo", year: "2024", project: "GTE Expo (Garment Technology)", image: "/media/work-agrimach-expo.webp" },
  
  // Block A: 1x2 (Perfectly fills column)
  { slug: "kanha-shanti-vanam", year: "2024", project: "Kanha Shanti Vanam (Spiritual Gathering)", image: "/media/work-hampi-utsav.webp", size: "tall" },
  
  // Block B: 2x1 + two 1x1 (Perfectly fills 2 columns)
  { slug: "biffes", year: "2024", project: "International Film Festival (BIFFES)", image: "/media/work-film-festival.webp", size: "wide" },
  { slug: "isgcon-bengaluru", year: "2024", project: "ISGCON Bengaluru", image: "/media/work-congress.4850b520.webp" },
  { slug: "tribe-vibe-fest", year: "2024", project: "Tribe Vibe Corporate Fest", image: "/media/work-corporate.fca2ff69.webp" },
  
  // Block C: two 1x1 (Perfectly fills column)
  { slug: "art-of-living-conference", year: "2024", project: "Art of Living \u2014 Human Values Conference", image: "/media/event-corporate-forum.webp" },
  { slug: "dr-rajkumar-punya-smarane", year: "2025", project: "Dr. Rajkumar Punya Smarane", image: "/media/work-krishimela.webp" },
  
  // Block A: 1x2 (Perfectly fills column)
  { slug: "suttur-jathra-mahotsava", year: "2025", project: "Suttur Jathra Mahotsava", image: "/media/work-ceremony.24729b14.webp", size: "tall" },
];
