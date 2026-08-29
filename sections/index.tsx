import {
  getCapabilities,
  getClientEvents,
  getClients,
  getCollage,
  getContact,
  getHero,
  getProcessSteps,
  getProjects,
  getStats,
} from "@/lib/store";

import { CapabilitiesView } from "./Capabilities";
import { HeroView } from "./Hero";
import { ClientsView } from "./Clients";
import { LegacyView } from "./Legacy";
import { ProcessView } from "./Process";
import { ResourcesView } from "./Resources";
import { WorksView } from "./Works";

/**
 * Server wrappers.
 *
 * Each section's motion lives in a client component that receives its data as
 * props; these read that data. Splitting them this way is what lets the CMS
 * exist at all — a `"use client"` section cannot open a SQLite connection —
 * without pushing the content fetch into a `useEffect` and giving up
 * server rendering, which on a marketing page would cost the LCP.
 */
export function Hero() {
  return <HeroView hero={getHero()} />;
}

export function Capabilities() {
  return <CapabilitiesView capabilities={getCapabilities()} />;
}

export function Works() {
  return <WorksView projects={getProjects()} />;
}

export function Process() {
  return <ProcessView processSteps={getProcessSteps()} />;
}

export function Legacy() {
  return <LegacyView collage={getCollage()} />;
}

export function Resources() {
  return <ResourcesView stats={getStats()} />;
}

export function Clients() {
  return (
    <ClientsView clients={getClients()} contact={getContact()} events={getClientEvents()} />
  );
}
