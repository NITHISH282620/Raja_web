import { getContact, getHero, getStats } from "@/lib/store";
import { usingDefaultPassword } from "@/lib/auth";
import { changePassword, saveContact, saveHero, saveStats } from "../actions";
import { Notice, PageHead } from "../ui";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const contact = getContact();
  const hero = getHero();
  const stats = getStats();

  return (
    <>
      <PageHead
        title="Settings"
        sub="Contact details, the headline on the front page, the four figures in the scale band, and your password."
      />

      {saved === "contact" && <Notice tone="ok">Contact details saved.</Notice>}
      {saved === "hero" && <Notice tone="ok">Headline saved.</Notice>}
      {saved === "stats" && <Notice tone="ok">Figures saved.</Notice>}
      {error === "password" && <Notice tone="error">Your current password was not correct.</Notice>}
      {error === "short" && <Notice tone="error">Choose a password of at least 10 characters.</Notice>}

      {usingDefaultPassword() && (
        <Notice tone="warn">
          <strong>This account is still using the default password.</strong> It is printed on the
          sign-in page and in the project README, so anyone who can reach this site can reach this
          admin. Change it below before the site goes live.
        </Notice>
      )}

      {/* ------------------------------ password ------------------------------ */}
      <section className="admin-card" style={{ maxWidth: 620, marginBottom: 24 }}>
        <h2 className="admin-h2" style={{ marginBottom: 14 }}>Password</h2>
        <form action={changePassword}>
          <div className="admin-field">
            <label htmlFor="current">Current password</label>
            <input id="current" name="current" type="password" className="admin-input" autoComplete="current-password" required />
          </div>
          <div className="admin-field">
            <label htmlFor="nextpw">New password</label>
            <input id="nextpw" name="next" type="password" className="admin-input" autoComplete="new-password" minLength={10} required />
            <p className="hint">At least 10 characters. You will be signed out and asked to sign in again.</p>
          </div>
          <button type="submit" className="admin-btn" data-variant="primary">Change password</button>
        </form>
      </section>

      {/* ------------------------------- hero --------------------------------- */}
      <section className="admin-card" style={{ maxWidth: 760, marginBottom: 24 }}>
        <h2 className="admin-h2" style={{ marginBottom: 6 }}>Front page headline</h2>
        <p className="admin-sub" style={{ marginBottom: 16 }}>
          The large type over the video at the top of the site.
        </p>
        <form action={saveHero}>
          <div className="admin-field">
            <label htmlFor="headline">Headline</label>
            <textarea id="headline" name="headline" className="admin-textarea" defaultValue={hero.headline} style={{ minHeight: 76 }} />
            <p className="hint">Press Enter to break the line. Two short lines read best.</p>
          </div>
          <div className="admin-field">
            <label htmlFor="herobody">Supporting sentence</label>
            <textarea id="herobody" name="body" className="admin-textarea" defaultValue={hero.body} />
          </div>
          <button type="submit" className="admin-btn" data-variant="primary">Save headline</button>
        </form>
      </section>

      {/* ------------------------------- stats -------------------------------- */}
      <section className="admin-card" style={{ maxWidth: 760, marginBottom: 24 }}>
        <h2 className="admin-h2" style={{ marginBottom: 6 }}>Scale figures</h2>
        <p className="admin-sub" style={{ marginBottom: 16 }}>
          The four rows in the “We think in scale” band. The numbers count up as a visitor reaches
          them, so write them the way you want them to end — including commas and any “+”.
        </p>
        <form action={saveStats}>
          {stats.map((s, i) => (
            <div className="admin-row" key={i} style={{ marginBottom: 12 }}>
              <div className="admin-field" style={{ marginBottom: 0 }}>
                <label htmlFor={`label${i}`}>Label</label>
                <input id={`label${i}`} name="label" className="admin-input" defaultValue={s.label} />
              </div>
              <div className="admin-field" style={{ marginBottom: 0 }}>
                <label htmlFor={`value${i}`}>Figure</label>
                <input id={`value${i}`} name="value" className="admin-input" defaultValue={s.value} />
              </div>
            </div>
          ))}
          <button type="submit" className="admin-btn" data-variant="primary" style={{ marginTop: 8 }}>
            Save figures
          </button>
        </form>
      </section>

      {/* ------------------------------ contact ------------------------------- */}
      <section className="admin-card" style={{ maxWidth: 760 }}>
        <h2 className="admin-h2" style={{ marginBottom: 6 }}>Contact details</h2>
        <p className="admin-sub" style={{ marginBottom: 16 }}>
          Used in the footer, on the contact page and on every “get in touch” button. Clear the
          email and the buttons become inert rather than linking nowhere.
        </p>
        <form action={saveContact}>
          <div className="admin-row">
            <div className="admin-field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="admin-input" defaultValue={contact.email ?? ""} />
            </div>
            <div className="admin-field">
              <label htmlFor="phone">Primary phone</label>
              <input id="phone" name="phone" className="admin-input" defaultValue={contact.phone ?? ""} />
            </div>
          </div>
          <div className="admin-field">
            <label htmlFor="addressLines">Address</label>
            <textarea id="addressLines" name="addressLines" className="admin-textarea" defaultValue={contact.addressLines.join("\n")} />
            <p className="hint">One line per line.</p>
          </div>
          <div className="admin-field">
            <label htmlFor="landlines">Landlines</label>
            <textarea id="landlines" name="landlines" className="admin-textarea" defaultValue={contact.landlines.join("\n")} style={{ minHeight: 90 }} />
            <p className="hint">One number per line. Shown on the contact page.</p>
          </div>
          <button type="submit" className="admin-btn" data-variant="primary">Save contact details</button>
        </form>
      </section>
    </>
  );
}
