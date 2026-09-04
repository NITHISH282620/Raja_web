import { complianceStandards } from "@/content/inventoryCatalog";
import { Reveal } from "@/motion/Reveal";

export function InventoryCompliance() {
  return (
    <section className="relative w-full bg-paper py-16 sm:py-24 md:py-32 border-t border-ink/10">
      <div className="frame">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-12 sm:mb-16 max-w-3xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink/60">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>Certified Safety &amp; Engineering</span>
          </div>
          <h2 className="t-statement text-ink text-balance font-semibold">
            Institutional Compliance. <br className="hidden sm:inline" />
            <span className="text-brand-blue">Tested to Extreme Structural Thresholds.</span>
          </h2>
          <p className="t-body text-body-light leading-relaxed max-w-[50ch]">
            In public gatherings exceeding tens of thousands, structural integrity cannot rely on guesswork. Raja Enterprises tests every batch of aluminum extrusion, membrane textile, and load-bearing timber against national and European safety standards.
          </p>
        </div>

        {/* Compliance Table */}
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-ink/10 bg-white shadow-xs mb-14">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-ink/10 bg-neutral-50/80 font-mono text-[11px] uppercase tracking-wider text-ink/60">
                <tr>
                  <th className="px-6 py-4">Standard / Test</th>
                  <th className="px-6 py-4">Asset Family</th>
                  <th className="px-6 py-4">Certified Rating</th>
                  <th className="px-6 py-4">Governing Authority</th>
                  <th className="px-6 py-4">Field Engineering Notes</th>
                </tr>
              </thead>
              <Reveal as="tbody" variant="growRule" className="divide-y divide-ink/10">
                {complianceStandards.map((item) => (
                  <tr key={item.standard} className="transition-colors hover:bg-neutral-50/50">
                    <td className="px-6 py-4.5 font-semibold text-ink">{item.standard}</td>
                    <td className="px-6 py-4.5 text-brand-blue font-mono text-xs">{item.category}</td>
                    <td className="px-6 py-4.5 font-mono font-bold text-ink">{item.rating}</td>
                    <td className="px-6 py-4.5 text-ink/70 font-mono text-xs">{item.authority}</td>
                    <td className="px-6 py-4.5 text-body-light text-xs max-w-[300px]">{item.notes}</td>
                  </tr>
                ))}
              </Reveal>
            </table>
          </div>
        </div>

        {/* Yard & Logistics Operational Grid */}
        <Reveal as="div" variant="fadeUp" select=":scope > div > *">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-ink/10 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-brand-blue font-semibold">
                Bengaluru Central Depot
              </span>
              <span className="h-2 w-2 rounded-full bg-accent" />
            </div>
            <p className="text-base font-semibold text-ink mb-2">Primary Staging &amp; Fabrication Yard</p>
            <p className="text-xs sm:text-sm text-body-light leading-relaxed">
              Centrally situated in Bengaluru with dedicated covered bays for German hangar inspection, timber platform reconditioning, and mobile HVAC chiller bench testing.
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-brand-blue font-semibold">
                Rigging Overhaul Routine
              </span>
              <span className="h-2 w-2 rounded-full bg-accent" />
            </div>
            <p className="text-base font-semibold text-ink mb-2">Pre-Deployment Stress Testing</p>
            <p className="text-xs sm:text-sm text-body-light leading-relaxed">
              Every aluminum beam, truss pin, and tie-down strap undergoes strict dye-penetrant and torque testing before dispatching to prevent micro-fissure fatigue.
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-brand-blue font-semibold">
                Rapid Mobilization SLA
              </span>
              <span className="h-2 w-2 rounded-full bg-accent" />
            </div>
            <p className="text-base font-semibold text-ink mb-2">48–72 Hour Subcontinent Dispatch</p>
            <p className="text-xs sm:text-sm text-body-light leading-relaxed">
              With 20 company-owned multi-axle trucks and permanent field crews on payroll, convoys mobilize within hours of tender confirmation for urgent national calls.
            </p>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
