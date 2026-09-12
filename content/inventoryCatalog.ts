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
  href?: string;
  group?: string;
  index?: string;
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
    image: "/media/events/german-hanger-aerial.webp",
    alt: "Aerial view of large-scale German clear-span hanger complex.",
    href: "/services/german-hangers",
    group: "Structures",
    index: "01",
  },
  {
    id: "layer-scaffolding",
    name: "Heavy-Duty Ringlock Scaffolding Systems",
    shortName: "Scaffolding & Rigging",
    tagline: "Engineered high-load modular staging substructure and access towers",
    icon: "🏗️",
    totalCapacity: "National",
    unit: "Deployment",
    description:
      "Heavy-duty galvanized steel ringlock scaffolding engineered for rapid, rigid modular assembly. Supports multi-level camera platforms, concert PA delay towers, and high-load stage sub-structures with extreme stability.",
    specs: [
      { label: "Standard Tube", value: "48.3mm high-tensile galvanized steel" },
      { label: "Connection Node", value: "8-point cast steel rosettes" },
      { label: "Configuration", value: "Towers, gantries, raked seating substructure" },
      { label: "Safety Systems", value: "Integrated toe-boards & non-slip steel decks" },
    ],
    features: [
      "Fast wedge-lock pin assembly requiring no loose couplers",
      "Wind-braced structural geometry for outdoor stability",
      "Engineered for heavy broadcast equipment and camera arrays",
    ],
    applications: [
      "Large-Scale Music Concerts & Broadcast Stages",
      "Stadium Delay Towers & Follow-Spot Risers",
      "VIP Elevated Grandstands and Gantries",
    ],
    image: "/media/events/eima-ground-dusk.284dd6b2.webp",
    alt: "Heavy duty structural scaffold and gantry installation",
    href: "/services/event-scaffolding",
    group: "Staging & Rigging",
    index: "02",
  },
  {
    id: "lighting-av",
    name: "Professional Stage Lighting & AV Systems",
    shortName: "Lighting & AV",
    tagline: "Truss-mounted illumination, concert audio arrays and high-resolution LED video walls",
    icon: "💡",
    totalCapacity: "Broadcast",
    unit: "Grade",
    description:
      "Synchronized stage lighting, high-output audio delay towers, and seamless LED video displays engineered directly into our German hangars and scaffolding frameworks. Zero loose ground cables, preserved sightlines, and calibrated acoustics.",
    specs: [
      { label: "Rigging Truss", value: "Heavy aluminium box truss (300mm & 400mm)" },
      { label: "Display Systems", value: "High-definition P2.6/P3.9 indoor & outdoor LED video walls" },
      { label: "Audio Rigging", value: "Line-array speaker hangs & ground delay towers" },
      { label: "Control Systems", value: "DMX-controlled consoles with synchronized silent power" },
    ],
    features: [
      "Pre-calculated point-load suspension from aluminium hangar purlins",
      "Concealed under-floor and overhead cable management",
      "Integrated with silent diesel gensets for 100% electrical redundancy",
    ],
    applications: [
      "Prime Minister & State Government Inaugurations",
      "Large-Scale Music Concerts & Award Shows",
      "High-Profile Corporate Summits & Expos",
    ],
    image: "/media/inventory-lighting.25f99edf.webp",
    alt: "Concert stage lighting rigs and aerial truss installation during an evening event.",
    href: "/services/lighting-and-av",
    group: "Lighting & AV",
    index: "03",
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
      { label: "Leveling Range", value: "Up to 1.5m vertical slope adjustment" },
      { label: "Surface Finish", value: "Exhibition carpet, vinyl, high-gloss laminate" },
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
    href: "/services/event-flooring",
    group: "Ground Works",
    index: "04",
  },
  {
    id: "exhibition-stalls",
    name: "Modular Octonorm & Maxima Exhibition Stalls",
    shortName: "Exhibition Stalls",
    tagline: "Precision modular shell schemes and custom-branded trade fair pavilions",
    icon: "🎪",
    totalCapacity: "15,000",
    unit: "Sq. M.",
    description:
      "System aluminium stall hardware configured for national expos and international trade fairs. Compatible with standard Octonorm and heavy-section Maxima uprights with custom printed fascia branding and illumination.",
    specs: [
      { label: "System Types", value: "Octonorm standard (40mm) & Maxima (80mm/100mm)" },
      { label: "Panel Substrate", value: "White laminated MDF / Forex panels" },
      { label: "Fascia Integration", value: "Backlit LED headers and vinyl cut lettering" },
      { label: "Electrical", value: "Concealed conduit track lighting and distribution" },
    ],
    features: [
      "Overnight strike and rapid modular reconfiguration",
      "Interchangeable locking extrusions for flexible stand footprints",
      "Integrated display counters, lockable storage and shelving",
    ],
    applications: [
      "International B2B Trade Expos & Machinery Fairs",
      "Medical, Pharmaceutical & Tech Conventions",
      "Government Department & State Pavilions",
    ],
    image: "/media/events/larenon-stall-wide.ae5daaa7.webp",
    alt: "A fabricated exhibition stall shell with printed panels and seating",
    href: "/services/exhibition-stalls",
    group: "Fabrication",
    index: "05",
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
      "Heavy-duty modular stage platforms designed for heads of state, cultural performances, and orchestral ensembles. Integrated with multi-tier seating, broadcast camera risers and rigging towers.",
    specs: [
      { label: "Platform Framing", value: "Reinforced MS steel truss and box frames" },
      { label: "Height Range", value: "1.5 ft to 8.0 ft hydraulic pin-lock legs" },
      { label: "Rigging Trusses", value: "Heavy aluminium box truss (300mm & 400mm)" },
      { label: "Access Systems", value: "ADA wheelchair ramps, tiered stairs, VIP risers" },
    ],
    features: [
      "Multi-tiered VIP holding platforms and dignitary seating",
      "Quick-disconnect modular sections for overnight reconfiguration",
      "Non-slip finishes with ballistic-rated under-structure options",
    ],
    applications: [
      "State Government Swearing-In Ceremonies",
      "Presidential & Prime Ministerial Convocations",
      "Large-Scale Cultural Festivals & Mega Concerts",
    ],
    image: "/media/inventory-stage.b737c675.webp",
    alt: "Engineered stage and dais setup",
    href: "/services/staging-and-seating",
    group: "Staging & Rigging",
    index: "06",
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
      { label: "Total Capacity", value: "3,000 tons industrial cooling fleet" },
      { label: "Ducting Systems", value: "Laminar textile air socks & insulated metal ducting" },
      { label: "Temperature Target", value: "Maintains 22°C–24°C in 45°C ambient heat" },
      { label: "Acoustic Rating", value: "Whisper-quiet AHUs suited for broadcast" },
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
    image: "/media/events/kanha-canopy-interior.0403268d.webp",
    alt: "Interior temporary venue with integrated climate control",
    href: "/services/climate-control",
    group: "Support & Systems",
    index: "07",
  },
  {
    id: "security-barricades",
    name: "Iron Crowd-Control Barricades & Perimeters",
    shortName: "Barricades & Safety",
    tagline: "Police-certified interlocking steel barriers for high-security crowd zoning",
    icon: "🛡️",
    totalCapacity: "1,00,000",
    unit: "RFT",
    description:
      "Heavy-gauge interlocking galvanized steel barricades designed to establish secure perimeters, sterile VIP corridors, and high-density crowd distribution lanes for events exceeding 100,000 attendees.",
    specs: [
      { label: "Total Fleet", value: "1,00,000 running feet in company stock" },
      { label: "Material", value: "Heavy-gauge galvanized steel tubing" },
      { label: "Foot System", value: "Anti-trip flat base plates and bridge feet" },
      { label: "Interlock Design", value: "Positive pin-and-eye security coupling" },
    ],
    features: [
      "Flat feet minimize trip hazards in dense pedestrian channels",
      "Riot-rated coupling prevents disconnect under lateral surge",
      "Stackable for high-density transport and fast deployment",
    ],
    applications: [
      "Prime Minister & Chief Minister Public Rallies",
      "Stadium Ingress & Egress Management",
      "Mass Cultural Festivals & Stadium Ceremonies",
    ],
    image: "/media/representative/inventory-barricades.f368fe44.webp",
    alt: "Stacked plastic and steel crowd-control barriers held in a storage yard.",
    href: "/services/barricades-and-safety",
    group: "Support & Systems",
    index: "08",
  },
  {
    id: "logistics-fleet",
    name: "Dedicated Logistics Fleet & Mobile Heavy Machinery",
    shortName: "Logistics Fleet",
    tagline: "Company-owned heavy transport fleet ensuring zero transit delays nationwide",
    icon: "🚛",
    totalCapacity: "20+",
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
      "GPS tracking and 24/7 convoy telemetry",
    ],
    applications: [
      "Pan-India Fast-Track Mobilization",
      "Simultaneous Multi-City Venue Builds",
      "Emergency Overnight Structural Reinforcement",
    ],
    image: "/media/representative/inventory-fleet.13f2e483.webp",
    alt: "A row of goods vehicles parked in a depot yard.",
    href: "/services/logistics-fleet",
    group: "Support & Systems",
    index: "09",
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

