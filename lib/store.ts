import "server-only";
import { getRecord, getSetting, isEmpty, listRecords } from "./db";

import { projects as seedProjects, type Project } from "@/content/works";
import { capabilities as seedCapabilities, type Capability } from "@/content/capabilities";
import { inventoryTiles as seedInventory, type InventoryTile } from "@/content/inventory";
import { processSteps as seedProcess, type ProcessStep } from "@/content/process";
import { clients as seedClients, type Client } from "@/content/clients";
import { clientEvents as seedEvents, type ClientEvent } from "@/content/clientEvents";
import { collage as seedCollage, type CollagePhoto } from "@/content/legacy";
import { contact as seedContact, stats as seedStats, type Stat } from "@/content/company";
import { hero as seedHero } from "@/content/site";
import { publishable, publishableList } from "@/content/media";

/**
 * The read side of the CMS.
 *
 * Every collection here has TWO sources: the typed seed modules in `content/`,
 * and whatever the client has since saved in the database. The rule is one
 * line long — **if the collection has never been written to, the seed wins** —
 * and it is what makes this migration safe:
 *
 *   - The site renders exactly as it does today on a machine with no database.
 *   - The first save to a collection takes ownership of that collection, and
 *     only that one.
 *   - `content/` stays the source of truth for shape, defaults and the
 *     research notes explaining where each fact came from. It is documentation
 *     that happens to also be runnable, rather than a dead fixture.
 *
 * Nothing in `app/` reaches past this module. Swapping SQLite for Postgres
 * later means rewriting `lib/db.ts` and the seven functions below.
 */

export const COLLECTIONS = {
  projects: "projects",
  capabilities: "capabilities",
  inventory: "inventory",
  process: "process",
  clients: "clients",
  events: "events",
  collage: "collage",
} as const;

/** Seeds a collection reads from when the database has nothing for it. */
const SEEDS = {
  projects: seedProjects,
  capabilities: seedCapabilities,
  inventory: seedInventory,
  process: seedProcess,
  clients: seedClients,
  events: seedEvents,
  collage: seedCollage,
} as const;

type SeedOf<K extends keyof typeof SEEDS> = (typeof SEEDS)[K][number];

/**
 * Reads a collection, falling back to its seed.
 *
 * Records the client has unpublished are dropped here rather than in each
 * caller, so an unpublished project cannot reach a page by being read through
 * a route that forgot to filter.
 */
function read<K extends keyof typeof SEEDS>(collection: K): SeedOf<K>[] {
  if (isEmpty(collection)) return [...SEEDS[collection]] as SeedOf<K>[];
  return listRecords<SeedOf<K>>(collection)
    .filter((row) => row.published)
    .map((row) => row.data);
}

/** Reads a collection INCLUDING unpublished rows. For the admin only. */
export function readAll<K extends keyof typeof SEEDS>(
  collection: K,
): { id: string; position: number; published: boolean; data: SeedOf<K> }[] {
  if (isEmpty(collection)) {
    return (SEEDS[collection] as readonly SeedOf<K>[]).map((data, i) => ({
      id: idOf(collection, data, i),
      position: i,
      published: true,
      data,
    }));
  }
  return listRecords<SeedOf<K>>(collection);
}

export function readOne<K extends keyof typeof SEEDS>(
  collection: K,
  id: string,
): SeedOf<K> | null {
  if (!isEmpty(collection)) {
    const row = getRecord<SeedOf<K>>(collection, id);
    if (row) return row.data;
    return null;
  }
  const seeds = SEEDS[collection] as readonly SeedOf<K>[];
  return seeds.find((data, i) => idOf(collection, data, i) === id) ?? null;
}

/**
 * The stable key for a record.
 *
 * Most collections carry their own `id`. Client events do not — they are rows
 * from a spreadsheet — so they are keyed by their position, which is stable as
 * long as the list is only appended to and is repaired by the admin's reorder.
 */
export function idOf(collection: string, data: unknown, index: number): string {
  const withId = data as { id?: string };
  if (withId?.id) return withId.id;
  return `${collection}-${index}`;
}

/* -------------------------------------------------------------------------
   The public read API. These are what pages and sections call.
   ------------------------------------------------------------------------- */

/** Published projects, featured first, then by order, media gated. */
export function getProjects(): Project[] {
  return read("projects")
    .filter((p) => p.published)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
    .map((p) => ({
      ...p,
      hero: publishable(p.hero),
      gallery: publishableList(p.gallery),
      video: publishable(p.video),
      logo: publishable(p.logo),
    }));
}

export const getCapabilities = (): Capability[] => read("capabilities");
export const getInventoryTiles = (): InventoryTile[] => read("inventory");
export const getProcessSteps = (): ProcessStep[] => read("process");
export const getClients = (): Client[] => read("clients");
export const getClientEvents = (): ClientEvent[] => read("events");
export const getCollage = (): CollagePhoto[] => read("collage");

/* --------------------------------- settings -------------------------------- */

export type ContactSettings = typeof seedContact;
export type HeroSettings = { headline: string; body: string };

export function getContact(): ContactSettings {
  return { ...seedContact, ...(getSetting<Partial<ContactSettings>>("contact") ?? {}) };
}

export function getStats(): Stat[] {
  return getSetting<Stat[]>("stats") ?? seedStats;
}

export function getHero(): HeroSettings {
  return { ...seedHero, ...(getSetting<Partial<HeroSettings>>("hero") ?? {}) };
}
