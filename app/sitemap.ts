import type { MetadataRoute } from "next";
import { pagedPillars } from "@/content/services";
import { abs } from "@/lib/site";

/**
 * The sitemap.
 *
 * Generated from the same modules the pages render from, so a service that
 * stops shipping a route stops appearing here without anyone remembering to
 * remove it. `/admin` is excluded — it is behind authentication and disallowed
 * in robots.txt.
 *
 * Project detail pages are absent on purpose: they do not ship in V1, because
 * no cleared photography exists for them yet. They join this list the moment
 * the route does.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, freq: "monthly" },
    { path: "/services", priority: 0.9, freq: "monthly" },
    { path: "/projects", priority: 0.9, freq: "weekly" },
    { path: "/inventory", priority: 0.8, freq: "monthly" },
    { path: "/about", priority: 0.7, freq: "yearly" },
    { path: "/legacy", priority: 0.6, freq: "yearly" },
    { path: "/locations", priority: 0.6, freq: "monthly" },
    { path: "/contact", priority: 0.8, freq: "yearly" },
    { path: "/careers", priority: 0.4, freq: "monthly" },
  ];

  return [
    ...core.map((c) => ({
      url: abs(c.path),
      lastModified: now,
      changeFrequency: c.freq,
      priority: c.priority,
    })),
    ...pagedPillars().map((s) => ({
      url: abs(`/services/${s.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}
