import { notableEventsList } from "@/content/notableEvents";
import { Reveal } from "@/motion/Reveal";

export function PortfolioMatrix() {
  return (
    <section className="relative w-full bg-paper py-16 sm:py-24 md:py-32 border-t border-ink/10">
      <div className="frame">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-12 sm:mb-16 max-w-3xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink/60">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>Comparative Field Matrix</span>
          </div>
          <h2 className="t-statement text-ink text-balance font-semibold">
            Scale Benchmarks at a Glance. <br className="hidden sm:inline" />
            <span className="text-brand-blue">Direct Comparison Across Mandates.</span>
          </h2>
          <p className="t-body text-body-light leading-relaxed max-w-[50ch]">
            When comparing infrastructure contractors, turnaround windows and security clearances determine capability. Review the side-by-side performance record across our notable projects.
          </p>
        </div>

        {/* Matrix Table */}
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-ink/10 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-ink/10 bg-neutral-50/80 font-mono text-[11px] uppercase tracking-wider text-ink/60">
                <tr>
                  <th className="px-6 py-4">Event Mandate</th>
                  <th className="px-6 py-4">Venue &amp; Year</th>
                  <th className="px-6 py-4">Covered Area</th>
                  <th className="px-6 py-4">Turnaround Window</th>
                  <th className="px-6 py-4">Attendance Scale</th>
                  <th className="px-6 py-4">Security Level</th>
                </tr>
              </thead>
              <Reveal as="tbody" variant="growRule" className="divide-y divide-ink/10">
                {notableEventsList.map((ev) => (
                  <tr key={ev.id} className="transition-colors hover:bg-neutral-50/50">
                    <td className="px-6 py-4.5 font-semibold text-ink">
                      <div>{ev.title}</div>
                      <span className="text-[10px] font-mono text-brand-blue font-normal uppercase">
                        {ev.sectorLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 font-mono text-xs text-ink/70">
                      <div>{ev.venue}</div>
                      <span className="text-ink/40">{ev.year}</span>
                    </td>
                    <td className="px-6 py-4.5 font-mono font-bold text-ink">{ev.coveredArea}</td>
                    <td className="px-6 py-4.5 font-mono text-xs font-medium text-brand-blue">
                      {ev.turnaroundTime}
                    </td>
                    <td className="px-6 py-4.5 text-xs text-body-light">{ev.attendance}</td>
                    <td className="px-6 py-4.5 font-mono text-[11px] text-ink/60">
                      {ev.securityLevel}
                    </td>
                  </tr>
                ))}
              </Reveal>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
