import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * The admin is disallowed rather than merely unlinked. It is behind
 * authentication either way, but there is no reason for a crawler to spend
 * budget on a login screen or to surface it in a result page.
 */
export default function robots(): MetadataRoute.Robots {
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
