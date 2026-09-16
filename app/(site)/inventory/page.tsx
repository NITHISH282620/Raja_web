import type { Metadata } from "next";
import { InventoryHero } from "@/components/inventory/InventoryHero";
import { InventoryShowcase } from "@/components/inventory/InventoryShowcase";
import { InventoryEstimator } from "@/components/inventory/InventoryEstimator";
import { InventoryCompliance } from "@/components/inventory/InventoryCompliance";
import { getCatalog } from "@/lib/store";
import { abs } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Inventory & Systems — Raja Enterprises, Bengaluru",
  description:
    "German clear-span hangars, modular wooden flooring, VIP staging, scaffolding, and mobile HVAC — directly owned by Raja Enterprises and deployed pan-India.",
  alternates: { canonical: abs("/inventory") },
};

export default async function InventoryPage() {
  const categories = await getCatalog();

  return (
    <main id="main" className="relative w-full bg-paper">
      <InventoryHero />
      <InventoryShowcase categories={categories} />
      <InventoryEstimator />
      <InventoryCompliance />
    </main>
  );
}
