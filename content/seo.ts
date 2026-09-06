import type { Sourced } from "./types";

/**
 * Per-route SEO overrides.
 *
 * Every page already computes a sensible title and description from its own
 * content. This is the override layer on top of that: when a row exists for a
 * route, its non-empty fields win; when it does not, the page's own metadata
 * stands. That ordering matters — it means adding this table changed nothing
 * about how the site currently presents itself, and the owner can correct one
 * page's description without inheriting responsibility for all twenty-three.
 *
 * `noindex` is deliberately a per-row switch rather than a global one. The case
 * it exists for is a page that is published but not yet worth indexing, which is
 * a normal editorial state and not something that should need a deploy.
 */
export interface SeoOverride extends Sourced {
  id: string;
  /** Route path exactly as it appears in the address bar, e.g. `/partners`. */
  route: string;
  title: string;
  description: string;
  ogImage: string;
  canonical: string;
  noindex: boolean;
  order: number;
}

/**
 * Ships empty on purpose.
 *
 * Seeding rows that merely restate what each page already generates would
 * create exactly the duplicate source of truth this project has been removing
 * everywhere else: two places holding the same title, drifting apart the first
 * time someone edits one of them.
 */
export const seoOverrides: SeoOverride[] = [];
