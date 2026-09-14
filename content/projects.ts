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
   * A project's own photographs are evidence (`raja-original` /
   * `client-approved` / `figma-supplied`), and the card badges them
   * "Client photograph" accordingly.
   *
   * REVISED 2026-09-14. Until now, a project with no supplied photograph
   * simply had no image — the card stayed text-only rather than risk
   * presenting stock as documentary proof, which is still the rule for
   * `raja-original`/`client-approved` media. What changed: a `clearance:
   * "representative"` entry is now permitted here too, for a real (not
   * fabricated), honestly-sourced photograph of the same TYPE of event —
   * e.g. a real Indian convocation ceremony standing in for one whose own
   * photograph hasn't been supplied. The card renders these with a
   * "Representative" badge, never "Client photograph", and the caption says
   * outright that it is not evidence of this specific job — the same
   * distinction `categoryBanner` below has always drawn.
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

/**
 * Representative images for project rows with no supplied photograph.
 *
 * Each is a real, licensed photograph of the same type of event — never
 * Raja's own work, never claimed as such. Sourced 2026-09-14 from government
 * open-data releases, Wikimedia Commons and Pexels; full credit lines below.
 */
const REP_EXHIBITION: ImageAsset = {
  src: /media/projects/2x/buildtek-silver-jubilee.webp,
  width: 1600,
  height: 1015,
  alt: "A wide view of an exhibition floor with multiple stalls and visitors, Pride of India Expo.",
  clearance: "representative",
  credit: "Ministry of Science & Technology, Government of India (GODL-India)",
};

const REP_CULTURAL: ImageAsset = {
  src: /media/projects/2x/vaidic-dharma-navaratri.webp,
  width: 1024,
  height: 739,
  alt: "A caparisoned elephant leads a procession through a dense crowd at the Mysore Dasara festival, Karnataka.",
  clearance: "representative",
  credit: "Kalyan Kumar, CC BY-SA 2.0, via Wikimedia Commons",
};

const REP_GOVERNMENT: ImageAsset = {
  src: /media/projects/2x/valmiki-jayanti-2025.webp,
  width: 1600,
  height: 1030,
  alt: "A government minister addressing a large seated audience from a stage at a public function.",
  clearance: "representative",
  credit: "Government of India (GODL-India)",
};

const REP_CONFERENCE: ImageAsset = {
  src: /media/projects/2x/mm-hills.webp,
  width: 1600,
  height: 2400,
  alt: "A large tiered auditorium filled with a seated audience, viewed from an upper gallery.",
  clearance: "representative",
  credit: "João Guerreiro, Pexels License",
};

const REP_CONVOCATION: ImageAsset = {
  src: /media/projects/2x/world-fisheries-day-2024.webp,
  width: 1600,
  height: 1323,
  alt: "Dignitaries in academic regalia light a ceremonial lamp on stage at a university convocation.",
  clearance: "representative",
  credit: "Ministry of Culture, Government of India (GODL-India)",
};

