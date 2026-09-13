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
    title: "German Hangars & Temporary Structures",
    heading: "German hangars and temporary structures",
    summary:
      "Imported clear-span hangars erected on prepared ground — column-free interiors that carry staging, seating and services without breaking a sightline.",
    body: [
      "A German hangar is a clear-span aluminium structure: no internal columns, so the whole floor plate is usable and every seat has a sightline to the stage. It is the difference between a marquee and a building that happens to be temporary.",
      "Raja owns its hangars rather than sub-hiring them. That matters on two counts — the structure is available when the calendar says it is, and the crew erecting it has put up the same frames hundreds of times.",
      "Spans are configured to the site. The shell holds through monsoon weather, and flooring, climate control, staging and power are specified as one package rather than coordinated between four suppliers.",
    ],
    capacity: [
      { label: "Owned hangar area", value: "5,00,000 sq ft" },
      { label: "Configuration", value: "Clear-span, column-free" },
      { label: "Weather", value: "Monsoon-rated shell" },
    ],
    bundled: ["Event flooring", "Climate control", "Staging", "Power distribution", "Barricading"],
    image:
    {
      src: "/media/raja/hanger-frame-erection.8e578fc4.webp",
      width: 1600,
      height: 1204,
      alt: "A German hangar frame part-erected on open ground at sunrise, its aluminium portal frames standing unclad against the sky.",
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
      src: "/media/events/larenon-stall-counter.33e301ef.webp",
      width: 1800,
      height: 1468,
      alt: "An exhibition stall interior: branded back wall, display counters, seating and planting.",
      clearance: "client-approved",
    },
    page: true,
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
    bundled: ["German hangars", "Carpeting", "Staging"],
    image:
    {
      src: "/media/events/kanha-assembly-floor-aerial.da511112.webp",
      width: 837,
      height: 650,
      alt: "Aerial of a vast covered assembly floor laid out in patterned seating blocks.",
      clearance: "client-approved",
    },
    page: true,
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
      src: "/media/events/isgcon-stage-lamp.5633cdec.webp",
      width: 800,
      height: 533,
      alt: "A lamp-lighting ceremony on a conference stage in front of a large printed backdrop.",
      clearance: "client-approved",
    },
    page: true,
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
    /*
     * NEEDS CLIENT IMAGE. Raja holds no photograph of scaffolding proper —
     * no camera platform, lighting tower or raked seating deck. This is a
     * genuine Raja photograph of structural erection on site, which is the
     * same trade and the same crew, and the alt text says precisely what it
     * shows rather than implying it is a scaffold. Replace it with a real
     * scaffolding photograph as soon as one is supplied.
     */
    image: {
      src: "/media/raja/hanger-frame-erection.8e578fc4.webp",
      width: 1600,
      height: 1204,
      alt: "Aluminium portal frames standing unclad on open ground during erection, before cladding is fitted.",
      clearance: "raja-original",
      credit: "Raja Enterprises",
    },
    page: true,
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
    bundled: ["German hangars", "Staging", "Event flooring", "Barricading", "Climate control"],
    image:
    {
      src: "/media/events/icgs-akshay-commissioning.4d56e6c2.webp",
      width: 1280,
      height: 720,
      alt: "The commissioning of ICGS Akshay at Goa Shipyard: nameplate unveiling, the vessel at sea, and the ceremonial parade beneath a canopied dais.",
      clearance: "client-approved",
    },
    page: true,
    order: 5,
    status: "approved",
  },
  {
    slug: "lighting-and-av",
    title: "Lighting & AV Solutions",
    heading: "Stage lighting, sound engineering and AV infrastructure",
    summary:
      "Engineered truss-mounted stage lighting, line-array audio delay systems, and high-definition LED video displays integrated directly into structural frames.",
    body: [
      "Lighting, sound and audiovisual rigging cannot be an afterthought clamped onto unrated structures. Raja designs and mounts stage illumination, concert audio arrays and wide LED walls directly integrated into our German hangars and ringlock scaffolding.",
      "By calculating rigging loads and suspension geometry before the first bay is hoisted, point-load structural margins are strictly preserved, cables remain completely concealed, and sightlines are never obstructed by ad-hoc ground stands.",
      "From broadcast-ready VIP plenary sessions and state inaugurations to high-decibel cultural concerts, our lighting and AV systems deploy with synchronized power distribution and whisper-quiet backup generators.",
    ],
    capacity: [
      { label: "Rigging systems", value: "Heavy aluminium box truss (300/400mm)" },
      { label: "Power & distribution", value: "Synchronized clean feeds & silent gensets" },
      { label: "Deployment", value: "Pan-India turnkey delivery" },
    ],
    bundled: ["German hangars", "Staging, Seating & Dais", "Event Scaffolding", "Power distribution"],
    image: {
      src: "/media/inventory-lighting.25f99edf.webp",
      width: 1200,
      height: 800,
      alt: "Professional stage lighting rigs, aerial trussing and illumination over an event arena.",
      clearance: "client-approved",
      credit: "Raja Enterprises",
    },
    page: true,
    order: 6,
    status: "approved",
  },
  {
    slug: "climate-control",
    title: "Mobile HVAC & Climate Control",
    heading: "Temporary mobile HVAC and industrial climate control",
    summary:
      "3,000 tons of owned mobile chilling equipment, high-volume air handling units, and insulated ducting stabilizing indoor temperatures at 22°C–24°C across mega hangars.",
    body: [
      "A temporary structure during peak Indian summers is unusable without industrial-grade climate control. Raja owns and deploys 3,000 tons of mobile packaged chilling plants, precision air handling units, and textile laminar ducting.",
      "Our HVAC solutions are sized specifically to the volume of each German hangar and the expected crowd density, maintaining a comfortable 22°C to 24°C environment even when exterior ambient temperatures exceed 45°C.",
      "Quiet air handling units ensure conference and broadcast audio remain crystal clear, with engineered condensation barriers and concealed drain piping protecting subfloors and delegate footways.",
    ],
    capacity: [
      { label: "Owned cooling fleet", value: "3,000 tons" },
      { label: "Target temperature", value: "22°C – 24°C in 45°C ambient heat" },
      { label: "Ducting technology", value: "Laminar textile air socks & spiral ducting" },
    ],
    bundled: ["German hangars", "Event flooring", "Power distribution"],
    image: {
      src: "/media/events/kanha-canopy-interior.0403268d.webp",
      width: 1280,
      height: 720,
      alt: "Interior of temporary clear-span hall with integrated air-conditioning ducting.",
      clearance: "client-approved",
      credit: "Raja Enterprises",
    },
    page: true,
    order: 7,
    status: "approved",
  },
  {
    slug: "barricades-and-safety",
    title: "Barricades & Crowd Control Infrastructure",
    heading: "Interlocking crowd-control barricades and security perimeters",
    summary:
      "Over 1,00,000 running feet of heavy-gauge interlocking steel barricades and mojo safety barriers for sterile VIP perimeters and dense crowd distribution.",
    body: [
      "Crowd safety and protocol security dictate the layout of any high-attendance gathering. Raja maintains over 1,00,000 running feet of interlocking galvanized steel barricades and crowd-control barriers.",
      "Engineered with anti-trip flat baseplates and positive pin-and-eye interlocks, our barricades withstand intense lateral surges without separating, creating sterile VIP corridors, media enclosures, and controlled ingress channels.",
      "Deployed by our own logistics fleet and handled by trained crews who understand security protocols, police cordons, and rapid evacuation contingencies.",
    ],
    capacity: [
      { label: "Owned barricade stock", value: "1,00,000 running feet" },
      { label: "Barrier types", value: "Interlocking galvanized steel & mojo barriers" },
      { label: "Foot system", value: "Anti-trip flat plates & bridge feet" },
    ],
    bundled: ["German hangars", "Staging and Dais", "Event scaffolding"],
    image: {
      src: "/media/representative/inventory-barricades.f368fe44.webp",
      width: 1200,
      height: 800,
      alt: "Interlocking galvanized crowd control barriers deployed for event perimeter security.",
      clearance: "representative",
      credit: "Raja Enterprises",
    },
    page: true,
    order: 8,
    status: "approved",
  },
  {
    slug: "logistics-fleet",
    title: "Logistics Fleet & Heavy Transport",
    heading: "Company-owned logistics fleet and heavy site transport",
    summary:
      "Twenty owned multi-axle trucks, flatbeds, and mobile cranes delivering rapid statewide and pan-India deployment with zero third-party transport dependency.",
    body: [
      "Transit delays are the death of event construction schedules. Rather than brokering freight on the open spot market, Raja operates a dedicated fleet of 20+ owned commercial goods vehicles.",
      "Our multi-axle flatbeds, covered container trucks, and hydraulic cranes move aluminum hangar bays, steel ringlock scaffolding, and subfloors directly from our Bengaluru central yard straight to the project site.",
      "Experienced rigging drivers and site crews travel with the equipment convoys, ensuring immediate unloading, staging, and erection the moment the convoy arrives on site.",
    ],
    capacity: [
      { label: "Dedicated fleet size", value: "20+ owned commercial vehicles" },
      { label: "Vehicle classes", value: "10-wheelers, 6-wheelers, flatbeds & cranes" },
      { label: "Depot hub", value: "Central Logistics Yard, Bengaluru" },
    ],
    bundled: ["German hangars", "Event scaffolding", "Event flooring", "Staging, Seating & Dais"],
    image: {
      src: "/media/representative/inventory-fleet.13f2e483.webp",
      width: 1200,
      height: 800,
      alt: "Dedicated commercial fleet trucks parked at the Raja Enterprises logistics yard.",
      clearance: "representative",
      credit: "Raja Enterprises",
    },
    page: true,
    order: 9,
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
 * A second view of a hangar in use, for the German hangars page.
 *
 * REPRESENTATIVE, not evidence: it shows what a clear-span structure looks like
 * full of people, which is the thing the frame photograph cannot show. It is
 * never captioned as Raja's work.
 */
export const hangarInUse: ImageAsset = {
      src: "/media/events/kanha-canopy-interior.0403268d.webp",
      width: 515,
      height: 388,
      alt: "The interior of a tensile clear-span structure, its fabric roof carried on a steel frame.",
      clearance: "client-approved",
    };

export const findPillar = (slug: string): ServicePillar | undefined =>
  servicePillars.find((s) => s.slug === slug);

/** Pillars that ship as their own route. */
export const pagedPillars = (): ServicePillar[] => servicePillars.filter((s) => s.page);
