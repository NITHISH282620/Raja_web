import type { Sourced } from "./types";

/**
 * The partners page.
 *
 * Lifted out of `app/(site)/partners/page.tsx`, where these two lists were
 * hardcoded constants. Copy that a business will want to reword — its own
 * pitch to agencies, most of all — should never have lived inside a route
 * file, because rewording it meant a developer and a deploy.
 *
 * The wording below is unchanged from what the page already showed.
 */

export interface PartnerPoint extends Sourced {
  id: string;
  heading: string;
  body: string;
  order: number;
}

export const partnerPoints: PartnerPoint[] = [
{
    id: "the-stock-is-ours",
    heading: "The stock is ours",
    body:
      "Structures, flooring, staging, stalls, seating and barricading come out of Raja's own yard rather than being re-hired from someone else's. One less chain between your commitment to a client and the thing arriving on site.",
    order: 0,
    status: "approved",
  },
    {
    id: "the-crew-is-ours",
    heading: "The crew is ours",
    body:
      "Installation is done by Raja's own field crew, who travel with the stock. Scheduling, supervision and the strike are handled by the same organisation that supplied the material.",
    order: 0,
    status: "approved",
  },
    {
    id: "we-stay-behind-your-name",
    heading: "We stay behind your name",
    body:
      "Raja is the infrastructure partner, not a competing agency. The client relationship, the creative and the credit stay yours; we are accountable to you for the ground.",
    order: 0,
    status: "approved",
  },
    {
    id: "one-scope-instead-of-six-vendors",
    heading: "One scope instead of six vendors",
    body:
      "Hangars, floor, stage, stalls, seating and access structures under one scope and one schedule, so co-ordination between trades is our problem rather than a line on your critical path.",
    order: 0,
    status: "approved",
  },
];

export interface PartnerStep extends Sourced {
  id: string;
  label: string;
  order: number;
}

export const partnerSteps: PartnerStep[] = [
  { id: "step-0", label: "Send the brief, the floor plan or the BOQ — whatever stage it is at", order: 0, status: "approved" },
  { id: "step-1", label: "We survey the site and come back with quantities against your drawing", order: 1, status: "approved" },
  { id: "step-2", label: "One scope, one schedule, one point of contact through the build", order: 2, status: "approved" },
  { id: "step-3", label: "Our crew installs, stays through the event, and dismantles to your strike time", order: 3, status: "approved" },
];
