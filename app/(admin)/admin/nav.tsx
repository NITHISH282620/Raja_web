"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Admin navigation.
 *
 * The only client component in the admin. Everything else is a server
 * component with a plain <form> posting to a server action, which is why the
 * editor works with JavaScript still loading and why there is no client state
 * to get out of sync with the database.
 */
/**
 * Grouped by PAGE, not by data type.
 *
 * The previous grouping was one flat "Content" list named after the underlying
 * collections — capabilities, process, collage, events. That is how the data is
 * shaped, and it is useless to the person using it: someone who wants to fix a
 * sentence on the About page has to already know it lives in a collection called
 * "principles".
 *
 * So the sidebar now mirrors the website. Find the page, then the section within
 * it. Sub-items are indented under their page for the same reason: the owner
 * navigates by what he can see on the site, not by how it is stored.
 */
const GROUPS: {
  label: string;
  items: { href: string; label: string; key?: string; sub?: boolean }[];
}[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/enquiries", label: "Enquiries", key: "enquiries" },
    ],
  },
  {
    label: "Homepage",
    items: [
      { href: "/admin/capabilities", label: "Capability cards", key: "capabilities", sub: true },
      { href: "/admin/homepageWorks", label: "Featured projects", key: "homepageWorks", sub: true },
      { href: "/admin/inventory", label: "Resource tiles", key: "inventory", sub: true },
      { href: "/admin/process", label: "Build process", key: "process", sub: true },
      { href: "/admin/eventFormats", label: "Event format cards", key: "eventFormats", sub: true },
      { href: "/admin/recentEvents", label: "Recent events grid", key: "recentEvents", sub: true },
      { href: "/admin/events", label: "Recent engagements table", key: "events", sub: true },
      { href: "/admin/clients", label: "Client logos", key: "clients", sub: true },
    ],
  },
  {
    label: "Services & solutions",
    items: [
      { href: "/admin/services", label: "Service pages", key: "services", sub: true },
      { href: "/admin/solutions", label: "Solution pages", key: "solutions", sub: true },
    ],
  },
  {
    label: "Projects page",
    items: [
      { href: "/admin/projects", label: "All projects", key: "projects", sub: true },
    ],
  },
  {
    label: "About page",
    items: [
      { href: "/admin/timeline", label: "Timeline", key: "timeline", sub: true },
      { href: "/admin/milestones", label: "Milestones", key: "milestones", sub: true },
      { href: "/admin/principles", label: "Principles", key: "principles", sub: true },
      { href: "/admin/highlights", label: "Inventory highlights", key: "highlights", sub: true },
    ],
  },
  {
    label: "Legacy page",
    items: [
      { href: "/admin/copy", label: "Paragraphs", key: "copy", sub: true },
      { href: "/admin/collage", label: "Photo collage", key: "collage", sub: true },
    ],
  },
  {
    label: "Inventory page",
    items: [
      { href: "/admin/catalog", label: "Equipment catalogue", key: "catalog", sub: true },
      { href: "/admin/schedule", label: "Capacity figures", key: "schedule", sub: true },
    ],
  },
  {
    label: "Other pages",
    items: [
      { href: "/admin/partnerPoints", label: "Partners — reasons", key: "partnerPoints", sub: true },
      { href: "/admin/partnerSteps", label: "Partners — steps", key: "partnerSteps", sub: true },
      { href: "/admin/disciplines", label: "Careers", key: "disciplines", sub: true },
      { href: "/admin/locations", label: "Locations", key: "locations", sub: true },
    ],
  },
  {
    label: "Assets & setup",
    items: [
      { href: "/admin/pageImages", label: "Page photographs", key: "pageImages" },
      { href: "/admin/media", label: "Media library", key: "media" },
      { href: "/admin/seo", label: "Page SEO", key: "seo" },
      { href: "/admin/settings", label: "Settings" },
    ],
  },
];

export function AdminNav({ counts }: { counts: Record<string, number> }) {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {GROUPS.map((group) => (
        <nav key={group.label} className="admin-nav" aria-label={group.label}>
          <p className="admin-nav-label">{group.label}</p>
          {group.items.map((item) => {
            // Exact match for the dashboard, prefix match for everything else,
            // so /admin/projects/aicog-2019 still highlights "Projects".
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const count = item.key ? counts[item.key] : undefined;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                // Indented so a section reads as belonging to the page above it.
                style={item.sub ? { paddingLeft: 22 } : undefined}
              >
                <span>{item.label}</span>
                {count !== undefined && count > 0 && <span className="count">{count}</span>}
              </Link>
            );
          })}
        </nav>
      ))}
    </div>
  );
}
