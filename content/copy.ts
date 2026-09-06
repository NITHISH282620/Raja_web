import type { Sourced } from "./types";

/**
 * Long-form page copy.
 *
 * The last hardcoded business text on the site. Narrative paragraphs on About
 * and Legacy were written directly into their components as JSX text, which
 * meant the owner could edit a project title or a capacity figure from a phone
 * but not a sentence describing his own company — including the sentences
 * carrying the claims most likely to need correcting.
 *
 * Each block is addressed by a stable id, so a component asks for
 * `copyText("legacy-trust-0")` and gets whatever the admin currently holds,
 * falling back to the text below. That is the same seed-then-database rule the
 * rest of the content uses, and it is why moving this text changed nothing
 * about how the pages read.
 *
 * WHY NOT A RICH TEXT EDITOR. These are paragraphs in a designed layout, not a
 * document. A WYSIWYG would let someone paste a heading or a table into a slot
 * built for one paragraph and break the page. A plain textarea per block cannot.
 *
 * Entities were converted to real characters on extraction: JSX renders
 * `&rsquo;` as an apostrophe, but a JavaScript string would print it literally.
 */
export interface CopyBlock extends Sourced {
  id: string;
  /** Which page and section this appears in. Shown in the admin list. */
  label: string;
  body: string;
  order: number;
}

export const copyBlocks: CopyBlock[] = [
  {
    id: "legacy-origins-0",
    label: "LegacyOrigins",
    body:
      "Building the Physical Ground for Karnataka\u2019s Early Civic Life",
    order: 0,
    status: "approved",
  },
  {
    id: "legacy-origins-1",
    label: "LegacyOrigins",
    body:
      "Establishing the operational standards that earned the trust of state departments and public institutions.",
    order: 1,
    status: "approved",
  },
  {
    id: "legacy-pivot-0",
    label: "LegacyPivot",
    body:
      "Investing in first-party German hangar assets to eliminate sub-rental middlemen and guarantee structural safety.",
    order: 2,
    status: "approved",
  },
  {
    id: "legacy-pivot-1",
    label: "LegacyPivot",
    body:
      "When India initiated economic liberalization in 1991, Bengaluru rapidly emerged as the nation\u2019s technology capital. International delegations, multinational IT conglomerates, and large industrial expos demanded infrastructure that met European safety and aesthetic criteria.",
    order: 3,
    status: "approved",
  },
  {
    id: "legacy-trust-0",
    label: "LegacyTrust",
    body:
      "In an industry where tight deadlines frequently tempt contractors into structural shortcuts, Raja Enterprises operates with engineering conservatism.",
    order: 4,
    status: "approved",
  },
  {
    id: "legacy-trust-1",
    label: "LegacyTrust",
    body:
      "Structures are engineered for monsoon wind loading and for the crowd densities these events actually carry. Safety documentation is prepared per job and issued with the build.",
    order: 5,
    status: "approved",
  },
  {
    id: "legacy-trust-2",
    label: "LegacyTrust",
    body:
      "We reject cheap secondary metal scrap. Every aluminum beam is traceable to certified 6061-T6 metallurgical standards with verified tensile and shear thresholds.",
    order: 6,
    status: "approved",
  },
  {
    id: "legacy-trust-3",
    label: "LegacyTrust",
    body:
      "The crew raising these structures is on Raja\u2019s own payroll rather than subcontracted, which is why the same people return to the same clients.",
    order: 7,
    status: "approved",
  },
  {
    id: "legacy-evolution-0",
    label: "LegacyEvolution",
    body:
      "How Indian event engineering evolved from temporary artisanal shamianas into high-precision modular structural civil engineering.",
    order: 8,
    status: "approved",
  },
];

const INDEX = new Map(copyBlocks.map((b) => [b.id, b.body]));

/** Seed text for a block. The store overlays anything the admin has saved. */
export const seedCopy = (id: string): string => INDEX.get(id) ?? "";
