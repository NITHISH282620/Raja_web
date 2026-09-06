import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

/**
 * The CMS store.
 *
 * SQLite through `node:sqlite`, which ships inside Node 22+ — no native module
 * to compile, no build step, no service to run or pay for. For a site with one
 * editor and a few hundred records that is the right size of tool; the whole
 * database is one file that can be copied, versioned or emailed.
 *
 * WHERE IT LIVES. `RAJA_DB_PATH`, defaulting to `.data/raja.db`. That directory
 * is gitignored: it is the client's content, not the repository's.
 *
 * DEPLOYMENT NOTE. This needs a writable filesystem that persists between
 * requests, which means a normal Node host — a VPS, Render, Railway, Fly, or a
 * container. It will NOT work on Vercel's serverless functions, whose
 * filesystem is read-only and ephemeral. Every query in the app goes through
 * this module and `lib/store.ts`, so moving to Postgres later means rewriting
 * those two files and nothing else.
 */

// Scoped under cwd via join rather than resolve: an unbounded `resolve` makes
// the bundler trace the entire project into the server output, `public/`
// included, because it cannot prove where the path lands.
const DB_PATH = process.env.RAJA_DB_PATH
  ? resolve(/* turbopackIgnore: true */ process.env.RAJA_DB_PATH)
  : join(process.cwd(), ".data", "raja.db");

let instance: DatabaseSync | null = null;

/**
 * Schema.
 *
 * Content tables are deliberately thin: an `id`, a `json` blob, and ordering
 * plus publish flags hoisted out as real columns because those are the only
 * fields ever queried on. The blob is the same shape as the seed objects in
 * `content/`, which is what lets the store fall back to those seeds record for
 * record when the database is empty.
 */
const SCHEMA = `
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    email        TEXT NOT NULL UNIQUE,
    name         TEXT NOT NULL DEFAULT '',
    password     TEXT NOT NULL,
    role         TEXT NOT NULL DEFAULT 'editor',
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    last_seen_at TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL
  );

  -- Every editable collection shares this shape.
  CREATE TABLE IF NOT EXISTS records (
    collection TEXT NOT NULL,
    id         TEXT NOT NULL,
    position   INTEGER NOT NULL DEFAULT 0,
    published  INTEGER NOT NULL DEFAULT 1,
    json       TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (collection, id)
  );
  CREATE INDEX IF NOT EXISTS records_collection_pos ON records(collection, position);

  -- Single-value settings: contact details, stats, hero copy.
  CREATE TABLE IF NOT EXISTS settings (
    key        TEXT PRIMARY KEY,
    json       TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- The media library. Files land in public/uploads; this is the index.
  CREATE TABLE IF NOT EXISTS media (
    id         TEXT PRIMARY KEY,
    src        TEXT NOT NULL,
    width      INTEGER NOT NULL,
    height     INTEGER NOT NULL,
    alt        TEXT NOT NULL DEFAULT '',
    kind       TEXT NOT NULL DEFAULT 'image',
    bytes      INTEGER NOT NULL DEFAULT 0,
    credit     TEXT,
    clearance  TEXT NOT NULL DEFAULT 'raja-original',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Enquiries from the contact form. The seed of the CRM.
  CREATE TABLE IF NOT EXISTS enquiries (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    reference  TEXT NOT NULL DEFAULT '',
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    phone      TEXT NOT NULL DEFAULT '',
    organisation TEXT NOT NULL DEFAULT '',
    event_type TEXT NOT NULL DEFAULT '',
    event_date TEXT NOT NULL DEFAULT '',
    location   TEXT NOT NULL DEFAULT '',
    requirement TEXT NOT NULL DEFAULT '',
    message    TEXT NOT NULL DEFAULT '',
    attendance TEXT NOT NULL DEFAULT '',
    venue      TEXT NOT NULL DEFAULT '',
    budget     TEXT NOT NULL DEFAULT '',
    band       TEXT NOT NULL DEFAULT 'general',
    brief_name TEXT NOT NULL DEFAULT '',
    status     TEXT NOT NULL DEFAULT 'new',
    notes      TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS enquiries_status ON enquiries(status, created_at DESC);

  -- An attached brief, RFP or BOQ, held as a blob beside its enquiry.
  --
  -- WHY IN THE DATABASE. The application already requires a writable local disk
  -- for this SQLite file, so keeping attachments in the same place adds no new
  -- deployment requirement and no second thing to back up. Object storage would
  -- be the right answer at volume; at this volume it is a dependency to
  -- maintain for no gain. Size is capped hard at the upload path.
  CREATE TABLE IF NOT EXISTS enquiry_files (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    enquiry_id  INTEGER NOT NULL,
    filename    TEXT NOT NULL,
    mime        TEXT NOT NULL DEFAULT '',
    bytes       INTEGER NOT NULL DEFAULT 0,
    data        BLOB NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS enquiry_files_enquiry ON enquiry_files(enquiry_id);
`;

