import type { Sourced } from "./types";

/**
 * The canonical project record.
 *
 * ONE MODEL, replacing three. Until now the same real-world work was described
 * by `works.Project` (4), `notableEvents.NotableEvent` (7) and
 * `events.RecentExecution` (11) in incompatible shapes, only one of which the
 * client could edit, and with almost no overlap between them.
 *
 * SOURCE OF TRUTH is the 27-event schedule Raja supplied (client name and event
 * title, verbatim apart from the normalisations noted below). Every row here
 * traces to a line on that schedule.
 *
 * WHAT IS DELIBERATELY ABSENT. The retired `notableEvents` model carried
 * attendance figures, covered areas, turnaround windows and security
 * classifications — "50,000+ Dignitaries & Citizens", "1,50,000 Sq. Ft.",
 * "48 Hours Turnkey", "Z+ & SPG High-Security Protocol". None of it appears on
 * Raja's schedule, and unlike every other module in `content/` those records
 * carried no `status` and no source note. Publishing an unverifiable SPG or Z+
 * protocol claim for a government ceremony is the single most damaging thing
 * this site could assert, so those fields are not carried over. They return the
 * moment Raja supplies them.
 *
 * NORMALISATIONS applied to the schedule, so they can be checked against it:
 *   "KHANHA SHANTI VANAM"        -> "Kanha Shanti Vanam"
 *   "BANAGLORE"                  -> "Bengaluru"
 *   "ORGANAIZATION"              -> "Organisation"
 *   "CENTRAL SILK BORAD"         -> "Central Silk Board"
 *   "KRISHIMELA"                 -> "Krishi Mela"
 *   "VALMIKI JAYANTHI"           -> "Valmiki Jayanti"
 *   "Dr BABU JAGAJEEVAN RAM"     -> "Dr Babu Jagjivan Ram"
 * Organisation names are set as each body writes its own. Nothing has been
 * added, dropped or reordered.
 */

export type ProjectCategory =
  | "government"
  | "exhibition"
  | "conference"
  | "cultural"
  | "corporate"
  | "social";

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  government: "Government & public sector",
  exhibition: "Exhibitions & trade fairs",
  conference: "Conferences & congresses",
  cultural: "Cultural & religious",
  corporate: "Corporate",
  social: "Weddings & social",
};

export interface Project extends Sourced {
  id: string;
  /** The commissioning body, as it writes its own name. */
  client: string;
  /** The event, as titled on Raja's schedule. */
  event: string;
  /** Null where the schedule does not state one. Never inferred. */
  year: string | null;
  /** Null where the schedule does not state one. */
  location: string | null;
  category: ProjectCategory;
  /**
   * Free-text scope. Null until Raja supplies it — there is no honest way to
   * derive what was built from an event title alone.
   */
  scope: string | null;
  /** Slugs from `content/services.ts`, only where the event type makes it certain. */
  services: string[];
  /** Raja-original or client-approved media only. Representative media never attaches here. */
  media: [];
  published: boolean;
  featured: boolean;
  order: number;
}

const P = (
  id: string,
  client: string,
  event: string,
  year: string | null,
  category: ProjectCategory,
  services: string[],
  location: string | null = null,
  featured = false,
): Project => ({
  id,
  client,
  event,
  year,
  location,
  category,
  scope: null,
  services,
  media: [],
  published: true,
  featured,
  order: 0,
  status: "approved",
  note: "Client and event title from Raja's supplied 27-event schedule. Scope, area, attendance and photographs not yet supplied.",
});

