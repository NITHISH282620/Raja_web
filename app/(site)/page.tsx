import { EventsWeBuildFor, RecentExecutions, Hero, Legacy, Resources, Works, Clients } from "@/sections";

/**
 * Homepage narrative flow:
 *
 * 01 HERO         - Full Raja film, scale + positioning
 * 02 LEGACY       - 1977 to present (sticky pinned on desktop, editorial on mobile)
 * 03 WORKS        - Proof of execution, notable projects
 * 04 RESOURCES    - Scale / capacity / infrastructure numbers
 * 05 EVENTS       - Core event typologies
 * 06 RECENT       - Recent build showcases
 * 07 CLIENTS      - Real organizations/events + CTA
 */
export const dynamic = "force-static";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Legacy />
      {/* This wrapper ensures all sections after Legacy have a solid
          background and higher z-index to cover the sticky Legacy section */}
      <div className="relative z-20 bg-paper">
        <Works />
        <Resources />
        <EventsWeBuildFor />
        <RecentExecutions />
        <Clients />
      </div>
    </main>
  );
}