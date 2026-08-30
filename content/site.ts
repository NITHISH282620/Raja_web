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
 * Hero copy.
 *
 * Replaces "Building the extraordinary. Delivering the unforgettable." — two
 * superlatives that say nothing a competitor could not also claim, and that
 * name neither the product nor the buyer. What Raja actually sells is the
 * transformation the Process section documents: a levelled field becomes a
 * working venue. The headline states that, and the body names the physical
 * things being sold, who buys them, and the one fact that separates Raja from
 * a broker — it owns the inventory and employs the crew.
 */
export const hero = {
  headline: "Building the physical infrastructure\nbehind large-scale events.",
  body: "Since 1977, Raja Enterprises has delivered the physical infrastructure for government programmes, trade fairs, exhibitions, and corporate conferences. With substantial inventory and in-house field resources, we build the venue.",
} as const;

/**
 * The hero.
 *
 * SOURCE: Raja's own AICOG 2019 project film (HYD Kanaha.mp4, 1920x1080, 2:01).
 *
 * WHAT IS SERVED, and why it is not the whole film. The full encode was 64 MB
 * at 4.3 Mbps, with a 25 MB "mobile" variant that any viewport over 640px
 * loaded — a hero background costing more than most entire websites. It is
 * also a third-party event film: the frame carries a "GOOD" production mark
 * bottom-left, an "AICOG 2019 / GAYATHRI VIHAR" lockup bottom-right and a Raja
 * corner logo top-right, all burned in.
 *
 * What ships is a 20-second window (0:56-1:16) covering exhibition stalls, the
 * tent city at dawn, the packed hanger and the VIP lounge — the widest range of
 * Raja's work the film holds in one continuous stretch. It is cropped to the
 * middle 68% of the frame height, which removes all three burned-in overlays,
 * and re-encoded at 1600px CRF 30 (4.1 MB) and 960px CRF 32 (1.3 MB). The
 * centre "RAJA ENTERPRISES" watermark on some shots is left in: it is Raja's
 * own name on Raja's own site.
 *
 * The masters are in `_masters/video/`, outside the served tree, so the loop
 * can be recut without re-sourcing the original.
 *
 * The poster is the loop's own first frame, so nothing shifts when the video
 * fades in over it.
 */
export const heroMedia = {
  poster: {
    id: "raja-hero-poster",
    src: "/video/raja-hero-poster.webp",
    width: 1600,
    height: 612,
    alt: "Exhibition stalls and delegate walkways inside a clear-span hanger built by Raja Enterprises.",
    focal: "center",
    clearance: "raja-original",
    credit: "Raja Enterprises",
  } satisfies MediaAsset,

  /** The tent-city dawn frame, kept as an alternative poster. */
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

  video: {
    id: "raja-hero-loop",
    src: "/video/raja-hero-loop.mp4",
    poster: undefined,
    width: 1600,
    height: 612,
    description:
      "Twenty seconds from Raja Enterprises' AICOG 2019 project film: exhibition stalls under a hanger roof, an aerial over the tent city at dawn, a full audience seated under a clear-span structure, and the VIP lounge frontage.",
    clearance: "raja-original",
    credit: "Raja Enterprises",
  } satisfies VideoAsset,

  mobileSrc: "/video/raja-hero-loop-mobile.mp4",
} as const;
