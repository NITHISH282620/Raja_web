import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutInventoryBento } from "@/components/about/AboutInventoryBento";
import { AboutMilestones } from "@/components/about/AboutMilestones";
import { AboutPrinciples } from "@/components/about/AboutPrinciples";
import { FOUNDED_YEAR } from "@/content/company";
import { getPrinciples, getTimeline, getMilestones, getInventoryHighlights, pageImage } from "@/lib/store";

export const metadata: Metadata = {
  title: "About Us — 49 Years of Physical Infrastructure",
  description: `Event infrastructure contractor in Bengaluru since ${FOUNDED_YEAR}. Owned German hangers, flooring, staging and stalls, installed by an in-house crew.`,
};

export default async function AboutPage() {
  return (
    <main id="main" className="relative w-full bg-paper">
      <AboutHero primary={await pageImage("about-hero-primary")} secondary={await pageImage("about-hero-secondary")} />
      <AboutTimeline eras={await getTimeline()} />
      <AboutInventoryBento highlights={await getInventoryHighlights()} />
      <AboutMilestones milestones={await getMilestones()} />
      <AboutPrinciples principles={await getPrinciples()} />
    </main>
  );
}
