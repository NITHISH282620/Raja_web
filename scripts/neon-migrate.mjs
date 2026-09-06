/**
 * SQLite → Neon migration.
 *
 *   node --env-file=.env.local scripts/neon-migrate.mjs [--apply]
 *
 * Without --apply it is a dry run: it reads SQLite, reports what it would
 * write, and touches nothing.
 *
 * Three properties this has to have, and the reasons:
 *
 *   IDEMPOTENT. Every id is a UUIDv5 hash of a stable natural key, and every
 *   insert is ON CONFLICT DO UPDATE. Running it twice converges instead of
 *   duplicating, so a half-finished run can simply be re-run.
 *
 *   NON-DESTRUCTIVE TO SOURCE. SQLite is opened read-only and stays the
 *   rollback evidence.
 *
 *   HONEST ABOUT CONFLICTS. Where the owner has not resolved a content
 *   conflict, both values migrate and nothing is silently picked.
 */
import { DatabaseSync } from "node:sqlite";
import { createHash, randomUUID } from "node:crypto";
import { readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "@neondatabase/serverless";

const APPLY = process.argv.includes("--apply");
const ROOT = process.cwd();
const DB_PATH = process.env.RAJA_DB_PATH ?? ".data/raja.db";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

/* ------------------------------------------------------------ identity -- */

const NS = "9f2b1c84-5f1e-4d6a-9d3b-1c7a6e2f0a11"; // fixed namespace for this project

/** RFC 4122 v5 (SHA-1, name-based). Deterministic: same name, same id. */
function uuid5(name) {
  const nsBytes = Buffer.from(NS.replace(/-/g, ""), "hex");
  const hash = createHash("sha1").update(nsBytes).update(Buffer.from(name, "utf8")).digest();
  const b = Buffer.from(hash.subarray(0, 16));
  b[6] = (b[6] & 0x0f) | 0x50;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = b.toString("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/* ------------------------------------------------------- test-data rules -- */

/**
 * What counts as disposable QA data.
 *
 * Deliberately conservative and evidence-based: the E2E harness stamped its own
 * rows with a recognisable name and organisation. Anything that does not match
 * one of these shapes is treated as real and migrates.
 */
const isTestEnquiry = (r) =>
  /^E2E-\d+$/.test(r.name ?? "") ||
  (r.organisation ?? "") === "E2E Test Co" ||
  /^E2E-/.test(r.reference ?? "") ||
  ["Owner Call Test", "Procurement Lead", "Ravi"].includes(r.name ?? "");

/* ------------------------------------------------------------- helpers -- */

const sqlite = new DatabaseSync(DB_PATH, { readOnly: true });
const all = (sql, ...a) => sqlite.prepare(sql).all(...a);
const parse = (s) => { try { return JSON.parse(s); } catch { return {}; } };
const iso = (s) => (s ? new Date(String(s).replace(" ", "T") + (String(s).includes("Z") ? "" : "Z")).toISOString() : null);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const counts = {};
const problems = [];

async function q(text, params = []) {
  if (!APPLY) return { rows: [], rowCount: 0 };
  return pool.query(text, params);
}

/* ================================================================ media == */

/**
 * Media ids are hashed from the file path, which is what the SQLite table used
 * as its primary key and what every content record still references. Hashing
 * the path keeps those references resolvable without rewriting 60 strings
 * inside JSONB payloads.
 */
const mediaRows = all(`SELECT * FROM media ORDER BY id`);
const mediaIdByPath = new Map();

async function migrateMedia() {
  let sized = 0;
  for (const m of mediaRows) {
    const path = m.src;
    const id = uuid5(`media:${path}`);
    mediaIdByPath.set(path, id);

    // size_bytes is 0 for every row in SQLite; recover it from disk.
    let bytes = m.bytes ?? 0;
    const onDisk = join(ROOT, "public", path.replace(/^\//, ""));
    if (existsSync(onDisk)) { bytes = statSync(onDisk).size; sized++; }
    else problems.push(`media file missing on disk: ${path}`);

    const objectKey = path.replace(/^\/media\//, "").replace(/^\//, "");
    const ext = (path.split(".").pop() ?? "").toLowerCase();
    const mime = { webp: "image/webp", png: "image/png", jpg: "image/jpeg",
      jpeg: "image/jpeg", svg: "image/svg+xml", avif: "image/avif", mp4: "video/mp4" }[ext] ?? null;

    await q(
      `INSERT INTO media (id,storage_provider,bucket,object_key,legacy_path,original_filename,
                          mime_type,size_bytes,width,height,alt_text,credit,kind,clearance,visibility,verified)
       VALUES ($1,'r2','raja-public-media',$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'public',$13)
       ON CONFLICT (id) DO UPDATE SET
         object_key=EXCLUDED.object_key, legacy_path=EXCLUDED.legacy_path,
         mime_type=EXCLUDED.mime_type, size_bytes=EXCLUDED.size_bytes,
         width=EXCLUDED.width, height=EXCLUDED.height, alt_text=EXCLUDED.alt_text,
         credit=EXCLUDED.credit, kind=EXCLUDED.kind, clearance=EXCLUDED.clearance,
         verified=EXCLUDED.verified, updated_at=now()`,
      [id, objectKey, path, path.split("/").pop(), mime, bytes, m.width ?? 0, m.height ?? 0,
       m.alt ?? "", m.credit ?? null, m.kind ?? "image", m.clearance ?? "raja-original",
       m.clearance === "raja-original"],
    );
  }
  counts.media = mediaRows.length;
  counts.media_sized_from_disk = sized;
}

/* ============================================================== records == */

const records = all(`SELECT collection,id,position,published,json FROM records ORDER BY collection,position`);
const byCollection = new Map();
for (const r of records) {
  if (!byCollection.has(r.collection)) byCollection.set(r.collection, []);
  byCollection.get(r.collection).push({ ...r, data: parse(r.json) });
}
const col = (name) => byCollection.get(name) ?? [];

/** Resolve an image reference (string path, or an object with .src) to media id. */
function mediaRef(v) {
  const path = typeof v === "string" ? v : v && typeof v === "object" ? v.src : null;
  if (!path || typeof path !== "string" || !path.startsWith("/media/")) return null;
  const id = mediaIdByPath.get(path);
  if (!id) problems.push(`unresolved media reference: ${path}`);
  return id ?? null;
}

/* -------------------------------------------------------------- clients -- */

async function migrateClients() {
  const rows = col("clients");
  for (const [i, r] of rows.entries()) {
    const d = r.data;
    await q(
      `INSERT INTO clients (id,slug,name,alternate_name,event,category,logo_media_id,published,sort_order,source_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO UPDATE SET
         slug=EXCLUDED.slug, name=EXCLUDED.name, alternate_name=EXCLUDED.alternate_name,
         event=EXCLUDED.event, category=EXCLUDED.category, logo_media_id=EXCLUDED.logo_media_id,
         published=EXCLUDED.published, sort_order=EXCLUDED.sort_order, updated_at=now()`,
      [uuid5(`client:${r.id}`), r.id, d.name ?? r.id, d.alternateName ?? null, d.event ?? null,
       d.category ?? null, mediaRef(d.logo), r.published === 1, r.position ?? i, d.status ?? null],
    );
  }
  counts.clients = rows.length;
}

/* ------------------------------------------------------------- projects -- */

async function migrateProjects() {
  const rows = col("projects");
  let heroes = 0, gallery = 0;
  for (const [i, r] of rows.entries()) {
    const d = r.data;
    const pid = uuid5(`project:${r.id}`);
    const year = d.year == null ? null : Number.parseInt(String(d.year), 10);

    await q(
      `INSERT INTO projects (id,slug,title,client_id,organisation,year,eyebrow,description,featured,published,sort_order)
       VALUES ($1,$2,$3,NULL,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO UPDATE SET
         slug=EXCLUDED.slug, title=EXCLUDED.title, organisation=EXCLUDED.organisation,
         year=EXCLUDED.year, eyebrow=EXCLUDED.eyebrow, description=EXCLUDED.description,
         featured=EXCLUDED.featured, published=EXCLUDED.published,
         sort_order=EXCLUDED.sort_order, updated_at=now()`,
      // client_id stays NULL: the organisation names resemble client rows, but
      // resemblance is not a verified commercial relationship. Owner decides.
      [pid, r.id, d.title ?? r.id, d.organization ?? null, Number.isFinite(year) ? year : null,
       d.eyebrow ?? null, d.summary ?? null, Boolean(d.featured), d.published !== false, d.order ?? i],
    );

    // The explicit hero is preserved as role='hero' rather than assuming
    // gallery[0] is the lead image.
    const heroId = mediaRef(d.hero);
    if (heroId) {
      await q(
        `INSERT INTO project_media (project_id,media_id,role,sort_order) VALUES ($1,$2,'hero',0)
         ON CONFLICT (project_id,media_id) DO UPDATE SET role='hero', sort_order=0`,
        [pid, heroId]);
      heroes++;
    }
    for (const [gi, g] of (Array.isArray(d.gallery) ? d.gallery : []).entries()) {
      const gid = mediaRef(g);
      if (!gid || gid === heroId) continue;
      await q(
        `INSERT INTO project_media (project_id,media_id,role,sort_order) VALUES ($1,$2,'gallery',$3)
         ON CONFLICT (project_id,media_id) DO UPDATE SET role='gallery', sort_order=EXCLUDED.sort_order`,
        [pid, gid, gi]);
      gallery++;
    }
  }
  counts.projects = rows.length;
  counts.project_media = heroes + gallery;
}

/* ------------------------------------------------------------- capacity -- */

/**
 * One canonical row per physical capacity.
 *
 * The same fact was published in up to four places — schedule, catalog,
 * highlights and a service page — and they had already drifted: the schedule
 * hedges "5,00,000+" where the catalogue states "5,00,000". The schedule's
 * hedged string wins as display_value because it is the weaker, more defensible
 * claim; the disagreement is recorded rather than resolved.
 */
const CAPACITY_KEY = {
  "Imported German hangers": "german-hangars",
  "Wooden floor platforms": "wooden-floors",
  "Octonorm & Maxima stalls": "octonorm-stalls",
  "Air-conditioning": "hvac",
  "Staging & platforms": "staging",
  "Lighting & AV systems": "lighting-av",
  "LED fascia": "led-fascia",
  "Seating": "seating",
  "Flooring & carpeting": "flooring-carpeting",
  "Catering services": "catering",
};
const CATALOG_CAPACITY_KEY = {
  "Clear-Span German Aluminium Hangars": "german-hangars",
  "Modular Wooden Floors & Ground Engineering": "wooden-floors",
  "Engineered Staging, VIP Dais & Rigging": "staging",
  "Temporary Mobile HVAC & Climate Control": "hvac",
  "Iron Crowd-Control Barricades & Perimeters": "barricades",
  "Dedicated Logistics Fleet & Mobile Heavy Machinery": "logistics-fleet",
};

/** "5,00,000+" -> 500000 (advisory only; never rendered). */
function numeric(display) {
  if (!display) return null;
  const n = Number(String(display).replace(/[^0-9]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function migrateCapacity() {
  const seen = new Map();
  for (const [i, r] of col("schedule").entries()) {
    const d = r.data;
    const key = CAPACITY_KEY[d.item] ?? d.item.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    seen.set(key, {
      key, label: d.item, display: d.capacity ?? null, unit: d.unit || null,
      note: d.note ?? null, status: d.status ?? "approved", order: r.position ?? i,
      published: r.published === 1,
    });
  }
  // Catalogue-only capacities (barricades, logistics fleet) have no schedule row.
  for (const [i, r] of col("catalog").entries()) {
    const d = r.data;
    const key = CATALOG_CAPACITY_KEY[d.name];
    if (!key || seen.has(key)) continue;
    seen.set(key, {
      key, label: d.name, display: d.totalCapacity ?? null, unit: d.unit || null,
      note: null, status: "approved", order: 100 + i, published: true,
    });
  }

  for (const c of seen.values()) {
    await q(
      `INSERT INTO capacity_items (id,key,label,value,display_value,unit,note,status,sort_order,published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (key) DO UPDATE SET
         label=EXCLUDED.label, value=EXCLUDED.value, display_value=EXCLUDED.display_value,
         unit=EXCLUDED.unit, note=EXCLUDED.note, status=EXCLUDED.status,
         sort_order=EXCLUDED.sort_order, published=EXCLUDED.published, updated_at=now()`,
      [uuid5(`capacity:${c.key}`), c.key, c.label, numeric(c.display), c.display,
       c.unit, c.note, c.status, c.order, c.published],
    );
  }
  counts.capacity_items = seen.size;
  return seen;
}

async function migrateInventoryItems() {
  const rows = col("catalog");
  for (const [i, r] of rows.entries()) {
    const d = r.data;
    const specs = {
      specs: d.specs ?? [], features: d.features ?? [], applications: d.applications ?? [],
      icon: d.icon ?? null, shortName: d.shortName ?? null, tagline: d.tagline ?? null,
      alt: d.alt ?? null,
    };
    await q(
      `INSERT INTO inventory_items (id,slug,category,title,description,specifications,capacity_key,media_id,sort_order,published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO UPDATE SET
         slug=EXCLUDED.slug, title=EXCLUDED.title, description=EXCLUDED.description,
         specifications=EXCLUDED.specifications, capacity_key=EXCLUDED.capacity_key,
         media_id=EXCLUDED.media_id, sort_order=EXCLUDED.sort_order,
         published=EXCLUDED.published, updated_at=now()`,
      [uuid5(`inventory:${r.id}`), r.id, d.category ?? "", d.name ?? r.id, d.description ?? null,
       JSON.stringify(specs), CATALOG_CAPACITY_KEY[d.name] ?? null, mediaRef(d.image),
       r.position ?? i, r.published === 1],
    );
  }
  counts.inventory_items = rows.length;
}

/* ------------------------------------------------------ content_entries -- */

const RELATIONAL = new Set(["clients", "projects", "schedule", "catalog"]);
const SLUGGED = new Set(["services", "solutions", "recentEvents", "locations"]);

async function migrateContent() {
  let n = 0;
  for (const [collection, rows] of byCollection) {
    if (RELATIONAL.has(collection)) continue;
    for (const [i, r] of rows.entries()) {
      const d = r.data;
      const slug = SLUGGED.has(collection) ? (d.slug ?? r.id) : null;
      const title = d.title ?? d.label ?? d.name ?? d.item ?? d.headline ?? d.project ?? null;
      await q(
        `INSERT INTO content_entries (id,collection,entry_key,slug,title,data,sort_order,published)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO UPDATE SET
           slug=EXCLUDED.slug, title=EXCLUDED.title, data=EXCLUDED.data,
           sort_order=EXCLUDED.sort_order, published=EXCLUDED.published, updated_at=now()`,
        [uuid5(`${collection}:${r.id}`), collection, r.id, slug, title,
         JSON.stringify(d), r.position ?? i, r.published === 1],
      );
      n++;
    }
  }
  counts.content_entries = n;
}

/* ---------------------------------------------------------------- users -- */

async function migrateUsers() {
  const rows = all(`SELECT * FROM users`);
  let kept = 0;
  for (const u of rows) {
    // Password hashes carry their own iteration count and migrate verbatim —
    // no re-hash, so 210,000 iterations is preserved exactly.
    await q(
      `INSERT INTO users (id,email,password_hash,role,display_name,active,created_at,last_login_at)
       VALUES ($1,$2,$3,$4,$5,true,$6,$7)
       ON CONFLICT (id) DO UPDATE SET
         email=EXCLUDED.email, password_hash=EXCLUDED.password_hash, role=EXCLUDED.role,
         display_name=EXCLUDED.display_name, updated_at=now()`,
      [uuid5(`user:${u.id}`), u.email, u.password, u.role ?? "owner", u.name ?? "",
       iso(u.created_at) ?? new Date().toISOString(), iso(u.last_seen_at)],
    );
    kept++;
  }
  counts.users = kept;
}

/* ------------------------------------------------------------ enquiries -- */

async function migrateEnquiries() {
  const rows = all(`SELECT * FROM enquiries ORDER BY id`);
  const real = rows.filter((r) => !isTestEnquiry(r));
  const excluded = rows.length - real.length;

  const keptIds = new Set();
  for (const e of real) {
    const id = uuid5(`enquiry:${e.reference || e.id}`);
    keptIds.add(e.id);
    await q(
      `INSERT INTO enquiries (id,reference,name,company,email,phone,event_type,city,event_date,
                              attendance,venue,budget_band,triage_band,requirements,message,status,
                              next_follow_up_at,created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       ON CONFLICT (id) DO UPDATE SET status=EXCLUDED.status, updated_at=now()`,
      [id, e.reference, e.name, e.organisation ?? "", e.email ?? "", e.phone ?? "",
       e.event_type ?? "", e.location ?? "", e.event_date ?? "", e.attendance ?? "",
       e.venue ?? "", e.budget ?? "", e.band ?? "general", e.requirement ?? "",
       e.message ?? "", e.status ?? "new", iso(e.next_followup_on), iso(e.created_at)],
    );
  }
  counts.enquiries = real.length;
  counts.enquiries_excluded_as_test = excluded;

  const notes = all(`SELECT * FROM enquiry_notes ORDER BY id`).filter((n) => keptIds.has(n.enquiry_id));
  counts.enquiry_notes = notes.length;
  counts.enquiry_notes_excluded = all(`SELECT COUNT(*) c FROM enquiry_notes`)[0].c - notes.length;

  const files = all(`SELECT id,enquiry_id,filename,mime,bytes FROM enquiry_files`).filter((f) => keptIds.has(f.enquiry_id));
  counts.enquiry_files = files.length;
  counts.enquiry_files_excluded = all(`SELECT COUNT(*) c FROM enquiry_files`)[0].c - files.length;

  counts.sessions_excluded_as_test = all(`SELECT COUNT(*) c FROM sessions`)[0].c;
  counts.audit_excluded_as_test = all(`SELECT COUNT(*) c FROM audit_logs`)[0].c;
}

/* -------------------------------------------------------------- settings -- */

async function migrateSettings() {
  const rows = all(`SELECT key,json FROM settings`);
  for (const s of rows) {
    await q(`INSERT INTO site_settings (key,value) VALUES ($1,$2)
             ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, updated_at=now()`,
      [s.key, s.json]);
  }
  counts.site_settings = rows.length;
  counts.page_seo = 0; // seoOverrides ships empty by design
}

/* ------------------------------------------------------------------ run -- */

console.log(`\nSQLite -> Neon   ${APPLY ? "APPLY" : "DRY RUN (no writes)"}`);
console.log("=".repeat(58));

if (APPLY) {
  const schema = readFileSync(join(ROOT, "lib/db/schema.sql"), "utf8");
  await pool.query(schema);
  console.log("schema applied\n");
}

await migrateMedia();
await migrateUsers();
await migrateClients();
await migrateProjects();
await migrateCapacity();
await migrateInventoryItems();
await migrateContent();
await migrateEnquiries();
await migrateSettings();

if (APPLY) {
  await pool.query(
    `INSERT INTO migration_runs (id,source_sha,note,counts) VALUES ($1,$2,$3,$4)`,
    [randomUUID(), process.env.SOURCE_SHA ?? null, "sqlite->neon", JSON.stringify(counts)]);
}

for (const [k, v] of Object.entries(counts)) {
  console.log(`  ${k.padEnd(32)} ${String(v).padStart(5)}`);
}

if (problems.length) {
  console.log(`\n  ${problems.length} problem(s):`);
  for (const p of [...new Set(problems)].slice(0, 20)) console.log(`    ! ${p}`);
}

await pool.end();
console.log(`\n${APPLY ? "migration applied" : "dry run complete — re-run with --apply"}\n`);