/**
 * Columns added after the first database was created in the wild.
 *
 * `CREATE TABLE IF NOT EXISTS` will not widen an existing table, so every
 * column added after launch has to be applied separately. Adding a column that
 * is already there throws, which is the intended signal here rather than an
 * error worth surfacing — so each statement is attempted and ignored.
 */
const MIGRATIONS = [
  `ALTER TABLE enquiries ADD COLUMN reference TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE enquiries ADD COLUMN requirement TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE enquiries ADD COLUMN attendance TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE enquiries ADD COLUMN venue TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE enquiries ADD COLUMN budget TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE enquiries ADD COLUMN band TEXT NOT NULL DEFAULT 'general'`,
  `ALTER TABLE enquiries ADD COLUMN brief_name TEXT NOT NULL DEFAULT ''`,
  // Must come after the ALTER above: an index cannot name a column that the
  // table does not have yet, and on an existing database it does not have it
  // until that statement has run.
  `CREATE INDEX IF NOT EXISTS enquiries_band ON enquiries(band, created_at DESC)`,
];

/**
 * Whether opening the database has already failed once.
 *
 * WHY THIS EXISTS. The public site is prerendered at build time, where the
 * filesystem is writable and the database opens normally. `/contact` is not
 * prerendered — it reads `?sent=` and so renders per request — and on a
 * read-only serverless filesystem that request-time open throws. The page was
 * returning a 500 in production while every prerendered page looked fine, which
 * is exactly the failure that is easiest to miss and worst to have: it is the
 * one page the whole site is trying to send people to.
 *
 * A missing database is not an error the reader should ever see. Every read
 * path already falls back to the seed content in `content/` when a collection
 * has never been written, so a database that cannot be opened at all is just
 * that same case for every collection at once. The flag stops each request
 * paying for a failed open, and stops the log filling with the same throw.
 */
let unavailable = false;

/**
 * The database if it can be opened, otherwise null.
 *
 * Read paths use this. Write paths use `db()` and are expected to fail loudly:
 * silently dropping an enquiry would be far worse than an error.
 */
export function tryDb(): DatabaseSync | null {
  if (instance) return instance;
  if (unavailable) return null;
  try {
    return db();
  } catch {
    unavailable = true;
    return null;
  }
}

export function db(): DatabaseSync {
  if (instance) return instance;
  mkdirSync(dirname(DB_PATH), { recursive: true });

  /*
   * The handle is assigned to the module singleton only once it is fully set
   * up. Assigning first and initialising after looks equivalent and is not: if
   * anything in SCHEMA throws, the half-built handle is already cached, every
   * later call takes the `if (instance)` early return, and the migrations never
   * run again for the life of the process. That happened — a new index naming a
   * column that only a migration adds aborted SCHEMA, and the failure surfaced
   * hours later as "table enquiries has no column named ..." on insert.
   */
  const opened = new DatabaseSync(DB_PATH);
  opened.exec(SCHEMA);
  for (const sql of MIGRATIONS) {
    try {
      opened.exec(sql);
    } catch {
      /* already applied */
    }
  }
  instance = opened;
  return instance;
}

