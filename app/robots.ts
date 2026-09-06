import type { MetadataRoute } from "next";
import { SITE_URL, isProductionSite } from "@/lib/site";

/**
 * The admin is disallowed rather than merely unlinked. It is behind
 * authentication either way, but there is no reason for a crawler to spend
 * budget on a login screen or to surface it in a result page.
 */
export default function robots(): MetadataRoute.Robots {
  // A preview deployment refuses every crawler outright. See `isProductionSite`
  // — staging outranking production is the one SEO mistake that needs a recrawl
  // to undo, so it is prevented by hostname rather than by remembering a flag.
  if (!isProductionSite()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
