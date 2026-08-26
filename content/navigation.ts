import type { Sourced } from "./types";

/**
 * Site navigation.
 *
 * Figma animated a three-line hamburger into the hero but defined no open
 * state and no routes. The information architecture below is recovered from
 * Raja's own previous implementation, so these are the company's real sections
 * rather than invented ones.
 */
export interface NavItem {
  label: string;
  href: string;
  /** One line for the overlay and for page intros. */
  blurb?: string;
}

export const ROUTES = {
  home: "/",
  inventory: "/inventory",
  portfolio: "/portfolio",
  legacy: "/legacy",
  locations: "/locations",
  contact: "/contact",
} as const;

export const navItems: NavItem[] = [
  { label: "Inventory", href: ROUTES.inventory, blurb: "What we own and deploy" },
  { label: "Portfolio", href: ROUTES.portfolio, blurb: "Programmes we have built" },
  { label: "Legacy", href: ROUTES.legacy, blurb: "1977 to now" },
  { label: "Locations", href: ROUTES.locations, blurb: "Bengaluru, deployed India-wide" },
  { label: "Contact", href: ROUTES.contact, blurb: "Start a conversation" },
];

/** The inline desktop bar omits Contact, which has its own button. */
export const primaryNav = navItems.filter((i) => i.href !== ROUTES.contact);

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
  note: "Routes recovered from Raja's previous implementation (home / inventory / portfolio / legacy / locations / contact).",
};
