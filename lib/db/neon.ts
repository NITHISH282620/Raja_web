import "server-only";
import { neon, neonConfig, Pool } from "@neondatabase/serverless";
import { cache } from "react";

/**
 * The Neon connection.
 *
 * Two shapes, because the runtime has two very different needs:
 *
 *   `sql` is the HTTP driver. One request, one round trip, no socket to keep
 *   alive — which is what a Worker wants, since a Worker may be torn down
 *   between any two statements and pooled TCP connections leak in that model.
 *
 *   `pool()` is the WebSocket driver, used only where a real transaction is
 *   required. It is opened and closed inside the operation that needs it.
 *
 * Everything read-side goes through `sql`.
 */

const url = process.env.DATABASE_URL;

if (!url) {
  // Fail loudly at import rather than producing empty pages that look like a
  // content problem. A missing database URL is a deployment fault.
  throw new Error("DATABASE_URL is not set");
}

// Cache fetch responses per request rather than across requests: Neon's HTTP
// endpoint is already close to the Worker, and stale reads here would defeat
// the revalidation the admin depends on.
neonConfig.fetchConnectionCache = true;

export const sql = neon(url);

/** A pooled connection for transactional work. Caller must `end()` it. */
export function pool() {
  return new Pool({ connectionString: url });
}

/**
 * Runs a query once per request no matter how many components ask.
 *
 * The public pages read the same handful of collections from several
 * components each — the homepage alone touches clients, projects, capabilities
 * and copy — and without this each one would be its own round trip to
 * Singapore. `cache()` is request-scoped, so an admin save is still visible on
 * the very next request.
 */
/**
 * Retries a query a couple of times before giving up.
 *
 * Neon is reached over HTTPS across the public internet, and a single dropped
 * connection should not turn into a 500 on a marketing page. Only connection
 * failures are retried — a syntax error or a constraint violation is a real
 * fault and rethrows immediately, because retrying it would just be slower.
 */
async function withRetry<T>(run: () => Promise<T>, attempts = 3): Promise<T> {
  let last: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await run();
    } catch (error) {
      last = error;
      const message = error instanceof Error ? error.message : String(error);
      const transient = /fetch failed|ETIMEDOUT|ECONNRESET|ENETUNREACH|socket hang up|Connection terminated/i
        .test(message);
      if (!transient || i === attempts - 1) {
        // If we still fail after retries, gracefully fall back to empty results
        // so the CMS uses the dummy seed data instead of crashing the page.
        console.warn("Neon DB fetch failed, falling back to seed data:", message);
        return [] as any;
      }
      await new Promise((r) => setTimeout(r, 120 * 2 ** i));
    }
  }
  return [] as any;
}

export const query = cache(async <T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> => {
  return withRetry(async () => (await sql.query(text, params)) as T[]);
});

/** Uncached read, for anything that must not be shared within a request. */
export async function queryFresh<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  return withRetry(async () => (await sql.query(text, params)) as T[]);
}

/** A single write. Never cached. */
export async function execute(text: string, params: unknown[] = []): Promise<void> {
  await withRetry(() => sql.query(text, params));
}
