import "server-only";
import { getRecord, getSetting, isEmpty, listRecords } from "./db/content";

import { projects as seedProjects, type Project } from "@/content/works";
import { capabilities as seedCapabilities, type Capability } from "@/content/capabilities";
import { inventoryTiles as seedInventory, type InventoryTile } from "@/content/inventory";
import { processSteps as seedProcess, type ProcessStep } from "@/content/process";
import { clients as seedClients, type Client } from "@/content/clients";
import { clientEvents as seedEvents, type ClientEvent } from "@/content/clientEvents";
import { eventsWeBuildFor as seedEventFormats, recentExecutions as seedRecent,
  type EventCategory, type RecentExecution } from "@/content/events";
import { collage as seedCollage, type CollagePhoto } from "@/content/legacy";
import { contact as seedContact, stats as seedStats, type Stat } from "@/content/company";
import { hero as seedHero } from "@/content/site";
import { servicePillars as seedServices, type ServicePillar } from "@/content/services";
import { solutions as seedSolutions, type Solution } from "@/content/solutions";
import { inventorySchedule as seedSchedule, type InventoryLine } from "@/content/inventorySchedule";
import { inventoryCategories as seedCatalog, type InventoryCategory } from "@/content/inventoryCatalog";
import { aboutTimeline as seedTimeline, milestoneMoments as seedMilestones, principles as seedPrinciples,
  inventoryHighlights as seedHighlights,
  type TimelineEra, type MilestoneItem, type Principle, type InventoryItem } from "@/content/about";
import { locations as seedLocations, type LocationRecord } from "@/content/locations";
import { disciplines as seedDisciplines, type Discipline } from "@/content/careers";
import { partnerPoints as seedPartnerPoints, partnerSteps as seedPartnerSteps,
  type PartnerPoint, type PartnerStep } from "@/content/partners";
import { seoOverrides as seedSeo, type SeoOverride } from "@/content/seo";
import { copyBlocks as seedCopyBlocks } from "@/content/copy";
import { pageImages as seedPageImages, type PageImage } from "@/content/pageImages";
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
  services: "services",
  solutions: "solutions",
  schedule: "schedule",
  catalog: "catalog",
  timeline: "timeline",
  milestones: "milestones",
  principles: "principles",
  locations: "locations",
  disciplines: "disciplines",
  partnerPoints: "partnerPoints",
  partnerSteps: "partnerSteps",
  seo: "seo",
  copy: "copy",
  highlights: "highlights",
  eventFormats: "eventFormats",
  recentEvents: "recentEvents",
  pageImages: "pageImages",
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
  services: seedServices,
  solutions: seedSolutions,
  schedule: seedSchedule,
  catalog: seedCatalog,
  timeline: seedTimeline,
  milestones: seedMilestones,
  principles: seedPrinciples,
  locations: seedLocations,
  disciplines: seedDisciplines,
  partnerPoints: seedPartnerPoints,
  partnerSteps: seedPartnerSteps,
  seo: seedSeo,
  copy: seedCopyBlocks,
  highlights: seedHighlights,
  eventFormats: seedEventFormats,
  recentEvents: seedRecent,
  pageImages: seedPageImages,
} as const;

type SeedOf<K extends keyof typeof SEEDS> = (typeof SEEDS)[K][number];

/**
 * Reads a collection, falling back to its seed.
 *
 * Records the client has unpublished are dropped here rather than in each
 * caller, so an unpublished project cannot reach a page by being read through
 * a route that forgot to filter.
 */
async function read<K extends keyof typeof SEEDS>(collection: K): Promise<SeedOf<K>[]> {
  if (await isEmpty(collection)) return [...SEEDS[collection]] as SeedOf<K>[];
  return (await listRecords<SeedOf<K>>(collection))
    .filter((row) => row.published)
    .map((row) => row.data);
}

/** Reads a collection INCLUDING unpublished rows. For the admin only. */
export async function readAll<K extends keyof typeof SEEDS>(
  collection: K,
): Promise<{ id: string; position: number; published: boolean; data: SeedOf<K> }[]> {
  if (await isEmpty(collection)) {
    return (SEEDS[collection] as readonly SeedOf<K>[]).map((data, i) => ({
      id: idOf(collection, data, i),
      position: i,
      published: true,
      data,
    }));
  }
  return await listRecords<SeedOf<K>>(collection);
}

