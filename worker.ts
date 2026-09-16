import handler from "vinext/server/fetch-handler";

/**
 * The Worker entry point.
 *
 * It delegates everything to vinext and then applies this site's cache policy,
 * because vinext deletes `Cache-Control` and rebuilds it from its own route
 * classification. Public pages now carry `export const dynamic =
 * "force-static"` (see the route files), so `--prerender-all` classifies and
 * prerenders them correctly — but the live-served `Cache-Control` is still
 * decided here, not by vinext's own CDN adapter, which was measured (2026-09-16)
 * to have no externally-visible effect on this deployment's cache headers.
 *
 * TTL, 2026-09-16 revision (Raja is a low-traffic B2B site, not a consumer app):
 *
 *   public HTML   max-age=0, s-maxage=3600, stale-while-revalidate=86400
 *   static assets max-age=31536000, immutable
 *   admin/contact private, no-store
 *
 * WHY 3600 (1 hour), NOT LONGER. Content is admin-editable at any time,
 * independent of deployment — this is a core feature of the CMS, not an edge
 * case, so public pages are NOT immutable between deployments and a long/
 * infinite TTL would risk visibly stale content after an edit.
 *
 * KNOWN LIMITATION, confirmed end-to-end 2026-09-16 (real admin login, real
 * saveHero() edit, real Neon read, repeated checks across two colos):
 *
 *   revalidatePath() updates the application/data cache path but does not
 *   currently invalidate the existing Cloudflare edge cache entry in this
 *   deployment.
 *
 * The DB write and a genuinely fresh render (different cache key) were both
 * correct immediately; the *existing* cached copy of the unmodified route was
 * not purged, in either direction (edit and rollback), across five separate
 * checks. Root cause not yet isolated — see the 2026-09-16 cache-purge test
 * for the full reproduction. Do not build anything that assumes an admin
 * save is instantly visible; it becomes visible within, at most, this TTL.
 * 1 hour is therefore a deliberate, bounded ceiling while that gap is open:
 * ~60x fewer cache misses than the previous 60s, while worst-case staleness
 * after an edit stays inside a number an owner can reason about, rather than
 * the unbounded risk a long/immutable TTL would carry with purge confirmed
 * broken. Do not raise this further, and do not attempt another purge fix,
 * until the edge-purge path is separately investigated and verified
 * end-to-end.
 *
 * TWO THINGS THIS MUST NEVER DO, and how each is prevented:
 *
 *   Cache a signed-in response. Anything under /admin, and /contact (which
 *   renders per-request), keeps the private no-store header. Beyond that, any
 *   response carrying Set-Cookie is left alone — a session being established is
 *   never shared.
 *
 *   Cache a failure. Only 200 and 304 are given a shared TTL; a 500 held at the
 *   edge for an hour would multiply one transient database blip into an hour
 *   of outage for everyone.
 */

/**
 * The only hostname that may be indexed.
 *
 * Pages are prerendered with the production URL baked into their metadata, so
 * every deployment — staging included — ships `robots: index, follow` and a
 * permissive robots.txt. On a publicly reachable workers.dev host that is an
 * invitation to index the staging copy. Indexability is therefore decided here,
 * per request, from the host actually being served; it stops applying by itself
 * the moment the custom domain is attached.
 */
const PRODUCTION_HOST = "rajaenterprises.co";

const isProductionHost = (host: string) =>
  host === PRODUCTION_HOST || host === `www.${PRODUCTION_HOST}`;

// Disallow everything, but still advertise the production sitemap: the
// canonical site is rajaenterprises.co, and a crawler that finds this host
// should be sent there rather than told nothing exists.
const STAGING_ROBOTS =
  `User-Agent: *\nDisallow: /\n\nHost: https://${PRODUCTION_HOST}\n` +
  `Sitemap: https://${PRODUCTION_HOST}/sitemap.xml\n`;

const HTML_CACHE = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
const IMMUTABLE = "public, max-age=31536000, immutable";
const PRIVATE = "private, no-cache, no-store, max-age=0, must-revalidate";

/** Paths that render per request and must never enter a shared cache. */
const PRIVATE_PATH = /^\/(admin|api\/admin)(\/|$)|^\/contact(\/|$)/;

/** Content-addressed assets: the filename changes when the bytes change. */
const IMMUTABLE_PATH = /^\/(media|video|vector|assets)\/|^\/_next\/static\//;

/** Marks a response non-indexable without touching its body. */
function withNoIndex(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    const response = await (handler as {
      fetch(r: Request, e: unknown, c: unknown): Promise<Response>;
    }).fetch(request, env, ctx);

    const url = new URL(request.url);
    const staging = !isProductionHost(url.hostname);

    // A staging host serves its own robots.txt rather than the built one, which
    // names the production site and allows everything.
    if (staging && url.pathname === "/robots.txt") {
      return new Response(STAGING_ROBOTS, {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store",
          "x-robots-tag": "noindex, nofollow",
        },
      });
    }

    if (PRIVATE_PATH.test(url.pathname)) {
      const headers = new Headers(response.headers);
      headers.set("Cache-Control", PRIVATE);
      if (staging) headers.set("X-Robots-Tag", "noindex, nofollow");
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    if (IMMUTABLE_PATH.test(url.pathname)) {
      const headers = new Headers(response.headers);
      headers.set("Cache-Control", IMMUTABLE);
      if (staging) headers.set("X-Robots-Tag", "noindex, nofollow");
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    const cacheable =
      request.method === "GET" &&
      (response.status === 200 || response.status === 304) &&
      !response.headers.has("Set-Cookie");

    if (!cacheable) return staging ? withNoIndex(response) : response;

    const headers = new Headers(response.headers);
    headers.set("Cache-Control", HTML_CACHE);
    if (staging) headers.set("X-Robots-Tag", "noindex, nofollow");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