/* -------------------------------------------------------------------------
   Typed helpers. Everything above is SQL; everything below is what the app
   actually calls, so no route or action ever writes a query by hand.
   ------------------------------------------------------------------------- */

export interface RecordRow<T> {
  id: string;
  position: number;
  published: boolean;
  data: T;
}

export function listRecords<T>(collection: string): RecordRow<T>[] {
  const handle = tryDb();
  if (!handle) return [];
  const rows = handle
    .prepare(
      `SELECT id, position, published, json FROM records
        WHERE collection = ? ORDER BY position ASC, id ASC`,
    )
    .all(collection) as { id: string; position: number; published: number; json: string }[];

  return rows.map((r) => ({
    id: r.id,
    position: r.position,
    published: Boolean(r.published),
    data: JSON.parse(r.json) as T,
  }));
}

export function getRecord<T>(collection: string, id: string): RecordRow<T> | null {
  const handle = tryDb();
  if (!handle) return null;
  const r = handle
    .prepare(`SELECT id, position, published, json FROM records WHERE collection = ? AND id = ?`)
    .get(collection, id) as { id: string; position: number; published: number; json: string } | undefined;
  if (!r) return null;
  return { id: r.id, position: r.position, published: Boolean(r.published), data: JSON.parse(r.json) as T };
}

export function putRecord(
  collection: string,
  id: string,
  data: unknown,
  opts: { position?: number; published?: boolean } = {},
) {
  const existing = db()
    .prepare(`SELECT position, published FROM records WHERE collection = ? AND id = ?`)
    .get(collection, id) as { position: number; published: number } | undefined;

  const nextPosition =
    opts.position ??
    existing?.position ??
    ((
      db().prepare(`SELECT COALESCE(MAX(position), -1) + 1 AS n FROM records WHERE collection = ?`)
        .get(collection) as { n: number }
    ).n);

  const published = opts.published ?? (existing ? Boolean(existing.published) : true);

  db()
    .prepare(
      `INSERT INTO records (collection, id, position, published, json, updated_at)
            VALUES (?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(collection, id) DO UPDATE SET
            position = excluded.position,
            published = excluded.published,
            json = excluded.json,
            updated_at = excluded.updated_at`,
    )
    .run(collection, id, nextPosition, published ? 1 : 0, JSON.stringify(data));
}

export function deleteRecord(collection: string, id: string) {
  db().prepare(`DELETE FROM records WHERE collection = ? AND id = ?`).run(collection, id);
}

export function reorderRecords(collection: string, ids: string[]) {
  const stmt = db().prepare(`UPDATE records SET position = ? WHERE collection = ? AND id = ?`);
  ids.forEach((id, i) => stmt.run(i, collection, id));
}

export function getSetting<T>(key: string): T | null {
  const handle = tryDb();
  if (!handle) return null;
  const r = handle.prepare(`SELECT json FROM settings WHERE key = ?`).get(key) as
    | { json: string }
    | undefined;
  return r ? (JSON.parse(r.json) as T) : null;
}

export function putSetting(key: string, value: unknown) {
  db()
    .prepare(
      `INSERT INTO settings (key, json, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET json = excluded.json, updated_at = excluded.updated_at`,
    )
    .run(key, JSON.stringify(value));
}

/** True when the collection has never been written to, so seeds should show. */
export function isEmpty(collection: string): boolean {
  const handle = tryDb();
  // No database is the same answer as an unwritten collection: use the seed.
  if (!handle) return true;
  const r = handle
    .prepare(`SELECT COUNT(*) AS n FROM records WHERE collection = ?`)
    .get(collection) as { n: number };
  return r.n === 0;
}
