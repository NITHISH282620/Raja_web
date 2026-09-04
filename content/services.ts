import type { ImageAsset, Sourced } from "./types";

/**
 * The service architecture.
 *
 * THREE TIERS, deliberately. A contractor's site fails in one of two ways: it
 * lists forty capabilities as forty pages nobody maintains, or it hides real
 * services inside a paragraph. So:
 *
 *   `pillars`     — services with enough depth to carry their own page and
 *                   enough search intent to justify one.
 *   `capabilities`— genuinely offered, bought as part of a larger job rather
 *                   than on their own. Sections on a pillar page, never routes.
 *   `markets`     — who Raja builds for. Not services; they answer "do you do
 *                   events like mine", which is a different question.
 *
 * SCAFFOLDING and WEDDINGS/SOCIAL were both confirmed by Raja on 2026-09-04.
 * An earlier research pass had rejected scaffolding because it appeared nowhere
 * in the supplied material; that rejection is withdrawn. Capacity figures are
 * deliberately absent for scaffolding because none has been supplied — the page
 * describes the service without inventing a number.
 */

export interface ServicePillar extends Sourced {
  slug: string;
  /** Nav and card label. */
  title: string;
  /** The <h1>, written as the buyer would say it. */
  heading: string;
  /** One sentence answering "what is this". */
  summary: string;
  /** Two or three paragraphs. */
  body: string[];
  /** Hard numbers, only where Raja owns the asset and the figure is confirmed. */
  capacity: { label: string; value: string }[];
  /** What is normally bought alongside it — slugs of other pillars, or labels. */
  bundled: string[];
  image: ImageAsset | null;
  /** Shipped as a route in V1, or listed on the hub only. */
  page: boolean;
  order: number;
}

export const servicePillars: ServicePillar[] = [
  {
    slug: "german-hangers",
    title: "German Hangers & Temporary Structures",
    heading: "German hangers and temporary structures",
    summary:
      "Imported clear-span hangers erected on prepared ground — column-free interiors that carry staging, seating and services without breaking a sightline.",
    body: [
      "A German hanger is a clear-span aluminium structure: no internal columns, so the whole floor plate is usable and every seat has a sightline to the stage. It is the difference between a marquee and a building that happens to be temporary.",
      "Raja owns its hangers rather than sub-hiring them. That matters on two counts — the structure is available when the calendar says it is, and the crew erecting it has put up the same frames hundreds of times.",
      "Spans are configured to the site. The shell holds through monsoon weather, and flooring, climate control, staging and power are specified as one package rather than coordinated between four suppliers.",
    ],
    capacity: [
      { label: "Owned hanger area", value: "5,00,000 sq ft" },
      { label: "Configuration", value: "Clear-span, column-free" },
      { label: "Weather", value: "Monsoon-rated shell" },
    ],
    bundled: ["Event flooring", "Climate control", "Staging", "Power distribution", "Barricading"],
    image:
    {
      src: "/media/raja/hanger-frame-erection.8e578fc4.webp",
      width: 1600,
      height: 1204,
      alt: "A German hanger frame part-erected on open ground at sunrise, its aluminium portal frames standing unclad against the sky.",
      clearance: "raja-original",
      credit: "Raja Enterprises",
    },
    page: true,
    order: 0,
    status: "approved",
  },
  {
    slug: "exhibition-stalls",
    title: "Exhibition Stalls & Pavilions",
    heading: "Exhibition stall fabrication and pavilions",
    summary:
      "Octonorm and custom-fabricated stalls, fascia and pavilion builds for trade fairs and expos.",
    body: [
      "Stall fabrication is its own discipline: hundreds of small builds delivered against one opening date, each to a different exhibitor's specification, all of them finished before the doors open.",
      "Raja builds both modular octonorm shells and custom fabricated pavilions, with fascia, lighting, power and carpeting handled in the same scope.",
    ],
    capacity: [],
    bundled: ["Event flooring", "Lighting", "Power distribution", "Signage and fascia"],
    image:
    {
      src: "/media/representative/service-exhibition-stalls.10a9e410.webp",
      width: 1600,
      height: 1067,
      alt: "Visitors walking between modular exhibition booths inside a daylit trade-fair hall.",
      clearance: "licensed",
    },
    page: false,
    order: 1,
    status: "approved",
  },
  {
    slug: "event-flooring",
    title: "Event Flooring & Platforms",
    heading: "Event flooring, decking and levelled platforms",
    summary:
      "Wooden decking and levelled platforms laid across the full floor plate, over ground that is rarely level to begin with.",
    body: [
      "Most event sites are a field, a car park or a stadium concourse. Flooring is what turns that into a floor: levelled, load-bearing, and safe to walk on in heels or to run a forklift across.",
      "Raja owns ten lakh square feet of decking and platform stock, laid and struck by its own crew.",
    ],
    capacity: [{ label: "Owned flooring area", value: "10,00,000 sq ft" }],
    bundled: ["German hangers", "Carpeting", "Staging"],
    image: null,
    page: false,
    order: 2,
    status: "approved",
  },
  {
    slug: "staging-and-seating",
    title: "Staging, Seating & Audience Infrastructure",
    heading: "Staging, dais and audience infrastructure",
    summary:
      "Dais, stage, rigging, lighting and audience seating delivered as one package rather than coordinated across suppliers.",
    body: [
      "The dais is the part everybody photographs and the part with the least tolerance for error. Raja builds multi-tiered ceremonial stages, broadcast-rigged platforms and plain conference daises, with the seating, barricading and circulation planned around them.",
      "Lighting and AV rigging are specified within this scope, so the structure is designed to carry the rig rather than having the rig hung off whatever is available.",
    ],
    capacity: [{ label: "Owned stage area", value: "1,00,000 sq ft" }],
    bundled: ["Lighting and AV", "Barricading", "Event flooring", "Seating"],
    image:
    {
      src: "/media/representative/service-staging.0fb6d139.webp",
      width: 1600,
      height: 1067,
      alt: "A large arched stage structure lit for a night event, with an audience in front of it.",
      clearance: "licensed",
    },
    page: false,
    order: 3,
    status: "approved",
  },
  {
    slug: "event-scaffolding",
    title: "Event Scaffolding & Access Structures",
    heading: "Event scaffolding and temporary access structures",
    summary:
      "Scaffolding for camera platforms, lighting towers, temporary seating decks, backdrops and elevated access.",
    body: [
      "Scaffolding is the structural work behind everything that has to be higher than the ground: camera and broadcast platforms, lighting and delay towers, raked seating decks, tall backdrops and entrance gantries.",
      "It is erected and struck by Raja's own crew alongside the rest of the build, which is why it lands on the same schedule as the structure it serves rather than as a separate contractor's visit.",
    ],
    // No capacity figure: none has been supplied, and a scaffolding tonnage
    // guessed from the other stock would be an invented specification.
    capacity: [],
    bundled: ["Staging", "Lighting and AV", "Barricading"],
    image: null,
    page: false,
    order: 4,
    status: "provisional",
    note: "Service confirmed by Raja 2026-09-04. Capacity, tonnage and height limits not yet supplied — add them and this page gains a capacity band like the other pillars.",
  },
  {
    slug: "government-events",
    title: "Government Event Infrastructure",
    heading: "Government event infrastructure",
    summary:
      "Turnkey infrastructure for state ceremonies, national programmes and public-sector conferences, delivered under protocol and to a fixed date.",
    body: [
      "Government work has constraints most event jobs do not: a date that cannot move, a security protocol that governs who may be on site and when, and a procurement process that is scored before it is priced.",
      "Raja has built for state ceremonies, national programmes and public-sector conferences for decades, including high-security environments and stadium-scale turnkey builds against short turnarounds.",
    ],
    capacity: [],
    bundled: ["German hangers", "Staging", "Event flooring", "Barricading", "Climate control"],
    image:
    {
      src: "/media/representative/service-conference.9e8df1c8.webp",
      width: 1600,
      height: 1067,
      alt: "A seated audience facing a lit presentation screen at a conference.",
      clearance: "licensed",
    },
    page: false,
    order: 5,
    status: "approved",
  },
];

