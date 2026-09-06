import type { Metadata } from "next";
import { InventoryHero } from "@/components/inventory/InventoryHero";
import { InventoryCatalog } from "@/components/inventory/InventoryCatalog";
import { InventoryEstimator } from "@/components/inventory/InventoryEstimator";
import { InventoryCompliance } from "@/components/inventory/InventoryCompliance";
import { getCatalog } from "@/lib/store";

export const metadata: Metadata = {
  title: "Inventory & Systems — Direct Owned Physical Assets",
  description:
    "German clear-span hangers, wooden flooring, staging, mobile HVAC and barricading — owned outright by Raja Enterprises and deployed from its Bengaluru yard.",
};

export default async function InventoryPage() {
  return (
    <main id="main" className="relative w-full bg-paper">
      <InventoryHero />
      <InventoryCatalog categories={await getCatalog()} />
      <InventoryEstimator />
      <InventoryCompliance />
    </main>
  );
}
