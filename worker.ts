import handler from "vinext/server/fetch-handler";

/**
 * The Worker entry point.
 *
 * It delegates everything to vinext and then applies this site's cache policy,
 * because vinext deletes `Cache-Control` and rebuilds it from its own route
 * classification. It could not classify these routes statically — every page
 * reads content from Postgres — so it fell back to `no-store`, which would put
 * every visitor's every request through the Worker and on to Neon in Singapore.
 *
 * The policy applied here is the one measured and validated before the move:
 *
 *   public HTML   max-age=0, s-maxage=60, stale-while-revalidate=86400
 *   static assets max-age=31536000, immutable
 *   admin/contact private, no-store
 *
 * Worst-case staleness for an owner edit is therefore 60 seconds, and
 * `stale-while-revalidate` means the edge answers instantly from its copy while
 * it refreshes behind the request, so the short TTL costs nothing in speed.
 *
 * TWO THINGS THIS MUST NEVER DO, and how each is prevented:
 *
 *   Cache a signed-in response. Anything under /admin, and /contact (which
 *   renders per-request), keeps the private no-store header. Beyond that, any
 *   response carrying Set-Cookie is left alone — a session being established is
 *   never shared.
 *
 *   Cache a failure. Only 200 and 304 are given a shared TTL; a 500 held at the
 *   edge for a minute would multiply one transient database blip into a minute
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

const HTML_CACHE = "public, max-age=0, s-maxage=60, stale-while-revalidate=86400";
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
