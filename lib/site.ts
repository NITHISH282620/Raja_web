/**
 * The site's own origin.
 *
 * Until now this was the literal `https://rajaenterprises.example`, which is
 * not a real domain: `metadataBase` resolved every canonical URL and every
 * Open Graph image against a hostname that does not exist, so social previews
 * and canonicals were both wrong in production.
 *
 * `rajaenterprises.co` is Raja's own published domain and is the default.
 * `NEXT_PUBLIC_SITE_URL` overrides it, so a staging deployment advertises
 * itself rather than the production site.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rajaenterprises.co").replace(/\/$/, "");

/** Absolute URL for a site-relative path. */
export const abs = (path: string): string => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
