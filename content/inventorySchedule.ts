import type { Sourced } from "./types";

/**
 * The owned-inventory schedule.
 *
 * Figures are Raja's own published numbers, recovered from their previous
 * implementation. The wooden-flooring figure (10 lakh sq ft) matches the
 * Figma stat band exactly, which is a useful cross-check that these are the
 * company's real operating numbers rather than marketing rounding.
 */
export interface InventoryLine extends Sourced {
  item: string;
  capacity: string | null;
  unit?: string;
}

export const inventorySchedule: InventoryLine[] = [
  { item: "Imported German hangers", capacity: "5,00,000+", unit: "sq ft", status: "approved" },
  { item: "Wooden floor platforms", capacity: "10,00,000+", unit: "sq ft", status: "approved" },
  { item: "Octonorm & Maxima stalls", capacity: "15,000", unit: "sq m", status: "approved" },
  { item: "Air-conditioning", capacity: "3,000", unit: "tons", status: "approved" },
  { item: "Staging & platforms", capacity: "1,00,000+", unit: "sq ft", status: "approved" },
  { item: "Lighting & AV systems", capacity: null, status: "provisional",
    note: "Named on Raja's published inventory but no capacity figure given." },
  { item: "LED fascia", capacity: null, status: "provisional",
    note: "Named on Raja's published inventory but no capacity figure given." },
  { item: "Seating", capacity: null, status: "provisional",
    note: "Named on Raja's published inventory but no capacity figure given." },
  { item: "Flooring & carpeting", capacity: null, status: "provisional" },
  { item: "Catering services", capacity: null, status: "provisional" },
];

/** Service categories, verbatim from Raja's own published site. */
export const services = [
  "Events and conferences",
  "Exhibitions and trade shows",
  "Exhibition stall fabrication",
  "Corporate events",
  "Government programmes",
  "Weddings and social events",
] as const;
