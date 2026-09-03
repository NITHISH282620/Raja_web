import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutInventoryBento } from "@/components/about/AboutInventoryBento";
import { AboutMilestones } from "@/components/about/AboutMilestones";
import { AboutPrinciples } from "@/components/about/AboutPrinciples";
import { FOUNDED_YEAR, yearsInOperation } from "@/content/company";

export const metadata: Metadata = {
  title: "About Us — 49 Years of Physical Infrastructure",
  description: `Since ${FOUNDED_YEAR}, Raja Enterprises has engineered and built the physical ground for India's largest gatherings, state ceremonies, and industrial expos. ${yearsInOperation()} years of direct asset ownership, in-house crew of 460 personnel, nationwide turnkey execution.`,
};

export default function AboutPage() {
  return (
    <main id="main" className="relative w-full overflow-x-hidden bg-paper">
      <AboutHero />
      <AboutTimeline />
      <AboutInventoryBento />
      <AboutMilestones />
      <AboutPrinciples />
    </main>
  );
}
