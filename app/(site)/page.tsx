import { Capabilities, Clients, Hero, Legacy, Process, Resources, Works } from "@/sections";

/**
 * Homepage — narrative flow:
 *
 * 01 HERO        — Full Raja film, scale + positioning
 * 02 LEGACY      — 1977 → present (moved up per user request)
 * 03 CAPABILITIES — What we physically build
 * 04 WORKS       — Proof of execution, notable projects
 * 05 RESOURCES   — Scale / capacity / infrastructure numbers
 * 06 PROCESS     — How Raja executes
 * 07 CLIENTS     — Real organizations/events + CTA
 *
 * Sections own their own markup, content and motion. Nothing is orchestrated
 * from here on purpose — the 19s Figma cohort is decomposed into local
 * timelines so any one of them can be retimed or removed in isolation.
 */
export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Legacy />
      <Capabilities />
      <Works />
      <Resources />
      <Process />
      <Clients />
    </main>
  );
}
