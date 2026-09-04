import type { Sourced } from "./types";
import { yearsInOperation } from "./company";

export const aboutIntro = {
  eyebrow: ["Est. 1977", `${yearsInOperation()} Years in Operation`] as const,
  statement: [
    { text: "Building the physical grounds where India’s " },
    { text: "largest moments stand", accent: true },
    { text: "." },
  ],
  lead: `Founded in Bengaluru in 1977, Raja Enterprises is an event infrastructure and experiential architecture firm with a 49-year heritage of constructing temporary cities, state ceremonies, and industrial expos at monumental scale.`,
  tagline: "49 Years of Direct Asset Ownership · Zero Sub-Rentals · Nationwide Deployment",
};

export interface TimelineEra {
  year: string;
  period: string;
  tag: string;
  headline: string;
  description: string;
  deliverables: string[];
  image: string;
  alt: string;
}

export const aboutTimeline: TimelineEra[] = [
  {
    year: "1977",
    period: "1977 – 1990",
    tag: "Foundational Era",
    headline: "The Civic & Pandal Roots",
    description:
      "Raja Enterprises was founded in Bengaluru by Raju from the historic headquarters at 5th Main Road. Starting as a specialist contractor for state ceremonies, public convocations, and civic gatherings across Karnataka, the firm established its foundational ethos: flawless engineering and uncompromising human safety.",
    deliverables: [
      "Traditional timber and bamboo pavilion engineering",
      "Civic state convocations and government dais construction",
      "Foundational Bangalore headquarters establishment",
    ],
    image: "/media/events/isgcon-stage-award.1423a9d8.webp",
    alt: "Foundational civic event infrastructure in Karnataka",
  },
  {
    year: "1991",
    period: "1991 – 2004",
    tag: "Strategic Pivot",
    headline: "The Direct Asset Ownership Moat",
    description:
      "Coinciding with India's economic liberalization, Raja made its pivotal strategic transformation: permanently eliminating reliance on sub-rentals. The firm invested directly in heavy industrial inventory, introducing imported German clear-span aluminium structures and precision wooden floor platforms to South India.",
    deliverables: [
      "Acquisition of first clear-span German hangar systems",
      "Transition from sub-hiring to 100% direct-owned asset fleet",
      "Heavy wooden platform fabrication yards established",
    ],
    image: "/media/events/kanha-canopy-night.0c0ccba9.webp",
    alt: "Directly owned German clear-span structure engineering",
  },
  {
    year: "2005",
    period: "2005 – 2017",
    tag: "Scale Expansion",
    headline: "High-Precision Expos & Climate Engineering",
    description:
      "As India became a global hub for industrial trade fairs and summits, Raja scaled its specialized modular infrastructure. Deploying tens of thousands of square meters of Octonorm and Maxima exhibition stalls, paired with 3,000 tons of mobile HVAC chilling systems, the firm became the turnkey partner for national expos.",
    deliverables: [
      "10,000+ sq. mtr. Octonorm and Maxima stall deployment",
      "3,000-ton temporary mobile HVAC cooling division",
      "National industrial trade fair execution in New Delhi, Mumbai, and Bengaluru",
    ],
    image: "/media/events/eima-mahindra-stall.526d34c1.webp",
    alt: "Exhibition stall systems and interior expo design",
  },
  {
    year: "Today",
    period: "2018 – 2026",
    tag: "Monumental Era",
    headline: "National Ceremonies & Monumental Mandates",
    description:
      "Raja builds today at the scale its inventory allows: covered assemblies for gatherings numbering in the tens of thousands, multi-hall exhibition grounds, national congresses and naval ceremonial work — structures, flooring, staging and services delivered as one contract.",
    // Deliverables list only engagements that appear on Raja's own schedule or
    // its own website. The three previously listed here — a stadium
    // swearing-in, an airport dedication by the Prime Minister, and a
    // hundred-thousand-delegate literature conference — appear on neither, and
    // carried delegate counts nobody had supplied.
    deliverables: [
      "Tent city and covered assembly, Kanha Shanti Vanam",
      "EIMA Agrimach international agricultural machinery fair",
      "ICGS Akshay commissioning, Goa Shipyard Limited",
    ],
    image: "/media/events/larenon-stall-counter.33e301ef.webp",
    alt: "A fabricated exhibition stall with branded fascia and display counters",
  },
];

export interface InventoryItem {
  number: string;
  unit: string;
  label: string;
  description: string;
  tag: string;
  image: string;
}

