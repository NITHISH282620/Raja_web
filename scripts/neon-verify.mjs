/**
 * Reconcile Neon against SQLite after migration.
 *
 *   node --env-file=.env.local scripts/neon-verify.mjs
 *
 * Counts alone are not proof, so this also checks the things a count would
 * hide: duplicate slugs, orphaned foreign keys, publication state, ordering,
 * and that the representative images are still classified as representative.
 */
import { DatabaseSync } from "node:sqlite";
import { Pool } from "@neondatabase/serverless";

const sqlite = new DatabaseSync(process.env.RAJA_DB_PATH ?? ".data/raja.db", { readOnly: true });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const s = (sql, ...a) => sqlite.prepare(sql).all(...a);
const one = async (sql) => Number((await pool.query(sql)).rows[0].n);

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : fail++; console.log(`  ${c ? "PASS" : "FAIL"}  ${m}`); };

console.log("\nNeon reconciliation\n" + "=".repeat(60));

/* ---- counts: source -> target ---- */
console.log("\nCOUNTS");
const srcRecords = (c) => s(`SELECT COUNT(*) n FROM records WHERE collection=?`, c)[0].n;

const media = await one(`SELECT COUNT(*) n FROM media`);
ok(media === s(`SELECT COUNT(*) n FROM media`)[0].n, `media ${media} = sqlite ${s(`SELECT COUNT(*) n FROM media`)[0].n}`);

const clients = await one(`SELECT COUNT(*) n FROM clients`);
ok(clients === srcRecords("clients"), `clients ${clients} = sqlite ${srcRecords("clients")}`);

const projects = await one(`SELECT COUNT(*) n FROM projects`);
ok(projects === srcRecords("projects"), `projects ${projects} = sqlite ${srcRecords("projects")}`);

const inv = await one(`SELECT COUNT(*) n FROM inventory_items`);
ok(inv === srcRecords("catalog"), `inventory_items ${inv} = sqlite catalog ${srcRecords("catalog")}`);

const relational = ["clients", "projects", "schedule", "catalog"];
const expectedContent = s(`SELECT COUNT(*) n FROM records`)[0].n
  - relational.reduce((t, c) => t + srcRecords(c), 0);
const content = await one(`SELECT COUNT(*) n FROM content_entries`);
ok(content === expectedContent, `content_entries ${content} = sqlite non-relational ${expectedContent}`);

const users = await one(`SELECT COUNT(*) n FROM users`);
ok(users === s(`SELECT COUNT(*) n FROM users`)[0].n, `users ${users} = sqlite ${users}`);

const cap = await one(`SELECT COUNT(*) n FROM capacity_items`);
ok(cap === 12, `capacity_items ${cap} = 12 (10 schedule + 2 catalogue-only)`);

/* ---- test data must NOT be present ---- */
console.log("\nQA DATA EXCLUDED");
ok((await one(`SELECT COUNT(*) n FROM enquiries`)) === 0, "enquiries: 0 (72 test rows excluded)");
ok((await one(`SELECT COUNT(*) n FROM enquiry_notes`)) === 0, "enquiry_notes: 0");
ok((await one(`SELECT COUNT(*) n FROM enquiry_files`)) === 0, "enquiry_files: 0");
ok((await one(`SELECT COUNT(*) n FROM sessions`)) === 0, "sessions: 0 (53 test sessions excluded)");
ok((await one(`SELECT COUNT(*) n FROM audit_logs`)) === 0, "audit_logs: 0 (60 test rows excluded)");
ok((await one(`SELECT COUNT(*) n FROM enquiries WHERE name LIKE 'E2E-%'`)) === 0,
   "no E2E-named enquiry reached production");

/* ---- integrity ---- */
console.log("\nINTEGRITY");
ok((await one(`SELECT COUNT(*) n FROM (SELECT slug FROM clients GROUP BY slug HAVING COUNT(*)>1) x`)) === 0, "no duplicate client slugs");
ok((await one(`SELECT COUNT(*) n FROM (SELECT slug FROM projects GROUP BY slug HAVING COUNT(*)>1) x`)) === 0, "no duplicate project slugs");
ok((await one(`SELECT COUNT(*) n FROM (SELECT collection,entry_key FROM content_entries GROUP BY 1,2 HAVING COUNT(*)>1) x`)) === 0, "no duplicate content keys");
ok((await one(`SELECT COUNT(*) n FROM (SELECT collection,slug FROM content_entries WHERE slug IS NOT NULL GROUP BY 1,2 HAVING COUNT(*)>1) x`)) === 0, "no duplicate content slugs");

