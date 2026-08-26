import type { Sourced } from "./types";

/**
 * Single source of truth for company facts.
 *
 * The Figma file contradicts itself on headcount and age: the capabilities copy
 * says "our own 460-person crew", the stat band says "Field workforce 300+", and
 * a hidden frame says "460 In-house personnel" / "48 years in operation" while
 * the live copy says "47 years". Years are computed from the founding date so
 * they cannot go stale; the headcounts are flagged until confirmed.
 */
export const FOUNDED_YEAR = 1977;

export const yearsInOperation = (asOf: Date = new Date()) => asOf.getFullYear() - FOUNDED_YEAR;

export const company = {
  name: "Raja Enterprises",
  city: "Bengaluru",
  foundedYear: FOUNDED_YEAR,
  tagline: "We build moments.",
  description:
    "We design, build, and deliver large-scale event spaces and experiences — turning ambitious ideas into unforgettable realities.",
} as const;

export interface Stat extends Sourced {
  label: string;
  value: string;
}

/** The four full-bleed rows in the "Our resource" band, in Figma order. */
export const stats: Stat[] = [
  { label: "Own goods vehicles", value: "20", status: "approved" },
  {
    label: "Field workforce",
    value: "300+",
    status: "provisional",
    note: "Contradicts the capabilities copy, which claims a 460-person crew. Confirm which figure is field crew and which is total headcount.",
  },
  { label: "Sq. ft. stage capacity", value: "1,00,000+", status: "approved" },
  { label: "Sq. ft. wooden flooring", value: "10,00,000+", status: "approved" },
];

/**
 * Contact details.
 *
 * NOT PRESENT ANYWHERE IN THE FIGMA FILE. Deliberately left null rather than
 * invented — a wrong phone number on a contractor's site is worse than none.
 * Fill these in and every CTA and the footer wire themselves up automatically.
 */
export const contact = {
  email: null as string | null,
  phone: null as string | null,
  addressLines: [] as string[],
  status: "pending" as const,
  note: "No footer, address, phone, email or social links exist in the Figma file. Required before launch.",
};

export const hasContactDetails = Boolean(contact.email || contact.phone || contact.addressLines.length);
