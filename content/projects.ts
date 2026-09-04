import type { ImageAsset, Sourced } from "./types";

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
  /**
   * Raja-original or client-approved media only. Representative imagery never
   * attaches to a project — a project's photographs are its evidence, and
   * stock would make that evidence false.
   */
  media: ImageAsset[];
  /**
   * Where the record came from. `schedule` is Raja's supplied 27-event list;
   * `raja-published` is Raja's own website, which is client-published evidence
   * and therefore equally citable.
   */
  provenance: "schedule" | "raja-published" | "client-provided";
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
  provenance: "schedule",
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
  {
    ...P("la-renon-company-event", "La Renon Healthcare", "Company event", null, "corporate", ["exhibition-stalls", "staging-and-seating"]),
    media: ([
      {
        src: "/media/projects/larenon-stall-frontage.33e301ef.webp",
        width: 1800,
        height: 1468,
        alt: "A La Renon exhibition stall: branded back wall, product display counters, seating and planting inside a fabricated shell.",
        clearance: "client-approved",
      },
      {
        src: "/media/projects/larenon-stall-in-use.0d4ebe9c.webp",
        width: 1800,
        height: 1183,
        alt: "Delegates at a La Renon exhibition stall, product panels lit along the back wall.",
        clearance: "client-approved",
      },
      {
        src: "/media/projects/larenon-stall-arch.0f7c47d8.webp",
        width: 1800,
        height: 1350,
        alt: "An arched-fascia exhibition stall carrying La Renon branding, with visitors passing the frontage.",
        clearance: "client-approved",
      },
    ] satisfies ImageAsset[]),
    featured: true,
  },
  P("fc-expo-2024", "First Circle Biztech", "FC Expo 2024", "2024", "exhibition", ["exhibition-stalls", "event-flooring"], "Bengaluru"),
  {
    ...P("eima-agrimach-2024", "Federation of Indian Chambers of Commerce & Industry (FICCI)", "EIMA Agrimach 2024", "2024", "exhibition", ["german-hangers", "exhibition-stalls", "event-flooring"], "Bengaluru", true),
    media: ([
      {
        src: "/media/projects/eima-expo-ground.74508fee.webp",
        width: 1600,
        height: 1200,
        alt: "Delegates walking the outdoor exhibition ground at an agricultural machinery expo, tractors and exhibitor stands either side.",
        clearance: "client-approved",
      },
    ] satisfies ImageAsset[]),
  },
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

  // --- Published by Raja on rajaenterprises.co, read 2026-09-04. These are the
  // client's own public claims and so are citable, but the site states no year,
  // area or attendance for any of them and none is inferred here.
  { ...P("indian-science-congress-107", "Government of India", "107th Indian Science Congress", null, "conference", ["german-hangers", "staging-and-seating", "exhibition-stalls"], null), provenance: "raja-published" as const },
  { ...P("ambedkar-jayanti-vidhana-soudha", "Government of Karnataka", "Ambedkar Jayanti at Vidhana Soudha", null, "government", ["staging-and-seating"], "Vidhana Soudha, Bengaluru"), provenance: "raja-published" as const },
  { ...P("karnataka-cabinet-meeting", "Government of Karnataka", "Karnataka Government Cabinet Meeting", null, "government", ["staging-and-seating"], "Bengaluru"), provenance: "raja-published" as const },
  { ...P("global-investors-summit-2023", "Government summit", "Global Investors Summit 2023", "2023", "government", ["german-hangers", "exhibition-stalls", "staging-and-seating"], "Dehradun"), provenance: "raja-published" as const },
  { ...P("ds-max-anniversary-2023", "DS Max", "DS Max Anniversary 2023", "2023", "corporate", ["staging-and-seating"], "Bengaluru"), provenance: "raja-published" as const },
  { ...P("bhima-diamonds", "Bhima Diamonds", "Bhima Diamonds event", null, "corporate", ["staging-and-seating"], "Bengaluru"), provenance: "raja-published" as const },

  // Event verified against published reporting; Raja's involvement is the
  // client's own statement plus the photographs they hold. See the note above.
  {
    ...P("icgs-akshay-commissioning", "Indian Coast Guard / Goa Shipyard Limited", "ICGS Akshay commissioning", "2026", "government", ["staging-and-seating"], "Vasco, Goa"),
    provenance: "client-provided" as const,
    status: "provisional" as const,
    note: "Event verified: ICGS Akshay, 4th Adamya-class Fast Patrol Vessel, commissioned at Goa Shipyard Limited, Vasco, 27 Jun 2026. Raja's involvement is client-stated and not publicly corroborated. Client-supplied photographs are Coast Guard/shipyard press imagery and are NOT published pending permission.",
  },
].map((p, i) => ({ ...p, order: i }));

