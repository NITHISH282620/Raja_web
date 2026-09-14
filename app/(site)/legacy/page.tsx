import type { Metadata } from "next";
import { LegacyHero } from "@/components/legacy/LegacyHero";
import { LegacyOrigins } from "@/components/legacy/LegacyOrigins";
import { LegacyTimeline } from "@/components/legacy/LegacyTimeline";
import { LegacyPivot } from "@/components/legacy/LegacyPivot";
import { LegacyEvolution } from "@/components/legacy/LegacyEvolution";
import { LegacyTrust } from "@/components/legacy/LegacyTrust";
import { FOUNDED_YEAR } from "@/content/company";
import { LegacyChoreographer } from "@/components/legacy/LegacyChoreographer";
import { pageImage } from "@/lib/store";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Legacy — 49 Years of Physical Execution (1977–2026)",
  description: `Raja Enterprises, established ${FOUNDED_YEAR} in Bengaluru — four decades of engineering the temporary cities and physical ground where India gathers.`,
  alternates: { canonical: abs("/legacy") },
};

export default async function LegacyPage() {
  const heroImage = await pageImage("legacy-hero");

  return (
    <main id="main" className="relative w-full bg-paper">
      <LegacyChoreographer />
      <LegacyHero imageSrc={heroImage?.image ?? /media/projects/2x/la-renon-company-event.webp} />
      <LegacyOrigins />
      <LegacyTimeline />
      <LegacyPivot />
      <LegacyEvolution />
      <LegacyTrust />
    </main>
  );
}
