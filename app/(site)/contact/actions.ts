"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { query, execute } from "@/lib/db/neon";
import { putObject, privateKey, storageAvailable } from "@/lib/storage/r2";
import { LIMITS, makeReference, classify, type EnquiryField } from "@/lib/enquiry";

/**
 * Receives an enquiry from the public contact form.
 *
 * This is the one write path on the site that is NOT behind authentication, so
 * it is the one that has to assume bad input: everything is length-capped
 * before it reaches the database, the honeypot is checked, submissions are rate
 * limited per client, and nothing here is ever rendered back to the sender.
 *
 * A silent success on the honeypot path is deliberate. Telling a bot it was
 * detected just teaches whoever wrote it to stop filling that field.
 *
 * The enquiry is saved BEFORE the visitor is offered the WhatsApp hand-off, so
 * a visitor who never taps through is still a recorded lead.
 */

/**
 * Per-client submission limit.
 *
 * In-process and therefore per-instance: this resets when the server restarts
 * and does not coordinate across replicas. For a single-node deployment — which
 * is what this application requires anyway, since it writes SQLite to local
 * disk — that is the right amount of machinery. Moving to several instances
 * means moving this to the database or a shared cache.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // Opportunistic sweep so the map cannot grow without bound.
  if (hits.size > 500) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

async function clientKey(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown").trim();
}

function field(formData: FormData, key: EnquiryField): string {
  return String(formData.get(key) ?? "").trim().slice(0, LIMITS[key]);
}

/**
 * Attachment rules.
 *
 * Buyers send briefs as PDFs, and procurement sends BOQs as spreadsheets, so
 * those are the types worth accepting. The allow-list is checked against the
 * extension rather than the declared MIME type, because the browser's type
 * string is supplied by the client and an allow-list that trusts it is not an
 * allow-list. Nothing here is ever executed, rendered or served back to the
 * public — it is written to a blob column and read only by the admin inbox.
 */
const MAX_BRIEF_BYTES = 8 * 1024 * 1024;
const ALLOWED_BRIEF = new Set([
  "pdf", "doc", "docx", "xls", "xlsx", "csv", "ppt", "pptx",
  "png", "jpg", "jpeg", "webp", "zip",
]);

function safeName(name: string): string {
  // Path separators and control characters out; the name is only ever shown as
  // text in the admin inbox, but a filename is still untrusted input.
  return name.replace(/[\u0000-\u001f\\/]/g, "").trim().slice(0, 160) || "brief";
}

export async function submitEnquiry(formData: FormData) {
  if (String(formData.get("website") ?? "")) redirect("/contact?sent=1");

  if (await clientKey().then(rateLimited)) {
    redirect("/contact?error=rate");
  }

  const name = field(formData, "name");
  const email = field(formData, "email");
  const phone = field(formData, "phone");

  // A reply is impossible without a name and at least one way to reach them.
  // Phone counts: WhatsApp is the primary channel, so an email is not required.
  if (!name) redirect("/contact?error=name");
  if (!email.includes("@") && phone.replace(/\D/g, "").length < 8) {
    redirect("/contact?error=reach");
  }

  const organisation = field(formData, "organisation");
  const event_type = field(formData, "event_type");
  const requirement = field(formData, "requirement");
  const attendance = field(formData, "attendance");
  const budget = field(formData, "budget");

  // Triage band. Computed on the server from what was actually submitted, and
  // written to the record — never returned to the sender.
  const band = classify({ organisation, email, budget, attendance, requirement, event_type });

  // The attachment is read before the insert so a file that fails validation
  // does not leave a half-recorded enquiry behind.
  const upload = formData.get("brief");
  let brief: { name: string; mime: string; bytes: Uint8Array } | null = null;
  if (upload && typeof upload === "object" && "arrayBuffer" in upload && upload.size > 0) {
    const ext = upload.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_BRIEF.has(ext)) redirect("/contact?error=filetype");
    if (upload.size > MAX_BRIEF_BYTES) redirect("/contact?error=filesize");
    brief = {
      name: safeName(upload.name),
      mime: String(upload.type ?? "").slice(0, 120),
      bytes: new Uint8Array(await upload.arrayBuffer()),
    };
  }

  const reference = makeReference();

  /*
   * Persisting the enquiry is best-effort, and the hand-off is not.
   *
   * On a read-only serverless filesystem the SQLite write throws. Letting that
   * become a 500 would lose the lead outright and show the buyer a crash on the
   * one page the entire site funnels into. WhatsApp is Raja's primary channel
   * anyway, so a failed write still ends with the visitor holding a prefilled
   * message carrying their reference — the enquiry reaches Raja, it just does
   * not also sit in the admin inbox. The failure is logged so the gap is
   * visible to whoever runs the site rather than silent.
   */
  try {
    const rows = await query<{ id: string }>(
      `INSERT INTO enquiries
         (id, reference, name, email, phone, company, event_type, event_date, city,
          requirements, message, attendance, venue, budget_band, triage_band)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id`,
      [
        reference,
        name,
        email,
        phone,
        organisation,
        event_type,
        field(formData, "event_date"),
        field(formData, "location"),
        requirement,
        field(formData, "message"),
        attendance,
        field(formData, "venue"),
        budget,
        band,
      ],
    );
    const enquiryId = rows[0]?.id;

    /*
     * The attachment goes to private R2, and its metadata to Neon.
     *
     * It used to be a BLOB in the enquiry row. That cannot survive the move —
     * and holding a client's BOQ inside the same table the admin lists is a
     * worse shape anyway. The bytes are written first: a metadata row pointing
     * at an object that does not exist would render a broken download, whereas
     * an orphaned object is invisible and harmless.
     */
    if (brief && enquiryId) {
      const key = privateKey(reference, brief.name);
      if (await storageAvailable("PRIVATE_DOCS")) {
        await putObject("PRIVATE_DOCS", key, brief.bytes.buffer as ArrayBuffer, brief.mime);
        await execute(
          `INSERT INTO enquiry_files (id, enquiry_id, bucket, object_key, original_filename, mime_type, size_bytes)
           VALUES (gen_random_uuid(), $1, 'raja-private-documents', $2, $3, $4, $5)`,
          [enquiryId, key, brief.name, brief.mime, brief.bytes.byteLength],
        );
      } else {
        console.error(
          `[enquiry] ${reference} attachment not stored: no PRIVATE_DOCS binding in this runtime.`,
        );
      }
    }
  } catch (error) {
    console.error(
      `[enquiry] ${reference} could not be stored; handing off to WhatsApp only.`,
      error,
    );
  }

  // The reference travels back so the success state can offer a WhatsApp
  // hand-off carrying it. Nothing else about the record is exposed.
  redirect(`/contact?sent=1&ref=${encodeURIComponent(reference)}`);
}
