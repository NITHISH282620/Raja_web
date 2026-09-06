import type { Client } from "./clients";

/**
 * The shape the honeycomb renders.
 *
 * Derived from the canonical client records rather than holding its own copy.
 * This module previously carried a hardcoded CLIENTS_27 array, which is what
 * made the admin's client editor decorative: the wall read the array, the admin
 * wrote the database, and nothing joined them.
 */

export interface RosterEntry {
  id: string;
  name: string;
  /** Trimmed to fit inside a hexagon. */
  shortName: string;
  /** Initials, shown when no logo file exists. */
  monogram: string;
  logo: Client["logo"] | null;
  projects: number;
}

const SKIP = new Set([
  "of", "the", "and", "for", "de", "pvt", "private", "limited", "ltd",
  "india", "indian", "trust", "department", "government",
]);

/** Up to three initials from the significant words of a name. */
function initials(name: string): string {
  const words = name
    .replace(/[^A-Za-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !SKIP.has(w.toLowerCase()));
  const source = words.length ? words : name.split(/\s+/).filter(Boolean);
  return source.slice(0, 3).map((w) => w[0]!.toUpperCase()).join("");
}

/** Trim a legal name down to something that reads inside a hexagon. */
function short(name: string): string {
  const cleaned = name
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/\s*—.*$/, "")
    .replace(/\b(Private|Pvt\.?|Limited|Ltd\.?)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return cleaned.length > 26 ? `${cleaned.slice(0, 24).trimEnd()}…` : cleaned;
}

/**
 * Builds the wall from whatever the store currently holds.
 *
 * Takes the records rather than reaching for a module-level array, so an
 * unpublished client is genuinely absent — the store has already filtered it
 * out before this is called.
 */
export function clientRoster(records: Client[]): RosterEntry[] {
  return records.map((c) => ({
    id: c.id,
    name: c.name,
    shortName: short(c.name),
    monogram: initials(c.name),
    logo: c.logo?.src ? c.logo : null,
    projects: 1,
  }));
}
