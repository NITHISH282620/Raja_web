import "server-only";
import { cookies } from "next/headers";
import { db } from "./db";

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
 */

const COOKIE = "raja_session";
const SESSION_DAYS = 14;

/* ---------------------------------- hashing ---------------------------------- */

const KEYLEN = 32; // bytes
const ITERATIONS = Number(process.env.RAJA_PBKDF2_ITERATIONS ?? 210_000);

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

/** `pbkdf2$<iterations>$<salt hex>$<key hex>`. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const bits = await derive(password, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${hex(salt.buffer as ArrayBuffer)}$${hex(bits)}`;
}

/**
 * The iteration count is read back out of the stored hash rather than taken
 * from the constant, so raising ITERATIONS later does not lock out every
 * existing account. Old hashes keep verifying at the count they were made with.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iterStr, salt, key] = stored.split("$");
  if (scheme !== "pbkdf2" || !iterStr || !salt || !key) return false;
  const iterations = Number(iterStr);
  if (!Number.isFinite(iterations) || iterations < 1) return false;

  const candidate = new Uint8Array(await derive(password, unhex(salt), iterations));
  const expected = unhex(key);
  if (candidate.length !== expected.length) return false;

  // Constant time. Workers does not guarantee node:crypto.timingSafeEqual, and
  // an early-return comparison leaks the position of the first wrong byte.
  let diff = 0;
  for (let i = 0; i < candidate.length; i++) diff |= candidate[i]! ^ expected[i]!;
  return diff === 0;
}

/* ---------------------------------- users ------------------------------------ */

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
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
  const count = (db().prepare(`SELECT COUNT(*) AS n FROM users`).get() as { n: number }).n;
  if (count > 0) return;

  const email = process.env.RAJA_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.RAJA_ADMIN_PASSWORD;
  if (!email || !password) return; // fail closed

  db()
    .prepare(`INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, 'owner')`)
    .run(email, "Raja Enterprises", await hashPassword(password));
}

/** False when no account exists — the admin cannot be signed into at all. */
export function adminConfigured(): boolean {
  return (db().prepare(`SELECT COUNT(*) AS n FROM users`).get() as { n: number }).n > 0;
}

export function findUser(email: string) {
  return db()
    .prepare(`SELECT id, email, name, password, role FROM users WHERE email = ?`)
    .get(email.trim().toLowerCase()) as
    | { id: number; email: string; name: string; password: string; role: string }
    | undefined;
}

export async function setPassword(userId: number, password: string) {
  db().prepare(`UPDATE users SET password = ? WHERE id = ?`).run(await hashPassword(password), userId);
  // Every existing session is invalidated: a password change that leaves old
  // sessions alive does not actually lock anyone out.
  db().prepare(`DELETE FROM sessions WHERE user_id = ?`).run(userId);
}

/* --------------------------------- sessions ---------------------------------- */

export async function createSession(userId: number): Promise<void> {
  // Web Crypto rather than node:randomBytes, for the same portability reason.
  const raw = crypto.getRandomValues(new Uint8Array(32));
  const token = btoa(String.fromCharCode(...raw))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);

  db()
    .prepare(`INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`)
    .run(token, userId, expires.toISOString());
  db().prepare(`UPDATE users SET last_seen_at = datetime('now') WHERE id = ?`).run(userId);

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
  if (token) db().prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
  jar.delete(COOKIE);
}

/** The signed-in user, or null. Safe to call from any server component. */
export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  const row = db()
    .prepare(
      `SELECT u.id, u.email, u.name, u.role, s.expires_at
         FROM sessions s JOIN users u ON u.id = s.user_id
        WHERE s.token = ?`,
    )
    .get(token) as
    | { id: number; email: string; name: string; role: string; expires_at: string }
    | undefined;

  if (!row) return null;
  if (new Date(row.expires_at) < new Date()) {
    db().prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
    return null;
  }
  return { id: row.id, email: row.email, name: row.name, role: row.role };
}

/** Clears sessions that have already expired. Called on login. */
export function pruneSessions(): void {
  db().prepare(`DELETE FROM sessions WHERE expires_at < datetime('now')`).run();
}
