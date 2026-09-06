import {
  getCapabilities,
  getClientEvents,
  getClients,
  getCollage,
  getContact,
  getHero,
  getProcessSteps,
  getProjects,
  getSchedule,
  getEventFormats,
  getRecentEvents,
  getInventoryTiles,
  pageImage,
} from "@/lib/store";

import { CapabilitiesView } from "./Capabilities";
import { HeroView } from "./Hero";
import { ClientsView } from "./Clients";
import { LegacyView } from "./Legacy";
import { ProcessView } from "./Process";
import { ResourcesView } from "./Resources";
import { WorksView } from "./Works";
import { EventsWeBuildForView } from "./Events";
import { RecentExecutionsView } from "./RecentExecutions";

/**
 * Server wrappers.
 *
 * Each section's motion lives in a client component that receives its data as
 * props; these read that data. Splitting them this way is what lets the CMS
 * exist at all — a `"use client"` section cannot open a SQLite connection —
 * without pushing the content fetch into a `useEffect` and giving up
 * server rendering, which on a marketing page would cost the LCP.
 */
export async function Hero() {
  return <HeroView hero={await getHero()} poster={await pageImage("home-hero-poster")} />;
}

export async function Capabilities() {
  return <CapabilitiesView capabilities={await getCapabilities()} />;
}

export async function Works() {
  return <WorksView projects={await getProjects()} />;
}

export async function Process() {
  return <ProcessView processSteps={await getProcessSteps()} />;
}

export async function Legacy() {
  return <LegacyView collage={await getCollage()} />;
}

export async function Resources() {
  return <ResourcesView schedule={await getSchedule()} tiles={await getInventoryTiles()} />;
}

export async function Clients() {
  return (
    <ClientsView clients={await getClients()} contact={await getContact()} events={await getClientEvents()} />
  );
}

/** Server wrapper: reads the cards, the client view animates them. */
export async function EventsWeBuildFor() {
  return <EventsWeBuildForView formats={await getEventFormats()} />;
}
/** Server wrapper: reads the grid, the client view animates it. */
export async function RecentExecutions() {
  return <RecentExecutionsView events={await getRecentEvents()} />;
}
