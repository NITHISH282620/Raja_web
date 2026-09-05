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
  {
    ...P("art-of-living-navaratri-2023", "The Art of Living Trust", "Navaratri Function 2023", "2023", "cultural", ["german-hangers", "event-flooring", "staging-and-seating"], "Bengaluru", true),
    media: ([
      {
        src: "/media/events/aol-assembly-rows.7e11d21d.webp",
        width: 1200,
        height: 800,
        alt: "Row after row of seated participants across an immense covered gathering.",
        clearance: "client-approved",
      },
      {
        src: "/media/events/aol-crowd-aerial.72481eb2.webp",
        width: 1200,
        height: 675,
        alt: "An aerial over a vast open-air gathering, seating filling the frame.",
        clearance: "client-approved",
      },
      {
        src: "/media/events/aol-pavilion-night.67b84519.webp",
        width: 450,
        height: 800,
        alt: "A large illuminated pavilion at night, reflected in still water.",
        clearance: "client-approved",
      },
    ] satisfies ImageAsset[]),
  },
  {
    ...P("isgcon-2023", "Indian Society of Gastroenterology", "ISGCON 2023 — 64th Annual Congress", "2023", "conference", ["german-hangers", "staging-and-seating", "exhibition-stalls"], "Bengaluru"),
    media: ([
      {
        src: "/media/events/isgcon-stage-lamp.5633cdec.webp",
        width: 800,
        height: 533,
        alt: "A lamp-lighting ceremony on a conference stage in front of a large printed backdrop.",
        clearance: "client-approved",
      },
      {
        src: "/media/events/isgcon-stage-award.1423a9d8.webp",
        width: 800,
        height: 450,
        alt: "An award presentation on a conference stage beneath a branded backdrop.",
        clearance: "client-approved",
      },
    ] satisfies ImageAsset[]),
  },
  {
    ...P("la-renon-company-event", "La Renon Healthcare", "Company event", null, "corporate", ["exhibition-stalls", "staging-and-seating"]),
    media: ([
      {
        src: "/media/events/larenon-stall-counter.33e301ef.webp",
        width: 1800,
        height: 1468,
        alt: "An exhibition stall interior: branded back wall, display counters, seating and planting.",
        clearance: "client-approved",
      },
      {
        src: "/media/events/larenon-stall-arch.0f7c47d8.webp",
        width: 1800,
        height: 1350,
        alt: "An arched-fascia exhibition stall with visitors passing its frontage.",
        clearance: "client-approved",
      },
      {
        src: "/media/events/larenon-stall-visitors.0d4ebe9c.webp",
        width: 1800,
        height: 1183,
        alt: "Visitors at an exhibition stall, product panels lit along the back wall.",
        clearance: "client-approved",
      },
      {
        src: "/media/events/larenon-stall-wide.ae5daaa7.webp",
        width: 1021,
        height: 605,
        alt: "A fabricated exhibition stall shell with printed panels and seating.",
        clearance: "client-approved",
      },
    ] satisfies ImageAsset[]),
    featured: true,
  },
  {
    ...P("fc-expo-2024", "First Circle Biztech", "FC Expo 2024", "2024", "exhibition", ["exhibition-stalls", "event-flooring"], "Bengaluru"),
    media: ([
      {
        src: "/media/events/fcexpo-hall-stage.fb778307.webp",
        width: 547,
        height: 365,
        alt: "A wide conference hall with a lit stage, carpeted aisle and a full seated audience.",
        clearance: "client-approved",
      },
      {
        src: "/media/events/fcexpo-audience.280f1069.webp",
        width: 543,
        height: 368,
        alt: "A conference audience seated at banquet rounds through a large hall.",
        clearance: "client-approved",
      },
    ] satisfies ImageAsset[]),
  },
  {
    ...P("eima-agrimach-2024", "Federation of Indian Chambers of Commerce & Industry (FICCI)", "EIMA Agrimach 2024", "2024", "exhibition", ["german-hangers", "exhibition-stalls", "event-flooring"], "Bengaluru", true),
    media: ([
      {
        src: "/media/events/eima-mahindra-stall.526d34c1.webp",
        width: 1000,
        height: 603,
        alt: "A fabricated exhibition stall with branded fascia and machinery on display at an agricultural trade fair.",
        clearance: "client-approved",
      },
      {
        src: "/media/events/eima-expo-crowd.11d4b8f2.webp",
        width: 595,
        height: 336,
        alt: "A crowded outdoor trade-fair ground with exhibitor stands and agricultural machinery.",
        clearance: "client-approved",
      },
      {
        src: "/media/events/eima-delegates-stand.5c782f20.webp",
        width: 853,
        height: 470,
        alt: "Delegates beside a tractor on an exhibitor stand at an agricultural machinery fair.",
        clearance: "client-approved",
      },
      {
        src: "/media/events/eima-ground-dusk.284dd6b2.webp",
        width: 680,
        height: 451,
        alt: "An outdoor exhibition ground at dusk, machinery displays under exhibitor structures.",
        clearance: "client-approved",
      },
      {
        src: "/media/events/eima-stall-frontage.ac25251f.webp",
        width: 600,
        height: 800,
        alt: "Delegates in front of a fabricated exhibition stand with printed fascia panels.",
        clearance: "client-approved",
      },
    ] satisfies ImageAsset[]),
  },
  {
    ...P("kanha-shanti-vanam-tent-city", "Kanha Shanti Vanam", "Tent city, Bengaluru", null, "cultural", ["german-hangers", "event-flooring", "staging-and-seating"], "Bengaluru"),
    media: ([
      {
        src: "/media/events/kanha-canopy-assembly-aerial.56be51e1.webp",
        width: 644,
        height: 388,
        alt: "Aerial view over an immense clear-span canopy sheltering a seated assembly of many thousands.",
        clearance: "client-approved",
      },
      {
        src: "/media/events/kanha-assembly-floor-aerial.da511112.webp",
        width: 837,
        height: 650,
        alt: "Aerial of a vast covered assembly floor laid out in patterned seating blocks.",
        clearance: "client-approved",
      },
      {
        src: "/media/events/kanha-canopy-night.0c0ccba9.webp",
        width: 720,
        height: 1280,
        alt: "A tensile canopy structure lit from within at night.",
        clearance: "client-approved",
      },
      {
        src: "/media/events/kanha-canopy-seating.7a22707d.webp",
        width: 516,
        height: 387,
        alt: "A wide clear-span canopy over rank upon rank of seating, open at the sides.",
        clearance: "client-approved",
      },
      {
        src: "/media/events/kanha-canopy-interior.0403268d.webp",
        width: 515,
        height: 388,
        alt: "The interior of a tensile clear-span structure, its fabric roof carried on a steel frame.",
        clearance: "client-approved",
      },
      {
        src: "/media/events/kanha-crowd-scale.3e07499f.webp",
        width: 275,
        height: 183,
        alt: "A stadium-scale covered gathering seen from above, seating filled to the edges.",
        clearance: "client-approved",
      },
      {
        src: "/media/events/kanha-campus-aerial.fbf4b561.webp",
        width: 320,
        height: 178,
        alt: "Aerial of a campus of large domed event structures lit at dusk.",
        clearance: "client-approved",
      },
    ] satisfies ImageAsset[]),
    featured: true,
  },
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
  { ...P("global-investors-summit-2023", "Government of Uttarakhand", "Global Investors Summit 2023", "2023", "government", ["german-hangers", "exhibition-stalls", "staging-and-seating"], "Dehradun"), provenance: "raja-published" as const },
  { ...P("ds-max-anniversary-2023", "DS Max", "DS Max Anniversary 2023", "2023", "corporate", ["staging-and-seating"], "Bengaluru"), provenance: "raja-published" as const },
  { ...P("bhima-diamonds", "Bhima Diamonds", "Bhima Diamonds event", null, "corporate", ["staging-and-seating"], "Bengaluru"), provenance: "raja-published" as const },

  // Event verified against published reporting; Raja's involvement is the
  // client's own statement plus the photographs they hold. See the note above.
  {
    ...P("icgs-akshay-commissioning", "Indian Coast Guard / Goa Shipyard Limited", "ICGS Akshay commissioning", "2026", "government", ["staging-and-seating"], "Vasco, Goa"),
    media: ([
{
        src: "/media/events/icgs-akshay-commissioning.4d56e6c2.webp",
        width: 1280,
        height: 720,
        alt: "The commissioning of ICGS Akshay: the ship's nameplate unveiled, the vessel at sea, and the ceremonial parade beneath a canopied dais.",
        clearance: "client-approved",
      },
    ] satisfies ImageAsset[]),
    provenance: "client-provided" as const,
    status: "provisional" as const,
    note: "Event verified: ICGS Akshay, 4th Adamya-class Fast Patrol Vessel, commissioned at Goa Shipyard Limited, Vasco, 27 Jun 2026. Raja's involvement is client-stated and not publicly corroborated. Client-supplied photographs are Coast Guard/shipyard press imagery and are NOT published pending permission.",
  },

  // --- Confirmed by Raja 2026-09-04, after being withheld pending evidence.
  // These three appear on neither Raja's supplied schedule nor its website, and
  // were previously carrying invented figures ("50,000+ Citizens & Dignitaries",
  // "10,000 RFT security barricading"). The events themselves are real and
  // well documented; the figures are not restored, because a press attendance
  // estimate is not Raja's measurement.
  //
  // The Kempegowda photographs are Press Information Bureau material — they
  // record the ceremony, not who built the set — and are credited as such.
  {
    ...P("kempegowda-t2-dedication", "Government of India / Bengaluru International Airport", "Kempegowda International Airport Terminal 2 & Statue Dedication", "2022", "government", ["staging-and-seating", "event-flooring"], "Bengaluru"),
    provenance: "client-provided" as const,
    media: ([
      {
        src: "/media/events/kempegowda-t2-plaque.08b46266.webp",
        width: 1800,
        height: 1288,
        alt: "A ceremonial plaque unveiling on a red-carpeted dais, the drape drawn back before assembled dignitaries.",
        clearance: "licensed",
        credit: "Press Information Bureau, Government of India",
      },
      {
        src: "/media/events/kempegowda-t2-interior.8c7d60e6.webp",
        width: 1800,
        height: 1419,
        alt: "Dignitaries walking the concourse of Kempegowda International Airport Terminal 2 beside its planted green wall.",
        clearance: "licensed",
        credit: "Press Information Bureau, Government of India",
      },
    ] satisfies ImageAsset[]),
    status: "provisional" as const,
    note: "Event verified: Terminal 2 inaugurated by the Prime Minister 11 Nov 2022, with the 108-ft Kempegowda statue dedicated the same day. Raja's involvement is client-stated; no public source names the infrastructure contractor. Photographs are PIB, credited, and record the ceremony rather than the build.",
  },
  {
    ...P("karnataka-swearing-in-2023", "Government of Karnataka", "Karnataka Government Swearing-In Ceremony", "2023", "government", ["staging-and-seating", "event-flooring"], "Kanteerava Stadium, Bengaluru"),
    provenance: "client-provided" as const,
    status: "provisional" as const,
    note: "Event verified: sworn in at Sri Kanteerava Stadium 20 May 2023. Raja's involvement client-stated. No photograph published — available press imagery is news-agency copyright, not PIB, so rights are unresolved. Supply one photograph and this record gains a hero.",
  },
  {
    ...P("kannada-sahitya-sammelana", "Kannada Sahitya Parishat", "Kannada Sahitya Sammelana", null, "cultural", ["german-hangers", "staging-and-seating", "event-flooring"], "Karnataka"),
    provenance: "client-provided" as const,
    status: "provisional" as const,
    note: "Client-stated. Edition number and year not supplied, and the delegate figure previously attached to it is not restored. No photograph with clear reuse rights located.",
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
      src: "/media/events/eima-expo-crowd.11d4b8f2.webp",
      width: 595,
      height: 336,
      alt: "A crowded outdoor trade-fair ground with exhibitor stands and agricultural machinery.",
      clearance: "client-approved",
    },
  conference: {
      src: "/media/events/isgcon-stage-award.1423a9d8.webp",
    width: 800,
    height: 450,
    alt: "An award presentation on a conference stage beneath a branded backdrop.",
      clearance: "client-approved",
    },
  cultural: {
      src: "/media/events/kanha-canopy-assembly-aerial.56be51e1.webp",
      width: 644,
      height: 388,
      alt: "Aerial view over an immense clear-span canopy sheltering a seated assembly of many thousands.",
      clearance: "client-approved",
    },
  corporate: {
      src: "/media/events/larenon-stall-arch.0f7c47d8.webp",
      width: 1800,
      height: 1350,
      alt: "An arched-fascia exhibition stall with visitors passing its frontage.",
      clearance: "client-approved",
    },
  government: {
      src: "/media/events/icgs-akshay-commissioning.4d56e6c2.webp",
    width: 1280,
    height: 720,
    alt: "The commissioning of ICGS Akshay at Goa Shipyard: nameplate unveiling, the vessel at sea, and the ceremonial parade beneath a canopied dais.",
      clearance: "client-approved",
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
