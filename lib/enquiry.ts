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

/**
 * Budget bands.
 *
 * Asking for a band rather than a number is the single most useful qualifying
 * question on the form: buyers who will not type a figure will still pick a
 * range, and a range is all the triage below needs. "Not yet decided" is a
 * deliberate option — refusing to offer it just produces a wrong answer, and an
 * honest blank is more useful than a fabricated band.
 */
export const BUDGET_BANDS = [
  "Under Rs 10L",
  "Rs 10-25L",
  "Rs 25-40L",
  "Rs 40-75L",
  "Rs 75L-1Cr",
  "Rs 1Cr+",
  "Not yet decided",
] as const;
export type BudgetBand = (typeof BUDGET_BANDS)[number];

/** The buyer-side event categories, in the language buyers use for them. */
export const EVENT_TYPES = [
  "Exhibition or trade fair",
  "Conference or summit",
  "Corporate event or annual meet",
  "Brand or product launch",
  "Government or institutional programme",
  "Cultural or public event",
  "Agency or production partner enquiry",
] as const;

/**
 * Internal lead triage.
 *
 * WHAT THIS IS FOR. Raja reads every enquiry by hand. The band exists so a
 * substantial project does not sit behind ten small ones in the same inbox —
 * nothing more. It is written to the record and shown in the admin inbox, and
 * it is never rendered anywhere the sender can see it. Showing a person the
 * score you gave them is a good way to lose the ones you scored wrong.
 *
 * WHY THESE SIGNALS. Budget band is the strongest single indicator and is
 * weighted accordingly. Scale (covered area or headcount) is next, because this
 * business is priced by what has to be built. A named organisation and a work
 * email both suggest someone buying on an employer's behalf rather than for a
 * private function, which is the commercial segment this site is for. None of
 * it is arithmetic about money — it is a sort order for a human's attention.
 */
export type LeadBand = "high" | "medium" | "general";

const BUDGET_WEIGHT: Record<string, number> = {
  "Rs 1Cr+": 5,
  "Rs 75L-1Cr": 4,
  "Rs 40-75L": 3,
  "Rs 25-40L": 2,
  "Rs 10-25L": 1,
};

const FREE_EMAIL = /@(gmail|yahoo|hotmail|outlook|live|rediffmail|proton(mail)?|icloud|aol)\./i;

export function classify(input: {
  organisation?: string;
  email?: string;
  budget?: string;
  attendance?: string;
  requirement?: string;
  event_type?: string;
}): LeadBand {
  let score = BUDGET_WEIGHT[input.budget ?? ""] ?? 0;

  // Scale, read off whichever field the buyer actually filled in. Area and
  // headcount are both quoted with Indian digit grouping often enough that the
  // separators have to come out before this is a number.
  const scaleText = `${input.attendance ?? ""} ${input.requirement ?? ""}`;
  const numbers = [...scaleText.matchAll(/[\d][\d,]*/g)].map((m) => Number(m[0].replace(/,/g, "")));
  const largest = numbers.length ? Math.max(...numbers) : 0;
  if (largest >= 25000) score += 3;
  else if (largest >= 5000) score += 2;
  else if (largest >= 1000) score += 1;

  // Buying on an employer's behalf.
  if ((input.organisation ?? "").trim().length > 2) score += 1;
  const email = (input.email ?? "").trim();
  if (email.includes("@") && !FREE_EMAIL.test(email)) score += 1;

  // The segments this site is built to win.
  if (/exhibition|conference|corporate|launch|government|institutional|agency/i.test(input.event_type ?? "")) {
    score += 1;
  }

  if (score >= 6) return "high";
  if (score >= 3) return "medium";
  return "general";
}

export const BAND_LABELS: Record<LeadBand, string> = {
  high: "High value",
  medium: "Medium",
  general: "General",
};

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
  attendance: string;
  venue: string;
  budget: string;
  /** Internal triage band. Never shown to the person who submitted. */
  band: LeadBand;
  /** Original filename of an attached brief, empty when none was sent. */
  brief_name: string;
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
  attendance: 80,
  venue: 160,
  budget: 40,
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

/**
 * A dialable `tel:` URI.
 *
 * Two things were wrong across the site. Some links were built by interpolating
 * the display string straight in, producing `tel:+91 98450 44177` — spaces are
 * not valid in a tel URI and some clients simply refuse it. The Bengaluru
 * landlines were emitted as `tel:08026609751`, which dials only from inside
 * India: a buyer calling from a mobile abroad, or from a softphone, gets
 * nothing. Both are normalised here to E.164 so every number on the site is one
 * tap from anywhere.
 */
export function telHref(raw: string, countryCode = "91"): string {
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return `tel:${digits}`;
  // A leading 0 is the Indian trunk prefix; it is replaced by the country code.
  const national = digits.replace(/^0+/, "");
  return `tel:+${countryCode}${national}`;
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
