export interface NotableEvent {
  id: string;
  title: string;
  client: string;
  sector: "state-ceremonies" | "pm-dedications" | "expos-summits" | "cultural-cities";
  sectorLabel: string;
  year: string;
  venue: string;
  attendance: string;
  coveredArea: string;
  turnaroundTime: string;
  securityLevel: string;
  summary: string;
  scopeHighlights: string[];
  equipmentDeployed: {
    label: string;
    value: string;
  }[];
  heroImage: string;
  alt: string;
  featured?: boolean;
}

export const notableEventsList: NotableEvent[] = [
  {
    id: "kanteerava-swearing-in",
    title: "Karnataka Government Swearing-In Ceremony",
    client: "Government of Karnataka",
    sector: "state-ceremonies",
    sectorLabel: "State & VIP Ceremonies",
    year: "May 2023",
    venue: "Kanteerava Stadium, Bengaluru",
    attendance: "50,000+ Dignitaries & Citizens",
    coveredArea: "1,50,000 Sq. Ft.",
    turnaroundTime: "48 Hours Turnkey",
    securityLevel: "Z+ & SPG High-Security Protocol",
    featured: true,
    summary:
      "A complete physical transformation of an open sports stadium into a high-security constitutional swearing-in environment within 48 hours. Raja Enterprises engineered the multi-tiered central ceremonial dais, VIP diplomatic holding enclosures, 10,000 RFT iron crowd-control perimeters, and multi-camera broadcast rigging.",
    scopeHighlights: [
      "Monumental central ceremonial rostrum engineered to withstand extreme VIP crowd load",
      "Tiered presidential & cabinet seating enclosures with high-friction safety balustrades",
      "Over 10,000 RFT heavy-gauge iron barricading establishing sterile security channels",
      "Under-dais multi-camera tracking cable routing and reinforced AV suspension trusses",
    ],
    equipmentDeployed: [
      { label: "VIP Staging & Dais", value: "15,000 Sq. Ft." },
      { label: "Iron Barricades", value: "10,000 RFT" },
      { label: "Laser-Aligned Flooring", value: "80,000 Sq. Ft." },
      { label: "In-House Specialists", value: "180 Personnel" },
    ],
    heroImage: "/media/work-ceremony.24729b14.webp",
    alt: "Grand swearing-in ceremony dais and stadium crowd infrastructure",
  },
  {
    id: "kempegowda-airport-dedication",
    title: "Kempegowda Airport T2 & 108-ft Statue Dedication",
    client: "Government of Karnataka / BIAL",
    sector: "pm-dedications",
    sectorLabel: "Prime Minister Dedications",
    year: "Nov 2022",
    venue: "Bengaluru International Airport",
    attendance: "Inaugurated by Hon'ble Prime Minister",
    coveredArea: "2,00,000 Sq. Ft.",
    turnaroundTime: "7 Days Turnkey",
    securityLevel: "SPG Tier 1 Prime Ministerial Protocol",
    featured: true,
    summary:
      "Engineered German clear-span hangar complex erected on airport grounds for the dedication of Terminal 2 and the 108-foot Statue of Prosperity. The mandate demanded strict SPG clearance, column-free sightlines for thousands of dignitaries, and 100% weatherproofing against high airport winds.",
    scopeHighlights: [
      "40-meter clear-span German aluminium hangar pavilions with zero interior columns",
      "Climate-controlled mobile HVAC cooling delivering 22°C ambient temperature",
      "SPG-cleared presidential dais with integrated ballistic lectern structural framing",
      "Dedicated high-load access ramps and covered VIP motorcade transit tunnels",
    ],
    equipmentDeployed: [
      { label: "German Hangars", value: "2,00,000 Sq. Ft." },
      { label: "Mobile HVAC Cooling", value: "1,200 Tons" },
      { label: "Laser Subfloor", value: "2,00,000 Sq. Ft." },
      { label: "Heavy Fleet", value: "16 Truckloads" },
    ],
    heroImage: "/media/work-airport-inauguration.webp",
    alt: "Monumental airport terminal inauguration and presidential pavilion",
  },
  {
    id: "kannada-sahitya-sammelana",
    title: "86th All-India Kannada Sahitya Sammelana",
    client: "Kannada Sahitya Parishat & State of Karnataka",
    sector: "cultural-cities",
    sectorLabel: "Cultural Mega-Convocations",
    year: "Jan 2023",
    venue: "Haveri, Karnataka",
    attendance: "1,00,000+ Delegates & Visitors",
    coveredArea: "3,50,000 Sq. Ft.",
    turnaroundTime: "12 Days Turnkey",
    securityLevel: "State Police Multi-Zone Security",
    summary:
      "Construction of an expansive temporary cultural city spanning over 40 acres of raw agricultural land. Raja Enterprises leveled the topography with laser subfloors, erected the massive main convention pandal, 3 satellite literary symposium pavilions, commercial book exposition stalls, and massive communal dining halls.",
    scopeHighlights: [
      "Massive 100,000-capacity central auditorium pandal with natural acoustic baffling",
      "Three secondary symposium hangars with independent sound-reinforcement staging",
      "Over 400 Octonorm and Maxima exhibition stalls for publishers across Karnataka",
      "Massive covered dining halls with heavy washable subflooring for 50,000 meals daily",
    ],
    equipmentDeployed: [
      { label: "Covered Pavilions", value: "3,50,000 Sq. Ft." },
      { label: "Exposition Stalls", value: "400+ Units" },
      { label: "Subfloor Platforms", value: "2,50,000 Sq. Ft." },
      { label: "Field Riggers", value: "220 Personnel" },
    ],
    heroImage: "/media/work-krishimela.webp",
    alt: "Expansive cultural convention temporary city and delegates pavilion",
  },
  {
    id: "hampi-utsav",
    title: "Hampi Utsav World Heritage Celebrations",
    client: "Department of Tourism, Karnataka",
    sector: "cultural-cities",
    sectorLabel: "Cultural Mega-Convocations",
    year: "2024",
    venue: "Hampi, Karnataka (UNESCO World Heritage Site)",
    attendance: "Heritage Cultural Mega-Festival",
    coveredArea: "1,80,000 Sq. Ft.",
    turnaroundTime: "6 Days Turnkey",
    securityLevel: "Archaeological & VIP Protected Site",
    summary:
      "Deploying high-load performance staging and spectator enclosures directly adjacent to ancient monument ruins without digging or invasive earth anchors. Raja Enterprises used non-invasive counter-weighted ballast blocks, specialized ground-protection subfloors, and multi-tier orchestral staging.",
    scopeHighlights: [
      "Zero ground penetration protocol protecting 14th-century Vijayanagara monument foundations",
      "Multi-tiered performance stage accommodating 200 simultaneous artists and orchestra",
      "Acoustically damped covered spectator pavilions with clear sightlines",
      "Illumination truss grid supporting computerized moving heads and architectural projection mapping",
    ],
    equipmentDeployed: [
      { label: "Non-Invasive Staging", value: "25,000 Sq. Ft." },
      { label: "German Hangars", value: "1,50,000 Sq. Ft." },
      { label: "Box Trussing", value: "4,000 Linear Ft." },
      { label: "Safety Barricades", value: "8,000 RFT" },
    ],
    heroImage: "/media/event-cultural-gathering.webp",
    alt: "Hampi Utsav architectural festival staging against heritage backdrop",
  },
  {
    id: "uttarakhand-investors-summit",
    title: "Uttarakhand Global Investors Summit",
    client: "Government of Uttarakhand",
    sector: "expos-summits",
    sectorLabel: "Industrial Expos & Summits",
    year: "Dec 2023",
    venue: "Dehradun, Uttarakhand",
    attendance: "International Delegations & CEOs",
    coveredArea: "2,20,000 Sq. Ft.",
    turnaroundTime: "5 Days Turnkey",
    securityLevel: "National VVIP Protocol",
    summary:
      "Rapid Pan-India mobilization from Bengaluru to Dehradun (over 2,300 km) within 48 hours. Erection of presidential plenaries, bilateral country pavilions, state-of-the-art climate-controlled investor lounges, and high-gloss exhibition halls.",
    scopeHighlights: [
      "Long-haul rapid mobilization of 14 heavy trailers across 5 state borders without transit delay",
      "Full climate control ensuring steady 22°C interior throughout extreme winter temperatures",
      "Soundproof VIP bilateral meeting suites with acoustic insulation panels",
      "High-gloss white laminate flooring reflecting ambient architectural lighting",
    ],
    equipmentDeployed: [
      { label: "German Hangars", value: "2,20,000 Sq. Ft." },
      { label: "Mobile HVAC", value: "1,500 Tons" },
      { label: "Laminate Flooring", value: "1,80,000 Sq. Ft." },
      { label: "Dedicated Fleet", value: "14 Multi-Axle Trucks" },
    ],
    heroImage: "/media/legacy-uttarakhand-gis.2f326eed.webp",
    alt: "Global Investors Summit international plenary pavilion",
  },
  {
    id: "aicog-medical-congress",
    title: "AICOG National Medical Congress",
    client: "Federation of Obstetric & Gynaecological Societies",
    sector: "expos-summits",
    sectorLabel: "Industrial Expos & Summits",
    year: "2019",
    venue: "BIEC, Bengaluru",
    attendance: "12,000+ Surgical Delegates",
    coveredArea: "1,60,000 Sq. Ft.",
    turnaroundTime: "4 Days Turnkey",
    securityLevel: "Corporate & Institutional Clearance",
    summary:
      "Multi-hall medical convention requiring simultaneous plenary halls, surgical workshop zones, trade exhibition booths, and executive dining pavilions built under strict acoustic and thermal parameters.",
    scopeHighlights: [
      "Acoustic partition walls dividing large hangars into 6 sound-isolated breakout halls",
      "Vibration-free laser-leveled flooring supporting delicate medical simulation equipment",
      "Complete Octonorm pharmaceutical expo layout with 250 standardized trade booths",
      "Continuous climate management with active air exchange filtration",
    ],
    equipmentDeployed: [
      { label: "Hangar Infrastructure", value: "1,60,000 Sq. Ft." },
      { label: "Octonorm Stalls", value: "250 Units" },
      { label: "HVAC Chillers", value: "800 Tons" },
      { label: "Crew on Site", value: "95 Personnel" },
    ],
    heroImage: "/media/event-mega-exhibition.webp",
    alt: "National medical congress trade expo and conference pavilion",
  },
  {
    id: "krishi-mela-expo",
    title: "National Krishi Mela Agro Exposition",
    client: "University of Agricultural Sciences",
    sector: "expos-summits",
    sectorLabel: "Industrial Expos & Summits",
    year: "Nov 2023",
    venue: "GKVK Campus, Bengaluru",
    attendance: "1,50,000+ Farmers & Exhibitors",
    coveredArea: "4,00,000 Sq. Ft.",
    turnaroundTime: "8 Days Turnkey",
    securityLevel: "High-Volume Crowd Protocol",
    summary:
      "Constructing South India's largest outdoor agricultural fair on raw terrain. Requiring heavy-duty subflooring capable of carrying heavy tractors and combine harvesters, plus expansive covered livestock and seed demonstration hangars.",
    scopeHighlights: [
      "Extreme-duty 1,000 kg/m² reinforced wooden flooring supporting 5-ton tractors",
      "High-clearance German hangars accommodating tall agricultural machinery",
      "Extensive dust-containment perimeters and heavy pedestrian crowd flow control",
      "Modular power distribution grid supplying 600 agricultural vendor kiosks",
    ],
    equipmentDeployed: [
      { label: "German Hangars", value: "4,00,000 Sq. Ft." },
      { label: "Heavy Duty Floor", value: "3,00,000 Sq. Ft." },
      { label: "Barricades", value: "15,000 RFT" },
      { label: "Field Brigade", value: "160 Riggers" },
    ],
    heroImage: "/media/work-agrimach-expo.webp",
    alt: "Krishi Mela agricultural machinery exhibition hangar and pavilion",
  },
];