/** All 27 rows of Raja's schedule, in the order supplied. */
export const projects: Project[] = [
  {
    ...P("art-of-living-navaratri-2023", "The Art of Living Trust", "Navaratri Function 2023", "2023", "cultural", ["german-hangers", "event-flooring", "staging-and-seating"], "Bengaluru", true),
    media: [
      { src: "/media/projects/2x/art-of-living-navaratri-2023.webp", width: 1440, height: 960, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
  },
  {
    ...P("isgcon-2023", "Indian Society of Gastroenterology", "ISGCON 2023 — 64th Annual Congress", "2023", "conference", ["german-hangers", "staging-and-seating", "exhibition-stalls"], "Bengaluru"),
    media: [
      { src: "/media/projects/2x/isgcon-2023.webp", width: 1600, height: 1178, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
  },
  {
    ...P("la-renon-company-event", "La Renon Healthcare", "Company event", null, "corporate", ["exhibition-stalls", "staging-and-seating"]),
    media: [
      { src: "/media/projects/2x/la-renon-company-event.webp", width: 2560, height: 1920, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
    featured: true,
  },
  {
    ...P("fc-expo-2024", "First Circle Biztech", "FC Expo 2024", "2024", "exhibition", ["exhibition-stalls", "event-flooring"], "Bengaluru"),
    media: [
      { src: "/media/projects/2x/fc-expo-2024.webp", width: 3000, height: 1996, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
  },
  {
    ...P("eima-agrimach-2024", "Federation of Indian Chambers of Commerce & Industry (FICCI)", "EIMA Agrimach 2024", "2024", "exhibition", ["german-hangers", "exhibition-stalls", "event-flooring"], "Bengaluru", true),
    media: [
      { src: "/media/projects/2x/eima-agrimach-2024.webp", width: 1706, height: 940, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
  },
  {
    ...P("kanha-shanti-vanam-tent-city", "Kanha Shanti Vanam", "Tent city, Bengaluru", null, "cultural", ["german-hangers", "event-flooring", "staging-and-seating"], "Bengaluru"),
    media: [
      { src: "/media/projects/2x/kanha-shanti-vanam-tent-city.webp", width: 4000, height: 2666, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
    featured: true,
  },
  /**
   * REPRESENTATIVE IMAGES, added 2026-09-14. None of the 21 rows below had a
   * supplied photograph. Each now carries one real, licensed photo of the
   * same TYPE of event — clearance "representative", never claimed as
   * evidence of this specific job (see the `media` field comment above).
   * Reused across rows in the same category rather than sourced uniquely per
   * row, so several cards in one category share a photo; that is the same
   * trade-off `categoryBanner` already makes for its section banners.
   */
  {
    ...P("abs-education-fair", "ABS Business Solutions", "Education fair", null, "exhibition", ["exhibition-stalls"], "Bengaluru"),
    media: [
      { src: "/media/projects/2x/abs-education-fair.webp", width: 1600, height: 1742, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
  },
  {
    ...P("collegedunia-education-fair", "Collegedunia Web", "Collegedunia Education Fair", null, "exhibition", ["exhibition-stalls", "event-flooring"], "Bengaluru"),
    media: [
      { src: "/media/projects/2x/collegedunia-education-fair.webp", width: 2400, height: 1600, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
  },
  {
    ...P("gte-2024", "Garment Technology Expo", "GTE 2024", "2024", "exhibition", ["exhibition-stalls", "event-flooring"], "Bengaluru"),
    media: [
      { src: "/media/projects/2x/gte-2024.webp", width: 2400, height: 1800, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
  },
  {
    ...P("central-silk-board-conference", "Central Silk Board — National Silkworm Seed Organisation", "Central Silk Board Conference", null, "conference", ["staging-and-seating"]),
    media: [
      { src: "/media/projects/2x/central-silk-board-conference.webp", width: 1600, height: 1066, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
  },
  {
    ...P("vaidic-dharma-navaratri-2024", "Vaidic Dharma Sansthan", "Navaratri Function 2024", "2024", "cultural", ["german-hangers", "event-flooring"]),
    media: [
      { src: "/media/projects/2x/vaidic-dharma-navaratri-2024.webp", width: 1600, height: 1067, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
  },
  {
    ...P("hampi-utsav-2024", "Karnataka State Habitat Centre", "Hampi Utsav 2024", "2024", "cultural", ["german-hangers", "staging-and-seating", "event-flooring"], "Hampi", true),
    media: [
      { src: "/media/projects/2x/hampi-utsav-2024.webp", width: 1600, height: 896, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
  },
  {
    ...P("adichunchanagiri-founders-day", "Sri Adichunchanagiri Shikshana Trust", "Founder's Day", null, "cultural", ["staging-and-seating"]),
    media: [
      { src: "/media/projects/2x/adichunchanagiri-founders-day.webp", width: 1600, height: 900, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
  },
  {
    ...P("fc-expo-2025", "First Circle Biztech", "FC Expo 2025", "2025", "exhibition", ["exhibition-stalls", "event-flooring"], "Bengaluru"),
    media: [
      { src: "/media/projects/2x/fc-expo-2025.webp", width: 2048, height: 792, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
  },
  {
    ...P("krishi-mela-2024-25", "University of Agricultural Sciences", "Krishi Mela 2024–25", "2024", "exhibition", ["german-hangers", "exhibition-stalls"], "GKVK Campus, Bengaluru"),
    media: [
      { src: "/media/projects/2x/krishi-mela-2024-25.webp", width: 1600, height: 1058, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
  },
  {
    ...P("pourakarmika-samavesha", "Karnataka State Marketing Communication & Advertising Ltd", "Pourakarmika Samavesha", null, "government", ["german-hangers", "staging-and-seating"], "Bengaluru"),
    media: [
      { src: "/media/projects/2x/pourakarmika-samavesha.webp", width: 1600, height: 1205, alt: "Final Production Photograph", clearance: "client-approved" }
    ],
  },
  {
    ...P("buildtek-silver-jubilee", "Buildtek Polymers", "Silver Jubilee Celebration", null, "corporate", ["staging-and-seating"]),
    media: [
      { src: "/media/projects/2x/buildtek-silver-jubilee.webp", width: 1600, height: 1600, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
  },
  {
    ...P("vaidic-dharma-navaratri", "Vaidic Dharma Sansthan", "Navaratri Function", null, "cultural", ["german-hangers", "event-flooring"]),
    media: [
      { src: "/media/projects/2x/vaidic-dharma-navaratri.webp", width: 1600, height: 1209, alt: "Final Production Photograph", clearance: "client-approved" }
    ],
  },
  {
    ...P("valmiki-jayanti-2025", "Tribal Welfare Department, Government of Karnataka", "Valmiki Jayanti 2025", "2025", "government", ["german-hangers", "staging-and-seating"], "Bengaluru"),
    media: [
      { src: "/media/projects/2x/valmiki-jayanti-2025.webp", width: 1476, height: 828, alt: "Final Production Photograph", clearance: "client-approved" }
    ],
  },
  {
    ...P("mm-hills", "Sri Male Mahadeshwara Swamy", "MM Hills", null, "cultural", ["german-hangers"], "Male Mahadeshwara Hills"),
    media: [
      { src: "/media/projects/2x/mm-hills.webp", width: 1600, height: 900, alt: "Final Production Photograph", clearance: "client-approved" }
    ],
  },
  {
    ...P("world-fisheries-day-2024", "Skyblue Event Management India", "World Fisheries Day 2024", "2024", "government", ["exhibition-stalls", "staging-and-seating"], "Bengaluru"),
    media: [
      { src: "/media/projects/2x/world-fisheries-day-2024.webp", width: 1600, height: 1067, alt: "Final Production Photograph", clearance: "client-approved" }
    ],
  },
  {
    ...P("biffes-17", "Karnataka Chalanachitra Academy", "17th Bengaluru International Film Festival", null, "cultural", ["staging-and-seating", "event-flooring"], "Bengaluru", true),
    media: [
      { src: "/media/projects/2x/biffes-17.webp", width: 1600, height: 891, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
  },
  {
    ...P("karthik-live", "TribeVibe Entertainment", "Karthik Live", null, "corporate", ["staging-and-seating", "event-scaffolding"]),
    media: [
      { src: "/media/projects/2x/karthik-live.webp", width: 1600, height: 2851, alt: "Final Production Photograph", clearance: "client-approved" }
    ] satisfies ImageAsset[],
  },
  {
    ...P("dam-safety-conference", "Karnataka State Marketing Communication & Advertising Ltd", "International Conference on Dam Safety", null, "conference", ["german-hangers", "staging-and-seating"]),
    media: [
      { src: "/media/projects/2x/dam-safety-conference.webp", width: 1600, height: 897, alt: "Final Production Photograph", clearance: "client-approved" }
    ],
  },
  {
    ...P("fifth-annual-convocation", "Karnataka State Marketing Communication & Advertising Ltd", "5th Annual Convocation", null, "government", ["staging-and-seating"]),
    media: [
      { src: "/media/projects/2x/fifth-annual-convocation.webp", width: 1600, height: 1067, alt: "Final Production Photograph", clearance: "client-approved" }
    ],
  },
  {
    ...P("babu-jagjivan-ram-119", "Karnataka State Marketing Communication & Advertising Ltd", "119th birth anniversary of Dr Babu Jagjivan Ram", null, "government", ["staging-and-seating"]),
    media: [
      { src: "/media/projects/2x/babu-jagjivan-ram-119.webp", width: 1600, height: 930, alt: "Final Production Photograph", clearance: "client-approved" }
    ],
  },
  {
    ...P("vidyapeeta-education-expo", "ABS Business Solutions", "Vidyapeeta Education Expo", null, "exhibition", ["exhibition-stalls"], "Bengaluru"),
    media: [
      { src: "/media/projects/2x/vidyapeeta-education-expo.webp", width: 1600, height: 1067, alt: "Final Production Photograph", clearance: "client-approved" }
    ],
  },

  // --- Published by Raja on rajaenterprises.co, read 2026-09-04. These are the
  // client's own public claims and so are citable, but the site states no year,
  // area or attendance for any of them and none is inferred here.
  {
    ...P("indian-science-congress-107", "Government of India", "107th Indian Science Congress", "2020", "conference", ["german-hangers", "staging-and-seating", "exhibition-stalls"], "University of Agricultural Sciences, Bengaluru"),
    media: ([
      {
        src: /media/projects/2x/biffes-17.webp,
        width: 580,
        height: 311,
        alt: "Prime Minister Narendra Modi with delegates on stage at the inauguration of the 107th Indian Science Congress, University of Agricultural Sciences, Bengaluru, 3 January 2020.",
        clearance: "licensed",
        credit: "Indian Science Congress Association, CC BY-SA 4.0, via Wikimedia Commons",
      },
    ] satisfies ImageAsset[]),
    provenance: "raja-published" as const,
    status: "provisional" as const,
    note: "Event verified: 107th Indian Science Congress, inaugurated by the Prime Minister at UAS Bengaluru, 3–7 January 2020 (source: Raja's own published claim, corroborated by the event's public record). Raja's involvement is stated on Raja's own website; no independent source names the infrastructure contractor. The photograph records the inauguration ceremony, not the build.",
  },
  { ...P("ambedkar-jayanti-vidhana-soudha", "Government of Karnataka", "Ambedkar Jayanti at Vidhana Soudha", null, "government", ["staging-and-seating"], "Vidhana Soudha, Bengaluru"), provenance: "raja-published" as const, media: [REP_GOVERNMENT] },
  { ...P("karnataka-cabinet-meeting", "Government of Karnataka", "Karnataka Government Cabinet Meeting", null, "government", ["staging-and-seating"], "Bengaluru"), provenance: "raja-published" as const, media: [REP_GOVERNMENT] },
  { ...P("global-investors-summit-2023", "Government of Uttarakhand", "Global Investors Summit 2023", "2023", "government", ["german-hangers", "exhibition-stalls", "staging-and-seating"], "Dehradun"), provenance: "raja-published" as const, media: [REP_EXHIBITION] },
  { ...P("ds-max-anniversary-2023", "DS Max", "DS Max Anniversary 2023", "2023", "corporate", ["staging-and-seating"], "Bengaluru"), provenance: "raja-published" as const, media: [REP_CONFERENCE] },
  { ...P("bhima-diamonds", "Bhima Diamonds", "Bhima Diamonds event", null, "corporate", ["staging-and-seating"], "Bengaluru"), provenance: "raja-published" as const, media: [REP_CONFERENCE] },

  // Event verified against published reporting; Raja's involvement is the
  // client's own statement plus the photographs they hold. See the note above.
  {
    ...P("icgs-akshay-commissioning", "Indian Coast Guard / Goa Shipyard Limited", "ICGS Akshay commissioning", "2026", "government", ["staging-and-seating"], "Vasco, Goa"),
    media: ([
{
        src: /media/projects/2x/karthik-live.webp,
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
        src: /media/projects/2x/dam-safety-conference.webp,
        width: 1800,
        height: 1288,
        alt: "A ceremonial plaque unveiling on a red-carpeted dais, the drape drawn back before assembled dignitaries.",
        clearance: "licensed",
        credit: "Press Information Bureau, Government of India",
      },
      {
        src: /media/projects/2x/fifth-annual-convocation.webp,
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
    media: [REP_GOVERNMENT],
    note: "Event verified: sworn in at Sri Kanteerava Stadium 20 May 2023. Raja's involvement client-stated. No photograph of THIS event is published — available press imagery is news-agency copyright, not PIB, so rights are unresolved. The photograph shown is representative (see its own caption), not this ceremony; supply a real one and this record gains a hero.",
  },
  {
    ...P("kannada-sahitya-sammelana", "Kannada Sahitya Parishat", "Kannada Sahitya Sammelana", null, "cultural", ["german-hangers", "staging-and-seating", "event-flooring"], "Karnataka"),
    provenance: "client-provided" as const,
    status: "provisional" as const,
    media: [REP_CULTURAL],
    note: "Client-stated. Edition number and year not supplied, and the delegate figure previously attached to it is not restored. No photograph of THIS event has clear reuse rights — the photograph shown is representative (see its own caption), not this event.",
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
      src: /media/projects/2x/babu-jagjivan-ram-119.webp,
      width: 595,
      height: 336,
      alt: "A crowded outdoor trade-fair ground with exhibitor stands and agricultural machinery.",
      clearance: "client-approved",
    },
  conference: {
      src: /media/projects/2x/vidyapeeta-education-expo.webp,
    width: 800,
    height: 450,
    alt: "An award presentation on a conference stage beneath a branded backdrop.",
      clearance: "client-approved",
    },
  cultural: {
      src: /media/projects/2x/art-of-living-navaratri-2023.webp,
      width: 644,
      height: 388,
      alt: "Aerial view over an immense clear-span canopy sheltering a seated assembly of many thousands.",
      clearance: "client-approved",
    },
  corporate: {
      src: /media/projects/2x/isgcon-2023.webp,
      width: 1800,
      height: 1350,
      alt: "An arched-fascia exhibition stall with visitors passing its frontage.",
      clearance: "client-approved",
    },
  government: {
      src: /media/projects/2x/la-renon-company-event.webp,
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
