/**
 * Content status vocabulary.
 *
 * The Figma design is SEMI-APPROVED: its layout and interaction are the source
 * of truth, its copy is not. Every content record therefore carries a status so
 * that unapproved material is visible in the codebase and in the rendered page,
 * rather than silently hardening into a hardcoded string.
 *
 *   approved     Taken verbatim from the Figma file and believed final.
 *   provisional  Present in Figma but duplicated, contradictory, or placeholder.
 *   pending      The design implies this slot exists; no content was supplied.
 *
 * Anything `pending` renders through <Placeholder> so the composition holds
 * without inventing a case study, client, statistic, or contact detail.
 */
export type ContentStatus = "approved" | "provisional" | "pending";

export interface Sourced {
  status: ContentStatus;
  /** Why this is not final, and what would resolve it. Shown in the audit. */
  note?: string;
}

export interface ImageAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
}
