import Link from "next/link";
import { yearsInOperation } from "@/content/company";

export function LegacyTrust() {
  return (
    <section className="relative w-full bg-paper py-16 sm:py-24 md:py-32 border-t border-ink/10">
      <div className="frame">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-12 sm:mb-16 max-w-3xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink/60">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>Chapter 04: The Safety Benchmark</span>
          </div>
          <h2 className="t-statement text-ink text-balance font-semibold">
            The Unbroken Record. <br />
            <span className="text-brand-blue">{yearsInOperation()} Years Without a Structural Incident.</span>
          </h2>
          <p className="t-body text-body-light leading-relaxed max-w-[50ch]">
            In an industry where tight deadlines frequently tempt contractors into structural shortcuts, Raja Enterprises operates with engineering conservatism.
          </p>
        </div>

        {/* 3 Safety Pillars */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-2xl border border-ink/10 bg-white p-6 sm:p-8 shadow-xs">
            <p className="font-mono text-3xl sm:text-4xl font-bold text-accent mb-2">0</p>
            <h3 className="text-base sm:text-lg font-semibold text-ink mb-2">Structural Failures</h3>
            <p className="text-xs sm:text-sm text-body-light leading-relaxed">
              Across 49 years and over 10,000 completed event builds—through severe monsoons, squalls, and extreme crowd densities—not a single Raja Enterprises hangar or stage has ever failed.
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-6 sm:p-8 shadow-xs">
            <p className="font-mono text-3xl sm:text-4xl font-bold text-brand-blue mb-2">100%</p>
            <h3 className="text-base sm:text-lg font-semibold text-ink mb-2">Certified Extrusions</h3>
            <p className="text-xs sm:text-sm text-body-light leading-relaxed">
              We reject cheap secondary metal scrap. Every aluminum beam is traceable to certified 6061-T6 metallurgical standards with verified tensile and shear thresholds.
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-6 sm:p-8 shadow-xs">
            <p className="font-mono text-3xl sm:text-4xl font-bold text-ink mb-2">460</p>
            <h3 className="text-base sm:text-lg font-semibold text-ink mb-2">Permanent Payroll Guild</h3>
            <p className="text-xs sm:text-sm text-body-light leading-relaxed">
              Our safety record is sustained by permanent crew members—many of whom have been with Raja for 15 to 25 years. They know the rigging, torque tolerances, and wind vectors by heart.
            </p>
          </div>
        </div>

        {/* Closing Archival Quote Box */}
        <div className="rounded-2xl sm:rounded-3xl border border-brand-blue/20 bg-brand-blue/5 p-8 sm:p-12">
          <div className="max-w-3xl space-y-4">
            <p className="font-mono text-xs uppercase tracking-widest text-brand-blue font-semibold">
              The Founding Creed · Est. 1977
            </p>
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-serif italic text-ink leading-snug">
              &ldquo;We don&rsquo;t build tents to decorate a ceremony. We engineer the physical sanctuary where human lives, heads of state, and historical moments stand safe.&rdquo;
            </blockquote>
            <p className="text-xs font-mono uppercase tracking-wider text-ink/60 pt-2">
              — Raju &amp; Venkat, Founders, Raja Enterprises
            </p>

            <div className="pt-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-mono font-medium text-white transition-all duration-300 hover:bg-brand-blue hover:shadow-md"
              >
                <span>Consult with Our Senior Engineering Directors</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
