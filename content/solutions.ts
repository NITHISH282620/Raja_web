import type { ProjectCategory } from "./projects";

/**
 * Buyer-side solution pages.
 *
 * WHY THESE EXIST SEPARATELY FROM SERVICES. `content/services.ts` is organised
 * the way Raja thinks about the business — hangers, flooring, staging, stalls,
 * scaffolding. That is the right structure for someone who already knows what
 * they need to hire. It is the wrong structure for the buyer this site is
 * trying to win, who does not arrive looking for "clear-span structures"; they
 * arrive with an exhibition to open in eleven weeks, and they want to know
 * whether one company can do the whole ground.
 *
 * So these pages are the same capabilities indexed by occasion instead of by
 * product, each one ending at the same brief form. Services stay as they are.
 *
 * EVIDENCE. Every page draws its proof from `content/projects.ts` by category
 * rather than restating achievements in prose, so a page cannot claim work that
 * the project record does not contain. If the record is thin for a category,
 * the page shows fewer projects — it does not invent them.
 *
 * CLAIMS. Capacity figures quoted here come from the approved inventory
 * schedule and nowhere else. Nothing on these pages asserts a certification, a
 * project value, a client relationship or an engineering rating.
 */

export interface SolutionSection {
  heading: string;
  body: string;
  /** Concrete deliverables. Physical things, not adjectives. */
  items?: string[];
}

export interface Solution {
  slug: string;
  /** Short label, used in the "Who We Build For" grid and in breadcrumbs. */
  label: string;
  /** Page H1. */
  title: string;
  /** The single line under the H1, and the meta description. */
  summary: string;
  /** Who this page is written for, named plainly. */
  audience: string;
  /** Pulls real projects onto the page. */
  category: ProjectCategory;
  /**
   * Optional hero override.
   *
   * Left unset, the page and the index card borrow the category banner from
   * `content/projects.ts`, which is how this has always worked. Setting it lets
   * the owner give one solution its own photograph without that meaning every
   * solution needs one — a per-page image that has to be filled in before the
   * page looks right is a worse default than a shared one that already does.
   */
  image?: string;
  /** What Raja actually installs for this kind of event. */
  scope: string[];
  sections: SolutionSection[];
  /** Page title WITHOUT the brand: the root layout appends
   *  " — Raja Enterprises" via its title template, and repeating it here
   *  produced titles of 80-96 characters, well past what a result page shows. */
  seoTitle: string;
  seoDescription: string;
}

