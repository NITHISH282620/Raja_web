import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutInventoryBento } from "@/components/about/AboutInventoryBento";
import { AboutMilestones } from "@/components/about/AboutMilestones";
import { AboutPrinciples } from "@/components/about/AboutPrinciples";
import { FOUNDED_YEAR } from "@/content/company";
import { getPrinciples, getTimeline, getMilestones, getInventoryHighlights, pageImage } from "@/lib/store";
import { abs } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About Us — 49 Years of Physical Infrastructure",
  description: `Event infrastructure contractor in Bengaluru since ${FOUNDED_YEAR}. Owned German hangars, flooring, staging and stalls, installed by an in-house crew.`,
  alternates: { canonical: abs("/about") },
};

export default async function AboutPage() {
  // Six independent reads with no dependency between them — run concurrently
  // rather than as six sequential round trips to Neon.
  const [primary, secondary, eras, highlights, milestones, principles] = await Promise.all([
    pageImage("about-hero-primary"),
    pageImage("about-hero-secondary"),
    getTimeline(),
    getInventoryHighlights(),
    getMilestones(),
    getPrinciples(),
  ]);
  return (
    <main id="main" className="relative w-full bg-paper">
      <AboutHero primary={primary} secondary={secondary} />
      <AboutTimeline eras={eras} />
      <AboutInventoryBento highlights={highlights} />
      <AboutMilestones milestones={milestones} />
      <AboutPrinciples principles={principles} />
    </main>
  );
}
