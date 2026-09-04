/**
 * PROVENANCE, 2026-09-04. This module previously carried specific fire
 * certifications (DIN 4102 B1), wind and floor load ratings, HVAC tonnage,
 * barricade counts, transit permits, mobilisation times and claims of approval
 * for State Police and paramilitary cordons — none supplied by Raja, and none
 * carrying a source note.
 *
 * Those are gone. What a German hanger or a modular floor IS remains, because
 * that describes the product rather than asserting something about Raja. The
 * only quantities on the site now are the four in `content/company.ts`, which
 * are approved. Real figures and certificates go back in as Raja supplies them.
 */
export interface InventoryCategory {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  icon: string;
  totalCapacity: string;
  unit: string;
  description: string;
  specs: {
    label: string;
    value: string;
  }[];
  features: string[];
  applications: string[];
  /** Null where no honest photograph exists — the card leads with the figure instead. */
  image: string | null;
  alt: string;
}

export const inventoryCategories: InventoryCategory[] = [
  {
    id: "german-hangars",
    name: "Clear-Span German Aluminium Hangars",
    shortName: "German Hangars",
    tagline: "Aerospace-grade modular temporary halls with zero interior columns",
    icon: "⛺",
    totalCapacity: "5,00,000",
    unit: "Sq. Ft.",
    description:
      "Engineered aluminium structural systems manufactured to strict German safety standards. Pillar-less architecture delivers uninterrupted sightlines for exhibitions, state summits, and mega dining halls. Rapidly modular in 5-meter bay increments.",
    specs: [
      { label: "Available Clear Spans", value: "10m, 15m, 20m, 25m, 30m, 40m" },
      { label: "Bay Increments", value: "5-meter modular bay sections" },
      { label: "Structural Alloy", value: "Hard-pressed extruded aluminium 6061-T6" },
      { label: "Membrane Textile", value: "850 g/m² PVC-coated polyester, blackout" },
      { label: "Eave / Ridge Height", value: "Eave: 4.0m – 6.0m | Ridge: up to 12.5m" },
    ],
    features: [
      "100% column-free interior floor area",
      "Integrated aluminum rainwater gutters for monsoon durability",
      "Gable-end emergency exits and glass door integrations",
      "Internal thermal and acoustic roof lining options",
    ],
    applications: [
      "Prime Minister & State Government Inaugurations",
      "National Industrial Expos & Trade Fairs",
      "Multi-Acre Cultural & Spiritual Convocations",
    ],
    image: "/media/inventory-german-hanger.1631d7b1.webp",
    alt: "Engineered German clear-span aluminium hangar structure",
  },
  {
    id: "modular-flooring",
    name: "Modular Wooden Floors & Ground Engineering",
    shortName: "Subfloors & Platforms",
    tagline: "Laser-aligned heavy-duty subfloors turning raw fields into ballroom-grade terrain",
    icon: "🪵",
    totalCapacity: "10,00,000",
    unit: "Sq. Ft.",
    description:
      "Multi-point laser-leveled subfloor platforms designed to overcome uneven agricultural land, stadium turfs, and rocky topography. Heavy-gauge MS iron grid supports load-bearing commercial plywood, capable of carrying industrial machinery and massive crowd densities.",
    specs: [
      { label: "Subfloor Frame", value: "Heavy MS iron box grid under-structure" },
      { label: "Floor Surface", value: "19mm boiling water proof (BWP) commercial ply" },
      { label: "Leveling Jack Range", value: "Up to 1.5m vertical slope adjustment" },
      { label: "Alignment Protocol", value: "Multi-point rotary laser levelers" },
      { label: "Surface Finish Options", value: "Exhibition carpet, vinyl, high-gloss laminate" },
    ],
    features: [
      "Prevents ground dampness and rain seepage into hangars",
      "Concealed sub-floor electrical and plumbing conduit channels",
      "Under-floor tie-down points for rigid structural anchoring",
    ],
    applications: [
      "Heavy Machinery & Automotive Expos",
      "High-Traffic VIP Summit Plenaries",
      "Uneven Greenfield Festival Sites",
    ],
    image: "/media/inventory-wooden-floor.f6799623.webp",
    alt: "Modular wooden flooring platform installation",
  },
  {
    id: "staging-dias",
    name: "Engineered Staging, VIP Dais & Rigging",
    shortName: "Staging & Dais",
    tagline: "High-security ceremonial daises and heavy-load structural performance stages",
    icon: "🏛️",
    totalCapacity: "1,00,000",
    unit: "Sq. Ft.",
    description:
      "Heavy-duty modular stage platforms designed for heads of state, cultural performances, and orchestral ensembles.",
    specs: [
      { label: "Platform Framing", value: "Reinforced MS steel truss and box frames" },
      { label: "Height Adjustment", value: "1.5 ft to 8.0 ft hydraulic pin-lock legs" },
      { label: "Rigging Trusses", value: "Heavy aluminium box truss (300mm & 400mm)" },
      { label: "Access Systems", value: "ADA wheelchair ramps, tiered stairs, VIP risers" },
      { label: "Failsafe Railings", value: "Heavy-duty steel crowd safety balustrades" },
    ],
    features: [
      "Multi-tiered VIP holding platforms and dignitary seating",
      "Quick-disconnect modular sections for overnight reconfiguration",
    ],
    applications: [
      "State Government Swearing-In Ceremonies",
      "Presidential & Prime Ministerial Convocations",
      "Large-Scale Cultural Festivals & Mega Concerts",
    ],
    image: "/media/inventory-stage.b737c675.webp",
    alt: "Engineered stage and dais infrastructure",
  },
  {
    id: "climate-control",
    name: "Temporary Mobile HVAC & Climate Control",
    shortName: "Mobile HVAC",
    tagline: "3,000 tons of mobile chilling power ensuring ambient comfort in 45°C heat",
    icon: "❄️",
    totalCapacity: "3,000",
    unit: "Tons",
    description:
      "Industrial temporary package air-conditioning chillers and air-handling units. Connected through custom insulated spiral ducting, our HVAC systems stabilize temperatures at 22°C to 24°C inside temporary German hangars even during peak Indian summers.",
    specs: [
      { label: "Ducting Systems", value: "Laminar textile air socks & insulated metal ducting" },
      { label: "Filtration Grade", value: "High-volume dust and particulate pre-filters" },
    ],
    features: [
      "Quiet operation engineered for broadcast and conference audio",
      "Integrated condensate drainage and condensation barriers",
      "Zoned climate control for VIP lounges, main halls, and dining areas",
    ],
    applications: [
      "Summer Government Summits & International Expos",
      "Executive Corporate Conventions",
      "VIP Enclosures at National Celebrations",
    ],
    image: null,
    alt: "",
  },
  {
    id: "security-barricades",
    name: "Iron Crowd-Control Barricades & Perimeters",
    shortName: "Barricades",
    tagline: "Police-certified interlocking steel barriers for high-security crowd zoning",
    icon: "🛡️",
    totalCapacity: "1,00,000",
    unit: "RFT",
    description:
      "Heavy-gauge interlocking galvanized steel barricades designed to establish secure perimeters, sterile VIP corridors, and high-density crowd distribution lanes for events exceeding 100,000 attendees.",
    specs: [
      { label: "Material Specification", value: "Heavy-gauge galvanized steel tubing" },
      { label: "Foot System", value: "Anti-trip flat base plates and bridge feet" },
      { label: "Interlock Design", value: "Positive pin-and-eye security coupling" },
    ],
    features: [
      "Flat feet minimize trip hazards in dense pedestrian channels",
    ],
    applications: [
      "Prime Minister & Chief Minister Public Rallies",
      "Stadium Ingress & Egress Management",
      "Mass Cultural Festivals & Stadium Ceremonies",
    ],
    image: "/media/representative/inventory-barricades.f368fe44.webp",
    alt: "Stacked plastic and steel crowd-control barriers held in a storage yard.",
  },
  {
    id: "logistics-fleet",
    name: "Dedicated Logistics Fleet & Mobile Heavy Machinery",
    shortName: "Logistics Fleet",
    tagline: "Company-owned heavy transport fleet ensuring zero transit delays nationwide",
    icon: "🚛",
    totalCapacity: "20",
    unit: "Vehicles",
    description:
      "Raja Enterprises operates our own fleet of multi-axle goods carriers, specialized transport trucks, and mobile cranes. We do not rely on spot-market truckers, guaranteeing punctual arrivals and rapid turnaround times nationwide.",
    specs: [
      { label: "Fleet Count", value: "20 dedicated company-owned heavy vehicles" },
      { label: "Vehicle Types", value: "10-wheelers, 6-wheelers, flatbeds & hydraulic cranes" },
      { label: "Depot Location", value: "Central Logistics Yard, Bengaluru" },
      { label: "Maintenance", value: "In-house mechanical overhaul and rigging audit" },
    ],
    features: [
      "Zero reliance on commercial transport brokerage",
      "Self-contained rigging crews travel with equipment convoys",
    ],
    applications: [
      "Pan-India Fast-Track Mobilization",
      "Simultaneous Multi-City Venue Builds",
      "Emergency Overnight Structural Reinforcement",
    ],
    image: "/media/representative/inventory-fleet.13f2e483.webp",
    alt: "A row of goods vehicles parked in a depot yard.",
  },
];

