/**
 * The enquiry model, shared by the public form and the admin inbox.
 *
 * WHY WHATSAPP, AND WHAT THIS DOES NOT DO. Raja handles customer conversations
 * in WhatsApp, so the website's job is to capture a structured enquiry, keep a
 * copy Raja can look at later, and hand the visitor a prefilled WhatsApp
 * message. It is deliberately NOT a CRM and NOT a WhatsApp integration.
 *
 * The link is a `wa.me` deep link, which opens the visitor's own WhatsApp with
 * the message drafted. Nothing is sent on their behalf, and the site therefore
 * never claims a message was delivered — it cannot know. The enquiry is saved
 * before the link is offered, so a visitor who never taps through is still a
 * recorded lead.
 */

export const ENQUIRY_STATUSES = ["new", "contacted", "qualified", "closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  closed: "Closed",
};

export interface Enquiry {
  id: number;
  reference: string;
  name: string;
  email: string;
  phone: string;
  organisation: string;
  event_type: string;
  event_date: string;
  location: string;
  requirement: string;
  message: string;
  status: EnquiryStatus;
  notes: string;
  created_at: string;
}

/** Field length caps. Applied before anything reaches the database. */
export const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  organisation: 160,
  event_type: 80,
  event_date: 80,
  location: 160,
  requirement: 200,
  message: 4000,
} as const;

export type EnquiryField = keyof typeof LIMITS;

/**
 * A human reference the visitor can quote back.
 *
 * Deliberately not the database id: sequential ids leak how much business a
 * company is doing, and a visitor quoting "enquiry 4" tells anyone listening
 * that Raja has had four enquiries. Format is RE-YYMM-XXXX with the tail from
 * a non-sequential alphabet that omits characters people misread aloud.
 */
const ALPHABET = "ACDEFGHJKLMNPQRTUVWXY349";

export function makeReference(now: Date = new Date()): string {
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  let tail = "";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  for (const b of bytes) tail += ALPHABET[b % ALPHABET.length];
  return `RE-${yy}${mm}-${tail}`;
}

/** Digits only, for a `wa.me` link. `+91 98450 44177` -> `919845044177`. */
export const waNumber = (phone: string): string => phone.replace(/\D/g, "");

export interface WhatsAppContext {
  reference?: string;
  name?: string;
  organisation?: string;
  eventType?: string;
  location?: string;
  requirement?: string;
  eventDate?: string;
}

/**
 * Builds the prefilled WhatsApp message.
 *
 * Only fields the visitor actually filled in are included — a message padded
 * with "Event type: —" reads as a form dump rather than as a person writing.
 */
export function whatsappMessage(ctx: WhatsAppContext): string {
  const lines: string[] = ["Hello Raja Enterprises, I would like to enquire about event infrastructure."];
  const add = (label: string, value?: string) => {
    if (value && value.trim()) lines.push(`${label}: ${value.trim()}`);
  };
  lines.push("");
  add("Name", ctx.name);
  add("Company", ctx.organisation);
  add("Event type", ctx.eventType);
  add("Location", ctx.location);
  add("Dates", ctx.eventDate);
  add("Requirement", ctx.requirement);
  if (ctx.reference) {
    lines.push("");
    add("Reference", ctx.reference);
  }
  return lines.join("\n");
}

/** Full `wa.me` deep link, or null when no number is configured. */
export function whatsappLink(phone: string | null | undefined, ctx: WhatsAppContext = {}): string | null {
  if (!phone) return null;
  const n = waNumber(phone);
  if (n.length < 10) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(whatsappMessage(ctx))}`;
}