export const inventoryHighlights: InventoryItem[] = [
  {
    number: "5,00,000",
    unit: "Sq. Ft.",
    label: "Imported German Hangers",
    description: "Clear-span aluminium structures engineered for wind loads up to 120 km/h, fire-retardant membranes, and pillar-free sightlines.",
    tag: "Heavy Structures",
    image: "/media/events/kanha-canopy-seating.7a22707d.webp",
  },
  {
    number: "10,00,000",
    unit: "Sq. Ft.",
    label: "Modular Wooden Floor Platforms",
    description: "Heavy-duty load-bearing subfloors, leveling laser-aligned platforms capable of supporting industrial machinery and massive crowds.",
    tag: "Ground Engineering",
    image: "/media/events/kanha-assembly-floor-aerial.da511112.webp",
  },
  {
    number: "1,00,000",
    unit: "Sq. Ft.",
    label: "Engineered Stage Infrastructure",
    description: "Reinforced steel-truss staging and tiered platforms engineered for high-security VIP protocols, orchestral setups, and state ceremonies.",
    tag: "Dais & Staging",
    image: "/media/events/isgcon-stage-lamp.5633cdec.webp",
  },
  {
    number: "3,000",
    unit: "Tons",
    label: "Temporary Climate Control & HVAC",
    description: "Mobile chillers, air-handling ducting, and industrial environmental systems ensuring ambient comfort inside temporary structures.",
    tag: "Climate Control",
    image: "/media/events/kanha-canopy-interior.0403268d.webp",
  },
  {
    number: "1,00,000",
    unit: "RFT",
    label: "Iron Crowd-Control Barricades",
    description: "10,000 heavy-gauge interlocking steel barrier units certified for police cordons, VIP security perimeters, and stadium crowd zoning.",
    tag: "Security Perimeter",
    image: "/media/events/aol-crowd-aerial.72481eb2.webp",
  },
  {
    number: "20",
    unit: "Vehicles",
    label: "Dedicated Heavy Logistics Fleet",
    description: "Company-owned goods carriers, multi-axle transport vehicles, and emergency support units ensuring zero transit delays across India.",
    tag: "Logistics Fleet",
    image: "/media/events/eima-ground-dusk.284dd6b2.webp",
  },
];

export interface MilestoneItem {
  id: string;
  year: string;
  title: string;
  venue: string;
  scale: string;
  scope: string;
  image: string;
}

/**
 * Milestones.
 *
 * REBUILT 2026-09-04. This list previously led with engagements that appear on
 * neither Raja's supplied schedule nor Raja's own website — a stadium
 * swearing-in, an airport dedication, a literature conference — and attached
 * unsourced figures to them: "50,000+ Citizens & Dignitaries", "10,000 RFT
 * security barricading". Those are exactly the claims a government tender
 * checks, and none of them could be evidenced.
 *
 * These four are engagements Raja has supplied photographs of. Scale is
 * described rather than counted, because no counts were supplied.
 */
export const milestoneMoments: MilestoneItem[] = [
  {
    id: "kanha-tent-city",
    year: "2024",
    title: "Kanha Shanti Vanam Tent City",
    venue: "Kanha Shanti Vanam",
    scale: "Assembly of many thousands, under cover",
    scope: "Clear-span cover across the full assembly floor, levelled flooring, seating and circulation planned as one scope.",
    image: "/media/events/kanha-canopy-assembly-aerial.56be51e1.webp",
  },
  {
    id: "eima-agrimach-2024",
    year: "2024",
    title: "EIMA Agrimach",
    venue: "Bengaluru",
    scale: "International agricultural machinery fair",
    scope: "Exhibition ground build — fabricated stands, printed fascia and flooring across an open site carrying heavy machinery displays.",
    image: "/media/events/eima-expo-crowd.11d4b8f2.webp",
  },
  {
    id: "isgcon-2023",
    year: "2023",
    title: "ISGCON — 64th Annual Congress",
    venue: "Bengaluru",
    scale: "National medical congress",
    scope: "Conference staging, dais and audience infrastructure with printed backdrop and lighting rig.",
    image: "/media/events/isgcon-stage-award.1423a9d8.webp",
  },
  {
    id: "icgs-akshay",
    year: "Jun 2026",
    title: "ICGS Akshay Commissioning",
    venue: "Goa Shipyard Limited, Vasco",
    scale: "Indian Coast Guard fast patrol vessel",
    scope: "Ceremonial dais, canopy and parade infrastructure for a naval commissioning.",
    image: "/media/events/icgs-akshay-commissioning.4d56e6c2.webp",
  },
];


export interface Principle extends Sourced {
  index: string;
  title: string;
  lead: string;
  body: string;
}

export const principles: Principle[] = [
  {
    index: "01",
    title: "Asset Supremacy",
    lead: "We own 100% of what we erect.",
    body: "Every German hangar beam, wooden floor tile, stage truss, and HVAC chiller is stored in our own yards and transported in our own trucks. We never sub-hire on the week of your event. Your date is permanently secured against vendor price gouging, stock shortages, and third-party delays.",
    status: "approved",
  },
  {
    index: "02",
    title: "The Single Field Guild",
    lead: "A permanent field workforce, zero subcontracting.",
    body: "Our 300 riggers, 100 skilled fabricators, 50 site engineers, and 10 project managers are permanent payroll employees. The team that levels the bare earth is the exact team that raises the aluminium arches, fits the lighting, and strikes the venue after handover.",
    status: "approved",
  },
  {
    index: "03",
    title: "2 AM Direct Accountability",
    lead: "One contract, one number, zero finger-pointing.",
    body: "When severe weather strikes or protocol changes at 2:00 AM before a VVIP arrival, you don't navigate a maze of fragmented subcontractors. You call our on-site project director who possesses direct operational authority to mobilize men and machines immediately.",
    status: "approved",
  },
  {
    index: "04",
    title: "Pan-India Rapid Mobilization",
    lead: "Self-sufficient logistics across the subcontinent.",
    body: "With 20 company-owned heavy goods vehicles and strategically managed supply lines, Raja mobilizes millions of square feet of infrastructure across Karnataka, Maharashtra, Delhi, and nationwide within 48 to 72 hours.",
    status: "approved",
  },
];