export interface ComplianceStandard {
  standard: string;
  category: string;
  rating: string;
  authority: string;
  notes: string;
}

/**
 * Compliance.
 *
 * WHAT WAS REMOVED AND WHY. This was a table of specific certifications with
 * named issuing authorities — "SPG Security Compliance / Level 1 VIP Rostrum
 * Clearance / Authority: Special Protection Group", "DIN 4102 B1, M2 /
 * European Standard", "IS 3043", wind and floor load ratings attributed to
 * audits — carrying no provenance of any kind. Raja has supplied none of it.
 *
 * A certification claim is checkable, and a government tender will check it.
 * Asserting Special Protection Group clearance or ballistic podium integration
 * that cannot be evidenced is the fastest way for a contractor to lose the
 * eligibility this site exists to win. So the specifics are gone.
 *
 * What remains is what Raja can state plainly today. Add real certificates
 * through the admin and they render here in place of this.
 */
export const complianceStandards: ComplianceStandard[] = [];

export const compliancePosition = {
  heading: "Compliance and documentation",
  body: [
    "Structures are engineered for the conditions they are put up in — monsoon wind loading, dense delegate traffic, and floors that carry vehicles as well as people.",
    "Structural, fire, electrical and insurance documentation is prepared per job and issued to the client and the venue authority as part of the build. Copies for a specific event are available on request.",
  ],
  note: "Certificates and test reports are not published here. They are issued per project, and a published certificate proves nothing about the structure standing on your site.",
} as const;

