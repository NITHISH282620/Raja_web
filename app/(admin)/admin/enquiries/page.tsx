import Link from "next/link";
import { db } from "@/lib/db";
import { deleteEnquiry, addEnquiryNote, setEnquiryFollowup, setEnquiryStatus } from "../actions";
import { Notice, PageHead } from "../ui";
import { ENQUIRY_STATUSES, STATUS_LABELS, BAND_LABELS, whatsappLink, type LeadBand } from "@/lib/enquiry";

export const dynamic = "force-dynamic";

/**
 * Enquiries from the contact form.
 *
 * This is the seed of the CRM. It is deliberately just a list with a status and
 * a notes field, because that is the whole job today: see who wrote in, mark
 * whether they have been answered, and keep a note of what was said. Pipelines,
 * assignment and reminders are worth building when there is a second person
 * answering them.
 */
interface Enquiry {
  id: number;
  reference: string;
  requirement: string;
  name: string;
  email: string;
  phone: string;
  organisation: string;
  event_type: string;
  attendance: string;
  venue: string;
  budget: string;
  band: LeadBand;
  brief_name: string;
  event_date: string;
  location: string;
  message: string;
  status: string;
  notes: string;
  next_followup_on: string | null;
  created_at: string;
}

const STATUSES = ENQUIRY_STATUSES;

const TONE: Record<string, string> = {
  new: "new",
  contacted: "warn",
  qualified: "live",
  closed: "draft",
};

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; status?: string }>;
}) {
  const { saved, status } = await searchParams;
  const filter = status && STATUSES.includes(status as (typeof STATUSES)[number]) ? status : null;

  const rows = (
    filter
      ? db().prepare(`SELECT * FROM enquiries WHERE status = ? ORDER BY created_at DESC`).all(filter)
      : db().prepare(`SELECT * FROM enquiries ORDER BY created_at DESC`).all()
  ) as unknown as Enquiry[];

  return (
    <>
      <PageHead
        title="Enquiries"
        sub="Everyone who has written in through the contact form on the website."
      />

      {saved && <Notice tone="ok">Note saved.</Notice>}

      <div className="admin-actions" style={{ marginBottom: 20 }}>
        <Link href="/admin/enquiries" className="admin-btn" data-variant={filter ? "ghost" : "primary"} style={{ }}>
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/enquiries?status=${s}`}
            className="admin-btn"
            data-variant={filter === s ? "primary" : "ghost"}
            style={{ }}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="admin-card">
          <p className="admin-sub">
            {filter
              ? `No enquiries marked “${filter}”.`
              : "No enquiries yet. They arrive here as soon as someone uses the form on the contact page."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {rows.map((e) => (
            <article key={e.id} className="admin-card">
              <header style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h2 className="admin-h2">
                    {e.name}
                    {e.organisation && <span style={{ fontWeight: 400, color: "var(--color-body-light)" }}> · {e.organisation}</span>}
                  </h2>
                  <p style={{ fontSize: 13, color: "var(--color-body-light)", marginTop: 5 }}>
                    <a href={`mailto:${e.email}`}>{e.email}</a>
                    {e.phone && (
                      <>
                        {" · "}
                        <a href={`tel:${e.phone.replace(/[^\d+]/g, "")}`}>{e.phone}</a>
                      </>
                    )}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <span className="admin-chip" data-tone={TONE[e.status] ?? "draft"}>
                    {STATUS_LABELS[e.status as keyof typeof STATUS_LABELS] ?? e.status}
                  </span>
                  {e.reference && (
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-body-dark)" }}>
                      {e.reference}
                    </span>
                  )}
                </div>
              </header>

              {/* Triage band. Internal only — this is the admin inbox, and the
                  band is never rendered anywhere the sender can reach. */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginTop: 6 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase",
                    letterSpacing: "0.12em", padding: "2px 8px", borderRadius: 999,
                    color: e.band === "high" ? "#0b3d2c" : e.band === "medium" ? "#3d340b" : "var(--color-body-light)",
                    background: e.band === "high" ? "#d8f0e4" : e.band === "medium" ? "#f4ecd0" : "rgba(0,0,0,.05)",
                  }}
                >
                  {BAND_LABELS[e.band] ?? e.band}
                </span>
                {e.budget && <span style={{ fontSize: 12, color: "var(--color-body-light)" }}>{e.budget}</span>}
                {e.brief_name && (
                  <a href={`/admin/enquiries/${e.id}/brief`} style={{ fontSize: 12 }}>
                    &darr; {e.brief_name}
                  </a>
                )}
              </div>

              {(e.event_type || e.event_date || e.location || e.requirement || e.attendance || e.venue) && (
                <p style={{ fontSize: 13, color: "var(--color-body-light)", marginTop: 12 }}>
                  {[e.event_type, e.event_date, e.venue, e.location, e.attendance, e.requirement]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}

              {e.message && (
                <p style={{ fontSize: 14, lineHeight: 1.65, marginTop: 12, whiteSpace: "pre-wrap" }}>
                  {e.message}
                </p>
              )}

              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-body-dark)", marginTop: 12 }}>
                {new Date(e.created_at + "Z").toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </p>

              <div className="admin-actions" style={{ marginTop: 16 }}>
                {e.phone && whatsappLink(e.phone, { reference: e.reference, name: e.name }) && (
                  <a
                    href={whatsappLink(e.phone, { reference: e.reference, name: e.name })!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn"
                    data-variant="primary"
                    style={{ fontSize: 12.5 }}
                  >
                    Reply on WhatsApp
                  </a>
                )}
                {STATUSES.filter((s) => s !== e.status).map((s) => (
                  <form
                    key={s}
                    action={async () => {
                      "use server";
                      await setEnquiryStatus(e.id, s);
                    }}
                  >
                    <button type="submit" className="admin-btn" data-variant="ghost" style={{ fontSize: 12.5 }}>
                      Mark {STATUS_LABELS[s]}
                    </button>
                  </form>
                ))}
                <form
                  action={async () => {
                    "use server";
                    await deleteEnquiry(e.id);
                  }}
                >
                  <button type="submit" className="admin-btn" data-variant="danger" style={{ fontSize: 12.5 }}>
                    Delete
                  </button>
                </form>
              </div>

              {/* Follow-up date. On a phone this is the field that actually gets
                  used: it is the difference between a lead list and a to-do list. */}
              <form action={setEnquiryFollowup} style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
                <input type="hidden" name="id" value={e.id} />
                <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
                  <span style={{ color: "var(--color-body-light)" }}>Next follow-up</span>
                  <input
                    type="date"
                    name="next_followup_on"
                    className="admin-input"
                    defaultValue={e.next_followup_on ?? ""}
                    style={{ height: 40, fontSize: 14 }}
                  />
                </label>
                <button type="submit" className="admin-btn" data-variant="ghost" style={{ height: 40 }}>
                  Set
                </button>
              </form>

              {/* Notes append rather than overwrite — the history of a lead is
                  the useful part, and a single field destroys it on every save. */}
              <form action={addEnquiryNote} style={{ marginTop: 12 }}>
                <input type="hidden" name="id" value={e.id} />
                <textarea
                  name="body"
                  className="admin-textarea"
                  placeholder="Add a note — what was quoted, what was agreed, what happens next."
                  style={{ minHeight: 72, fontSize: 13 }}
                />
                <button type="submit" className="admin-btn" data-variant="ghost" style={{ marginTop: 8 }}>
                  Add note
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
