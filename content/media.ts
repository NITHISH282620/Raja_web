/**
 * The media model.
 *
 * Every image and video on the site is described by one of these records and
 * lives in `content/`. Presentation components never name a file path — they
 * receive a MediaAsset. That is what lets an admin panel replace a hero,
 * reorder a gallery or swap a logo without anyone editing a section component.
 *
 * `clearance` is the important field. The image policy is enforced here in
 * code rather than by convention: `publishable()` returns null for anything
 * that is not cleared, so a research-only asset cannot reach the production UI
 * even if someone wires it into a content module by mistake.
 */

export type MediaClearance =
  /** Raja's own photograph. Verified original. Highest priority for production. */
  | "raja-original"
  /** Supplied and approved for publication by the client. */
  | "client-approved"
  /** Third-party, but explicitly licensed or permission granted in writing. */
  | "licensed"
  /** Came through the approved Figma design file — the client's own material. */
  | "figma-supplied"
  /** Gathered for research. NEVER renders in production. */
  | "research-only";

/** The clearances a production surface is allowed to render. */
const PUBLISHABLE: ReadonlySet<MediaClearance> = new Set<MediaClearance>([
  "raja-original",
  "client-approved",
  "licensed",
  "figma-supplied",
]);

export interface MediaAsset {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  /** CSS object-position. Lets a crop be corrected without touching code. */
  focal?: string;
  clearance: MediaClearance;
  /** Photographer or rights holder, where one must be shown. */
  credit?: string;
}

export interface VideoAsset {
  id: string;
  src: string;
  poster?: MediaAsset;
  width: number;
  height: number;
  /** Describes the footage for anyone who cannot see or play it. */
  description: string;
  clearance: MediaClearance;
  credit?: string;
}

export const isPublishable = (m: { clearance: MediaClearance } | null | undefined): boolean =>
  Boolean(m && PUBLISHABLE.has(m.clearance));

/**
 * Gate a single asset. Returns null when the asset may not be published, so
 * callers fall through to their placeholder rather than rendering it.
 */
export function publishable<T extends { clearance: MediaClearance }>(asset: T | null | undefined): T | null {
  return isPublishable(asset) ? (asset as T) : null;
}

/** Gate a list, preserving order and dropping anything uncleared. */
export function publishableList<T extends { clearance: MediaClearance }>(assets: readonly T[] = []): T[] {
  return assets.filter(isPublishable) as T[];
}
