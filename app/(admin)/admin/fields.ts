import type { COLLECTIONS } from "@/lib/store";

type Collection = keyof typeof COLLECTIONS;

export type Field =
  | { name: string; label: string; type: "text" | "textarea" | "number"; hint?: string; placeholder?: string }
  | { name: string; label: string; type: "checkbox"; hint?: string }
  | { name: string; label: string; type: "select"; options: string[]; hint?: string }
  | { name: string; label: string; type: "image"; hint?: string };

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
  services: {
    slug: "", title: "", heading: "", summary: "", body: [], capacity: [], bundled: [],
    image: null, page: false, order: 99, status: "provisional",
  },
  solutions: {
    slug: "", label: "", title: "", summary: "", audience: "", category: "corporate",
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
    if (next === null || next === undefined || typeof next !== "object") cursor[key] = {};
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
}
