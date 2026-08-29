import Link from "next/link";
import { db } from "@/lib/db";
import { readAll, getContact } from "@/lib/store";
import { usingDefaultPassword } from "@/lib/auth";
import { PageHead, Notice } from "./ui";

export const dynamic = "force-dynamic";

/**
 * The dashboard.
 *
 * Answers the two questions an editor actually arrives with — "is there
 * anything waiting for me?" and "where do I go to change X?" — and nothing
 * else. No charts: this site has one editor and a few dozen records, and a
 * traffic graph here would be decoration standing where a task list belongs.
 */
export default async function Dashboard() {
  const newEnquiries = (
    db().prepare(`SELECT COUNT(*) AS n FROM enquiries WHERE status = 'new'`).get() as { n: number }
  ).n;
  const mediaCount = (db().prepare(`SELECT COUNT(*) AS n FROM media`).get() as { n: number }).n;
  const contact = getContact();

  const tiles = [
    { href: "/admin/projects", label: "Projects", value: readAll("projects").length },
    { href: "/admin/events", label: "Client events", value: readAll("events").length },
    { href: "/admin/media", label: "Media files", value: mediaCount },
    { href: "/admin/enquiries", label: "New enquiries", value: newEnquiries },
  ];

  // Everything still carrying a provisional or pending status, surfaced as work
  // rather than left buried in the content files where only a developer sees it.
  const todo: string[] = [];
  if (usingDefaultPassword()) todo.push("Change the admin password — it is currently the published default.");
  if (mediaCount === 0) todo.push("Upload Raja's own photographs in the Media library, then swap them onto the cards.");
  if (!contact.email) todo.push("Add a contact email address in Settings.");
  const unpublished = readAll("projects").filter((p) => !p.published).length;
  if (unpublished) todo.push(`${unpublished} project${unpublished > 1 ? "s are" : " is"} unpublished and not visible on the site.`);

  return (
    <>
      <PageHead
        title="Dashboard"
        sub="Everything on the public site is edited from here. Changes go live as soon as you save."
        action={
          <a href="/" target="_blank" rel="noreferrer" className="admin-btn" data-variant="ghost">
            View the site ↗
          </a>
        }
      />

      {todo.length > 0 && (
        <Notice tone="warn">
          <strong>Worth doing</strong>
          <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
            {todo.map((t) => (
              <li key={t} style={{ marginBottom: 4 }}>{t}</li>
            ))}
          </ul>
        </Notice>
      )}

      <div className="admin-grid" style={{ marginBottom: 30 }}>
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="admin-stat">
            <span className="admin-label">{t.label}</span>
            <span className="value">{t.value}</span>
          </Link>
        ))}
      </div>

      <div className="admin-card">
        <h2 className="admin-h2" style={{ marginBottom: 8 }}>How this works</h2>
        <p className="admin-sub">
          Each section of the website is a list on the left. Open a record, change what you need and
          save — the site updates immediately, and you can unpublish anything without deleting it.
        </p>
        <p className="admin-sub" style={{ marginTop: 12 }}>
          Photographs and video go in the <Link href="/admin/media">Media library</Link> first, then
          become selectable on any card. Enquiries from the contact form arrive under{" "}
          <Link href="/admin/enquiries">Enquiries</Link>.
        </p>
      </div>
    </>
  );
}
