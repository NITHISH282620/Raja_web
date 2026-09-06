import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Next 16 requires this allowlist — an unlisted `quality` prop is silently
     * snapped to the nearest allowed value. 90 is the hero poster and the
     * full-bleed case-study images; 75 stays the default for everything else.
     */
    qualities: [60, 75, 90],
    formats: ["image/avif", "image/webp"],
  },

  /**
   * Cache headers, chosen for a CDN sitting in front of this application.
   *
   * THE PROBLEM. Next serves prerendered HTML with `s-maxage=31536000` — one
   * year. Inside Next that is harmless, because `revalidatePath` purges its own
   * cache and the next request regenerates. A shared cache in front of it knows
   * nothing about that: `revalidatePath` cannot purge Cloudflare. So an owner
   * edit would be invisible at the edge for up to a year, and it is one of the
   * few caching mistakes that needs a manual purge to undo.
   *
   * THE CHOICE. Three options were considered. Configuring the OpenNext
   * incremental cache is necessary at deploy time but solves a different
   * problem — Next's own ISR store, not what the edge retains. Calling the
   * Cloudflare purge API on every mutation would work, and was rejected: it
   * puts an API token in the application, adds a network dependency to every
   * save, and fails silently when it fails. For one to three admin users
   * editing occasionally, that is a worse trade than a short TTL.
   *
   * So: plain HTTP semantics, which Cloudflare honours natively.
   *
   *   max-age=0                 browsers always revalidate
   *   s-maxage=60               the edge holds a page for at most a minute
   *   stale-while-revalidate    the edge serves the cached copy instantly and
   *                             refreshes behind it, so the short TTL costs
   *                             nothing in perceived speed
   *
   * Worst-case staleness is therefore 60 seconds rather than a year, with no
   * extra infrastructure and nothing to fail.
   *
   * Static assets go the other way. They were being served `max-age=0`, which
   * means no browser caching at all for 15 MB of photography. Their filenames
   * carry a content hash, so they are safe to cache immutably.
   *
   * `/admin` and `/contact` are excluded: Next already marks them
   * `private, no-store` because they are per-request, and overriding that would
   * put an authenticated page into a shared cache.
   */
  async headers() {
    const HTML = "public, max-age=0, s-maxage=60, stale-while-revalidate=86400";
    const IMMUTABLE = "public, max-age=31536000, immutable";
    return [
      {
        source: "/:path((?!admin|contact|api|_next/static|_next/image).*)",
        headers: [{ key: "Cache-Control", value: HTML }],
      },
      { source: "/", headers: [{ key: "Cache-Control", value: HTML }] },
      { source: "/media/:path*", headers: [{ key: "Cache-Control", value: IMMUTABLE }] },
      { source: "/video/:path*", headers: [{ key: "Cache-Control", value: IMMUTABLE }] },
      { source: "/vector/:path*", headers: [{ key: "Cache-Control", value: IMMUTABLE }] },
    ];
  },

  /**
   * `/portfolio` moved to `/projects`: "projects" is the word this industry and
   * its tender documents actually use. Permanent, because the old path was
   * live and linked.
   */
  async redirects() {
    return [{ source: "/portfolio", destination: "/projects", permanent: true }];
  },
};

export default nextConfig;
