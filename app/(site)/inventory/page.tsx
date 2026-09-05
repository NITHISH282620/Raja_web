import type { Metadata } from "next";
import { InventoryHero } from "@/components/inventory/InventoryHero";
import { InventoryCatalog } from "@/components/inventory/InventoryCatalog";
import { InventoryEstimator } from "@/components/inventory/InventoryEstimator";
import { InventoryCompliance } from "@/components/inventory/InventoryCompliance";

export const metadata: Metadata = {
  title: "Inventory & Systems — Direct Owned Physical Assets",
  description:
    "Explore 5,00,000 Sq. Ft. of German clear-span hangars, 10,00,000 Sq. Ft. of laser-aligned wooden flooring, 3,000 tons of mobile HVAC, and 1,00,000 RFT barricades. 100% owned by Raja Enterprises.",
};

export default function InventoryPage() {
  return (
    <main id="main" className="relative w-full bg-paper">
      <InventoryHero />
      <InventoryCatalog />
      <InventoryEstimator />
      <InventoryCompliance />
    </main>
  );
}
