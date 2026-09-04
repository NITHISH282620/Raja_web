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
    image: "/media/legacy-cm-authority-meeting.792b6646.webp",
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
    image: "/media/capability-structure.3aa80a08.webp",
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
    image: "/media/event-mega-exhibition.webp",
    alt: "Exhibition stall systems and interior expo design",
  },
  {
    year: "Today",
    period: "2018 – 2026",
    tag: "Monumental Era",
    headline: "National Ceremonies & Monumental Mandates",
    description:
      "Today, with 49 years of uninterrupted execution, Raja operates at a national benchmark. Entrusted with Prime Minister dedications, state swearing-in stadium conversions, international airport inaugurations, and 100,000-delegate temporary cities, Raja represents the gold standard of Indian physical infrastructure.",
    deliverables: [
      "Swearing-in Ceremony of Karnataka Government at Kanteerava Stadium",
      "Kempegowda International Airport Terminal 2 & Statue Dedication by PM",
      "86th Kannada Sahitya Sammelana 100,000+ delegate temporary city",
    ],
    image: "/media/work-ceremony.24729b14.webp",
    alt: "Monumental stadium swearing-in and state infrastructure ceremony",
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
    image: "/media/inventory-german-hanger.1631d7b1.webp",
  },
  {
    number: "10,00,000",
    unit: "Sq. Ft.",
    label: "Modular Wooden Floor Platforms",
    description: "Heavy-duty load-bearing subfloors, leveling laser-aligned platforms capable of supporting industrial machinery and massive crowds.",
    tag: "Ground Engineering",
    image: "/media/inventory-wooden-floor.f6799623.webp",
  },
  {
    number: "1,00,000",
    unit: "Sq. Ft.",
    label: "Engineered Stage Infrastructure",
    description: "Reinforced steel-truss staging and tiered platforms engineered for high-security VIP protocols, orchestral setups, and state ceremonies.",
    tag: "Dais & Staging",
    image: "/media/inventory-stage.b737c675.webp",
  },
  {
    number: "3,000",
    unit: "Tons",
    label: "Temporary Climate Control & HVAC",
    description: "Mobile chillers, air-handling ducting, and industrial environmental systems ensuring ambient comfort inside temporary structures.",
    tag: "Climate Control",
    image: "/media/work-corporate.fca2ff69.webp",
  },
  {
    number: "1,00,000",
    unit: "RFT",
    label: "Iron Crowd-Control Barricades",
    description: "10,000 heavy-gauge interlocking steel barrier units certified for police cordons, VIP security perimeters, and stadium crowd zoning.",
    tag: "Security Perimeter",
    image: "/media/legacy-ambedkar-jayanti.fb369379.webp",
  },
  {
    number: "20",
    unit: "Vehicles",
    label: "Dedicated Heavy Logistics Fleet",
    description: "Company-owned goods carriers, multi-axle transport vehicles, and emergency support units ensuring zero transit delays across India.",
    tag: "Logistics Fleet",
    image: "/media/work-agrimach-expo.webp",
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

export const milestoneMoments: MilestoneItem[] = [
  {
    id: "kanteerava-swearing-in",
    year: "May 2023",
    title: "Karnataka Government Swearing-in Ceremony",
    venue: "Kanteerava Stadium, Bengaluru",
    scale: "50,000+ Citizens & Dignitaries",
    scope: "Complete stadium transformation, massive central ceremonial dais, tiered VIP enclosure, 10,000 RFT security barricading, and multi-camera stage rigging.",
    image: "/media/work-ceremony.24729b14.webp",
  },
  {
    id: "pm-airport-inauguration",
    year: "Nov 2022",
    title: "Kempegowda International Airport T2 & 108-ft Statue Dedication",
    venue: "Bengaluru International Airport",
    scale: "Inaugurated by Hon'ble Prime Minister",
    scope: "Clear-span German hangar pavilions, ceremonial dais, VIP holding areas and climate-controlled staging.",
    image: "/media/work-airport-inauguration.webp",
  },
  {
    id: "kannada-sahitya-sammelana",
    year: "Jan 2023",
    title: "86th Kannada Sahitya Sammelana",
    venue: "Haveri, Karnataka",
    scale: "1,00,000+ Delegates & Visitors",
    scope: "Construction of an expansive temporary cultural city: mega main pandal, three satellite presentation stages, book exposition stalls, and mega dining halls.",
    image: "/media/work-krishimela.webp",
  },
  {
    id: "hampi-utsav",
    year: "2024",
    title: "Hampi Utsav World Heritage Celebrations",
    venue: "Hampi, Karnataka (UNESCO World Heritage Site)",
    scale: "State Heritage Cultural Mega-Festival",
    scope: "Heritage-sensitive clear-span pavilions, non-invasive ground leveling, multi-level performance staging, and illumination infrastructure.",
    image: "/media/work-hampi-utsav.webp",
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
    lead: "460 in-house specialists, zero subcontracting.",
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