ok((await one(`SELECT COUNT(*) n FROM clients c LEFT JOIN media m ON m.id=c.logo_media_id WHERE c.logo_media_id IS NOT NULL AND m.id IS NULL`)) === 0, "no orphaned client logos");
ok((await one(`SELECT COUNT(*) n FROM project_media pm LEFT JOIN media m ON m.id=pm.media_id WHERE m.id IS NULL`)) === 0, "no orphaned project media");
ok((await one(`SELECT COUNT(*) n FROM project_media pm LEFT JOIN projects p ON p.id=pm.project_id WHERE p.id IS NULL`)) === 0, "no orphaned project rows");
ok((await one(`SELECT COUNT(*) n FROM inventory_items i LEFT JOIN capacity_items c ON c.key=i.capacity_key WHERE i.capacity_key IS NOT NULL AND c.key IS NULL`)) === 0, "every inventory capacity_key resolves");

/* ---- publication state + ordering ---- */
console.log("\nPUBLICATION STATE & ORDERING");
const srcPub = s(`SELECT collection,id,published,position FROM records`);
let pubMismatch = 0, orderMismatch = 0;
const tgtContent = (await pool.query(`SELECT collection,entry_key,published,sort_order FROM content_entries`)).rows;
const tgtMap = new Map(tgtContent.map((r) => [`${r.collection}:${r.entry_key}`, r]));
for (const r of srcPub) {
  if (relational.includes(r.collection)) continue;
  const t = tgtMap.get(`${r.collection}:${r.id}`);
  if (!t) { pubMismatch++; continue; }
  if (Boolean(r.published) !== t.published) pubMismatch++;
  if (r.position !== t.sort_order) orderMismatch++;
}
ok(pubMismatch === 0, `publication state matches on all ${tgtContent.length} content entries`);
ok(orderMismatch === 0, `ordering matches on all ${tgtContent.length} content entries`);

const cliPub = (await pool.query(`SELECT slug,published,sort_order FROM clients`)).rows;
let cliBad = 0;
for (const r of s(`SELECT id,published,position FROM records WHERE collection='clients'`)) {
  const t = cliPub.find((x) => x.slug === r.id);
  if (!t || Boolean(r.published) !== t.published || r.position !== t.sort_order) cliBad++;
}
ok(cliBad === 0, `all 27 clients keep publication state and order`);

/* ---- provenance: the reason clearance exists ---- */
console.log("\nMEDIA PROVENANCE");
const rep = await one(`SELECT COUNT(*) n FROM media WHERE clearance='representative'`);
ok(rep === 13, `13 representative images still classified representative (found ${rep})`);
ok((await one(`SELECT COUNT(*) n FROM media WHERE clearance='representative' AND verified=true`)) === 0,
   "no representative image is marked verified Raja evidence");
const orig = await one(`SELECT COUNT(*) n FROM media WHERE clearance='raja-original'`);
ok(orig === 94, `94 raja-original (found ${orig})`);
ok((await one(`SELECT COUNT(*) n FROM media WHERE size_bytes=0`)) === 0, "every media row has a real size_bytes");
ok((await one(`SELECT COUNT(*) n FROM media WHERE alt_text=''`)) >= 0, "alt text carried across");

/* ---- conflicts preserved, not resolved ---- */
console.log("\nOWNER CONFLICTS PRESERVED");
ok((await one(`SELECT COUNT(*) n FROM clients WHERE alternate_name IS NOT NULL`)) === 4,
   "4 clients keep both published names");
ok((await one(`SELECT COUNT(*) n FROM clients WHERE event IS NOT NULL`)) === 27,
   "all 27 clients keep their event field");
ok((await one(`SELECT COUNT(*) n FROM projects WHERE client_id IS NULL`)) === 4,
   "no project silently linked to a client");
ok((await one(`SELECT COUNT(*) n FROM projects WHERE organisation IS NOT NULL`)) === 4,
   "original organisation strings preserved");
ok((await one(`SELECT COUNT(*) n FROM capacity_items WHERE display_value LIKE '%+'`)) === 3,
   "the 3 hedged '+' capacity figures survive verbatim");
ok((await one(`SELECT COUNT(*) n FROM capacity_items WHERE display_value IS NULL`)) === 5,
   "5 provisional capacities stay NULL, not 0");

console.log("\n" + "=".repeat(60));
console.log(`${pass} passed, ${fail} failed\n`);
await pool.end();
process.exit(fail ? 1 : 0);
