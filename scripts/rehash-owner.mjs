/**
 * Re-hashes the owner password into the chained PBKDF2 form.
 *
 *   node --env-file=.env.local scripts/rehash-owner.mjs
 *
 * Needed once, because Cloudflare Workers refuses a single PBKDF2 call above
 * 100,000 iterations. The existing hash was made in one 210,000-iteration call,
 * so the Worker cannot verify it — and cannot therefore upgrade it on a
 * successful sign-in either, since the sign-in can never succeed.
 *
 * The work factor is unchanged: 3 chained rounds of 70,000 is the same 210,000
 * iterations of PBKDF2-SHA256 an attacker had to pay before.
 */
import { Pool } from "@neondatabase/serverless";

const TOTAL = Number(process.env.RAJA_PBKDF2_ITERATIONS ?? 210_000);
const MAX_PER_CALL = 100_000;
const KEYLEN = 32;

const hex = (b) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");

async function derive(password, salt, iterations) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"],
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, KEYLEN * 8,
  );
}

async function hashPassword(password) {
  const count = Math.max(1, Math.ceil(TOTAL / MAX_PER_CALL));
  const per = Math.ceil(TOTAL / count);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  let bits = await derive(password, salt, per);
  for (let i = 1; i < count; i++) bits = await derive(hex(bits), salt, per);
  return { hash: `pbkdf2c$${count}x${per}$${hex(salt.buffer)}$${hex(bits)}`, count, per };
}

const email = process.env.RAJA_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.RAJA_ADMIN_PASSWORD;
if (!email || !password) {
  console.error("RAJA_ADMIN_EMAIL and RAJA_ADMIN_PASSWORD must be set");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const before = await pool.query(
  `SELECT id, left(password_hash, 12) AS scheme FROM users WHERE lower(email) = $1`, [email]);
if (!before.rows.length) {
  console.error("no matching user in Neon");
  process.exit(1);
}
console.log(`  before: ${before.rows[0].scheme}...`);

const t = Date.now();
const { hash, count, per } = await hashPassword(password);
console.log(`  hashed in ${Date.now() - t}ms  (${count} rounds x ${per} = ${count * per} iterations)`);

await pool.query(
  `UPDATE users SET password_hash = $2, updated_at = now() WHERE lower(email) = $1`,
  [email, hash]);

// Every existing session is invalidated: a credential change that leaves old
// sessions alive has not actually changed anything.
const killed = await pool.query(
  `DELETE FROM sessions WHERE user_id = $1`, [before.rows[0].id]);

const after = await pool.query(
  `SELECT left(password_hash, 14) AS scheme FROM users WHERE lower(email) = $1`, [email]);
console.log(`  after : ${after.rows[0].scheme}...`);
console.log(`  sessions invalidated: ${killed.rowCount ?? 0}`);

await pool.end();
