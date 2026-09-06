import { redirect } from "next/navigation";
import { currentUser, ensureOwnerAccount, adminConfigured } from "@/lib/auth";
import { signIn } from "../actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  // Creates the first account on first visit, so the client never has to run a
  // seed script or a CLI command to get in.
  await ensureOwnerAccount();
  if (await currentUser()) redirect("/admin");

  const { error, next } = await searchParams;
  const configured = adminConfigured();

  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <p className="admin-label">Raja Enterprises</p>
        <h1 className="admin-h1" style={{ marginTop: 6, marginBottom: 6 }}>
          Content admin
        </h1>
        <p className="admin-sub" style={{ marginBottom: 24 }}>
          Sign in to update the website.
        </p>

        {error && (
          <div className="admin-notice" data-tone="error" role="alert">
            <span>
              {error === "credentials"
                ? "That email and password do not match an account."
                : "Something went wrong. Please try again."}
            </span>
          </div>
        )}

        <form action={signIn}>
          <input type="hidden" name="next" value={next ?? "/admin"} />

          <div className="admin-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="admin-input"
              autoComplete="username"
              required
              autoFocus
            />
          </div>

          <div className="admin-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="admin-input"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="admin-btn" data-variant="primary" style={{ width: "100%" }}>
            Sign in
          </button>
        </form>

        {/*
          The opposite of what used to be here. This page previously printed a
          working email and password on screen whenever the seed account still
          had its default — on a public URL, that is a documented way in. There
          are no default credentials now, so the only thing worth saying is when
          no account exists at all, and that message deliberately gives away
          nothing an attacker could use.
        */}
        {!configured && (
          <div className="admin-notice" data-tone="warn" style={{ marginTop: 24, marginBottom: 0 }}>
            <span>
              <strong>No administrator account is configured.</strong>
              <br />
              Set RAJA_ADMIN_EMAIL and RAJA_ADMIN_PASSWORD in the server environment, then reload
              this page. Sign-in is unavailable until then.
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
