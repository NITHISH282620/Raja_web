import { clients, type Client } from "./clients";
import { publishedProjects } from "./projects";

/**
 * The full client roster, derived rather than maintained.
 *
 * The honeycomb used to render the twelve entries in `content/clients.ts` —
 * the ones a logo file exists for. But Raja's engagement record names
 * twenty-five distinct commissioning bodies, and the thirteen without a logo
 * were simply absent from the section that exists to show who Raja builds for.
 *
 * So the roster is computed from `content/projects.ts`, which is the canonical
 * record, and a logo is attached where one exists. Everything else renders as
 * a wordmark. That has two consequences worth having: the section grows on its
 * own when a project is added, and it never silently drops a client for want
 * of an image file.
 *
 * Names are matched loosely because the two sources spell some organisations
 * differently — "Collegedunia" against "Collegedunia Web", "Indian Society of
 * Gastroenterology" against the same with "(ISGCON)" appended.
 */

export interface RosterEntry {
  id: string;
  name: string;
  /** Shown on the tile when there is no logo. Kept short enough to read at 84px. */
  shortName: string;
  /** Initials, used in place of a logo. A monogram reads as deliberate; a
   *  truncated name reads as a rendering fault. */
  monogram: string;
  logo: Client["logo"] | null;
  /** How many engagements the record holds for this organisation. */
  projects: number;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** True when either name contains the other — enough for these two sources. */
function sameOrg(a: string, b: string): boolean {
  const x = norm(a);
  const y = norm(b);
  if (!x || !y) return false;
  return x === y || x.includes(y) || y.includes(x);
}

/** Trim a legal name down to something readable inside a hexagon. */
function short(name: string): string {
  const cleaned = name
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/\s*—.*$/, "")
    .replace(/\s*\/.*$/, "")
    .replace(/\b(Private|Pvt\.?|Limited|Ltd\.?|India|Trust)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return cleaned.length > 26 ? `${cleaned.slice(0, 24).trimEnd()}…` : cleaned;
}

/** Up to three initials from the significant words of a name. */
function initials(name: string): string {
  const skip = new Set([
    "of","the","and","for","de","private","pvt","limited","ltd","india","indian","trust","department","government",
  ]);
  const words = name
    .replace(/[^A-Za-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !skip.has(w.toLowerCase()));
  const source = words.length ? words : name.split(/\s+/).filter(Boolean);
  return source.slice(0, 3).map((w) => w[0]!.toUpperCase()).join("");
}

export function clientRoster(): RosterEntry[] {
  const counts = new Map<string, { name: string; n: number }>();
  for (const p of publishedProjects()) {
    // "Government of India / Bengaluru International Airport" and "Indian Coast
    // Guard / Goa Shipyard Limited" name two bodies in one field. Key on the
    // first, or the roster shows Government of India twice.
    const primary = p.client.split(" / ")[0].trim();
    const key = norm(primary);
    const seen = counts.get(key);
    if (seen) seen.n += 1;
    else counts.set(key, { name: primary, n: 1 });
  }

  const roster: RosterEntry[] = [];
  for (const [key, { name, n }] of counts) {
    const logo = clients.find((c) => sameOrg(c.name, name))?.logo ?? null;
    roster.push({
      id: key.replace(/\s+/g, "-"),
      name,
      shortName: short(name),
      monogram: initials(name),
      logo,
      projects: n,
    });
  }

  // Two records can resolve to one mark: the Tribal Welfare Department is the
  // Government of Karnataka, and rendering that emblem twice reads as a
  // duplicate rather than as two clients. Keep the first, fold the counts in.
  const byLogo = new Map<string, RosterEntry>();
  const deduped: RosterEntry[] = [];
  for (const entry of roster) {
    const key = entry.logo?.src;
    if (!key) {
      deduped.push(entry);
      continue;
    }
    const seen = byLogo.get(key);
    if (seen) {
      seen.projects += entry.projects;
    } else {
      byLogo.set(key, entry);
      deduped.push(entry);
    }
  }
  roster.length = 0;
  roster.push(...deduped);

  // Organisations that carry a logo lead, then the rest by engagement count —
  // so the strongest marks land first and the rail still reads left to right.
  return roster.sort((a, b) => {
    if (!!a.logo !== !!b.logo) return a.logo ? -1 : 1;
    if (a.projects !== b.projects) return b.projects - a.projects;
    return a.name.localeCompare(b.name);
  });
}
