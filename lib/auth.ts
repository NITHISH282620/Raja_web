import "server-only";
import { cookies } from "next/headers";
import { query, execute } from "./db/neon";

/**
 * Authentication for the Raja admin.
 *
 * Deliberately small: one cookie, one table, no third-party identity provider.
 * This protects one company's own content editor, not a multi-tenant product,
 * and every dependency added here is one the client would have to keep paying
 * for and keep patched.
 *
 * Passwords are PBKDF2-SHA256 with a per-user random salt, via **Web Crypto**
 * rather than `node:crypto`. That is a deployment requirement, not a
 * preference: this application targets the Cloudflare Workers runtime, where
 * `scryptSync` is not confirmed to exist and native builds like bcrypt cannot
 * run at all. Web Crypto is present in Workers and in Node alike, so the same
 * code authenticates in both and the auth layer stops being the thing that
 * pins us to one host.
 *
 * scrypt is the better algorithm — memory-hardness is exactly what resists GPU
 * cracking, and PBKDF2 has none. PBKDF2 is chosen because it is the strongest
 * KDF that actually exists in both runtimes, and it is used with a high
 * iteration count to compensate as far as it can.
 *
 * ITERATIONS ARE A DEPLOYMENT VARIABLE. PBKDF2 is pure CPU, and Cloudflare
 * Workers meters CPU per request — 10 ms on the free plan. Sign-in is therefore
 * the most CPU-expensive route on the site and the one that decides whether the
 * free plan is viable. The count is env-tunable so it can be measured against a
 * real deployment rather than guessed at.
 *
 * Sessions are opaque random tokens stored server-side rather than signed JWTs,
 * because a server-side session can be revoked. "Sign out everywhere" is a
 * DELETE; with a stateless token it is impossible before expiry.
 *
 * Only the SHA-256 OF the token is stored. The cookie holds the token itself,
 * so a leaked database row cannot be replayed as a live session — which the
 * previous schema, where the raw token was the primary key, allowed.
 */

const COOKIE = "raja_session";
const SESSION_DAYS = 14;

/* ---------------------------------- hashing ---------------------------------- */

const KEYLEN = 32; // bytes

/**
 * The total PBKDF2 work factor. Unchanged at 210,000.
 */
const ITERATIONS = Number(process.env.RAJA_PBKDF2_ITERATIONS ?? 210_000);

/**
 * Cloudflare Workers refuses a single PBKDF2 call above 100,000 iterations:
 *
 *   NotSupportedError: Pbkdf2 failed: iteration counts above 100000 are not
 *   supported (requested 210000).
 *
 * That is a cap in the runtime's WebCrypto implementation, not a CPU budget, so
 * no paid plan lifts it. The work factor is therefore reached by CHAINING
 * rounds that each sit under the cap: the output of one derivation is the input
 * to the next, over the same salt.
 *
 * This is not a weakening. An attacker testing one candidate password still
 * performs 210,000 iterations of PBKDF2-SHA256; the total is merely expressed
 * in units the platform will accept. Chaining is sequential by construction, so
 * it cannot be parallelised away either.
 */
const MAX_ITERATIONS_PER_CALL = 100_000;

/** Splits a work factor into as few equal rounds as the platform allows. */
function rounds(total: number): { count: number; per: number } {
  const count = Math.max(1, Math.ceil(total / MAX_ITERATIONS_PER_CALL));
  return { count, per: Math.ceil(total / count) };
}

const hex = (b: ArrayBuffer): string =>
  [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");

const unhex = (s: string): Uint8Array =>
  new Uint8Array((s.match(/.{1,2}/g) ?? []).map((b) => parseInt(b, 16)));

async function derive(password: string, salt: Uint8Array, iterations: number): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    key,
    KEYLEN * 8,
  );
}

/**
 * Derives the key by chaining `count` rounds of `per` iterations.
 *
 * Each round feeds on the previous round's output, so the rounds cannot be run
 * in parallel and the cost is genuinely additive.
 */
async function deriveChained(
  password: string, salt: Uint8Array, count: number, per: number,
): Promise<ArrayBuffer> {
  let secret = password;
  let bits = await derive(secret, salt, per);
  for (let i = 1; i < count; i++) {
    secret = hex(bits);
    bits = await derive(secret, salt, per);
  }
  return bits;
}

