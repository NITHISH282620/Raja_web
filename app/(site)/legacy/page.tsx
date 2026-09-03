import type { Metadata } from "next";
import { LegacyHero } from "@/components/legacy/LegacyHero";
import { LegacyOrigins } from "@/components/legacy/LegacyOrigins";
import { LegacyPivot } from "@/components/legacy/LegacyPivot";
import { LegacyEvolution } from "@/components/legacy/LegacyEvolution";
import { LegacyTrust } from "@/components/legacy/LegacyTrust";
import { FOUNDED_YEAR } from "@/content/company";

export const metadata: Metadata = {
  title: "Legacy — 49 Years of Physical Execution (1977–2026)",
  description: `Raja Enterprises, established ${FOUNDED_YEAR} in Bengaluru — four decades of engineering the temporary cities and physical ground where India gathers.`,
};

export default function LegacyPage() {
  return (
    <main id="main" className="relative w-full overflow-x-hidden bg-paper">
      <LegacyHero />
      <LegacyOrigins />
      <LegacyPivot />
      <LegacyEvolution />
      <LegacyTrust />
    </main>
  );
}