/**
 * Genuinely offered, but bought as part of a larger job.
 *
 * These are sections on the hub and on the pillar pages they belong to. Giving
 * each its own route would inflate the sitemap without helping anyone: nobody
 * commissions barricading on its own.
 */
export interface Capability {
  title: string;
  body: string;
}

export const groupedCapabilities: Capability[] = [
  {
    title: "Climate control",
    body: "Air conditioning and ventilation sized to the covered area, specified with the structure rather than bolted on afterwards.",
  },
  {
    title: "Lighting & AV",
    body: "Stage, ambient and architectural lighting with AV rigging, planned into the structure's load.",
  },
  {
    title: "Barricading & crowd control",
    body: "Iron barricade runs, queue management and secure perimeters for high-attendance and protocol events.",
  },
  {
    title: "Power distribution",
    body: "Distribution, cabling and backup across the site, sized to the connected load.",
  },
  {
    title: "Logistics & fleet",
    body: "Twenty owned goods vehicles moving stock to site and back, on Raja's own schedule.",
  },
  {
    title: "Manpower",
    body: "Site crew on Raja's payroll rather than subcontracted, which is why the same people return to the same clients.",
  },
  {
    title: "Catering",
    body: "Catering services arranged as part of a turnkey scope.",
  },
];

/** Who Raja builds for. Answers "do you do events like mine". */
export const markets: { title: string; body: string }[] = [
  {
    title: "Government & public sector",
    body: "State ceremonies, national programmes, public-sector conferences and departmental exhibitions.",
  },
  {
    title: "Exhibitions & trade fairs",
    body: "Multi-hall expos, industry trade shows and education fairs, from stall fabrication to the whole ground.",
  },
  {
    title: "Corporate & conferences",
    body: "Annual conventions, product launches, dealer meets and plenary conference environments.",
  },
  {
    title: "Cultural & public festivals",
    body: "State festivals, film festivals and religious gatherings running for days at a time.",
  },
  {
    title: "Weddings & social events",
    body: "Large-format private events where the ground has to become a venue — structures, flooring, staging and climate control at the same scale as any public build.",
  },
];

export const servicesIntro = {
  eyebrow: ["What we", "build"] as const,
  statement: [
    { text: "We do not decorate events. " },
    { text: "We build", accent: true },
    { text: " the venue." },
  ],
  lead:
    "Raja owns the structures, the flooring, the staging and the fleet, and employs the crew that raises them. That is the whole difference between a contractor and a broker — and it is why the date holds.",
};

/**
 * A second view of a hanger in use, for the German hangers page.
 *
 * REPRESENTATIVE, not evidence: it shows what a clear-span structure looks like
 * full of people, which is the thing the frame photograph cannot show. It is
 * never captioned as Raja's work.
 */
export const hangerInUse: ImageAsset =     {
      src: "/media/representative/service-expo-structure.ef0551b6.webp",
      width: 1600,
      height: 1064,
      alt: "Exhibition visitors gathered beneath the clear-span roof of a large temporary event structure.",
      clearance: "licensed",
    };

export const findPillar = (slug: string): ServicePillar | undefined =>
  servicePillars.find((s) => s.slug === slug);

/** Pillars that ship as their own route. */
export const pagedPillars = (): ServicePillar[] => servicePillars.filter((s) => s.page);
