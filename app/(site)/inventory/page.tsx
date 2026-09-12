import type { Metadata } from "next";
import { InventoryHero } from "@/components/inventory/InventoryHero";
import { InventoryShowcase } from "@/components/inventory/InventoryShowcase";
import { InventoryEstimator } from "@/components/inventory/InventoryEstimator";
import { InventoryCompliance } from "@/components/inventory/InventoryCompliance";
import { getCatalog } from "@/lib/store";

export const metadata: Metadata = {
  title: "Inventory & Systems — Direct Owned Physical Assets | Raja Enterprises",
  description:
    "German clear-span hangers, modular wooden flooring, VIP staging, scaffolding, and mobile HVAC — directly owned by Raja Enterprises and deployed pan-India.",
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
