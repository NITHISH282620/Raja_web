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

import type { MediaClearance } from "./media";
export type { MediaClearance };

export interface Sourced {
  status: ContentStatus;
  /** Why this is not final, and what would resolve it. Shown in the audit. */
  note?: string;
}

/**
 * A plain image.
 *
 * `clearance` is REQUIRED and deliberately not optional. Until 2026-09 this
 * interface had no clearance field at all, which meant the gate in
 * `media.ts` covered only the collections built on `MediaAsset` — client
 * logos, inventory tiles, the legacy collage and the event categories all
 * bypassed it. Anything rendered on a public surface now carries a clearance,
 * so `publishable()` governs every image on the site rather than half of them.
 */
export interface ImageAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
  clearance: MediaClearance;
  /** CSS object-position. Lets a crop be corrected without touching code. */
  focal?: string;
  /** Photographer or rights holder, where one must be shown. */
  credit?: string;
}
