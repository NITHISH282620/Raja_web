import { Capabilities, Clients, Hero, Legacy, Process, Resources, Works } from "@/sections";

/**
 * Homepage narrative flow:
 *
 * 01 HERO         - Full Raja film, scale + positioning
 * 02 LEGACY       - 1977 to present (sticky pinned, scroll-over reveal)
 * 03 CAPABILITIES - What we physically build (scrolls OVER Legacy)
 * 04 WORKS        - Proof of execution, notable projects
 * 05 RESOURCES    - Scale / capacity / infrastructure numbers
 * 06 PROCESS      - How Raja executes
 * 07 CLIENTS      - Real organizations/events + CTA
 *
 * The Legacy section uses position:sticky so it stays pinned while
 * the Capabilities section (and everything after) scrolls over it.
 * The cover-wrap div provides the z-index layer and opaque background
 * that ensures all subsequent sections properly cover the sticky Legacy.
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
        <Clients />
      </div>
    </main>
  );
}