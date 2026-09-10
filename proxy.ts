import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Two jobs: pass the pathname to the admin layout, and keep every host that is
 * not the real site out of search results.
 *
 * PATHNAME. A layout cannot read its own pathname — it is rendered for many of
 * them — and `app/(admin)/admin/layout.tsx` needs it for exactly one reason:
 * the login page lives inside the segment it protects, so the layout has to
 * recognise and let that one path through.
 *
 * Authentication is NOT enforced here. This runs before the request reaches
 * the origin, so it could only ever check that a cookie is present, not that
 * it is valid. The real check is `currentUser()` in the layout and `guard()`
 * at the top of every server action. This is a plumbing shim, not a security
 * boundary.
 *
 * INDEXING. Every page is prerendered with the production URL baked into its
 * metadata, so each deployment ships `robots: index, follow` and a permissive
 * robots.txt no matter which hostname is serving it. On a publicly reachable
 * preview or *.vercel.app host that is an invitation for Google to index the
 * staging copy — and because the canonical points at rajaenterprises.co, the
 * two would compete over the same content.
 *
 * Indexability is therefore decided per request from the host actually being
 * served. It costs nothing on the real domain and switches itself off the
 * moment DNS points here. The equivalent rule lives in `worker.ts` for the
 * Cloudflare deployment; this is the one that applies on Vercel.
 */

const PRODUCTION_HOST = "rajaenterprises.co";

const isProductionHost = (host: string) => {
  const name = host.split(":")[0]?.toLowerCase() ?? "";
  return name === PRODUCTION_HOST || name === `www.${PRODUCTION_HOST}`;
};

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const staging = !isProductionHost(host);

  // A staging host serves its own robots.txt rather than the built one, which
  // names the production site and allows everything. The production sitemap is
  // still advertised: a crawler that finds this host should be pointed at the
  // canonical site rather than told nothing exists.
  if (staging && request.nextUrl.pathname === "/robots.txt") {
    return new NextResponse(
      `User-Agent: *\nDisallow: /\n\nHost: https://${PRODUCTION_HOST}\n` +
        `Sitemap: https://${PRODUCTION_HOST}/sitemap.xml\n`,
      {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store",
          "x-robots-tag": "noindex, nofollow",
        },
      },
    );
  }

  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);

  const response = NextResponse.next({ request: { headers } });
  // X-Robots-Tag beats the prerendered <meta robots> tag, so this works without
  // rebuilding the pages per host.
  if (staging) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  // Everything except Next's internals and static files: the indexing rule has
  // to cover public pages, not just /admin.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
