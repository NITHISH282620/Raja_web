import type { Sourced } from "./types";

export interface ClientEvent {
  organisation: string;
  event: string;
}

/**
 * Recent engagements, as supplied by Raja.
 *
 * The source list arrived as a spreadsheet export and was rendered verbatim —
 * shouting caps throughout ("THE ART OF LIVING TRUST", "SETTING UP TENT CITY AT
 * BANAGLORE"), inconsistent legal suffixes, and three typos. Set in caps at
 * 13px the whole column was also materially harder to scan than the same names
 * in sentence case, which is the one thing this table has to be good at.
 *
 * Names are corrected to how each organisation writes its own, and the event
 * descriptions are set as titles. NOTHING has been added, dropped or reordered
 * — the ten rows and their pairings are exactly as supplied.
 *
 * Corrections applied, so they can be checked against the source:
 *   - "BANAGLORE"                 -> "Bengaluru"
 *   - "ORGANAIZATION"             -> "Organisation"
 *   - "COSTING OF CENTRAL SILK
 *      BORAD CONFERENCE"          -> "Central Silk Board Conference"
 *     ("Costing of" is a line item from the source sheet, not part of the
 *     event name; "BORAD" is a transposition of "Board".)
 */
export const clientEvents: ClientEvent[] = [
  { organisation: "The Art of Living Trust", event: "Navaratri Function 2023" },
  {
    organisation: "Indian Society of Gastroenterology",
    event: "ISGCON 2023 — 64th Annual Congress, Bengaluru",
  },
  { organisation: "La Renon Healthcare", event: "Annual company event" },
  { organisation: "First Circle Biztech", event: "FC Expo 2024" },
  {
    organisation: "Federation of Indian Chambers of Commerce & Industry (FICCI)",
    event: "EIMA Agrimach 2024",
  },
  { organisation: "Kanha Shanti Vanam", event: "Tent city, Bengaluru" },
  { organisation: "ABS Business Solutions", event: "Education fair" },
  { organisation: "Collegedunia Web", event: "Collegedunia Education Fair" },
  { organisation: "Garment Technology Expo", event: "GTE 2024" },
  {
    organisation: "Central Silk Board — National Silkworm Seed Organisation",
    event: "Central Silk Board Conference",
  },
];

export const clientEventsMeta: Sourced = {
  status: "provisional",
  note: "Supplied by Raja as a spreadsheet export. Organisation names normalised to each body's own styling and three source typos corrected (BANAGLORE, ORGANAIZATION, BORAD). Confirm the corrected names before launch.",
};
