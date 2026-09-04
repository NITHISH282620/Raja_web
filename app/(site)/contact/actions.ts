"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { LIMITS, makeReference, type EnquiryField } from "@/lib/enquiry";

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

  const reference = makeReference();

  db()
    .prepare(
      `INSERT INTO enquiries
         (reference, name, email, phone, organisation, event_type, event_date, location, requirement, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      reference,
      name,
      email,
      phone,
      field(formData, "organisation"),
      field(formData, "event_type"),
      field(formData, "event_date"),
      field(formData, "location"),
      field(formData, "requirement"),
      field(formData, "message"),
    );

  // The reference travels back so the success state can offer a WhatsApp
  // hand-off carrying it. Nothing else about the record is exposed.
  redirect(`/contact?sent=1&ref=${encodeURIComponent(reference)}`);
}
