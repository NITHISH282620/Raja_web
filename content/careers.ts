import type { Sourced } from "./types";

/**
 * The careers page.
 *
 * NO VACANCIES ARE INVENTED. Raja has not supplied a list of open roles, and a
 * careers page advertising positions that do not exist wastes the time of the
 * people it is meant to attract and damages the company with exactly the local
 * labour market it depends on.
 *
 * What the page does instead is what a contractor's careers page should do
 * anyway: describe the kinds of work the company employs people for, state
 * plainly that applications are read whether or not something is open, and give
 * one way to apply. The `roles` array below is the shape a vacancy takes —
 * add one and the page grows a listing section with no other change.
 */

export const careersIntro = {
  eyebrow: ["Work", "with us"] as const,
  statement: [
    { text: "The crew " },
    { text: "is the company", accent: true },
    { text: "." },
  ],
  lead: "Raja does not subcontract its builds, which means the people who put up the structures are on our payroll and have usually been here a long time. If you want to work on the biggest temporary structures in the country, this is where they are built.",
};

export interface Discipline {
  index: string;
  title: string;
  body: string;
}

/** The kinds of work the company actually employs people to do. */
export const disciplines: Discipline[] = [
  {
    index: "01",
    title: "Site crew",
    body: "Raising hangers and clear-span structures, laying wooden platforms and flooring, building and striking stalls. Physical work, on site, often to a fixed opening date.",
  },
  {
    index: "02",
    title: "Fabrication & workshop",
    body: "Preparing, maintaining and repairing the inventory between deployments — panels, frames, decking, staging and fascia.",
  },
  {
    index: "03",
    title: "Lighting, sound & AV",
    body: "Rigging truss, focusing lighting, running line-array sound and LED fascia through a live programme.",
  },
  {
    index: "04",
    title: "Project management",
    body: "Owning a build end to end: survey, drawings, schedule, labour, transport and handover, against a date that does not move.",
  },
  {
    index: "05",
    title: "Logistics & transport",
    body: "Loading, routing and running the fleet of twenty goods vehicles that carries the inventory to site anywhere in India.",
  },
  {
    index: "06",
    title: "Office & accounts",
    body: "Tendering, procurement, billing and the government paperwork that comes with public-sector work.",
  },
];

export interface Role extends Sourced {
  id: string;
  title: string;
  location: string;
  type: string;
  summary: string;
}

/**
 * Open positions. Empty on purpose — see the note at the top of this file.
 * Adding an entry makes the vacancies section appear on the page.
 */
export const roles: Role[] = [];

export const careersMeta: Sourced = {
  status: "pending",
  note: "No vacancy list supplied by Raja. The page states that applications are welcome rather than advertising roles that may not exist. Add entries to `roles` to publish real openings.",
};
