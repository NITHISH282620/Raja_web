import Link from "next/link";
import { db } from "@/lib/db";
import { deleteEnquiry, saveEnquiryNotes, setEnquiryStatus } from "../actions";
import { Notice, PageHead } from "../ui";
import { ENQUIRY_STATUSES, STATUS_LABELS, whatsappLink } from "@/lib/enquiry";

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
  event_date: string;
  location: string;
  message: string;
  status: string;
  notes: string;
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
        <Link href="/admin/enquiries" className="admin-btn" data-variant={filter ? "ghost" : "primary"} style={{ height: 32 }}>
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/enquiries?status=${s}`}
            className="admin-btn"
            data-variant={filter === s ? "primary" : "ghost"}
            style={{ height: 32 }}
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

              {(e.event_type || e.event_date || e.location || e.requirement) && (
                <p style={{ fontSize: 13, color: "var(--color-body-light)", marginTop: 12 }}>
                  {[e.event_type, e.event_date, e.location, e.requirement].filter(Boolean).join(" · ")}
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
                    style={{ height: 30, fontSize: 12.5 }}
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
                    <button type="submit" className="admin-btn" data-variant="ghost" style={{ height: 30, fontSize: 12.5 }}>
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
                  <button type="submit" className="admin-btn" data-variant="danger" style={{ height: 30, fontSize: 12.5 }}>
                    Delete
                  </button>
                </form>
              </div>

              <form action={saveEnquiryNotes} style={{ marginTop: 14 }}>
                <input type="hidden" name="id" value={e.id} />
                <textarea
                  name="notes"
                  className="admin-textarea"
                  defaultValue={e.notes}
                  placeholder="Notes — what was quoted, who is following up, what was agreed."
                  style={{ minHeight: 72, fontSize: 13 }}
                />
                <button type="submit" className="admin-btn" data-variant="ghost" style={{ height: 32, marginTop: 8 }}>
                  Save note
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