export async function readOne<K extends keyof typeof SEEDS>(
  collection: K,
  id: string,
): Promise<SeedOf<K> | null> {
  if (!(await isEmpty(collection))) {
    const row = await getRecord<SeedOf<K>>(collection, id);
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
export async function getProjects(): Promise<Project[]> {
  return (await read("projects"))
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

export const getCapabilities = async (): Promise<Capability[]> => read("capabilities");
export const getInventoryTiles = async (): Promise<InventoryTile[]> => read("inventory");
export const getProcessSteps = async (): Promise<ProcessStep[]> => read("process");
export const getClients = async (): Promise<Client[]> => read("clients");
export const getClientEvents = async (): Promise<ClientEvent[]> => read("events");
export const getCollage = async (): Promise<CollagePhoto[]> => read("collage");

/* --------------------------------- settings -------------------------------- */

export type ContactSettings = typeof seedContact;
export type HeroSettings = { headline: string; body: string };

export async function getContact(): Promise<ContactSettings> {
  return { ...seedContact, ...((await getSetting<Partial<ContactSettings>>("contact")) ?? {}) };
}

export async function getStats(): Promise<Stat[]> {
  return (await getSetting<Stat[]>("stats")) ?? seedStats;
}

/**
 * Service pillars, solution pages and the capacity schedule.
 *
 * These three were the largest remaining holes: six service pages, five
 * solution pages and every capacity figure on the site were readable only from
 * `content/`, which meant correcting a number or a paragraph was a code change
 * and a deploy. They now go through the same seed-then-database path as
 * everything else, so the owner can fix them from a phone.
 *
 * `read()` already drops unpublished rows, so an unpublished service cannot
 * reach a page through a route that forgot to filter.
 */
export async function getServices(): Promise<ServicePillar[]> {
  return read("services");
}

export async function getSolutions(): Promise<Solution[]> {
  return read("solutions");
}

export async function getSchedule(): Promise<InventoryLine[]> {
  return read("schedule");
}

/** Services that ship a page of their own. */
export async function getPagedServices(): Promise<ServicePillar[]> {
  return (await read("services")).filter((s) => s.page);
}

export async function findServiceBySlug(slug: string): Promise<ServicePillar | undefined> {
  return (await read("services")).find((s) => s.slug === slug);
}

export async function findSolutionBySlug(slug: string): Promise<Solution | undefined> {
  return (await read("solutions")).find((s) => s.slug === slug);
}

/**
 * One long-form copy block, by id.
 *
 * Returns "" for an unknown id rather than throwing: a paragraph the owner has
 * emptied should leave a gap on the page, not take the page down.
 */
/**
 * A named image slot. Returns the record so a caller gets the alt text too —
 * an image whose description does not travel with it ends up mislabelled.
 */
export async function pageImage(id: string): Promise<PageImage | null> {
  return (await read("pageImages")).find((i) => i.id === id) ?? null;
}

export async function copyText(id: string): Promise<string> {
  return (await read("copy")).find((b) => b.id === id)?.body ?? "";
}

export async function getCatalog(): Promise<InventoryCategory[]> { return read("catalog"); }
export async function getRecentEvents(): Promise<RecentExecution[]> { return read("recentEvents"); }
export async function getEventFormats(): Promise<EventCategory[]> { return read("eventFormats"); }
export async function getInventoryHighlights(): Promise<InventoryItem[]> { return read("highlights"); }
export async function getTimeline(): Promise<TimelineEra[]> { return read("timeline"); }
export async function getMilestones(): Promise<MilestoneItem[]> { return read("milestones"); }
export async function getPrinciples(): Promise<Principle[]> { return read("principles"); }
export async function getLocations(): Promise<LocationRecord[]> { return read("locations"); }
export async function getDisciplines(): Promise<Discipline[]> { return read("disciplines"); }
export async function getPartnerPoints(): Promise<PartnerPoint[]> { return read("partnerPoints"); }
export async function getPartnerSteps(): Promise<PartnerStep[]> { return read("partnerSteps"); }

/**
 * The SEO override for a route, or null.
 *
 * Null is the normal case and means "use whatever the page computes for
 * itself", which is why this returns null rather than an empty object: a caller
 * that spreads an empty object over its own metadata would blank every field.
 */
export async function getSeo(route: string): Promise<SeoOverride | null> {
  return (await read("seo")).find((s) => s.route === route) ?? null;
}

export async function getHero(): Promise<HeroSettings> {
  return { ...seedHero, ...((await getSetting<Partial<HeroSettings>>("hero")) ?? {}) };
}
