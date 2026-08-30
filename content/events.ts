import type { MediaAsset } from "./media";
export interface EventCategory {
  id: string;
  title: string;
  summary: string;
  image?: MediaAsset;
}

export const eventsWeBuildFor: EventCategory[] = [
  {
    id: "national-programmes",
    title: "National Programmes",
    summary: "High-security infrastructure for Prime Ministerial visits and state inaugurations.",
    image: { src: "/media/work-ceremony.24729b14.webp", width: 1800, height: 1013, alt: "National Programme" },
  },
  {
    id: "mega-exhibitions",
    title: "Mega Exhibitions",
    summary: "Massive stall fabrications and pavilion builds for industrial trade fairs.",
    image: { src: "/media/capability-exhibition.4378e5d7.webp", width: 1600, height: 1000, alt: "Mega Exhibition" },
  },
  {
    id: "corporate-forums",
    title: "Corporate Forums",
    summary: "Plenary halls, staging, and VIP environments for global summits.",
    image: { src: "/media/work-corporate.fca2ff69.webp", width: 1800, height: 1200, alt: "Corporate Forum" },
  },
  {
    id: "cultural-gatherings",
    title: "Cultural Gatherings",
    summary: "Open-air infrastructure and high-capacity audience seating for state festivals.",
    image: { src: "/media/legacy-aicog-2019.a98a8727.webp", width: 1600, height: 1000, alt: "Cultural Gathering" },
  },
];

export interface RecentExecution {
  year: string;
  project: string;
}

export const recentExecutions: RecentExecution[] = [
  { year: "2024", project: "Ambedkar Jayanti at Vidhana Soudha" },
  { year: "2024", project: "Vishwa Vokkaligara Mahasammelana" },
  { year: "2024", project: "Collegedunia Learn Expo" },
  { year: "2024", project: "Kanha Shanti Vanam (Spiritual Gathering)" },
  { year: "2024", project: "GTE Expo (Garment Technology)" },
  { year: "2024", project: "Art of Living - Human Values Conference" },
  { year: "2024", project: "International Film Festival (BIFFES)" },
  { year: "2024", project: "ISGCON Bengaluru" },
  { year: "2024", project: "Tribe Vibe Corporate Fest" },
  { year: "2025", project: "Suttur Jathra Mahotsava" },
  { year: "2025", project: "Dr. Rajkumar Punya Smarane" }
];
