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
  image: string;
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
      { label: "Fire Resistance", value: "DIN 4102 B1, M2 flame-retardant certified" },
      { label: "Wind Load Tolerance", value: "Certified up to 100 – 120 km/h" },
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
      { label: "Load-Bearing Rating", value: "750 kg/m² to 1,000 kg/m²" },
      { label: "Leveling Jack Range", value: "Up to 1.5m vertical slope adjustment" },
      { label: "Alignment Protocol", value: "Multi-point rotary laser levelers" },
      { label: "Surface Finish Options", value: "Exhibition carpet, vinyl, high-gloss laminate" },
    ],
    features: [
      "Engineered to withstand heavy automotive & industrial exhibits",
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
      "Heavy-duty modular stage platforms designed for heads of state, cultural performances, and orchestral ensembles. Fully certified to Special Protection Group (SPG) and Central Reserve Police Force (CRPF) structural guidelines for Prime Ministerial events.",
    specs: [
      { label: "Platform Framing", value: "Reinforced MS steel truss and box frames" },
      { label: "Height Adjustment", value: "1.5 ft to 8.0 ft hydraulic pin-lock legs" },
      { label: "Security Compliance", value: "SPG & State Police certified load stability" },
      { label: "Rigging Trusses", value: "Heavy aluminium box truss (300mm & 400mm)" },
      { label: "Access Systems", value: "ADA wheelchair ramps, tiered stairs, VIP risers" },
      { label: "Failsafe Railings", value: "Heavy-duty steel crowd safety balustrades" },
    ],
    features: [
      "Zero-vibration platform stability for broadcast cameras",
      "Integrated presidential ballistic lectern reinforcement",
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
      { label: "Fleet Capacity", value: "3,000 Tons cumulative mobile HVAC" },
      { label: "Unit Configurations", value: "20-Ton, 50-Ton & 100-Ton modular chillers" },
      { label: "Ducting Systems", value: "Laminar textile air socks & insulated metal ducting" },
      { label: "Target Interior Temp", value: "22°C – 24°C controlled environment" },
      { label: "Ambient Tolerance", value: "Tested up to 48°C outside ambient heat" },
      { label: "Filtration Grade", value: "High-volume dust and particulate pre-filters" },
    ],
    features: [
      "Quiet operation engineered for broadcast and conference audio",
      "Integrated condensate drainage and condensation barriers",
      "Synchronized automatic generator switchover for 100% uptime",
      "Zoned climate control for VIP lounges, main halls, and dining areas",
    ],
    applications: [
      "Summer Government Summits & International Expos",
      "Executive Corporate Conventions",
      "VIP Enclosures at National Celebrations",
    ],
    image: "/media/work-corporate.fca2ff69.webp",
    alt: "Industrial mobile HVAC and climate control deployment",
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
      { label: "Inventory Quantity", value: "10,000+ individual interlocking units" },
      { label: "Linear Coverage", value: "1,00,000 Running Feet (RFT)" },
      { label: "Material Specification", value: "Heavy-gauge galvanized steel tubing" },
      { label: "Foot System", value: "Anti-trip flat base plates and bridge feet" },
      { label: "Interlock Design", value: "Positive pin-and-eye security coupling" },
      { label: "Certifications", value: "Approved for State Police & Paramilitary cordons" },
    ],
    features: [
      "Positive interlocking prevents removal or tampering by crowds",
      "Flat feet minimize trip hazards in dense pedestrian channels",
      "Crash-barrier strength for VIP motorcade paths and rostrums",
      "Modular deployment enables rapid sterile-zone reconfiguration",
    ],
    applications: [
      "Prime Minister & Chief Minister Public Rallies",
      "Stadium Ingress & Egress Management",
      "Mass Cultural Festivals & Stadium Ceremonies",
    ],
    image: "/media/legacy-ambedkar-jayanti.fb369379.webp",
    alt: "High-security iron crowd-control barricades deployment",
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
      { label: "Permits", value: "All-India National Transit Permits" },
      { label: "Deployment Speed", value: "48 – 72 hours rapid mobilization nationwide" },
      { label: "Depot Location", value: "Central Logistics Yard, Bengaluru" },
      { label: "Maintenance", value: "In-house mechanical overhaul and rigging audit" },
    ],
    features: [
      "Zero reliance on commercial transport brokerage",
      "Self-contained rigging crews travel with equipment convoys",
      "Onboard GPS telematics for real-time shipment tracking",
      "Dedicated spare parts and rigging replacement cache on every vehicle",
    ],
    applications: [
      "Pan-India Fast-Track Mobilization",
      "Simultaneous Multi-City Venue Builds",
      "Emergency Overnight Structural Reinforcement",
    ],
    image: "/media/work-agrimach-expo.webp",
    alt: "Dedicated heavy transport and logistics fleet",
  },
];

export interface ComplianceStandard {
  standard: string;
  category: string;
  rating: string;
  authority: string;
  notes: string;
}

export const complianceStandards: ComplianceStandard[] = [
  {
    standard: "Wind Load Tolerance",
    category: "German Hangars",
    rating: "120 km/h (33.3 m/s)",
    authority: "Structural Engineering Audit",
    notes: "Aerodynamic roof slope & earth-anchor stake system tested for severe monsoon winds.",
  },
  {
    standard: "Flame Retardancy",
    category: "Roof & Wall Membrane",
    rating: "DIN 4102 B1, M2",
    authority: "European Standard",
    notes: "Self-extinguishing PVC membrane that will not produce flaming drops upon direct ignition.",
  },
  {
    standard: "Floor Load Capacity",
    category: "Modular Wooden Floor",
    rating: "1,000 kg/m² Uniform Load",
    authority: "Industrial Test Audit",
    notes: "Laser-aligned steel lattice framework supports heavy vehicles and dense delegate traffic.",
  },
  {
    standard: "SPG Security Compliance",
    category: "VVIP Stage & Dais",
    rating: "Level 1 VIP Rostrum Clearance",
    authority: "Special Protection Group",
    notes: "Certified for Prime Ministerial rostrums with zero vibration and ballistic podium integration.",
  },
  {
    standard: "Electrical & HVAC Safety",
    category: "Climate & Power",
    rating: "IS 3043 Grounding Standard",
    authority: "Indian Electrical Code",
    notes: "Copper earth pits, automatic phase changers, and fail-safe circuit breaker protection.",
  },
];