/** `pbkdf2c$<count>x<per>$<salt hex>$<key hex>` — total work is count × per. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const { count, per } = rounds(ITERATIONS);
  const bits = await deriveChained(password, salt, count, per);
  return `pbkdf2c$${count}x${per}$${hex(salt.buffer as ArrayBuffer)}$${hex(bits)}`;
}

/**
 * The iteration count is read back out of the stored hash rather than taken
 * from the constant, so raising ITERATIONS later does not lock out every
 * existing account. Old hashes keep verifying at the count they were made with.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, work, salt, key] = stored.split("$");
  if (!scheme || !work || !salt || !key) return false;

  let candidate: Uint8Array;
  if (scheme === "pbkdf2c") {
    // Chained form: "<count>x<per>".
    const [countStr, perStr] = work.split("x");
    const count = Number(countStr);
    const per = Number(perStr);
    if (!Number.isFinite(count) || !Number.isFinite(per) || count < 1 || per < 1) return false;
    candidate = new Uint8Array(await deriveChained(password, unhex(salt), count, per));
  } else if (scheme === "pbkdf2") {
    // Legacy single-call form, still verifiable wherever the runtime allows the
    // full count. On Workers anything above 100,000 throws, which is exactly
    // why these are re-hashed on the next successful sign-in.
    const iterations = Number(work);
    if (!Number.isFinite(iterations) || iterations < 1) return false;
    try {
      candidate = new Uint8Array(await derive(password, unhex(salt), iterations));
    } catch {
      return false;
    }
  } else {
    return false;
  }
  const expected = unhex(key);
  if (candidate.length !== expected.length) return false;

  // Constant time. Workers does not guarantee node:crypto.timingSafeEqual, and
  // an early-return comparison leaks the position of the first wrong byte.
  let diff = 0;
  for (let i = 0; i < candidate.length; i++) diff |= candidate[i]! ^ expected[i]!;
  return diff === 0;
}

/** True when a stored hash is not in the chained form the runtime can verify. */
export function needsRehash(stored: string): boolean {
  return !stored.startsWith("pbkdf2c$");
}

/* ---------------------------------- users ------------------------------------ */

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

/** Sessions are looked up by digest, never by the token itself. */
async function tokenHash(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return hex(digest);
}

/**
 * Creates the owner account, and ONLY from configuration.
 *
 * This used to fall back to a published constant — `admin@rajaenterprises.co` /
 * `raja-admin-2026` — which the login page then printed on screen for
 * convenience. On a public URL that is not a development aid, it is a
 * documented way in. Both are gone, and there is no fallback of any kind.
 *
 * The system now fails CLOSED: with no `RAJA_ADMIN_EMAIL` and
 * `RAJA_ADMIN_PASSWORD` set, no account is created and nobody can sign in. An
 * admin that is unreachable until someone deliberately configures it is the
 * correct failure, and it is the only one that cannot be guessed.
 */
export async function ensureOwnerAccount(): Promise<void> {
  const [{ n }] = await query<{ n: number }>(`SELECT COUNT(*)::int AS n FROM users`);
  if (n > 0) return;

  const email = process.env.RAJA_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.RAJA_ADMIN_PASSWORD;
  if (!email || !password) return; // fail closed

  await execute(
    `INSERT INTO users (id, email, display_name, password_hash, role)
     VALUES (gen_random_uuid(), $1, $2, $3, 'owner')`,
    [email, "Raja Enterprises", await hashPassword(password)],
  );
}

/** False when no account exists — the admin cannot be signed into at all. */
export async function adminConfigured(): Promise<boolean> {
  const [{ n }] = await query<{ n: number }>(`SELECT COUNT(*)::int AS n FROM users`);
  return n > 0;
}

export async function findUser(email: string) {
  const rows = await query<{
    id: string; email: string; name: string; password: string; role: string;
  }>(
    `SELECT id, email, display_name AS name, password_hash AS password, role
       FROM users WHERE lower(email) = lower($1) AND active`,
    [email.trim()],
  );
  return rows[0];
}

export async function setPassword(userId: string, password: string) {
  await execute(`UPDATE users SET password_hash = $2, updated_at = now() WHERE id = $1`,
    [userId, await hashPassword(password)]);
  // Every existing session is invalidated: a password change that leaves old
  // sessions alive does not actually lock anyone out.
  await execute(`DELETE FROM sessions WHERE user_id = $1`, [userId]);
}

/* --------------------------------- sessions ---------------------------------- */

export async function createSession(userId: string): Promise<void> {
  // Web Crypto rather than node:randomBytes, for the same portability reason.
  const raw = crypto.getRandomValues(new Uint8Array(32));
  const token = btoa(String.fromCharCode(...raw))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);

  await execute(
    `INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)`,
    [await tokenHash(token), userId, expires.toISOString()],
  );
  await execute(`UPDATE users SET last_login_at = now() WHERE id = $1`, [userId]);

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await execute(`DELETE FROM sessions WHERE token_hash = $1`, [await tokenHash(token)]);
  jar.delete(COOKIE);
}

/** The signed-in user, or null. Safe to call from any server component. */
export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  const digest = await tokenHash(token);
  const rows = await query<{
    id: string; email: string; name: string; role: string; expires_at: string;
  }>(
    `SELECT u.id, u.email, u.display_name AS name, u.role, s.expires_at
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = $1 AND u.active`,
    [digest],
  );
  const row = rows[0];

  if (!row) return null;
  if (new Date(row.expires_at) < new Date()) {
    await execute(`DELETE FROM sessions WHERE token_hash = $1`, [digest]);
    return null;
  }
  return { id: row.id, email: row.email, name: row.name, role: row.role };
}

/** Clears sessions that have already expired. Called on login. */
export async function pruneSessions(): Promise<void> {
  await execute(`DELETE FROM sessions WHERE expires_at < now()`);
}
