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

/**
 * The one production hostname. Everything else is a preview.
 *
 * This is deliberately a constant and not read from the environment: the whole
 * point is to have a value that a misconfigured deployment cannot claim to be.
 */
export const PRODUCTION_ORIGIN = "https://rajaenterprises.co";

/**
 * Whether this deployment is the real site.
 *
 * THE FAILURE THIS PREVENTS. A staging deployment that is crawlable competes
 * with production for the same queries, and Google may pick the staging URL as
 * canonical — so the client's own search result becomes a preview host they
 * cannot control. It is one of the few SEO mistakes that is genuinely hard to
 * undo, because it needs a recrawl to reverse.
 *
 * So indexing is opt-IN by hostname rather than opt-out. A deployment is
 * indexable only when it says it is rajaenterprises.co; every preview URL,
 * including any *.workers.dev or *.vercel.app, is noindex by default without
 * anyone needing to remember to set a flag.
 */
export const isProductionSite = (): boolean => SITE_URL === PRODUCTION_ORIGIN;