/**
 * ICGS Akshay, and why it is published while its photographs are not.
 *
 * Raja stated a ship inauguration in Goa. A first search found nothing —
 * rajaenterprises.co has no maritime content at all — so this was held
 * unpublished. The client then supplied event photographs, and those identify
 * it precisely: the nameplate reads ICGS AKSHAY, the vessel carries Indian
 * Coast Guard pennant 257, and a woman dignitary in a sari appears alongside
 * senior ICG officers.
 *
 * That matches published reporting exactly. ICGS Akshay is the fourth
 * Adamya-class Fast Patrol Vessel, built by Goa Shipyard Limited and
 * commissioned at Vasco, Goa on 27 June 2026, with Parama Sen (Additional
 * Secretary, Ministry of Finance) and IGs Bhisham Sharma and Jyotindra Singh
 * attending.
 *
 * So the EVENT is verified. RAJA'S INVOLVEMENT is not: no public source names
 * the infrastructure contractor, and possessing photographs is not proof of
 * having built the set. The record therefore publishes with attribution marked
 * client-provided, which is what the visitor is shown.
 *
 * THE PHOTOGRAPHS ARE NOT PUBLISHED. They are Coast Guard and shipyard press
 * imagery, not Raja's own, and clearing them is a permission question rather
 * than a licensing one.
 */
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

/**
 * A representative banner per sector.
 *
 * These are NOT project photographs and must never be captioned as any
 * particular build. They show the kind of environment each sector's work
 * produces, so a visitor scanning the archive can see the category before
 * reading a single client name.
 *
 * `government` is deliberately absent. The searched candidates were either
 * US-market imagery, the wrong category entirely, or a duplicate of a frame
 * already used elsewhere on the site — so that sector leads with its count
 * instead. A representative image is worth having; a misleading or repeated
 * one is not.
 */
export const categoryBanner: Partial<Record<ProjectCategory, ImageAsset>> = {
  exhibition: {
    src: "/media/representative/service-exhibition-stalls.10a9e410.webp",
    width: 1600,
    height: 1067,
    alt: "Visitors walking between modular exhibition booths inside a daylit trade-fair hall.",
    clearance: "licensed",
  },
  conference: {
    src: "/media/representative/service-conference.9e8df1c8.webp",
    width: 1600,
    height: 1067,
    alt: "A seated audience facing a lit presentation screen at a conference.",
    clearance: "licensed",
  },
  cultural: {
    src: "/media/representative/category-cultural.a36405bc.webp",
    width: 1400,
    height: 935,
    alt: "A night crowd in front of a lit festival stage.",
    clearance: "licensed",
  },
  corporate: {
    src: "/media/representative/category-corporate.1ccebf22.webp",
    width: 1400,
    height: 934,
    alt: "Rows of seating set out in a conference hall before an event.",
    clearance: "licensed",
  },
  social: {
    src: "/media/representative/category-social.ff84e1c8.webp",
    width: 1400,
    height: 934,
    alt: "A banquet laid out under a decorated event structure for a large private celebration.",
    clearance: "licensed",
  },
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
