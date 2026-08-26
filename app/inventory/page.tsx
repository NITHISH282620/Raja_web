import type { Metadata } from "next";
import { PageMasthead, Band } from "@/components/PageShell";
import { InventoryTile } from "@/components/InventoryTile";
import { inventoryTiles } from "@/content/inventory";
import { inventorySchedule, services } from "@/content/inventorySchedule";

export const metadata: Metadata = {
  title: "Inventory",
  description:
    "Owned inventory, in-house crew, one contract. German hangers, wooden flooring, Octonorm and Maxima stalls, air-conditioning, staging, lighting and AV — deployed by Raja Enterprises.",
};

export default function InventoryPage() {
  return (
    <main id="main">
      <PageMasthead
        eyebrow={["What", "we deploy"]}
        statement={[
          { text: "Owned inventory. " },
          { text: "In-house", accent: true },
          { text: " crew. One contract." },
        ]}
        lead="Nothing here is sourced in when a job lands. It is owned, stored, maintained and deployed by our own crew, which is why a single contract covers the whole build."
      />

      {/* The schedule — the numbers behind the claim. */}
      <Band tone="ink">
        <div className="frame">
          <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-white/50">The inventory schedule</p>
          <dl className="flex flex-col">
            {inventorySchedule.map((line) => (
              <div
                key={line.item}
                data-band-item
                className="grid grid-cols-[1fr_auto] items-baseline gap-6 border-t border-white/12 py-[clamp(14px,1.7vw,24px)] last:border-b"
              >
                <dt className="t-stat-label text-white">{line.item}</dt>
                <dd className="m-0 text-right">
                  {line.capacity ? (
                    <span className="t-work text-white">
                      {line.capacity}
                      {line.unit && <span className="t-body ml-2 text-body-dark">{line.unit}</span>}
                    </span>
                  ) : (
                    <span className="t-eyebrow text-white/35">In fleet</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="t-body-sm mt-[clamp(18px,2vw,28px)] max-w-[62ch] text-body-dark">
            Capacities are Raja&rsquo;s own published operating figures. Items without a number are
            carried in the fleet but not quoted by area.
          </p>
        </div>
      </Band>

      {/* The systems themselves, reusing the homepage bento tiles. */}
      <Band>
        <div className="frame">
          <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-ink/50">The systems</p>
          <div className="grid gap-[15px] md:grid-cols-2 xl:grid-cols-3">
            {inventoryTiles.map((tile) => (
              <div key={tile.id} data-band-item className="min-h-[380px]">
                <InventoryTile tile={tile} />
              </div>
            ))}
          </div>
        </div>
      </Band>

      <Band tone="ink">
        <div className="frame">
          <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-white/50">Where it goes to work</p>
          <ul className="grid gap-x-10 gap-y-[clamp(10px,1.4vw,18px)] sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s} data-band-item className="t-work border-t border-white/12 pt-4 text-white">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </Band>
    </main>
  );
}
