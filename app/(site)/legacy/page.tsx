import type { Metadata } from "next";
import Image from "next/image";
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

      <figure className="frame mt-[clamp(20px,3vw,44px)]">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[20px] bg-ink/5">
          <Image src="/media/events/kanha-canopy-assembly-aerial.56be51e1.webp" alt="Aerial view over an immense clear-span canopy sheltering a seated assembly of many thousands." fill priority sizes="(max-width: 1024px) 96vw, 1280px" className="object-cover" />
        </div>
        <figcaption className="t-body-sm mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-light">
          <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white">
            Project photograph
          </span>
          <span>Clear-span cover over a full assembly — the scale Raja builds at today.</span>
        </figcaption>
      </figure>

      <LegacyHero />
      <LegacyOrigins />
      <LegacyPivot />
      <LegacyEvolution />
      <LegacyTrust />
    </main>
  );
}