export const solutions: Solution[] = [
  {
    slug: "corporate-events",
    label: "Corporate events",
    title: "Corporate event infrastructure",
    summary:
      "Annual meets, leadership summits, dealer conferences, town halls and product launches — built as physical infrastructure, not organised as an occasion.",
    audience:
      "Corporate marketing and communications teams, event and administration teams, and procurement.",
    category: "corporate",
    scope: [
      "Clear-span structures for company gatherings held away from a hall",
      "Levelled and decked flooring over uneven ground, lawn or car park",
      "Main stage, back-of-house and speaker access platforms",
      "Seating layouts, aisles and barricaded circulation",
      "Registration, lounge and hospitality structures",
      "Lighting and AV support structures, cable management and covered runs",
      "Installation, on-site crew through the event, and dismantling",
    ],
    sections: [
      {
        heading: "What a corporate buyer is actually procuring",
        body:
          "Most corporate event budgets are spent on things that have to be physically installed and taken away again: a covered space, a level floor, a stage that will hold a set, seating that meets the room plan, and the crew who put all of it up. Raja supplies those directly rather than sub-contracting them, which is why the same company can be accountable for the ground from survey to strike.",
      },
      {
        heading: "Where corporate events get built",
        body:
          "Hotel lawns, factory and campus grounds, car parks, plant sites and open land are all common, and none of them arrive level, covered or serviced. That is the work: a site becomes a venue because a floor, a roof, a stage and a power route were installed on it.",
        items: [
          "Company grounds and manufacturing campuses",
          "Hotel lawns and open forecourts",
          "Convention centre forecourts and overflow areas",
          "Open ground with no permanent structure at all",
        ],
      },
      {
        heading: "How the engagement runs",
        body:
          "A site visit and a measured plan first, then a scope that names quantities rather than adjectives, then installation to a dated schedule with Raja's own crew on site for the duration. Send a brief, an RFP or a BOQ and the reply will be against your numbers.",
      },
    ],
    seoTitle: "Corporate Event Infrastructure in Bengaluru",
    seoDescription:
      "Structures, flooring, staging and seating for annual meets, leadership summits, dealer meets and town halls. Owned inventory and in-house crew, Bengaluru, since 1977.",
  },
  {
    slug: "exhibitions-and-trade-fairs",
    label: "Exhibitions & trade fairs",
    title: "Exhibition and trade fair infrastructure",
    summary:
      "Temporary halls, stall systems, aisles and visitor infrastructure — built, run and dismantled to the organiser's dates.",
    audience:
      "Exhibition organisers, trade fair operators, industry associations and exhibiting brands.",
    category: "exhibition",
    scope: [
      "Octanorm and Maxima modular stall systems",
      "Custom-fabricated stalls and display environments",
      "Fascia, name boards, and stall lighting",
      "Clear-span temporary halls where permanent space runs out",
      "Raised and levelled exhibition flooring, carpeting and aisle build",
      "Registration, entry and visitor circulation infrastructure",
      "Barricading, queue management and crowd routing",
      "Installation, running maintenance, and dismantling to schedule",
    ],
    sections: [
      {
        heading: "The organiser's problem is dates, not design",
        body:
          "An exhibition floor has to exist completely on the morning it opens and be gone by the contracted strike time, with hundreds of separate stalls handed to hundreds of separate exhibitors in between. That is a logistics and manpower problem before it is a design one. Raja's stock and crew are its own, so the schedule is not dependent on a chain of sub-contractors each holding a different piece of it.",
      },
      {
        heading: "Modular and custom, from one supplier",
        body:
          "Octanorm and Maxima cover the shell-scheme floor efficiently and are what most exhibitors expect. Custom fabrication covers the anchor stands that carry the show. Running both from one yard means the aisles line up, the fascia matches and the dismantle is one operation rather than several.",
        items: [
          "Shell scheme in Octanorm or Maxima, with fascia and lighting",
          "Custom-built stands for principal exhibitors",
          "Consistent aisle widths, carpeting and signage lines",
          "One installation crew and one dismantling schedule",
        ],
      },
      {
        heading: "When the permanent hall is not enough",
        body:
          "Where a show outgrows its built space, clear-span structures add usable, column-free floor next to it on the same footing — the same structures used for the temporary venues elsewhere on this site, serving as overflow halls, registration wings or covered concourses.",
      },
    ],
    seoTitle: "Exhibition & Stall Infrastructure, Bengaluru",
    seoDescription:
      "Octanorm and Maxima stalls, custom fabrication, temporary halls, exhibition flooring, barricading and visitor infrastructure for trade fairs in Bengaluru and across India.",
  },
  {
    slug: "conferences-and-summits",
    label: "Conferences & summits",
    title: "Conference and summit infrastructure",
    summary:
      "Column-free assembly space, tiered and flat seating, plenary staging and delegate circulation for programmes measured in thousands.",
    audience:
      "Conference organisers, professional bodies, institutions and government programme teams.",
    category: "conference",
    scope: [
      "Clear-span structures giving column-free plenary floor",
      "Plenary staging, podium and speaker access",
      "Flat and raked seating layouts with defined aisles",
      "Breakout and session spaces built off the main structure",
      "Delegate registration, holding and circulation areas",
      "Camera platforms, lighting positions and AV support structures",
      "Flooring, cable protection and covered walkways between blocks",
    ],
    sections: [
      {
        heading: "Sightlines are a structural decision",
        body:
          "A conference is one of the few event types where the roof structure directly determines whether the programme works: a column standing in the middle of a plenary floor removes a block of seats and a section of the audience's view of the stage. Clear-span structures are used here precisely because they put nothing between the delegate and the platform.",
      },
      {
        heading: "A programme is several venues at once",
        body:
          "Plenary, breakouts, registration, dining and holding areas all have to exist at the same time, be reachable from one another under cover, and be built on the same site within the same window.",
        items: [
          "One main assembly structure with defined seating",
          "Smaller structures for parallel sessions",
          "Covered links so delegates move between them under roof",
          "Registration and holding built for arrival peaks",
        ],
      },
    ],
    seoTitle: "Conference & Summit Infrastructure",
    seoDescription:
      "Clear-span assembly structures, plenary staging, seating and delegate circulation for conferences and summits. Owned inventory and in-house crew, Bengaluru, since 1977.",
  },
  {
    slug: "brand-and-product-launches",
    label: "Brand & product launches",
    title: "Brand and product launch infrastructure",
    summary:
      "Controlled, covered environments built on sites that have none — for launches, activations and reveals where the space itself is part of the presentation.",
    audience:
      "Brand teams, marketing teams, experiential and brand activation agencies.",
    category: "corporate",
    scope: [
      "Clear-span structures on open or unfinished sites",
      "Reveal staging, ramps and platform build",
      "Levelled flooring and decking, including over rough ground",
      "Controlled entry, queueing and guest circulation",
      "Lighting and rigging support structures",
      "Camera and broadcast platforms",
      "Overnight installation windows where the site is in use by day",
    ],
    sections: [
      {
        heading: "The site is usually the constraint",
        body:
          "Launches happen where the product is — a plant, a plot, a showroom forecourt, a project site — rather than where a venue happens to be. The infrastructure is what makes those places usable for a few hours: a floor over broken ground, a roof against weather, a stage that will take the load, and a route the guest can actually walk.",
      },
      {
        heading: "Built to a fixed hour",
        body:
          "A reveal has a time on it. Raja works to installation schedules with the crew on site, including night builds where the location cannot be closed during working hours.",
      },
    ],
    seoTitle: "Product Launch & Activation Infrastructure",
    seoDescription:
      "Temporary structures, staging, flooring and controlled guest environments for product launches and brand activations in Bengaluru and across India.",
  },
  {
    slug: "institutional-and-cultural-events",
    label: "Institutional & cultural",
    title: "Institutional and cultural event infrastructure",
    summary:
      "Public-scale gatherings, state programmes, festivals and temple-town events, built on open ground and dismantled without trace.",
    audience:
      "Government departments, public institutions, trusts, universities and festival committees.",
    category: "cultural",
    scope: [
      "Large-span covered assembly for open-ground gatherings",
      "Public seating, barricading and controlled circulation",
      "Main stage and dignitary platforms",
      "Flooring and walkway build over unmade ground",
      "Entry gantries and queue infrastructure",
      "Deployment to sites away from the city, with the crew travelling",
    ],
    sections: [
      {
        heading: "Public scale is a different problem",
        body:
          "Public and institutional gatherings are held where the people are, which is frequently a field, a temple town or a heritage site with no permanent facilities and limited access. The infrastructure has to be transported in, built on ground as found, hold a public crowd safely, and leave the site as it was.",
      },
      {
        heading: "Working away from base",
        body:
          "Raja's engagement record includes work outside Bengaluru on open and hill sites. Deployment away from the yard is a normal operating mode rather than an exception, which matters when the venue is a location rather than a building.",
      },
    ],
    seoTitle: "Institutional & Cultural Infrastructure",
    seoDescription:
      "Covered assembly, public seating, staging and circulation for state programmes, festivals and institutional gatherings on open ground. Raja Enterprises, Bengaluru, since 1977.",
  },
];

export const findSolution = (slug: string): Solution | undefined =>
  solutions.find((s) => s.slug === slug);
