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
  image: string | null;
  alt: string;
  href?: string;
  group?: string;
  index?: string;
}

export const inventoryCategories: InventoryCategory[] = [
  {
    id: "german-hangars",
    name: "German Hangers & Structures",
    shortName: "German Hangars",
    tagline: "Aerospace-grade modular temporary halls with zero interior columns",
    icon: "⛺",
    totalCapacity: "5,00,000",
    unit: "Sq. Ft.",
    description: "Engineered aluminium structural systems manufactured to strict German safety standards. Pillar-less architecture delivers uninterrupted sightlines for exhibitions, state summits, and mega dining halls. Rapidly modular in 5-meter bay increments.",
    specs: [
      { label: "Available Clear Spans", value: "10m, 15m, 20m, 25m, 30m, 40m" },
      { label: "Bay Increments", value: "5-meter modular bay sections" },
      { label: "Structural Alloy", value: "Hard-pressed extruded aluminium 6061-T6" },
      { label: "Membrane Textile", value: "850 g/m² PVC-coated polyester, blackout" }
    ],
    features: [
      "100% column-free interior floor area",
      "Integrated aluminum rainwater gutters for monsoon durability",
      "Gable-end emergency exits and glass door integrations"
    ],
    applications: [
      "Prime Minister & State Government Inaugurations",
      "National Industrial Expos & Trade Fairs",
      "Multi-Acre Cultural & Spiritual Convocations"
    ],
    image: "/media/events/german-hanger-aerial.webp",
    alt: "Aerial view of large-scale German clear-span hanger complex.",
    href: "/services/german-hangers",
    group: "Structures",
    index: "01",
  },
  {
    id: "wooden-platforms",
    name: "Wooden Platforms & Flooring",
    shortName: "Platforms & Floors",
    tagline: "Laser-aligned heavy-duty subfloors turning raw fields into ballroom-grade terrain",
    icon: "🪵",
    totalCapacity: "10,00,000",
    unit: "Sq. Ft.",
    description: "Multi-point laser-leveled subfloor platforms designed to overcome uneven agricultural land, stadium turfs, and rocky topography. Heavy-gauge MS iron grid supports load-bearing commercial plywood, capable of carrying industrial machinery and massive crowd densities.",
    specs: [
      { label: "Subfloor Frame", value: "Heavy MS iron box grid under-structure" },
      { label: "Floor Surface", value: "19mm boiling water proof (BWP) commercial ply" },
      { label: "Leveling Range", value: "Up to 1.5m vertical slope adjustment" },
      { label: "Surface Finish", value: "Exhibition carpet, vinyl, high-gloss laminate" }
    ],
    features: [
      "Prevents ground dampness and rain seepage into hangars",
      "Concealed sub-floor electrical and plumbing conduit channels",
      "Under-floor tie-down points for rigid structural anchoring"
    ],
    applications: [
      "Heavy Machinery & Automotive Expos",
      "High-Traffic VIP Summit Plenaries",
      "Uneven Greenfield Festival Sites"
    ],
    image: "/media/inventory-wooden-floor.f6799623.webp",
    alt: "Modular wooden flooring platform installation",
    href: "/services/event-flooring",
    group: "Ground Works",
    index: "02",
  },
  {
    id: "octonorm-stalls",
    name: "Octonorm Exhibition Stalls",
    shortName: "Octonorm Stalls",
    tagline: "Flexible and modular stalls for trade shows and expos",
    icon: "🎪",
    totalCapacity: "15,000",
    unit: "Sq. M.",
    description: "System aluminium stall hardware configured for national expos and international trade fairs. Compatible with standard Octonorm uprights with custom printed fascia branding and illumination.",
    specs: [
      { label: "System Types", value: "Octonorm standard (40mm)" },
      { label: "Panel Substrate", value: "White laminated MDF panels" },
      { label: "Fascia Integration", value: "Vinyl cut lettering" },
      { label: "Electrical", value: "Concealed conduit track lighting" }
    ],
    features: [
      "Overnight strike and rapid modular reconfiguration",
      "Interchangeable locking extrusions for flexible stand footprints",
      "Integrated display counters, lockable storage and shelving"
    ],
    applications: [
      "International B2B Trade Expos & Machinery Fairs",
      "Medical, Pharmaceutical & Tech Conventions",
      "Government Department & State Pavilions"
    ],
    image: "/media/events/larenon-stall-wide.ae5daaa7.webp",
    alt: "A fabricated Octonorm exhibition stall shell",
    href: "/services/exhibition-stalls",
    group: "Fabrication",
    index: "03",
  },
  {
    id: "maxima-stalls",
    name: "Maxima Exhibition Stalls",
    shortName: "Maxima Stalls",
    tagline: "Premium modular stalls with elegant design and branding flexibility",
    icon: "💎",
    totalCapacity: "10,000",
    unit: "Sq. M.",
    description: "High-end Maxima aluminium extrusion stalls designed for premium corporate showcases. Offers thicker, more robust structural profiles supporting heavy graphics, large LED screen integrations, and superior architectural presence.",
    specs: [
      { label: "System Types", value: "Heavy section Maxima (80mm/100mm)" },
      { label: "Panel Substrate", value: "Seamless printed fabric or rigid Forex" },
      { label: "Fascia Integration", value: "Backlit LED headers and tension fabric" },
      { label: "Electrical", value: "High-load concealed distribution" }
    ],
    features: [
      "Supports massive spanning headers without mid-columns",
      "Premium finish suitable for global corporate pavilions",
      "Integrates flawlessly with standard Octonorm components"
    ],
    applications: [
      "Premium Corporate Pavilions",
      "International Auto Shows",
      "High-Profile Tech Summits"
    ],
    image: "/media/inventory/maxima_stalls.jpg",
    alt: "A premium Maxima exhibition stall",
    href: "/services/exhibition-stalls",
    group: "Fabrication",
    index: "04",
  },
  {
    id: "staging-dais",
    name: "Staging & Dais",
    shortName: "Staging & Dais",
    tagline: "High-security ceremonial daises and heavy-load structural performance stages",
    icon: "🏛️",
    totalCapacity: "1,00,000",
    unit: "Sq. Ft.",
    description: "Heavy-duty modular stage platforms designed for heads of state, cultural performances, and orchestral ensembles. Integrated with multi-tier seating, broadcast camera risers and rigging towers.",
    specs: [
      { label: "Platform Framing", value: "Reinforced MS steel truss and box frames" },
      { label: "Height Range", value: "1.5 ft to 8.0 ft hydraulic pin-lock legs" },
      { label: "Rigging Trusses", value: "Heavy aluminium box truss (300mm & 400mm)" },
      { label: "Access Systems", value: "ADA wheelchair ramps, tiered stairs, VIP risers" }
    ],
    features: [
      "Multi-tiered VIP holding platforms and dignitary seating",
      "Quick-disconnect modular sections for overnight reconfiguration",
      "Non-slip finishes with ballistic-rated under-structure options"
    ],
    applications: [
      "State Government Swearing-In Ceremonies",
      "Presidential & Prime Ministerial Convocations",
      "Large-Scale Cultural Festivals & Mega Concerts"
    ],
    image: "/media/inventory-stage.b737c675.webp",
    alt: "Engineered stage and dais setup",
    href: "/services/staging-and-seating",
    group: "Staging & Rigging",
    index: "05",
  },
  {
    id: "seating-solutions",
    name: "Seating Solutions",
    shortName: "Seating",
    tagline: "Wide range of seating including plastic chairs, cushioned chairs and VIP seating",
    icon: "🪑",
    totalCapacity: "5,00,000",
    unit: "Seats",
    description: "Complete seating infrastructure for events of any scale. From mass plastic seating for massive political rallies to premium velvet-cushioned banquet chairs and luxurious VIP sofa lounges for corporate summits.",
    specs: [
      { label: "Mass Seating", value: "High-durability plastic chairs for outdoor venues" },
      { label: "Banquet Seating", value: "Premium cushioned chairs with fabric covers" },
      { label: "VIP Seating", value: "Plush leather/fabric sofas and lounge chairs" },
      { label: "Tiered Seating", value: "Raked grandstand seating structures" }
    ],
    features: [
      "Rapid deployment for crowds exceeding 100,000",
      "Color-coordinated chair covers and bows available",
      "Immaculately maintained VIP furniture inventory"
    ],
    applications: [
      "Mass Public Rallies & Convocations",
      "Corporate Seminars & Award Galas",
      "High-Security VIP Enclosures"
    ],
    image: "/media/inventory/seating_solutions.jpg",
    alt: "Rows of elegant event seating",
    href: "/services/staging-and-seating",
    group: "Staging & Rigging",
    index: "06",
  },
  {
    id: "climate-control",
    name: "Temporary AC & Climate Control",
    shortName: "Mobile HVAC",
    tagline: "High-capacity mobile AC units with ducting for large venues",
    icon: "❄️",
    totalCapacity: "3,000",
    unit: "Tons",
    description: "Industrial temporary package air-conditioning chillers and air-handling units. Connected through custom insulated spiral ducting, our HVAC systems stabilize temperatures at 22°C to 24°C inside temporary German hangars even during peak Indian summers.",
    specs: [
      { label: "Total Capacity", value: "3,000 tons industrial cooling fleet" },
      { label: "Ducting Systems", value: "Laminar textile air socks & insulated metal ducting" },
      { label: "Temperature Target", value: "Maintains 22°C–24°C in 45°C ambient heat" },
      { label: "Acoustic Rating", value: "Whisper-quiet AHUs suited for broadcast" }
    ],
    features: [
      "Quiet operation engineered for broadcast and conference audio",
      "Integrated condensate drainage and condensation barriers",
      "Zoned climate control for VIP lounges, main halls, and dining areas"
    ],
    applications: [
      "Summer Government Summits & International Expos",
      "Executive Corporate Conventions",
      "VIP Enclosures at National Celebrations"
    ],
    image: "/media/inventory/climate_control.jpg",
    alt: "Industrial mobile AC unit hooked up to a tent",
    href: "/services/climate-control",
    group: "Support & Systems",
    index: "07",
  },
  {
    id: "crowd-barricades",
    name: "Barricading & Crowd Control",
    shortName: "Barricades",
    tagline: "Heavy-duty galvanized barricades for safe and efficient crowd management",
    icon: "🛡️",
    totalCapacity: "1,00,000",
    unit: "RFT",
    description: "Heavy-gauge interlocking galvanized steel barricades designed to establish secure perimeters, sterile VIP corridors, and high-density crowd distribution lanes for events exceeding 100,000 attendees.",
    specs: [
      { label: "Total Fleet", value: "1,00,000 running feet in company stock" },
      { label: "Material", value: "Heavy-gauge galvanized steel tubing" },
      { label: "Foot System", value: "Anti-trip flat base plates and bridge feet" },
      { label: "Interlock Design", value: "Positive pin-and-eye security coupling" }
    ],
    features: [
      "Flat feet minimize trip hazards in dense pedestrian channels",
      "Riot-rated coupling prevents disconnect under lateral surge",
      "Stackable for high-density transport and fast deployment"
    ],
    applications: [
      "Prime Minister & Chief Minister Public Rallies",
      "Stadium Ingress & Egress Management",
      "Mass Cultural Festivals & Stadium Ceremonies"
    ],
    image: "/media/inventory/crowd_barricades.jpg",
    alt: "Steel crowd control barricades in a line",
    href: "/services/barricades-and-safety",
    group: "Support & Systems",
    index: "08",
  },
  {
    id: "lighting-av",
    name: "Lighting & AV",
    shortName: "Lighting & AV",
    tagline: "Stage lighting, truss systems, LED screens, sound and technical equipment",
    icon: "💡",
    totalCapacity: "Broadcast",
    unit: "Grade",
    description: "Synchronized stage lighting, high-output audio delay towers, and seamless LED video displays engineered directly into our German hangars and scaffolding frameworks. Zero loose ground cables, preserved sightlines, and calibrated acoustics.",
    specs: [
      { label: "Rigging Truss", value: "Heavy aluminium box truss (300mm & 400mm)" },
      { label: "Display Systems", value: "High-definition P2.6/P3.9 indoor & outdoor LED walls" },
      { label: "Audio Rigging", value: "Line-array speaker hangs & ground delay towers" },
      { label: "Control Systems", value: "DMX-controlled consoles with synchronized power" }
    ],
    features: [
      "Pre-calculated point-load suspension from aluminium hangar purlins",
      "Concealed under-floor and overhead cable management",
      "Integrated with silent diesel gensets for 100% electrical redundancy"
    ],
    applications: [
      "Large-Scale Music Concerts & Award Shows",
      "High-Profile Corporate Summits & Expos",
      "Broadcast-Level Live Events"
    ],
    image: "/media/inventory/lighting_av.jpg",
    alt: "Concert stage lighting and AV rig",
    href: "/services/lighting-and-av",
    group: "Lighting & AV",
    index: "09",
  },
  {
    id: "generators-power",
    name: "Generators & Power",
    shortName: "Generators",
    tagline: "Reliable power solutions with industrial generators and distribution systems",
    icon: "⚡",
    totalCapacity: "Unlimited",
    unit: "kVA",
    description: "Industrial-grade acoustic diesel generators delivering uncompromised, redundant power for massive temporary setups. Complete with heavy-duty cabling, intelligent distribution boards, and silent operation suitable for broadcast.",
    specs: [
      { label: "Generator Output", value: "62kVA to 500kVA+ silent gensets" },
      { label: "Distribution", value: "MCB/MCCB protected weatherproof distribution panels" },
      { label: "Cabling", value: "Armoured heavy-duty industrial cables" },
      { label: "Redundancy", value: "Auto-synchronizing dual/triple redundant setups" }
    ],
    features: [
      "Acoustic enclosures ensuring whisper-quiet operation",
      "Zero-downtime synchronized power grids for critical events",
      "On-site fuel management and technical monitoring crews"
    ],
    applications: [
      "Live Broadcasts & Award Ceremonies",
      "Massive Off-Grid Festival Sites",
      "Emergency Power Backup for Summits"
    ],
    image: "/media/inventory/generators_power.jpg",
    alt: "Industrial event power generator",
    href: "/services/lighting-and-av",
    group: "Support & Systems",
    index: "10",
  },
  {
    id: "logistics-transport",
    name: "Logistics & Transport",
    shortName: "Logistics Fleet",
    tagline: "Company-owned fleet for safe and timely deployment across India",
    icon: "🚛",
    totalCapacity: "20+",
    unit: "Vehicles",
    description: "Raja Enterprises operates our own fleet of multi-axle goods carriers, specialized transport trucks, and mobile cranes. We do not rely on spot-market truckers, guaranteeing punctual arrivals and rapid turnaround times nationwide.",
    specs: [
      { label: "Fleet Count", value: "20 dedicated company-owned heavy vehicles" },
      { label: "Vehicle Types", value: "10-wheelers, 6-wheelers, flatbeds & hydraulic cranes" },
      { label: "Depot Location", value: "Central Logistics Yard, Bengaluru" },
      { label: "Maintenance", value: "In-house mechanical overhaul and rigging audit" }
    ],
    features: [
      "Zero reliance on commercial transport brokerage",
      "Self-contained rigging crews travel with equipment convoys",
      "GPS tracking and 24/7 convoy telemetry"
    ],
    applications: [
      "Pan-India Fast-Track Mobilization",
      "Simultaneous Multi-City Venue Builds",
      "Emergency Overnight Structural Reinforcement"
    ],
    image: "/media/inventory/logistics_fleet.jpg",
    alt: "Event logistics truck loaded with equipment",
    href: "/services/logistics-fleet",
    group: "Support & Systems",
    index: "11",
  },
  {
    id: "catering-event-support",
    name: "Catering & Event Support",
    shortName: "Event Support",
    tagline: "Complete catering infrastructure and event support equipment for large gatherings",
    icon: "🍽️",
    totalCapacity: "1,00,000+",
    unit: "Pax",
    description: "Beyond core infrastructure, we provide extensive ancillary support including massive catering setups, dining enclosures, VIP buffet stations, and all associated structural needs to feed thousands of attendees seamlessly.",
    specs: [
      { label: "Dining Hangars", value: "Dedicated ventilated clear-span dining halls" },
      { label: "Buffet Setup", value: "Long-run buffet counters and chafing dish stations" },
      { label: "Kitchen Infrastructure", value: "Fire-safe backend kitchen tents with exhaust systems" },
      { label: "Waste Management", value: "Integrated temporary wet/dry waste zoning" }
    ],
    features: [
      "Hygienic, easy-to-clean floor and wall surfaces in dining zones",
      "High-capacity ventilation ensuring comfortable dining experiences",
      "Scalable from intimate VIP galas to 100,000+ public feeds"
    ],
    applications: [
      "Mass Cultural Festival Feasts",
      "High-Profile Wedding Receptions",
      "Corporate Summit Gala Dinners"
    ],
    image: "/media/inventory/event_catering.jpg",
    alt: "Premium event catering buffet setup",
    href: "/services/staging-and-seating",
    group: "Support & Systems",
    index: "12",
  }
];

export interface ComplianceStandard {
  standard: string;
  category: string;
  rating: string;
  authority: string;
  notes: string;
}

export const complianceStandards: ComplianceStandard[] = [];

export const compliancePosition = {
  heading: "Compliance and documentation",
  body: [
    "Structures are engineered for the conditions they are put up in — monsoon wind loading, dense delegate traffic, and floors that carry vehicles as well as people.",
    "Structural, fire, electrical and insurance documentation is prepared per job and issued to the client and the venue authority as part of the build. Copies for a specific event are available on request.",
  ],
  note: "Certificates and test reports are not published here. They are issued per project, and a published certificate proves nothing about the structure standing on your site.",
} as const;
