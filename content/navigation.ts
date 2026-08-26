import type { Sourced } from "./types";

/**
 * Site navigation.
 *
 * Figma animates a three-line hamburger into the hero but defines no open
 * state and no route list anywhere in the file. Until routes are approved this
 * stays a one-pager: the menu anchors to the sections that actually exist.
 */
export interface NavItem {
  label: string;
  href: string;
}

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

export const navItems: NavItem[] = [
  { label: "About", href: `#${SECTION_IDS.legacy}` },
  { label: "What we build", href: `#${SECTION_IDS.capabilities}` },
  { label: "Notable works", href: `#${SECTION_IDS.works}` },
  { label: "Our process", href: `#${SECTION_IDS.process}` },
  { label: "What we deploy", href: `#${SECTION_IDS.inventory}` },
  { label: "Clients", href: `#${SECTION_IDS.clients}` },
];

export const navigationMeta: Sourced = {
  status: "pending",
  note: "No menu open-state, route list or link destinations exist in the Figma file. Anchors to on-page sections until routes are approved.",
};
