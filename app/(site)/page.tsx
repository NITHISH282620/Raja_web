import { Capabilities, EventsWeBuildFor, RecentExecutions, Hero, Legacy, Process, Resources, Works, Clients } from "@/sections";

/**
 * Homepage narrative flow:
 *
 * 01 HERO         - Full Raja film, scale + positioning
 * 02 LEGACY       - 1977 to present (sticky pinned on desktop, editorial on mobile)
 * 03 CAPABILITIES - What we physically build
 * 04 WORKS        - Proof of execution, notable projects
 * 05 RESOURCES    - Scale / capacity / infrastructure numbers
 * 06 PROCESS      - How Raja executes
 * 07 EVENTS       - Core event typologies
 * 08 RECENT       - Recent build showcases
 * 09 CLIENTS      - Real organizations/events + CTA
 */
export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Legacy />
      {/* This wrapper ensures all sections after Legacy have a solid
          background and higher z-index to cover the sticky Legacy section */}
      <div className="relative z-20 bg-paper">
        <Capabilities />
        <Works />
        <Resources />
        <Process />
        <EventsWeBuildFor />
        <RecentExecutions />
        <Clients />
      </div>
    </main>
  );
}