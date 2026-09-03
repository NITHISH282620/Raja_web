import type { Metadata } from "next";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { PortfolioMatrix } from "@/components/portfolio/PortfolioMatrix";

export const metadata: Metadata = {
  title: "Notable Events — Monumental Mandates & VIP Proof",
  description:
    "Explore case studies of state ceremonies, Prime Minister dedications, national trade expos, and 100,000-delegate temporary cities built by Raja Enterprises since 1977.",
};

export default function PortfolioPage() {
  return (
    <main id="main" className="relative w-full overflow-x-hidden bg-paper">
      <PortfolioHero />
      <PortfolioGrid />
      <PortfolioMatrix />
    </main>
  );
}
