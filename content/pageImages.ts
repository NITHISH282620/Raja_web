import type { Sourced } from "./types";

/**
 * Named image slots for pages that show a single photograph.
 *
 * Some images do not belong to a repeating record. The photograph at the top of
 * the Legacy page, the one on Careers, the one beside the Contact form — each is
 * a single picture in a specific place, and each was written directly into its
 * route file as `src="/media/…"`. That made them the last images on the site the
 * owner could not change: everything in a list was editable, and the standalone
 * ones were not.
 *
 * The same shape as `content/copy.ts`, and for the same reason. A slot has a
 * stable id, a component asks for `pageImage("legacy-hero")`, and the store
 * returns whatever the admin holds or falls back to the value below.
 *
 * Not included: the Raja wordmark in the client honeycomb and the footer. That
 * is brand furniture rather than content — swapping it is a rebrand, not an
 * edit, and it should stay in code where it cannot be changed by accident.
 */
export interface PageImage extends Sourced {
  id: string;
  /** Where it appears, in words. Shown in the admin list. */
  label: string;
  image: string;
  alt: string;
  order: number;
}

export const pageImages: PageImage[] = [
  {
    id: "home-hero-poster",
    label: "Homepage — hero background",
    image: "/video/raja-hero-poster.webp",
    alt: "Exhibition stalls and delegate walkways inside a clear-span hangar built by Raja Enterprises.",
    order: 0,
    status: "approved",
  },
  {
    id: "about-hero-primary",
    label: "About — main photograph",
    image: "/media/events/kanha-canopy-assembly-aerial.56be51e1.webp",
    alt: "Aerial view over an immense clear-span canopy sheltering a seated assembly of many thousands.",
    order: 1,
    status: "approved",
  },
  {
    id: "about-hero-secondary",
    label: "About — second photograph",
    image: "/media/events/german-hanger-aerial.webp",
    alt: "A clear-span hangar structure seen from above at dusk.",
    order: 2,
    status: "approved",
  },
  {
    id: "legacy-hero",
    label: "Legacy — photograph at the top",
    image: "/media/events/kanha-canopy-assembly-aerial.56be51e1.webp",
    alt: "Aerial view over an immense clear-span canopy sheltering a seated assembly of many thousands.",
    order: 3,
    status: "approved",
  },
  {
    id: "legacy-origins",
    label: "Legacy — the Bengaluru Genesis section",
    image: "/media/events/kanha-campus-aerial.fbf4b561.webp",
    alt: "An aerial view across a large event campus.",
    order: 4,
    status: "approved",
  },
  {
    id: "legacy-pivot",
    label: "Legacy — the Asset Moat section",
    image: "/media/events/kanha-canopy-seating.7a22707d.webp",
    alt: "Seating laid out beneath a clear-span canopy.",
    order: 5,
    status: "approved",
  },
  {
    id: "partners-hero",
    label: "Partners — crew photograph",
    image: "/media/projects/aicog-2019-hanger-erection.webp",
    alt: "Raja Enterprises crew in branded shirts raising a canopy structure on site during a build.",
    order: 6,
    status: "approved",
  },
  {
    id: "careers-hero",
    label: "Careers — photograph",
    image: "/media/events/eima-delegates-stand.5c782f20.webp",
    alt: "Delegates at an exhibition stand during a trade fair.",
    order: 7,
    status: "approved",
  },
  {
    id: "contact-hero",
    label: "Contact — photograph beside the form",
    image: "/media/events/aol-pavilion-night.67b84519.webp",
    alt: "A large illuminated pavilion at night, reflected in still water.",
    order: 8,
    status: "approved",
  },
];
