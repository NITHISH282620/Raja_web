import type { ImageAsset, Sourced } from "./types";
import { publishedProjects, type Project } from "./projects";

/**
 * Geographic operating footprint.
 *
 * DATA-DRIVEN, NOT HARDCODED. This is the requirement that shapes the module:
 * when Raja wins work in a new city, an admin adds a location record and points
 * a project at it, and the map, the counts, the filters and the location page
 * all follow. Nothing about a city is written twice.
 *
 * A location is therefore a thin record — a name and a coordinate — and every
 * fact shown about it (how many projects, which sectors, which years) is
 * derived from `content/projects.ts` at render time. Delete or unpublish a
 * project and the geography updates itself.
 *
 * VERIFICATION is carried explicitly because Raja's own evidence differs in
 * strength from place to place. A city with published projects behind it reads
 * differently from one a client has mentioned but nothing corroborates, and the
 * map says which is which rather than flattening them into the same dot.
 */

export type LocationVerification =
  /** Projects in the canonical model place Raja here. */
  | "project-evidenced"
  /** Raja publishes this location on its own site or material. */
  | "raja-published"
  /** Raja has told us, and nothing public corroborates it yet. */
  | "client-provided"
  /** Under research; never rendered on the public map. */
  | "unverified";

export const VERIFICATION_LABELS: Record<LocationVerification, string> = {
  "project-evidenced": "Projects on record",
  "raja-published": "Published by Raja",
  "client-provided": "Client-provided, not yet public",
  unverified: "Under verification",
};

export interface LocationRecord extends Sourced {
  id: string;
  city: string;
  state: string;
  country: string;
  /** Decimal degrees. Used for the map projection. */
  lat: number;
  lng: number;
  /** Overrides `city` where a site is better known by its own name. */
  displayName?: string;
  blurb: string | null;
  verification: LocationVerification;
  published: boolean;
  /** A photograph from work at this location. Never representative imagery. */
  image?: ImageAsset;
  /** Only set once a page has enough underlying evidence to justify one. */
  seoTitle?: string;
  seoDescription?: string;
}

/**
 * Locations Raja's own records place it in.
 *
 * Coordinates are the standard published centroids for each place. They are
 * geography, not a claim about Raja.
 */
export const locations: LocationRecord[] = [
  {
    id: "bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    lat: 12.9716,
    lng: 77.5946,
    blurb:
      "Home city, yard and fleet. The majority of Raja's recorded engagements are built here — Palace Grounds, Gayathri Vihar, the GKVK campus and Vidhana Soudha among them.",
    image: {
      src: "/media/events/eima-expo-crowd.11d4b8f2.webp",
      width: 595,
      height: 336,
      alt: "A crowded outdoor trade-fair ground with exhibitor stands and agricultural machinery.",
      clearance: "client-approved",
    },
    verification: "project-evidenced",
    published: true,
    seoTitle: "Event Infrastructure in Bengaluru",
    seoDescription:
      "German hangers, flooring, staging and exhibition build in Bengaluru, from an owned yard and an in-house crew. Raja Enterprises, established 1977.",
    status: "approved",
  },
  {
    id: "hampi",
    city: "Hampi",
    state: "Karnataka",
    country: "India",
    lat: 15.335,
    lng: 76.46,
    blurb: "Hampi Utsav — state festival infrastructure on an open heritage site.",
    verification: "project-evidenced",
    published: true,
    status: "approved",
  },
  {
    id: "mm-hills",
    city: "Male Mahadeshwara Hills",
    state: "Karnataka",
    country: "India",
    lat: 12.0167,
    lng: 77.5833,
    displayName: "MM Hills",
    blurb: "Temple-town gathering infrastructure on hill terrain.",
    verification: "project-evidenced",
    published: true,
    status: "approved",
  },
  {
    id: "hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    lat: 17.385,
    lng: 78.4867,
    blurb: "Kanha Shanti Vanam — tent city and assembly infrastructure.",
    image: {
      src: "/media/events/kanha-canopy-assembly-aerial.56be51e1.webp",
      width: 644,
      height: 388,
      alt: "Aerial view over an immense clear-span canopy sheltering a seated assembly of many thousands.",
      clearance: "client-approved",
    },
    verification: "project-evidenced",
    published: true,
    status: "provisional",
    note: "Raja's schedule records the Kanha Shanti Vanam engagement as 'tent city at Bengaluru'. The Heartfulness campus of that name is outside Hyderabad. Confirm which site was built before this location is presented as Telangana work.",
  },
  {
    id: "dehradun",
    city: "Dehradun",
    state: "Uttarakhand",
    country: "India",
    lat: 30.3165,
    lng: 78.0322,
    blurb: "Global Investors Summit — as published on Raja's own website.",
    verification: "raja-published",
    published: true,
    status: "provisional",
    note: "Raja's own site lists a Global Investors Summit. The Uttarakhand summit is the likely referent but the site does not name the state. Confirm before this is presented as Uttarakhand work.",
  },
  {
    id: "goa",
    city: "Goa",
    state: "Goa",
    country: "India",
    lat: 15.2993,
    lng: 74.124,
    blurb:
      "ICGS Akshay commissioning at Goa Shipyard Limited, Vasco — the Coast Guard's fourth Adamya-class fast patrol vessel.",
    image: {
      src: "/media/events/icgs-akshay-commissioning.4d56e6c2.webp",
      width: 1280,
      height: 720,
      alt: "The ICGS Akshay commissioning ceremony at Goa Shipyard.",
      clearance: "client-approved",
    },
    verification: "client-provided",
    published: true,
    status: "provisional",
    note: "Event established from client-supplied photographs and confirmed against published reporting: ICGS Akshay commissioned at Goa Shipyard Limited, Vasco, 27 Jun 2026. Raja's involvement remains client-stated — no public source names the infrastructure contractor — so the map marks this location client-provided rather than project-evidenced.",
  },
];

