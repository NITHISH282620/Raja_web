import type { Metadata } from "next";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { PortfolioMatrix } from "@/components/portfolio/PortfolioMatrix";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects — Government, Exhibition & Cultural Event Infrastructure",
  description:
    "State ceremonies, national trade expos, film festivals and tent cities built by Raja Enterprises since 1977 — covered area, attendance, turnaround and scope for each.",
  alternates: { canonical: abs("/projects") },
};

/**
 * The project index.
 *
 * Fact-led rather than photograph-led, and that is a decision rather than a
 * limitation: no cleared photography of Raja's own work exists yet, and a card
 * carrying licensed stock would present somebody else's event as evidence of
 * Raja's. Covered area, attendance, turnaround and protocol level are real,
 * verifiable, and to this buyer more persuasive than an image would be.
 *
 * Individual project pages arrive in V1.1, when cleared photographs do.
 */
export default function ProjectsPage() {
  return (
    <main id="main" className="relative w-full overflow-x-hidden bg-paper">
      <PortfolioHero />
      <PortfolioGrid />
      <PortfolioMatrix />
    </main>
  );
}
