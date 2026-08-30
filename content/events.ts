export interface EventCategory {
  id: string;
  title: string;
  summary: string;
}

export const eventsWeBuildFor: EventCategory[] = [
  {
    id: "national-programmes",
    title: "National Programmes",
    summary: "High-security infrastructure for Prime Ministerial visits and state inaugurations.",
  },
  {
    id: "mega-exhibitions",
    title: "Mega Exhibitions",
    summary: "Massive stall fabrications and pavilion builds for industrial trade fairs.",
  },
  {
    id: "corporate-forums",
    title: "Corporate Forums",
    summary: "Plenary halls, staging, and VIP environments for global summits.",
  },
  {
    id: "cultural-gatherings",
    title: "Cultural Gatherings",
    summary: "Open-air infrastructure and high-capacity audience seating for state festivals.",
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
