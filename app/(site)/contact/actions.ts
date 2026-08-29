"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";

/**
 * Receives an enquiry from the public contact form.
 *
 * This is the one write path on the site that is NOT behind authentication, so
 * it is the one that has to assume bad input: everything is length-capped
 * before it reaches the database, the honeypot is checked, and nothing here is
 * ever rendered back to the sender.
 *
 * A silent success on the honeypot path is deliberate. Telling a bot it was
 * detected just teaches whoever wrote it to stop filling that field.
 */
const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  organisation: 160,
  event_type: 80,
  event_date: 80,
  location: 160,
  message: 4000,
} as const;

function field(formData: FormData, key: keyof typeof LIMITS): string {
  return String(formData.get(key) ?? "").trim().slice(0, LIMITS[key]);
}

export async function submitEnquiry(formData: FormData) {
  if (String(formData.get("website") ?? "")) redirect("/contact?sent=1");

  const name = field(formData, "name");
  const email = field(formData, "email");

  // The two fields a reply is impossible without.
  if (!name || !email.includes("@")) redirect("/contact?error=1");

  db()
    .prepare(
      `INSERT INTO enquiries (name, email, phone, organisation, event_type, event_date, location, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      name,
      email,
      field(formData, "phone"),
      field(formData, "organisation"),
      field(formData, "event_type"),
      field(formData, "event_date"),
      field(formData, "location"),
      field(formData, "message"),
    );

  redirect("/contact?sent=1");
}