/** All 27 rows of Raja's schedule, in the order supplied. */
export const projects: Project[] = [
  P("art-of-living-navaratri-2023", "The Art of Living Trust", "Navaratri Function 2023", "2023", "cultural", ["german-hangers", "event-flooring", "staging-and-seating"], "Bengaluru", true),
  P("isgcon-2023", "Indian Society of Gastroenterology", "ISGCON 2023 — 64th Annual Congress", "2023", "conference", ["german-hangers", "staging-and-seating", "exhibition-stalls"], "Bengaluru"),
  P("la-renon-company-event", "La Renon Healthcare", "Company event", null, "corporate", ["staging-and-seating"]),
  P("fc-expo-2024", "First Circle Biztech", "FC Expo 2024", "2024", "exhibition", ["exhibition-stalls", "event-flooring"], "Bengaluru"),
  P("eima-agrimach-2024", "Federation of Indian Chambers of Commerce & Industry (FICCI)", "EIMA Agrimach 2024", "2024", "exhibition", ["german-hangers", "exhibition-stalls", "event-flooring"], "Bengaluru", true),
  P("kanha-shanti-vanam-tent-city", "Kanha Shanti Vanam", "Tent city, Bengaluru", null, "cultural", ["german-hangers", "event-flooring"], "Bengaluru"),
  P("abs-education-fair", "ABS Business Solutions", "Education fair", null, "exhibition", ["exhibition-stalls"], "Bengaluru"),
  P("collegedunia-education-fair", "Collegedunia Web", "Collegedunia Education Fair", null, "exhibition", ["exhibition-stalls", "event-flooring"], "Bengaluru"),
  P("gte-2024", "Garment Technology Expo", "GTE 2024", "2024", "exhibition", ["exhibition-stalls", "event-flooring"], "Bengaluru"),
  P("central-silk-board-conference", "Central Silk Board — National Silkworm Seed Organisation", "Central Silk Board Conference", null, "conference", ["staging-and-seating"]),
  P("vaidic-dharma-navaratri-2024", "Vaidic Dharma Sansthan", "Navaratri Function 2024", "2024", "cultural", ["german-hangers", "event-flooring"]),
  P("hampi-utsav-2024", "Karnataka State Habitat Centre", "Hampi Utsav 2024", "2024", "cultural", ["german-hangers", "staging-and-seating", "event-flooring"], "Hampi", true),
  P("adichunchanagiri-founders-day", "Sri Adichunchanagiri Shikshana Trust", "Founder's Day", null, "cultural", ["staging-and-seating"]),
  P("fc-expo-2025", "First Circle Biztech", "FC Expo 2025", "2025", "exhibition", ["exhibition-stalls", "event-flooring"], "Bengaluru"),
  P("krishi-mela-2024-25", "University of Agricultural Sciences", "Krishi Mela 2024–25", "2024", "exhibition", ["german-hangers", "exhibition-stalls"], "GKVK Campus, Bengaluru"),
  P("pourakarmika-samavesha", "Karnataka State Marketing Communication & Advertising Ltd", "Pourakarmika Samavesha", null, "government", ["german-hangers", "staging-and-seating"], "Bengaluru"),
  P("buildtek-silver-jubilee", "Buildtek Polymers", "Silver Jubilee Celebration", null, "corporate", ["staging-and-seating"]),
  P("vaidic-dharma-navaratri", "Vaidic Dharma Sansthan", "Navaratri Function", null, "cultural", ["german-hangers", "event-flooring"]),
  P("valmiki-jayanti-2025", "Tribal Welfare Department, Government of Karnataka", "Valmiki Jayanti 2025", "2025", "government", ["german-hangers", "staging-and-seating"], "Bengaluru"),
  P("mm-hills", "Sri Male Mahadeshwara Swamy", "MM Hills", null, "cultural", ["german-hangers"], "Male Mahadeshwara Hills"),
  P("world-fisheries-day-2024", "Skyblue Event Management India", "World Fisheries Day 2024", "2024", "government", ["exhibition-stalls", "staging-and-seating"], "Bengaluru"),
  P("biffes-17", "Karnataka Chalanachitra Academy", "17th Bengaluru International Film Festival", null, "cultural", ["staging-and-seating", "event-flooring"], "Bengaluru", true),
  P("karthik-live", "TribeVibe Entertainment", "Karthik Live", null, "corporate", ["staging-and-seating", "event-scaffolding"]),
  P("dam-safety-conference", "Karnataka State Marketing Communication & Advertising Ltd", "International Conference on Dam Safety", null, "conference", ["german-hangers", "staging-and-seating"]),
  P("fifth-annual-convocation", "Karnataka State Marketing Communication & Advertising Ltd", "5th Annual Convocation", null, "government", ["staging-and-seating"]),
  P("babu-jagjivan-ram-119", "Karnataka State Marketing Communication & Advertising Ltd", "119th birth anniversary of Dr Babu Jagjivan Ram", null, "government", ["staging-and-seating"]),
  P("vidyapeeta-education-expo", "ABS Business Solutions", "Vidyapeeta Education Expo", null, "exhibition", ["exhibition-stalls"], "Bengaluru"),
].map((p, i) => ({ ...p, order: i }));

export const publishedProjects = (): Project[] => projects.filter((p) => p.published);

export const featuredProjects = (limit = 4): Project[] =>
  publishedProjects()
    .filter((p) => p.featured)
    .slice(0, limit);

export const projectsByCategory = (c: ProjectCategory): Project[] =>
  publishedProjects().filter((p) => p.category === c);

export const findProject = (id: string): Project | undefined =>
  projects.find((p) => p.id === id);

/** Categories that actually have projects, in schedule order. */
export const activeCategories = (): ProjectCategory[] => {
  const seen = new Set<ProjectCategory>();
  for (const p of publishedProjects()) seen.add(p.category);
  return (Object.keys(CATEGORY_LABELS) as ProjectCategory[]).filter((c) => seen.has(c));
};

export const projectsIntro = {
  eyebrow: ["What we", "have built"] as const,
  statement: [
    { text: "Twenty-seven engagements. " },
    { text: "One contractor", accent: true },
    { text: "." },
  ],
  lead:
    "Government programmes, trade fairs, congresses and cultural festivals — the client and the event for every one of them, as recorded on Raja's own schedule. Scope and photographs are added as Raja releases them; nothing here is estimated.",
};
