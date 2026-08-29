import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { currentUser, ensureSeedUser, usingDefaultPassword } from "@/lib/auth";
import { AdminNav } from "./nav";
import { signOut } from "./actions";
import { db } from "@/lib/db";
import { readAll } from "@/lib/store";

/**
 * The signed-in admin shell.
 *
 * The login page sits at `/admin/login`, INSIDE this segment, so this layout
 * has to let it through unauthenticated — otherwise signing in requires
 * already being signed in. Everything else redirects.
 */
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  ensureSeedUser();

  // `x-pathname` is set by proxy.ts. Falling back to letting the request
  // through would be a hole, so the fallback is to treat it as protected.
  const pathname = (await headers()).get("x-pathname") ?? "";
  if (pathname.startsWith("/admin/login")) return <>{children}</>;

  const user = await currentUser();
  if (!user) redirect(`/admin/login?next=${encodeURIComponent(pathname || "/admin")}`);

  const counts = {
    projects: readAll("projects").length,
    events: readAll("events").length,
    capabilities: readAll("capabilities").length,
    inventory: readAll("inventory").length,
    process: readAll("process").length,
    clients: readAll("clients").length,
    collage: readAll("collage").length,
    media: (db().prepare(`SELECT COUNT(*) AS n FROM media`).get() as { n: number }).n,
    enquiries: (
      db().prepare(`SELECT COUNT(*) AS n FROM enquiries WHERE status = 'new'`).get() as { n: number }
    ).n,
  };

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div>
          <p
            className="admin-label"
            style={{ color: "rgba(255,255,255,.4)", paddingLeft: 12, marginBottom: 4 }}
          >
            Raja Enterprises
          </p>
          <p style={{ paddingLeft: 12, fontSize: 16, fontWeight: 600 }}>Content admin</p>
        </div>

        <AdminNav counts={counts} />

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          {usingDefaultPassword() && (
            <Link
              href="/admin/settings"
              className="admin-chip"
              data-tone="warn"
              style={{ justifyContent: "center" }}
            >
              Default password
            </Link>
          )}
          <p style={{ paddingLeft: 12, fontSize: 12, color: "rgba(255,255,255,.45)" }}>
            {user.email}
          </p>
          <form action={signOut}>
            <button
              type="submit"
              className="admin-btn"
              data-variant="ghost"
              style={{ width: "100%", height: 36, background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,.2)" }}
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
