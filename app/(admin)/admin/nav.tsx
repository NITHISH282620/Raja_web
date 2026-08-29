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
const GROUPS: { label: string; items: { href: string; label: string; key?: string }[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/enquiries", label: "Enquiries", key: "enquiries" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/projects", label: "Projects", key: "projects" },
      { href: "/admin/events", label: "Client events", key: "events" },
      { href: "/admin/capabilities", label: "Capabilities", key: "capabilities" },
      { href: "/admin/inventory", label: "Inventory", key: "inventory" },
      { href: "/admin/process", label: "Build process", key: "process" },
      { href: "/admin/clients", label: "Clients", key: "clients" },
      { href: "/admin/collage", label: "Legacy photos", key: "collage" },
    ],
  },
  {
    label: "Assets & setup",
    items: [
      { href: "/admin/media", label: "Media library", key: "media" },
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
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
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
