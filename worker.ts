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

const HTML_CACHE = "public, max-age=0, s-maxage=60, stale-while-revalidate=86400";
const IMMUTABLE = "public, max-age=31536000, immutable";
const PRIVATE = "private, no-cache, no-store, max-age=0, must-revalidate";

/** Paths that render per request and must never enter a shared cache. */
const PRIVATE_PATH = /^\/(admin|api\/admin)(\/|$)|^\/contact(\/|$)/;

/** Content-addressed assets: the filename changes when the bytes change. */
const IMMUTABLE_PATH = /^\/(media|video|vector|assets)\/|^\/_next\/static\//;

export default {
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    const response = await (handler as {
      fetch(r: Request, e: unknown, c: unknown): Promise<Response>;
    }).fetch(request, env, ctx);

    const url = new URL(request.url);

    if (PRIVATE_PATH.test(url.pathname)) {
      const headers = new Headers(response.headers);
      headers.set("Cache-Control", PRIVATE);
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    if (IMMUTABLE_PATH.test(url.pathname)) {
      const headers = new Headers(response.headers);
      headers.set("Cache-Control", IMMUTABLE);
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

    if (!cacheable) return response;

    const headers = new Headers(response.headers);
    headers.set("Cache-Control", HTML_CACHE);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
