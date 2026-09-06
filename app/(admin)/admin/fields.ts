import type { COLLECTIONS } from "@/lib/store";

type Collection = keyof typeof COLLECTIONS;

export type Field =
  | { name: string; label: string; type: "text" | "textarea" | "number"; hint?: string; placeholder?: string }
  | { name: string; label: string; type: "checkbox"; hint?: string }
  | { name: string; label: string; type: "select"; options: string[]; hint?: string }
  | { name: string; label: string; type: "image"; hint?: string }
  /**
   * An image stored as a bare path string rather than an asset object.
   *
   * Three collections — the About timeline, milestones and inventory highlights
   * — declare `image: string`, not an `ImageAsset`. Pointing the normal "image"
   * field at one of those writes an object over the string and destroys the
   * path, which is exactly the failure that left an <img> with an empty src
   * earlier. This type exists so the editor matches the data instead of the
   * data being expected to match the editor.
   */
  | { name: string; label: string; type: "imagePath"; hint?: string };

/**
 * What each collection's editor shows.
 *
 * The client is not editing JSON. They are editing "the title of this project"
 * and "the photograph on this card", so the editor is built from a description
 * of the fields rather than from a text area containing a data structure.
 *
 * `name` is a dot path into the record, so `image.alt` edits the alt text
 * inside the nested image object without the form having to know the shape.
 * Anything a schema does not name is preserved untouched on save — that is what
 * keeps `clearance`, `status` and the research notes in `content/` from being
 * silently destroyed the first time someone fixes a typo.
 */
