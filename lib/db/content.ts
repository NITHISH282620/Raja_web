import "server-only";
import { query, execute } from "./neon";

/**
 * The record primitives the CMS reads and writes.
 *
 * These replace the SQLite functions of the same names. The seed-fallback
 * contract is unchanged and still the thing that makes the whole arrangement
 * safe: **a collection that has never been written to serves its seed.** What
 * changed is only where the written rows live.
 *
 * Everything here is request-cached (see `query`), so the homepage touching
 * five collections costs one round trip each rather than one per component.
 */

export interface Row<T> {
  id: string;
  position: number;
  published: boolean;
  data: T;
}

interface Raw {
  entry_key: string;
  sort_order: number;
  published: boolean;
  data: unknown;
}

/**
 * Every collection that has at least one row.
 *
 * Loaded in a single query and cached for the request. The alternative — an
 * `EXISTS` probe per collection — turned a page render into two dozen
 * round trips to Singapore.
 */
async function writtenCollections(): Promise<Set<string>> {
  const rows = await query<{ collection: string }>(
    `SELECT DISTINCT collection FROM content_entries`,
  );
  return new Set(rows.map((r) => r.collection));
}

export async function isEmpty(collection: string): Promise<boolean> {
  return !(await writtenCollections()).has(collection);
}

export async function listRecords<T>(collection: string): Promise<Row<T>[]> {
  const rows = await query<Raw>(
    `SELECT entry_key, sort_order, published, data
       FROM content_entries WHERE collection = $1 ORDER BY sort_order`,
    [collection],
  );
  return rows.map((r) => ({
    id: r.entry_key,
    position: r.sort_order,
    published: r.published,
    data: r.data as T,
  }));
}

export async function getRecord<T>(collection: string, id: string): Promise<Row<T> | null> {
  const rows = await query<Raw>(
    `SELECT entry_key, sort_order, published, data
       FROM content_entries WHERE collection = $1 AND entry_key = $2`,
    [collection, id],
  );
  const r = rows[0];
  return r ? { id: r.entry_key, position: r.sort_order, published: r.published, data: r.data as T } : null;
}

/**
 * Writes one record.
 *
 * Deterministic id from collection + key, so a save is an upsert rather than a
 * second row: the admin edits the same record repeatedly and each save must
 * land on the row the last one wrote.
 */
export async function putRecord(
  collection: string,
  id: string,
  data: unknown,
  opts: { position?: number; published?: boolean } = {},
): Promise<void> {
  const d = data as { slug?: string; title?: string; label?: string; name?: string };
  await execute(
    `INSERT INTO content_entries (id, collection, entry_key, slug, title, data, sort_order, published)
     VALUES (
       gen_random_uuid(),
       $1, $2, $3, $4, $5::jsonb,
       COALESCE($6, (SELECT sort_order FROM content_entries WHERE collection=$1 AND entry_key=$2), 0),
       COALESCE($7, (SELECT published FROM content_entries WHERE collection=$1 AND entry_key=$2), true)
     )
     ON CONFLICT (collection, entry_key) DO UPDATE SET
       slug = EXCLUDED.slug, title = EXCLUDED.title, data = EXCLUDED.data,
       sort_order = EXCLUDED.sort_order, published = EXCLUDED.published,
       updated_at = now()`,
    [collection, id, d?.slug ?? null, d?.title ?? d?.label ?? d?.name ?? null,
     JSON.stringify(data), opts.position ?? null, opts.published ?? null],
  );
}

export async function deleteRecord(collection: string, id: string): Promise<void> {
  await execute(`DELETE FROM content_entries WHERE collection = $1 AND entry_key = $2`,
    [collection, id]);
}

export async function setRecordPublished(
  collection: string, id: string, published: boolean,
): Promise<void> {
  await execute(
    `UPDATE content_entries SET published = $3, updated_at = now()
      WHERE collection = $1 AND entry_key = $2`,
    [collection, id, published],
  );
}

export async function setRecordPosition(
  collection: string, id: string, position: number,
): Promise<void> {
  await execute(
    `UPDATE content_entries SET sort_order = $3, updated_at = now()
      WHERE collection = $1 AND entry_key = $2`,
    [collection, id, position],
  );
}

/* -------------------------------------------------------------- settings -- */

export async function getSetting<T>(key: string): Promise<T | null> {
  const rows = await query<{ value: unknown }>(
    `SELECT value FROM site_settings WHERE key = $1`, [key]);
  return (rows[0]?.value as T) ?? null;
}

export async function putSetting(key: string, value: unknown): Promise<void> {
  await execute(
    `INSERT INTO site_settings (key, value) VALUES ($1, $2::jsonb)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [key, JSON.stringify(value)],
  );
}

/**
 * Applies a new order to a whole collection in one statement.
 *
 * A row-per-update loop would be several round trips to Singapore for what is
 * one drag in the admin, and a half-applied reorder is visible on the public
 * site.
 */
export async function reorderRecords(collection: string, ids: string[]): Promise<void> {
  if (!ids.length) return;
  await execute(
    `UPDATE content_entries AS c SET sort_order = v.pos, updated_at = now()
       FROM (SELECT unnest($2::text[]) AS key, generate_subscripts($2::text[], 1) - 1 AS pos) AS v
      WHERE c.collection = $1 AND c.entry_key = v.key`,
    [collection, ids],
  );
}
