import type { ImageAsset, Sourced } from "./types";

export interface Client extends Sourced {
  id: string;
  name: string;
  logo: ImageAsset;
  /** On-screen box for the logo inside the 130x100 tile */
  box: { width: number; height: number };
}

/**
 * Confirmed institutional and enterprise clients from verified engagements.
 */
export const clients: Client[] = [
  {
    id: "karnataka-govt",
    name: "Government of Karnataka",
    logo: {
      src: "/media/client-karnataka-govt.webp",
      width: 256,
      height: 256,
      alt: "Government of Karnataka emblem",
    },
    box: { width: 81, height: 81 },
    status: "approved",
  },
  {
    id: "government-of-india",
    name: "Government of India",
    logo: {
      src: "/media/client-government-of-india.webp",
      width: 300,
      height: 136,
      alt: "Government of India emblem",
    },
    box: { width: 112, height: 51 },
    status: "approved",
  },
  {
    id: "ficci",
    name: "Federation of Indian Chambers of Commerce & Industry (FICCI)",
    logo: {
      src: "/media/clients/ficci.svg",
      width: 200,
      height: 60,
      alt: "FICCI logo",
    },
    box: { width: 120, height: 50 },
    status: "approved",
  },
  {
    id: "art-of-living",
    name: "The Art of Living Trust",
    logo: {
      src: "/media/clients/art-of-living.svg",
      width: 220,
      height: 60,
      alt: "The Art of Living Trust logo",
    },
    box: { width: 130, height: 50 },
    status: "approved",
  },
  {
    id: "collegedunia-learn",
    name: "Collegedunia",
    logo: {
      src: "/media/client-collegedunia-learn.webp",
      width: 300,
      height: 170,
      alt: "Collegedunia logo",
    },
    box: { width: 122, height: 69 },
    status: "approved",
  },
  {
    id: "isgcon",
    name: "Indian Society of Gastroenterology (ISGCON)",
    logo: {
      src: "/media/clients/isgcon.svg",
      width: 200,
      height: 60,
      alt: "ISGCON logo",
    },
    box: { width: 120, height: 50 },
    status: "approved",
  },
  {
    id: "larenon",
    name: "La Renon Healthcare",
    logo: {
      src: "/media/clients/larenon.svg",
      width: 200,
      height: 60,
      alt: "La Renon Healthcare logo",
    },
    box: { width: 120, height: 50 },
    status: "approved",
  },
  {
    id: "kanha-shanti",
    name: "Kanha Shanti Vanam",
    logo: {
      src: "/media/clients/kanha-shanti.svg",
      width: 220,
      height: 60,
      alt: "Kanha Shanti Vanam logo",
    },
    box: { width: 130, height: 50 },
    status: "approved",
  },
  {
    id: "gte-expo",
    name: "Garment Technology Expo",
    logo: {
      src: "/media/clients/gte-expo.svg",
      width: 190,
      height: 60,
      alt: "Garment Technology Expo logo",
    },
    box: { width: 120, height: 50 },
    status: "approved",
  },
  {
    id: "biffes",
    name: "Bengaluru International Film Festival",
    logo: {
      src: "/media/clients/biffes.svg",
      width: 200,
      height: 60,
      alt: "Bengaluru International Film Festival logo",
    },
    box: { width: 120, height: 50 },
    status: "approved",
  },
  {
    id: "tribevibe",
    name: "TribeVibe Entertainment",
    logo: {
      src: "/media/clients/tribevibe.svg",
      width: 200,
      height: 60,
      alt: "TribeVibe Entertainment logo",
    },
    box: { width: 120, height: 50 },
    status: "approved",
  },
  {
    id: "first-circle",
    name: "First Circle Biztech",
    logo: {
      src: "/media/clients/first-circle.svg",
      width: 200,
      height: 60,
      alt: "First Circle Biztech logo",
    },
    box: { width: 120, height: 50 },
    status: "approved",
  },
];

export const clientsMeta = {
  status: "approved" as const,
  note: "Confirmed enterprise and institutional clients.",
};

export const closingCta = {
  eyebrow: "Start a build",
  statement: [
    { text: "Let\u2019s build the ground " },
    { text: "your event stands", accent: true },
    { text: " on." },
  ],
  label: "Talk to us",
};