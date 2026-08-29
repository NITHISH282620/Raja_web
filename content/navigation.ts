import type { Sourced } from "./types";

/**
 * Site navigation.
 */
export interface NavItem {
  label: string;
  href: string;
  /** One line for the overlay and for page intros. */
  blurb?: string;
}

export const ROUTES = {
  home: "/",
  about: "/about",
  inventory: "/inventory",
  portfolio: "/portfolio",
  legacy: "/legacy",
  locations: "/locations",
  careers: "/careers",
  contact: "/contact",
} as const;

export const navItems: NavItem[] = [
  { label: "About", href: ROUTES.about, blurb: "Who we are and how we work" },
  { label: "Inventory", href: ROUTES.inventory, blurb: "What we own and deploy" },
  { label: "Notable Events", href: ROUTES.portfolio, blurb: "Programmes we have built" },
  { label: "Legacy", href: ROUTES.legacy, blurb: "1977 to now" },
  { label: "Careers", href: ROUTES.careers, blurb: "Work with the crew" },
  { label: "Contact", href: ROUTES.contact, blurb: "Start a conversation" },
];

/**
 * The inline desktop bar.
 */
export const primaryNav = navItems.filter(
  (i) => i.href !== ROUTES.contact && i.href !== ROUTES.careers && i.href !== ROUTES.locations,
);

/** Anchors within the homepage, used by on-page links. */
export const SECTION_IDS = {
  hero: "top",
  legacy: "about",
  capabilities: "capabilities",
  resources: "resources",
  works: "works",
  process: "process",
  inventory: "inventory",
  clients: "clients",
} as const;

export const navigationMeta: Sourced = {
  status: "approved",
  note: "Routes updated with Notable Events (Locations removed from navbar).",
};