/* ------------------------------------------------------------------ derived */

/** Only these reach the public map. */
export const publishedLocations = (): LocationRecord[] => locations.filter((l) => l.published);

export const findLocation = (id: string): LocationRecord | undefined =>
  locations.find((l) => l.id === id);

export const locationLabel = (l: LocationRecord): string => l.displayName ?? l.city;

/**
 * Projects at a location.
 *
 * Matched on the project's own `location` string containing the city name, so
 * adding a project with `location: "Mysuru"` and a Mysuru record is all it
 * takes for the city to appear. No second list to keep in step.
 */
export function projectsAt(l: LocationRecord): Project[] {
  const needles = [l.city, l.displayName, l.state].filter(Boolean).map((s) => s!.toLowerCase());
  return publishedProjects().filter((p) => {
    const hay = (p.location ?? "").toLowerCase();
    return hay.length > 0 && needles.some((n) => hay.includes(n));
  });
}

export interface LocationSummary {
  location: LocationRecord;
  projects: Project[];
  count: number;
  sectors: string[];
  years: string[];
}

/** Everything the map and the location panel need, computed from projects. */
export function locationSummaries(): LocationSummary[] {
  return publishedLocations()
    .map((location) => {
      const projects = projectsAt(location);
      return {
        location,
        projects,
        count: projects.length,
        sectors: [...new Set(projects.map((p) => p.category))],
        years: [...new Set(projects.map((p) => p.year).filter(Boolean) as string[])].sort(),
      };
    })
    .sort((a, b) => b.count - a.count);
}

/**
 * Map projection bounds.
 *
 * A plain equirectangular box around mainland India. Enough for plotting a
 * dozen points accurately at this scale, and it costs no map library, no tile
 * server, no API key and no runtime fetch — which is the right trade for a
 * dozen dots on a marketing site.
 */
export const INDIA_BOUNDS = { minLng: 67.5, maxLng: 90.5, minLat: 6.5, maxLat: 36.5 } as const;

export const project = (lat: number, lng: number): { x: number; y: number } => ({
  x: ((lng - INDIA_BOUNDS.minLng) / (INDIA_BOUNDS.maxLng - INDIA_BOUNDS.minLng)) * 100,
  y: ((INDIA_BOUNDS.maxLat - lat) / (INDIA_BOUNDS.maxLat - INDIA_BOUNDS.minLat)) * 100,
});

export const locationsIntro = {
  eyebrow: ["Where we", "build"] as const,
  statement: [
    { text: "Bengaluru based. " },
    { text: "Deployed", accent: true },
    { text: " across India." },
  ],
  lead:
    "Twenty owned goods vehicles and a permanent field crew mean the yard travels. Every point below is a place Raja's own records put it — nothing is claimed on the strength of a sales territory.",
};
