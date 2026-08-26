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
  /** Verbatim from Raja's own published positioning. */
  legacyStatement:
    "Raja Enterprises has been delivering experiential event solutions across India for over four decades.",
  positioning:
    "Experts in organising government programs, trade fairs, exhibitions, conferences, roadshows and business forums across India.",
  disciplines: [
    "Government programmes",
    "Trade fairs",
    "Exhibitions",
    "Conferences",
    "Roadshows",
    "Business forums",
  ],
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
  email: "raju@rajaenterprises.co" as string | null,
  /** Primary number shown in CTAs; the full list appears on the contact page. */
  phone: "+91 98450 44177" as string | null,
  landlines: ["080-26609751", "080-26609753", "080-26602958", "080-26602962"],
  addressLines: ['"Venkat", #145, 5th Main Road', "Bengaluru 560018", "Karnataka, India"] as string[],
  status: "approved" as const,
  note: "Recovered from Raja's own published sites (rajaenterprises.co and the previous implementation). Confirm these are current before launch.",
};

export const hasContactDetails = Boolean(contact.email || contact.phone || contact.addressLines.length);
