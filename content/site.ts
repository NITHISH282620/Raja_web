import type { MediaAsset, VideoAsset } from "./media";

/**
 * Site-level media: the brand mark, the hero, and standing section imagery
 * that is not tied to one project.
 *
 * These were string literals inside Hero, SiteHeader and Resources. They live
 * here so an admin panel can replace them, and so every media record on the
 * site carries a clearance.
 */

export const brand = {
  logo: {
    id: "brand-raja-logo",
    src: "/media/brand-raja-logo.webp",
    width: 400,
    height: 101,
    alt: "Raja Enterprises",
    clearance: "figma-supplied",
  } satisfies MediaAsset,
} as const;

/**
 * The hero.
 *
 * Replaced the Figma-supplied festival crowd with Raja's own aerial of the
 * AICOG 2019 tent city. The crowd frame was a generic scrimmed festival shot
 * that showed none of Raja's work; this shows several hundred tents the
 * company erected, which is the claim the headline actually makes. Sourced
 * from Raja's own project film, which carries their watermark throughout and
 * ends on the card "Infrastructure provided by Raja Enterprises".
 */
export const heroMedia = {
  image: {
    id: "aicog-2019-tent-city-dawn",
    src: "/media/projects/aicog-2019-tent-city-dawn.webp",
    width: 1920,
    height: 1080,
    alt: "Aerial view at dawn over several hundred white peaked tents laid out in ordered rows for AICOG 2019.",
    focal: "center",
    clearance: "raja-original",
    credit: "Raja Enterprises",
  } satisfies MediaAsset,

  /**
   * Ambient background loop. The poster image above renders immediately and
   * owns the LCP; the video is only fetched afterwards, only on pointer-fine
   * screens, and never under reduced motion.
   */
  video: {
    id: "aicog-2019-tent-city-loop",
    src: "/video/aicog-2019-tent-city.mp4",
    poster: undefined,
    width: 1280,
    height: 720,
    description:
      "Slow aerial drift over the AICOG 2019 tent city at dawn, several hundred tents in ordered rows.",
    clearance: "raja-original",
    credit: "Raja Enterprises",
  } satisfies VideoAsset,

  sources: [
    { src: "/video/aicog-2019-tent-city.webm", type: "video/webm" },
    { src: "/video/aicog-2019-tent-city.mp4", type: "video/mp4" },
  ],
  mobileSrc: "/video/aicog-2019-tent-city-mobile.mp4",
} as const;

/** The frame that overlaps the stat band, reused from the legacy collage in Figma. */
export const resourcesOverlay: MediaAsset = {
  id: "resources-overlay",
  src: "/media/legacy-uttarakhand-gis.webp",
  width: 700,
  height: 379,
  alt: "",
  clearance: "figma-supplied",
};
