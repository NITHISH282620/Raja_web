import { redirect } from "next/navigation";
import { currentUser, DEV_EMAIL, DEV_PASSWORD, ensureSeedUser, usingDefaultPassword } from "@/lib/auth";
import { signIn } from "../actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  // Creates the first account on first visit, so the client never has to run a
  // seed script or a CLI command to get in.
  ensureSeedUser();
  if (await currentUser()) redirect("/admin");

  const { error, next } = await searchParams;
  const showDefaults = usingDefaultPassword();

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
              defaultValue={showDefaults ? DEV_EMAIL : undefined}
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
              defaultValue={showDefaults ? DEV_PASSWORD : undefined}
            />
          </div>

          <button type="submit" className="admin-btn" data-variant="primary" style={{ width: "100%" }}>
            Sign in
          </button>
        </form>

        {/*
          Shown only while the seed account still has its default password. The
          moment it is changed — or RAJA_ADMIN_PASSWORD is set — this block
          stops rendering, so a live site cannot end up publishing its own
          credentials on the login screen.
        */}
        {showDefaults && (
          <div className="admin-notice" data-tone="warn" style={{ marginTop: 24, marginBottom: 0 }}>
            <span>
              <strong>Test credentials are filled in above.</strong>
              <br />
              {DEV_EMAIL} / {DEV_PASSWORD}
              <br />
              Change the password in Settings before this site goes live — this notice disappears
              once you do.
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
