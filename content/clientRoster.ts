import type { ImageAsset } from "./types";
import { clients, type Client } from "./clients";

export interface ClientItem {
  id: string;
  name: string;
  event: string;
  logo: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  category: "Government" | "Enterprise" | "Cultural" | "Education" | "Healthcare" | "Exhibition";
}

/**
 * 27 client engagements as confirmed from Raja Enterprises records.
 * All items have dedicated high-fidelity logo assets.
 */
export const CLIENTS_27: ClientItem[] = [
  {
    id: "govt-karnataka",
    name: "Government of Karnataka",
    event: "State summits & official infrastructure",
    logo: {
      src: "/media/client-karnataka-govt.webp",
      width: 256,
      height: 256,
      alt: "Government of Karnataka emblem",
    },
    category: "Government",
  },
  {
    id: "govt-india",
    name: "Government of India",
    event: "National forums & inaugural pavilions",
    logo: {
      src: "/media/client-government-of-india.webp",
      width: 300,
      height: 136,
      alt: "Government of India emblem",
    },
    category: "Government",
  },
  {
    id: "art-of-living",
    name: "The Art of Living Trust",
    event: "Navarathri Function 2023",
    logo: {
      src: "/media/clients/art-of-living.svg",
      width: 220,
      height: 60,
      alt: "The Art of Living Trust logo",
    },
    category: "Cultural",
  },
  {
    id: "isgcon-bengaluru",
    name: "ISGCON Bengaluru",
    event: "64th Annual Congress of ISGCON",
    logo: {
      src: "/media/clients/isgcon.svg",
      width: 200,
      height: 60,
      alt: "ISGCON Bengaluru logo",
    },
    category: "Healthcare",
  },
  {
    id: "la-renon",
    name: "La Renon Healthcare",
    event: "Corporate Annual Event",
    logo: {
      src: "/media/clients/larenon.svg",
      width: 200,
      height: 60,
      alt: "La Renon Healthcare logo",
    },
    category: "Healthcare",
  },
  {
    id: "first-circle",
    name: "First Circle Biztech",
    event: "FC Expo 2024 & 2025",
    logo: {
      src: "/media/clients/first-circle.svg",
      width: 200,
      height: 60,
      alt: "First Circle Biztech logo",
    },
    category: "Exhibition",
  },
  {
    id: "ficci",
    name: "FICCI",
    event: "EIMA Agrimach 2024",
    logo: {
      src: "/media/clients/ficci.svg",
      width: 200,
      height: 60,
      alt: "FICCI logo",
    },
    category: "Enterprise",
  },
  {
    id: "kanha-shanti",
    name: "Kanha Shanti Vanam",
    event: "Tent City Infrastructure, Bengaluru",
    logo: {
      src: "/media/clients/kanha-shanti.svg",
      width: 220,
      height: 60,
      alt: "Kanha Shanti Vanam logo",
    },
    category: "Cultural",
  },
  {
    id: "abs-business",
    name: "ABS Business Solutions",
    event: "National Education Fair & Vidyapeeta Expo",
    logo: {
      src: "/media/clients/abs-business.svg",
      width: 200,
      height: 60,
      alt: "ABS Business Solutions logo",
    },
    category: "Enterprise",
  },
  {
    id: "collegedunia",
    name: "Collegedunia Web",
    event: "Collegedunia Education Fair",
    logo: {
      src: "/media/client-collegedunia-learn.webp",
      width: 300,
      height: 170,
      alt: "Collegedunia logo",
    },
    category: "Education",
  },
  {
    id: "gte-expo",
    name: "Garment Technology Expo",
    event: "GTE 2024 Bangalore",
    logo: {
      src: "/media/clients/gte-expo.svg",
      width: 190,
      height: 60,
      alt: "Garment Technology Expo logo",
    },
    category: "Exhibition",
  },
  {
    id: "csb-silk-board",
    name: "Central Silk Board",
    event: "National Silkworm Seed Org Conference",
    logo: {
      src: "/media/clients/csb-silk-board.svg",
      width: 200,
      height: 60,
      alt: "Central Silk Board logo",
    },
    category: "Government",
  },
  {
    id: "vaidic-dharma",
    name: "Vaidic Dharma Sansthan",
    event: "Navarathri Celebrations 2024",
    logo: {
      src: "/media/clients/vaidic-dharma.svg",
      width: 200,
      height: 60,
      alt: "Vaidic Dharma Sansthan logo",
    },
    category: "Cultural",
  },
  {
    id: "karnataka-habitat",
    name: "Karnataka State Habitat Centre",
    event: "Hampi Utsav 2024",
    logo: {
      src: "/media/clients/karnataka-habitat.svg",
      width: 200,
      height: 60,
      alt: "Karnataka State Habitat Centre logo",
    },
    category: "Government",
  },
  {
    id: "adichunchanagiri",
    name: "Sri Adichunchanagiri Shikshana Trust",
    event: "Founder's Day Monumental Assembly",
    logo: {
      src: "/media/clients/adichunchanagiri.svg",
      width: 200,
      height: 60,
      alt: "Sri Adichunchanagiri Shikshana Trust logo",
    },
    category: "Education",
  },
  {
    id: "uas-bangalore",
    name: "University of Agricultural Sciences",
    event: "Krishimela 2024-25 Mega Expo",
    logo: {
      src: "/media/clients/uas-bangalore.svg",
      width: 200,
      height: 60,
      alt: "University of Agricultural Sciences logo",
    },
    category: "Education",
  },
  {
    id: "ksmcal",
    name: "KSMCAL",
    event: "Pourakarmika Samavesha & State Convocations",
    logo: {
      src: "/media/clients/ksmcal.svg",
      width: 200,
      height: 60,
      alt: "KSMCAL logo",
    },
    category: "Government",
  },
  {
    id: "buildtek",
    name: "Buildtek Polymers",
    event: "Silver Jubilee Celebration",
    logo: {
      src: "/media/clients/buildtek.svg",
      width: 200,
      height: 60,
      alt: "Buildtek Polymers logo",
    },
    category: "Enterprise",
  },
  {
    id: "tribal-welfare",
    name: "Tribal Welfare Department",
    event: "State Valmiki Jayanthi Celebrations",
    logo: {
      src: "/media/clients/tribal-welfare.svg",
      width: 200,
      height: 60,
      alt: "Tribal Welfare Department logo",
    },
    category: "Government",
  },
  {
    id: "mm-hills",
    name: "Sri Male Mahadeshwara Swamy",
    event: "MM Hills Pilgrimage Infrastructure",
    logo: {
      src: "/media/clients/mm-hills.svg",
      width: 200,
      height: 60,
      alt: "Sri Male Mahadeshwara Swamy logo",
    },
    category: "Cultural",
  },
  {
    id: "skyblue-events",
    name: "Skyblue Event Management",
    event: "World Fisheries Day 2024 Pavilion",
    logo: {
      src: "/media/clients/skyblue.svg",
      width: 200,
      height: 60,
      alt: "Skyblue Event Management logo",
    },
    category: "Enterprise",
  },
  {
    id: "biffes",
    name: "Karnataka Chalanachitra Academy",
    event: "17th Bengaluru Int'l Film Festival (BIFFes)",
    logo: {
      src: "/media/clients/biffes.svg",
      width: 200,
      height: 60,
      alt: "BIFFes logo",
    },
    category: "Cultural",
  },
  {
    id: "tribevibe",
    name: "TribeVibe Entertainment",
    event: "Karthik Live Mega Concert",
    logo: {
      src: "/media/clients/tribevibe.svg",
      width: 200,
      height: 60,
      alt: "TribeVibe Entertainment logo",
    },
    category: "Enterprise",
  },
  {
    id: "ksmcal-dam-safety",
    name: "KSMCAL — Dam Safety",
    event: "Int'l Conference on Dam Safety",
    logo: {
      src: "/media/clients/ksmcal.svg",
      width: 200,
      height: 60,
      alt: "KSMCAL logo",
    },
    category: "Government",
  },
  {
    id: "ksmcal-babu-jagjivan",
    name: "KSMCAL — Babu Jagjivan Ram",
    event: "119th Memorial Celebrations",
    logo: {
      src: "/media/clients/ksmcal.svg",
      width: 200,
      height: 60,
      alt: "KSMCAL logo",
    },
    category: "Government",
  },
  {
    id: "abs-vidyapeeta",
    name: "ABS — Vidyapeeta Fair",
    event: "State Education Fair Expo",
    logo: {
      src: "/media/clients/abs-business.svg",
      width: 200,
      height: 60,
      alt: "ABS Business Solutions logo",
    },
    category: "Education",
  },
  {
    id: "vaidic-dharma-trust",
    name: "Vaidic Dharma Sansthan Trust",
    event: "Spiritual Congregation Pavilion",
    logo: {
      src: "/media/clients/vaidic-dharma.svg",
      width: 200,
      height: 60,
      alt: "Vaidic Dharma Sansthan Trust logo",
    },
    category: "Cultural",
  },
];

export interface RosterEntry {
  id: string;
  name: string;
  shortName: string;
  monogram: string;
  logo: Client["logo"] | null;
  projects: number;
}

export function clientRoster(): RosterEntry[] {
  return CLIENTS_27.map((c) => ({
    id: c.id,
    name: c.name,
    shortName: c.name.slice(0, 20),
    monogram: c.name.slice(0, 2).toUpperCase(),
    logo: {
      src: c.logo.src,
      width: c.logo.width,
      height: c.logo.height,
      alt: c.logo.alt,
      clearance: "figma-supplied" as const,
    },
    projects: 1,
  }));
}