export const FIELDS: Record<Collection, Field[]> = {
  pageImages: [
    { name: "label", label: "Where it appears", type: "text", hint: "A note to help you find it. Not shown on the website." },
    { name: "image", label: "Photograph", type: "imagePath" },
    { name: "alt", label: "Photograph description", type: "text", hint: "Say what is in the picture. Read aloud to blind visitors and used by search engines." },
  ],

  recentEvents: [
    { name: "project", label: "Project", type: "text", placeholder: "Ambedkar Jayanti at Vidhana Soudha" },
    { name: "year", label: "Year", type: "text", placeholder: "2024" },
    { name: "image", label: "Photograph", type: "imagePath" },
    { name: "slug", label: "Page address", type: "text", hint: "Used for this project's own page. Changing it changes that URL." },
    {
      name: "size",
      label: "Tile size in the grid",
      type: "select",
      options: ["normal", "wide", "tall"],
      hint: "Wide spans two columns, tall spans two rows. Changing these alters how the grid packs.",
    },
  ],

  eventFormats: [
    { name: "title", label: "Card title", type: "text", placeholder: "Mega Exhibitions" },
    { name: "summary", label: "Card description", type: "textarea" },
    { name: "image", label: "Card photograph", type: "image" },
    { name: "image.alt", label: "Photograph description", type: "text", hint: "Say what is in the picture. Read aloud to blind visitors and used by search engines." },
    { name: "href", label: "Where the card links to", type: "text", hint: "A path on this site, e.g. /solutions/exhibitions-and-trade-fairs." },
  ],

  highlights: [
    { name: "label", label: "Item", type: "text" },
    { name: "number", label: "Figure", type: "text", hint: "Leave blank if unconfirmed — the tile then shows no number rather than a wrong one." },
    { name: "unit", label: "Unit", type: "text", placeholder: "sq ft" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "tag", label: "Tag", type: "text" },
    { name: "image", label: "Photograph", type: "imagePath" },
  ],

  copy: [
    { name: "label", label: "Where this appears", type: "text", hint: "Just a note to help you find it — not shown on the website." },
    { name: "body", label: "Paragraph", type: "textarea", hint: "Plain text. Formatting and layout are handled by the page design." },
  ],

  catalog: [
    { name: "name", label: "Category name", type: "text" },
    { name: "shortName", label: "Short name", type: "text" },
    { name: "tagline", label: "One-line tagline", type: "text" },
    { name: "totalCapacity", label: "Capacity", type: "text", hint: "The figure as it should read, e.g. 5,00,000. Leave blank if unconfirmed." },
    { name: "unit", label: "Unit", type: "text", placeholder: "Sq. Ft." },
    { name: "description", label: "Description", type: "textarea" },
    // InventoryCategory.image is `string | null`, so this must be the path
    // field. Declaring it as an asset wrote an object over the string, and the
    // first save silently nulled the photograph.
    { name: "image", label: "Photograph", type: "imagePath" },
    { name: "alt", label: "Photograph description", type: "text" },
  ],

  timeline: [
    { name: "year", label: "Year", type: "text", placeholder: "1977" },
    { name: "period", label: "Period", type: "text", placeholder: "1977 — 1989" },
    { name: "tag", label: "Tag", type: "text" },
    { name: "headline", label: "Headline", type: "text" },
    { name: "description", label: "Narrative", type: "textarea" },
    { name: "image", label: "Photograph", type: "imagePath" },
    { name: "alt", label: "Photograph description", type: "text", hint: "Say what is in the picture. Read aloud to blind visitors and used by search engines." },
  ],

  milestones: [
    { name: "title", label: "Title", type: "text" },
    { name: "year", label: "Year", type: "text" },
    { name: "venue", label: "Venue", type: "text" },
    { name: "scale", label: "Scale", type: "text", hint: "Leave blank if unconfirmed." },
    { name: "scope", label: "What Raja supplied", type: "textarea" },
    { name: "image", label: "Photograph", type: "imagePath" },
  ],

  principles: [
    { name: "title", label: "Title", type: "text" },
    { name: "body", label: "Description", type: "textarea" },
  ],

  locations: [
    { name: "city", label: "City", type: "text" },
    { name: "state", label: "State", type: "text" },
    { name: "displayName", label: "Display name", type: "text", hint: "Use when the place is better known by another name. Leave blank to use the city." },
    { name: "blurb", label: "Description", type: "textarea" },
    { name: "seoTitle", label: "Search title", type: "text", hint: "IMPORTANT: a location only gets its own page when this is filled in. Leave blank and it stays a point on the map." },
    { name: "seoDescription", label: "Search description", type: "textarea" },
    { name: "image", label: "Photograph", type: "image" },
    { name: "image.alt", label: "Photograph description", type: "text" },
  ],

  disciplines: [
    { name: "title", label: "Discipline", type: "text" },
    { name: "body", label: "Description", type: "textarea" },
  ],

  partnerPoints: [
    { name: "heading", label: "Heading", type: "text" },
    { name: "body", label: "Body", type: "textarea" },
  ],

  partnerSteps: [
    { name: "label", label: "Step", type: "textarea" },
  ],

  seo: [
    { name: "route", label: "Page address", type: "text", placeholder: "/partners", hint: "Exactly as it appears in the address bar, starting with a slash." },
    { name: "title", label: "Search title", type: "text", hint: "About 55 characters reads best in Google. Longer is allowed — it may be shortened in results." },
    { name: "description", label: "Search description", type: "textarea", hint: "About 155 characters. This is the grey text under the blue link." },
    { name: "ogImage", label: "Social preview image", type: "imagePath", hint: "Shown when the page is shared on WhatsApp or LinkedIn. Leave blank to use the site default." },
    { name: "canonical", label: "Canonical URL", type: "text", hint: "Leave blank unless this page duplicates another." },
    { name: "noindex", label: "Hide this page from Google", type: "checkbox", hint: "The page stays live and reachable; it just stops being listed in search." },
  ],

  services: [
    { name: "title", label: "Service name", type: "text" },
    { name: "slug", label: "Page address", type: "text", hint: "The last part of the web address, e.g. german-hangers. Changing this changes the page's URL — old links will stop working." },
    { name: "heading", label: "Heading on the page", type: "text" },
    { name: "summary", label: "One-line summary", type: "textarea", hint: "Shown on the services index and used as the page's search-engine description." },
    { name: "image", label: "Main photograph", type: "image" },
    { name: "image.alt", label: "Photograph description", type: "text", hint: "Say what is in the picture. Read aloud to blind visitors and used by search engines." },
    { name: "page", label: "Give this service its own page", type: "checkbox", hint: "Off means it still appears in the list, but has no page of its own." },
  ],

  solutions: [
    { name: "label", label: "Short name", type: "text", hint: "Used on cards and in the menu." },
    { name: "title", label: "Heading on the page", type: "text" },
    { name: "slug", label: "Page address", type: "text", hint: "Changing this changes the page's URL." },
    { name: "summary", label: "One-line summary", type: "textarea" },
    { name: "audience", label: "Who this page is written for", type: "textarea" },
    { name: "image", label: "Page photograph", type: "imagePath", hint: "Optional. Leave blank and the page uses the shared photograph for its category." },
    { name: "seoTitle", label: "Search-engine title", type: "text", hint: "Keep under about 55 characters — the site name is added automatically." },
    { name: "seoDescription", label: "Search-engine description", type: "textarea", hint: "One or two sentences, under about 160 characters." },
  ],

  schedule: [
    { name: "item", label: "What it is", type: "text", placeholder: "Imported German hangers" },
    { name: "capacity", label: "How much", type: "text", hint: "The number as it should appear, e.g. 5,00,000+. Leave blank if unconfirmed — the line then shows no figure rather than a wrong one." },
    { name: "unit", label: "Unit", type: "text", placeholder: "sq ft" },
  ],

  projects: [
    { name: "title", label: "Project title", type: "text" },
    { name: "organization", label: "Client / organisation", type: "text" },
    { name: "eyebrow", label: "Category label", type: "text", placeholder: "National congress" },
    { name: "year", label: "Year", type: "text", placeholder: "2019" },
    {
      name: "summary",
      label: "Summary",
      type: "textarea",
      hint: "Two or three sentences describing what Raja built. Leave blank and the card shows a 'pending' placeholder instead of inventing one.",
    },
    { name: "hero", label: "Main photograph", type: "image" },
    { name: "hero.alt", label: "Photograph description", type: "text", hint: "Describes the image for screen readers and for search engines. Say what is in it." },
    { name: "featured", label: "Feature this project (shows first)", type: "checkbox" },
    {
      name: "tint",
      label: "Card colour",
      type: "select",
      options: ["neutral", "pink", "yellow", "blue", "purple", "green"],
    },
    { name: "reverse", label: "Put the photograph on the right", type: "checkbox" },
    { name: "href", label: "Link to a case study page", type: "text", hint: "Leave blank until a page exists. A card with no link simply shows no button." },
  ],

  events: [
    { name: "organisation", label: "Organisation", type: "text" },
    { name: "event", label: "Event", type: "text", placeholder: "Navaratri Function 2023" },
  ],

  capabilities: [
    { name: "index", label: "Number", type: "text", placeholder: "01" },
    { name: "title", label: "Title", type: "text" },
    { name: "summary", label: "One-line description", type: "textarea" },
    { name: "image", label: "Photograph", type: "image" },
    { name: "image.alt", label: "Photograph description", type: "text" },
  ],

  inventory: [
    { name: "index", label: "Number", type: "text", placeholder: "01" },
    { name: "eyebrow", label: "Category label", type: "text", placeholder: "Infrastructure" },
    { name: "title", label: "Title", type: "text" },
    { name: "body", label: "Description", type: "textarea" },
    { name: "image", label: "Photograph", type: "image" },
    { name: "image.alt", label: "Photograph description", type: "text" },
    {
      name: "tint",
      label: "Tile colour",
      type: "select",
      options: ["blue", "yellow", "green", "pink", "purple", "neutral"],
    },
  ],

  process: [
    { name: "index", label: "Number", type: "text", placeholder: "00" },
    { name: "label", label: "Stage name", type: "text", placeholder: "Empty" },
    { name: "caption", label: "Caption", type: "textarea", hint: "One sentence, shown over the photograph." },
    { name: "image", label: "Photograph", type: "image" },
    { name: "image.alt", label: "Photograph description", type: "text" },
  ],

  clients: [
    { name: "name", label: "Client name", type: "text" },
    { name: "logo", label: "Logo", type: "image", hint: "A logo on a transparent or white background works best." },
    { name: "logo.alt", label: "Logo description", type: "text" },
  ],

  collage: [
    { name: "image", label: "Photograph", type: "image" },
    { name: "image.alt", label: "Photograph description", type: "text" },
    { name: "left", label: "Position from left (%)", type: "number", hint: "Where the photograph sits in the composition. 0 is the left edge, 100 the right." },
    { name: "top", label: "Position from top (%)", type: "number" },
    { name: "width", label: "Width (%)", type: "number" },
    { name: "height", label: "Height (%)", type: "number" },
  ],
};

