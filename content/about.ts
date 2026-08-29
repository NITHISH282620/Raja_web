import type { Sourced } from "./types";
import { FOUNDED_YEAR, yearsInOperation } from "./company";

/**
 * The About page.
 *
 * Written from what the site already asserts and can support — the founding
 * year, the owned inventory, the in-house crew, the buyer types, the venues on
 * record. Nothing here introduces a fact the rest of the site cannot stand
 * behind: no founder biography, no client testimonial, no award, no turnover
 * figure. Those are the four things a page like this usually invents, and each
 * of them is checkable by exactly the government and corporate buyers Raja
 * sells to.
 */

export const aboutIntro = {
  eyebrow: ["Who we", "are"] as const,
  statement: [
    { text: "A contractor, not a " },
    { text: "middleman", accent: true },
    { text: "." },
  ],
  lead: `Raja Enterprises has built the physical environment of India's largest gatherings since ${FOUNDED_YEAR}. We own the structures, employ the crew, and carry one contract from bare ground to handover.`,
};

export interface Principle extends Sourced {
  index: string;
  title: string;
  body: string;
}

/**
 * What actually separates Raja from the field.
 *
 * Each of these is a consequence of the same fact — ownership — rather than a
 * separate claim, which is why they can all be stated plainly.
 */
export const principles: Principle[] = [
  {
    index: "01",
    title: "We own what we deploy",
    body: "The hangers, flooring, staging, stalls and air-conditioning are ours. Nothing is hired in when a job lands, so nothing is subject to somebody else's availability, condition or price on the week you need it.",
    status: "approved",
  },
  {
    index: "02",
    title: "One crew, start to finish",
    body: "The same field team levels the ground, raises the structure, lays the floor and strikes it afterwards. There is no handover between trades, and no gap for a problem to fall into.",
    status: "approved",
  },
  {
    index: "03",
    title: "One contract, one accountable party",
    body: "Structures, flooring, staging, lighting, stalls and catering are quoted and delivered together. When something needs deciding at two in the morning, there is one number to call.",
    status: "approved",
  },
  {
    index: "04",
    title: "Built for the scale India actually runs at",
    body: `Ten lakh square feet of flooring, twenty owned goods vehicles and ${yearsInOperation()} years of doing this means a national congress or a state ceremony is a normal week rather than a stretch.`,
    status: "approved",
  },
];

export const aboutTimeline: { year: string; label: string; body: string }[] = [
  {
    year: String(FOUNDED_YEAR),
    label: "Founded in Bengaluru",
    body: "Raja Enterprises begins as a contractor for local functions and civic events in Karnataka.",
  },
  {
    year: "Growth",
    label: "Owned inventory",
    body: "The company moves from hiring in to owning its stock — imported German hangers, wooden floor platforms, Octonorm and Maxima stall systems, staging and air-conditioning.",
  },
  {
    year: "Now",
    label: "National deployment",
    body: "Twenty goods vehicles and a 300-strong field crew take the fleet wherever the programme is, from Vidhana Soudha to a levelled field outside the city.",
  },
];

export const aboutMeta: Sourced = {
  status: "provisional",
  note: "The middle timeline entry has no date because Raja has not supplied one. Dates for the move to owned inventory and the first national deployment would make this a much stronger page.",
};
