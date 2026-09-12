import Link from "next/link";
import { yearsInOperation } from "@/content/company";
import { Reveal } from "@/motion/Reveal";
import { copyText } from "@/lib/store";

export async function LegacyTrust() {
  return (
    <section data-trust-section className="relative w-full bg-paper py-20 sm:py-28 md:py-36 overflow-hidden">
      {/* Ghost chapter numeral */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 -right-4 sm:-right-8 select-none leading-none font-mono font-black text-ink/[0.04] text-right"
        style={{ fontSize: "clamp(140px, 22vw, 320px)" }}
      >
        04
      </div>

      <div className="frame relative z-10">
        {/* Chapter eyebrow */}
        <div className="flex items-center gap-4 mb-10 sm:mb-14 justify-end">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">
            Chapter 04 · The Safety Benchmark
          </p>
          <span className="h-px flex-1 max-w-[60px] bg-accent" />
        </div>

        {/* Header */}
        <div data-trust-header className="flex flex-col gap-5 mb-14 sm:mb-20 max-w-3xl">
          <h2
            className="font-semibold tracking-tight text-ink text-balance"
            style={{ fontSize: "clamp(28px, 4vw, 52px)", lineHeight: 1.1 }}
          >
            The Unbroken Record.{" "}
            <span className="text-brand-blue">
              {yearsInOperation()} Years Without a Structural Incident.
            </span>
          </h2>
          <p className="text-base text-body-light leading-relaxed max-w-[50ch]">
            {await copyText("legacy-trust-0")}
          </p>
        </div>

        {/* 3 Safety Pillars */}
        <Reveal as="div" variant="land" className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20">
          <div data-trust-tile className="group rounded-2xl border border-ink/10 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-accent/30 transition-all duration-300">
            <p className="font-mono text-4xl sm:text-5xl font-black text-accent mb-3 group-hover:scale-110 transition-transform duration-300 origin-left">
              0
            </p>
            <h3 className="text-base sm:text-lg font-semibold text-ink mb-2">
              Structural Incidents
            </h3>
            <p className="text-xs sm:text-sm text-body-light leading-relaxed">
              {await copyText("legacy-trust-1")}
            </p>
          </div>

          <div data-trust-tile className="group rounded-2xl border border-ink/10 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-brand-blue/30 transition-all duration-300">
            <p className="font-mono text-4xl sm:text-5xl font-black text-brand-blue mb-3 group-hover:scale-110 transition-transform duration-300 origin-left">
              100%
            </p>
            <h3 className="text-base sm:text-lg font-semibold text-ink mb-2">Certified Extrusions</h3>
            <p className="text-xs sm:text-sm text-body-light leading-relaxed">
              {await copyText("legacy-trust-2")}
            </p>
          </div>

          <div data-trust-tile className="group rounded-2xl border border-ink/10 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-ink/20 transition-all duration-300">
            <p className="font-mono text-4xl sm:text-5xl font-black text-ink mb-3 group-hover:scale-110 transition-transform duration-300 origin-left">
              In‑house
            </p>
            <h3 className="text-base sm:text-lg font-semibold text-ink mb-2">Permanent Payroll Crew</h3>
            <p className="text-xs sm:text-sm text-body-light leading-relaxed">
              {await copyText("legacy-trust-3")}
            </p>
          </div>
        </Reveal>

        {/* Closing Archival Quote — Dark Treatment */}
        <div data-trust-quote-box className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl" style={{background: "linear-gradient(135deg, #12305a 0%, #163660 50%, #1d4a82 100%)"}}>
          <div className="p-8 sm:p-12 md:p-16 relative">
            {/* Ghost "49" behind quote */}
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 right-0 leading-none font-mono font-black text-white/[0.04] select-none"
              style={{ fontSize: "clamp(100px, 16vw, 220px)" }}
            >
              {yearsInOperation()}
            </div>

            <div className="relative z-10 max-w-4xl space-y-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/70 font-semibold">
                The Founding Creed &middot; Est. 1977
              </p>
              <blockquote
                className="font-serif italic text-white leading-[1.15] text-balance"
                style={{ fontSize: "clamp(22px, 3.5vw, 48px)" }}
              >
                &ldquo;We don&rsquo;t build tents to decorate a ceremony. We engineer the physical
                sanctuary where human lives, heads of state, and historical moments stand safe.&rdquo;
              </blockquote>
              <p className="font-mono text-xs uppercase tracking-wider text-white/40">
                — Raju &amp; Venkat, Founders, Raja Enterprises
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 rounded-full bg-brand-blue text-white px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 hover:bg-brand-blue/80 hover:shadow-xl hover:shadow-brand-blue/30 hover:-translate-y-0.5"
                >
                  <span>Consult with Our Senior Engineering Directors</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/inventory"
                  className="inline-flex items-center gap-3 rounded-full border border-white/20 text-white/70 px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 hover:border-brand-blue/60 hover:text-white hover:bg-brand-blue/10"
                >
                  <span>Explore the Fleet</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