/** A blank record for each collection, so "Add new" starts from a valid shape. */
export const BLANKS: Record<Collection, Record<string, unknown>> = {
  pageImages: { id: "", label: "", image: "", alt: "", order: 0, status: "approved" },
  recentEvents: { slug: "", year: "", project: "", image: "", size: "normal" },
  eventFormats: { id: "", title: "", summary: "", image: null, href: "/solutions" },
  highlights: { number: "", unit: "", label: "", description: "", tag: "", image: "" },
  copy: { id: "", label: "", body: "", order: 0, status: "approved" },
  catalog: { id: "", name: "", shortName: "", tagline: "", icon: "", totalCapacity: "", unit: "",
    description: "", specs: [], features: [], applications: [], image: null, alt: "" },
  timeline: { year: "", period: "", tag: "", headline: "", description: "", deliverables: [], image: "", alt: "" },
  milestones: { id: "", year: "", title: "", venue: "", scale: "", scope: "", image: "" },
  principles: { id: "", title: "", body: "", status: "approved" },
  locations: { id: "", city: "", state: "", country: "India", lat: 0, lng: 0, blurb: null,
    verification: "client-provided", published: true, status: "provisional" },
  disciplines: { id: "", title: "", body: "" },
  partnerPoints: { id: "", heading: "", body: "", order: 0, status: "approved" },
  partnerSteps: { id: "", label: "", order: 0, status: "approved" },
  seo: { id: "", route: "", title: "", description: "", ogImage: "", canonical: "", noindex: false, order: 0, status: "approved" },

  services: {
    slug: "", title: "", heading: "", summary: "", body: [], capacity: [], bundled: [],
    image: null, page: false, order: 99, status: "provisional",
  },
  solutions: {
    slug: "", label: "", title: "", summary: "", audience: "", category: "corporate", image: "",
    scope: [], sections: [], seoTitle: "", seoDescription: "",
  },
  schedule: { item: "", capacity: null, unit: "", status: "provisional" },

  projects: {
    id: "", order: 99, published: true, featured: false, organization: "", eyebrow: "",
    title: "", year: "", summary: null, hero: null, gallery: [], video: null, logo: null,
    tint: "neutral", reverse: false, href: null, status: "approved",
  },
  events: { organisation: "", event: "" },
  capabilities: { id: "", index: "", title: "", summary: null, image: null, status: "approved" },
  inventory: {
    id: "", eyebrow: "", index: "", title: "", body: null, image: null, tint: "blue",
    area: { col: "1 / 2", row: "1 / 2" }, fit: "cover", layout: "image-top", status: "approved",
  },
  process: { id: "", index: "", label: "", caption: null, image: null, status: "approved" },
  clients: { id: "", name: "", logo: null, box: { width: 120, height: 70 }, status: "approved" },
  collage: { id: "", left: 20, top: 20, width: 20, height: 18, image: null },
};

/* ------------------------------- dot paths -------------------------------- */

export function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

/**
 * Writes a value at a dot path, creating intermediate objects as needed.
 *
 * Setting `image.alt` on a record whose `image` is still null has to create the
 * image object rather than throw — otherwise the alt field is dead until a
 * photograph has been chosen and saved once.
 */
export function setPath(obj: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  let cursor: Record<string, unknown> = obj;
  for (const key of keys.slice(0, -1)) {
    const next = cursor[key];

    /*
     * A non-empty string here means the schema and the data disagree: the field
     * is declared as `image.alt` but `image` is a plain path string, not an
     * object. Overwriting it with `{}` silently destroys the path — which is
     * exactly what happened to two records, whose `image` became `{"alt": null}`
     * and whose pages then rendered an <img> with an empty src.
     *
     * Refusing the write is the right failure. A mis-declared field should lose
     * its own edit, not take the record's data with it.
     */
    if (typeof next === "string" && next !== "") {
      console.error(
        `[admin] refusing to write "${path}": "${key}" holds a string, not an object. ` +
          `Fix the field definition rather than overwriting the value.`,
      );
      return;
    }

    if (next === null || next === undefined || typeof next !== "object") cursor[key] = {};
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
}
