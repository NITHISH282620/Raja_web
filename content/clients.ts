import type { ImageAsset, Sourced } from "./types";

/**
 * The client roster — the single source for both the public wall and the admin.
 *
 * WHY THIS FILE CHANGED SHAPE. There were two client datasets: this one, with
 * twelve records, which the admin edited; and a hardcoded CLIENTS_27 in
 * content/clientRoster.ts, which the homepage honeycomb actually rendered. They
 * were never connected. `sections/Clients.tsx` accepted a `clients` prop typed
 * `unknown[]` and ignored it, so unpublishing a client in the admin changed
 * nothing on the live site. Proven by doing it: Government of Karnataka stayed
 * on the homepage after being unpublished.
 *
 * The twenty-seven are canonical because they are what the public site shows.
 * Nothing from the twelve is discarded — where the two disagreed on an
 * organisation's name, the other spelling is kept in `alternateName` rather
 * than one being chosen. Which form is correct is a question for Raja, not a
 * decision to make silently in a merge.
 *
 * FOUR NAMES ARE STILL IN CONFLICT and are marked below. The `biffes` record is
 * the sharpest: the same id carried "Bengaluru International Film Festival" in
 * one file and "Karnataka Chalanachitra Academy" in the other — the festival
 * and the body that runs it. Both are preserved.
 *
 * COMPOSITE ENTRIES — "KSMCAL — Dam Safety", "KSMCAL — Babu Jagjivan Ram" and
 * "ABS — Vidyapeeta Fair" — pair a client with an event in the name field. The
 * schema could hold those separately, since `event` already exists. They are
 * deliberately NOT split here: collapsing three KSMCAL rows into one would
 * remove two tiles from the public wall, which is a content decision and a
 * visible change, not a refactor. Flagged for owner verification.
 */

export interface Client extends Sourced {
  id: string;
  name: string;
  /**
   * The other name this organisation is published under.
   *
   * Present only where the two former datasets disagreed. Never rendered — it
   * exists so the alternative is not lost while Raja decides which is right.
   */
  alternateName?: string;
  /** The engagement this client is associated with, as supplied. */
  event: string;
  logo: ImageAsset;
  category:
    | "Government"
    | "Enterprise"
    | "Cultural"
    | "Education"
    | "Healthcare"
    | "Exhibition";
}

export const clients: Client[] = [
  {
    id: "govt-karnataka",
    name: "Government of Karnataka",
    event: "State summits & official infrastructure",
    logo: {
      src: "/media/client-karnataka-govt.webp",
      width: 256,
      height: 256,
      alt: "Government of Karnataka emblem",
      clearance: "figma-supplied",
    },
    category: "Government",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Government",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Cultural",
    status: "approved",
  },
  {
    id: "isgcon-bengaluru",
    name: "ISGCON Bengaluru",
    alternateName: "Indian Society of Gastroenterology (ISGCON)",
    event: "64th Annual Congress of ISGCON",
    logo: {
      src: "/media/clients/isgcon.svg",
      width: 200,
      height: 60,
      alt: "ISGCON Bengaluru logo",
      clearance: "figma-supplied",
    },
    category: "Healthcare",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Healthcare",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Exhibition",
    status: "approved",
  },
  {
    id: "ficci",
    name: "FICCI",
    alternateName: "Federation of Indian Chambers of Commerce & Industry (FICCI)",
    event: "EIMA Agrimach 2024",
    logo: {
      src: "/media/clients/ficci.svg",
      width: 200,
      height: 60,
      alt: "FICCI logo",
      clearance: "figma-supplied",
    },
    category: "Enterprise",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Cultural",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Enterprise",
    status: "approved",
  },
  {
    id: "collegedunia",
    name: "Collegedunia Web",
    alternateName: "Collegedunia",
    event: "Collegedunia Education Fair",
    logo: {
      src: "/media/client-collegedunia-learn.webp",
      width: 300,
      height: 170,
      alt: "Collegedunia logo",
      clearance: "figma-supplied",
    },
    category: "Education",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Exhibition",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Government",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Cultural",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Government",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Education",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Education",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Government",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Enterprise",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Government",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Cultural",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Enterprise",
    status: "approved",
  },
  {
    id: "biffes",
    name: "Karnataka Chalanachitra Academy",
    alternateName: "Bengaluru International Film Festival",
    event: "17th Bengaluru Int'l Film Festival (BIFFes)",
    logo: {
      src: "/media/clients/biffes.svg",
      width: 200,
      height: 60,
      alt: "BIFFes logo",
      clearance: "figma-supplied",
    },
    category: "Cultural",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Enterprise",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Government",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Government",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Education",
    status: "approved",
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
      clearance: "figma-supplied",
    },
    category: "Cultural",
    status: "approved",
  },
];

export const clientsMeta = {
  eyebrow: ["Institutional &", "enterprise trust"] as const,
};

export const closingCta = {
  heading: "Ready to build at monumental scale?",
} as const;
