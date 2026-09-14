/**
 * The "Key Milestones · 1977–2024" timeline on the Legacy page.
 *
 * REBUILT 2026-09-14. This was previously a hardcoded array inside
 * `components/legacy/LegacyTimeline.tsx`, invisible to the admin and to
 * `lib/store.ts` alike. Three of its six images were literal screenshots of a
 * developer's local `localhost:3001` — one of them a database error page with
 * a stack trace — captured by accident during development and never replaced.
 * They were live on the public site.
 *
 * Moved into the same seed-then-database pattern as everything else so this
 * cannot happen silently again: the images are now real, and the whole
 * section is editable from the admin like the rest of the site.
 */
export interface LegacyMilestone {
  year: string;
  title: string;
  desc: string;
  image: string;
  alt: string;
}

export const legacyMilestones: LegacyMilestone[] = [
  {
    year: "1977",
    title: "Founded in Bengaluru",
    desc: "Timber poles and cotton shamianas for civic convocations on 5th Main Road.",
    image: "/media/projects/02-02-isgcon-bengaluru-1764810125216.webp",
    alt: "An award presentation on a conference stage beneath a branded backdrop.",
  },
  {
    year: "1985",
    title: "State-Level Contracts",
    desc: "First Karnataka government mandates — Republic Day grounds and political summits.",
    image: "/media/projects/23-13-hampiutsav2024-images-8.webp",
    alt: "A ceremonial plaque unveiling on a red-carpeted dais, the drape drawn back before assembled dignitaries.",
  },
  {
    year: "1991",
    title: "The German Pivot",
    desc: "Direct acquisition of aerospace-grade 6061-T6 aluminium clear-span hangar systems.",
    image: "/media/projects/08-06-kanha-shanti-vanam-images.webp",
    alt: "Aerial view of engineered German clear-span hangar structures.",
  },
  {
    year: "2000",
    title: "National Expansion",
    desc: "Deployments across Tamil Nadu, Andhra Pradesh, and Maharashtra for multi-thousand delegate events.",
    image: "/media/projects/aicog-2019-tent-city-dawn.webp",
    alt: "Aerial view at dawn over several hundred white peaked tents laid out in ordered rows for AICOG 2019.",
  },
  {
    year: "2010",
    title: "The Flooring Guild",
    desc: "In-house precision wooden sub-floor production yard commissioned. 10,00,000+ sq. ft. deployed.",
    image: "/media/projects/aicog-2019-flooring-install.webp",
    alt: "Crew installing flooring panels on site during the AICOG 2019 build.",
  },
  {
    year: "2024",
    title: "Full-Stack Infrastructure",
    desc: "Structures, staging, lighting, AV, flooring, barricading — all owned, all operated by Raja crew.",
    image: "/media/projects/aicog-2019-hanger-complex-aerial.webp",
    alt: "Aerial view of a completed clear-span hangar complex with surrounding infrastructure.",
  },
];
