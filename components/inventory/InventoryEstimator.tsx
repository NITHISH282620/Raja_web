"use client";

import { useState } from "react";
import Link from "next/link";

interface EstimateRule {
  attendees: number;
  hangarSqFt: string;
  flooringSqFt: string;
  hvacTons: string;
  barricadeRft: string;
  stageSqFt: string;
  trucks: string;
  crew: string;
}

const ESTIMATES: Record<number, EstimateRule> = {
  2500: {
    attendees: 2500,
    hangarSqFt: "25,000",
    flooringSqFt: "30,000",
    hvacTons: "150",
    barricadeRft: "2,500",
    stageSqFt: "1,500",
    trucks: "3",
    crew: "25",
  },
  5000: {
    attendees: 5000,
    hangarSqFt: "50,000",
    flooringSqFt: "60,000",
    hvacTons: "300",
    barricadeRft: "5,000",
    stageSqFt: "3,000",
    trucks: "6",
    crew: "45",
  },
  15000: {
    attendees: 15000,
    hangarSqFt: "1,20,000",
    flooringSqFt: "1,50,000",
    hvacTons: "750",
    barricadeRft: "12,000",
    stageSqFt: "6,000",
    trucks: "12",
    crew: "90",
  },
  35000: {
    attendees: 35000,
    hangarSqFt: "2,50,000",
    flooringSqFt: "3,00,000",
    hvacTons: "1,500",
    barricadeRft: "25,000",
    stageSqFt: "12,000",
    trucks: "18",
    crew: "180",
  },
  50000: {
    attendees: 50000,
    hangarSqFt: "4,00,000+",
    flooringSqFt: "5,00,000+",
    hvacTons: "2,500+",
    barricadeRft: "50,000+",
    stageSqFt: "20,000+",
    trucks: "20+",
    crew: "350+",
  },
};

export function InventoryEstimator() {
  const [selectedCrowd, setSelectedCrowd] = useState<number>(15000);
  const estimate = ESTIMATES[selectedCrowd] || ESTIMATES[15000];

  return (
    <section className="relative w-full bg-paper py-16 sm:py-24 md:py-32 border-t border-ink/10">
      <div className="frame">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-12 sm:mb-16 max-w-3xl">
          <p className="t-eyebrow text-xs uppercase tracking-[0.2em] text-accent font-medium">
            Interactive Tool
          </p>
          <h2 className="t-statement text-ink text-balance font-semibold">
            Infrastructure Scale Estimator. <br className="hidden sm:inline" />
            <span className="text-brand-blue">Calculate Your Required Footprint.</span>
          </h2>
          <p className="t-body text-body-light leading-relaxed max-w-[50ch]">
            Select your anticipated delegate or public gathering scale to model the recommended structural clear-spans, ground leveling, cooling load, and mobilization requirements.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="rounded-2xl sm:rounded-3xl border border-ink/10 bg-white p-6 sm:p-10 md:p-12 shadow-sm">
          {/* Crowd Selector Buttons */}
          <div className="space-y-4 mb-10 pb-8 border-b border-ink/10">
            <label className="font-mono text-xs uppercase tracking-wider text-ink/70 block font-semibold">
              Step 1: Select Anticipated Attendance Scale
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[2500, 5000, 15000, 35000, 50000].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedCrowd(size)}
                  className={`p-4 rounded-xl border font-mono text-center transition-all duration-300 cursor-pointer ${
                    selectedCrowd === size
                      ? "bg-brand-blue text-white border-brand-blue shadow-md font-bold scale-[1.02]"
                      : "bg-neutral-50/80 border-ink/10 text-ink hover:bg-neutral-100"
                  }`}
                >
                  <p className="text-lg sm:text-xl">{size.toLocaleString()}+</p>
                  <p className={`text-[10px] uppercase tracking-wider ${selectedCrowd === size ? "text-white/80" : "text-ink/50"}`}>
                    Attendees
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-wider text-brand-blue font-semibold">
                Step 2: Recommended Structural Deployment Model ({selectedCrowd.toLocaleString()} Pax)
              </h3>
              <span className="text-xs font-mono text-ink/50">Based on Raja Field Standards</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Result 1: German Hangers */}
              <div className="rounded-xl border border-ink/10 bg-neutral-50 p-5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink/50 block mb-1">
                  German Clear-Span Hangers
                </span>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-ink">
                  {estimate.hangarSqFt}{" "}
                  <span className="text-xs font-normal text-brand-blue">Sq. Ft.</span>
                </p>
                <p className="text-xs text-body-light mt-1">Column-free covered pavilion area</p>
              </div>

              {/* Result 2: Wooden Flooring */}
              <div className="rounded-xl border border-ink/10 bg-neutral-50 p-5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink/50 block mb-1">
                  Laser-Aligned Wooden Floor
                </span>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-ink">
                  {estimate.flooringSqFt}{" "}
                  <span className="text-xs font-normal text-brand-blue">Sq. Ft.</span>
                </p>
                <p className="text-xs text-body-light mt-1">Multi-point laser leveled subfloor</p>
              </div>

              {/* Result 3: HVAC */}
              <div className="rounded-xl border border-ink/10 bg-neutral-50 p-5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink/50 block mb-1">
                  Temporary Mobile HVAC
                </span>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-ink">
                  {estimate.hvacTons}{" "}
                  <span className="text-xs font-normal text-brand-blue">Tons</span>
                </p>
                <p className="text-xs text-body-light mt-1">Chilling capacity with laminar ducting</p>
              </div>

              {/* Result 4: Barricades */}
              <div className="rounded-xl border border-ink/10 bg-neutral-50 p-5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink/50 block mb-1">
                  Iron Barricades &amp; Perimeters
                </span>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-ink">
                  {estimate.barricadeRft}{" "}
                  <span className="text-xs font-normal text-brand-blue">RFT</span>
                </p>
                <p className="text-xs text-body-light mt-1">Interlocking police-certified barriers</p>
              </div>

              {/* Result 5: Staging */}
              <div className="rounded-xl border border-ink/10 bg-neutral-50 p-5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink/50 block mb-1">
                  Engineered Stage &amp; Dais
                </span>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-ink">
                  {estimate.stageSqFt}{" "}
                  <span className="text-xs font-normal text-brand-blue">Sq. Ft.</span>
                </p>
                <p className="text-xs text-body-light mt-1">Tiered ceremonial platform &amp; ramps</p>
              </div>

              {/* Result 6: Fleet & Crew */}
              <div className="rounded-xl border border-ink/10 bg-neutral-50 p-5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink/50 block mb-1">
                  Logistics &amp; In-House Crew
                </span>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-ink">
                  {estimate.trucks}{" "}
                  <span className="text-xs font-normal text-brand-blue">Trucks</span>
                  {" · "}
                  {estimate.crew}{" "}
                  <span className="text-xs font-normal text-brand-blue">Crew</span>
                </p>
                <p className="text-xs text-body-light mt-1">Permanent specialists on site</p>
              </div>
            </div>

            {/* Direct Action */}
            <div className="pt-6 border-t border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-ink">Ready to verify availability for your dates?</p>
                <p className="text-xs text-body-light">
                  Our project directors review site topography, access roads, and municipal permits.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-xs font-mono font-medium text-white shadow-sm transition-all duration-300 hover:bg-ink hover:shadow-md shrink-0"
              >
                <span>Request Custom RFP for this Scale</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
