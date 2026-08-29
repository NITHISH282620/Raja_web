import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
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
 * Passwords are scrypt with a per-user random salt. scrypt is memory-hard, so
 * a stolen database is not trivially crackable, and it is in Node's standard
 * library — no bcrypt native build.
 *
 * Sessions are opaque random tokens stored server-side rather than signed JWTs,
 * because a server-side session can be revoked. "Sign out everywhere" is a
 * DELETE; with a stateless token it is impossible before expiry.
 */

const COOKIE = "raja_session";
const SESSION_DAYS = 14;

/* ---------------------------------- hashing ---------------------------------- */

const KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const key = scryptSync(password, salt, KEYLEN).toString("hex");
  return `scrypt$${salt}$${key}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, key] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !key) return false;
  const candidate = scryptSync(password, salt, KEYLEN);
  const expected = Buffer.from(key, "hex");
  // Length check first: timingSafeEqual throws on a mismatch rather than
  // returning false, which would turn a wrong-length password into a 500.
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

/* ---------------------------------- users ------------------------------------ */

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

/**
 * Creates the first account if the users table is empty.
 *
 * Credentials come from `RAJA_ADMIN_EMAIL` / `RAJA_ADMIN_PASSWORD` when set.
 * The fallback below is a KNOWN, PUBLIC, DOCUMENTED development credential —
 * it exists so the client can open the admin and look at it without a setup
 * call. `requirePasswordChange` is what stops it from quietly becoming the
 * production password: the admin refuses to do anything else until it is
 * changed.
 */
export const DEV_EMAIL = "admin@rajaenterprises.co";
export const DEV_PASSWORD = "raja-admin-2026";

export function ensureSeedUser(): void {
  const count = (db().prepare(`SELECT COUNT(*) AS n FROM users`).get() as { n: number }).n;
  if (count > 0) return;

  const email = (process.env.RAJA_ADMIN_EMAIL ?? DEV_EMAIL).toLowerCase();
  const password = process.env.RAJA_ADMIN_PASSWORD ?? DEV_PASSWORD;

  db()
    .prepare(`INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, 'owner')`)
    .run(email, "Raja Enterprises", hashPassword(password));
}

/** True while the seed account is still on its published default password. */
export function usingDefaultPassword(): boolean {
  if (process.env.RAJA_ADMIN_PASSWORD) return false;
  const row = db()
    .prepare(`SELECT password FROM users WHERE email = ?`)
    .get(DEV_EMAIL) as { password: string } | undefined;
  return Boolean(row && verifyPassword(DEV_PASSWORD, row.password));
}

export function findUser(email: string) {
  return db()
    .prepare(`SELECT id, email, name, password, role FROM users WHERE email = ?`)
    .get(email.trim().toLowerCase()) as
    | { id: number; email: string; name: string; password: string; role: string }
    | undefined;
}

export function setPassword(userId: number, password: string) {
  db().prepare(`UPDATE users SET password = ? WHERE id = ?`).run(hashPassword(password), userId);
  // Every existing session is invalidated: a password change that leaves old
  // sessions alive does not actually lock anyone out.
  db().prepare(`DELETE FROM sessions WHERE user_id = ?`).run(userId);
}

/* --------------------------------- sessions ---------------------------------- */

export async function createSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString("base64url");
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
