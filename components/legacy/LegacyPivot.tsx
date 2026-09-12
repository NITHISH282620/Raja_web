import Image from "next/image";
import { Reveal } from "@/motion/Reveal";
import { copyText, pageImage } from "@/lib/store";

export async function LegacyPivot() {
  return (
    <section data-pivot-section className="relative w-full bg-paper py-20 sm:py-28 md:py-40 overflow-hidden border-t border-ink/10">
      {/* Ghost chapter numeral */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 -right-4 sm:-right-8 select-none leading-none font-mono font-black text-ink/[0.04] text-right"
        style={{ fontSize: "clamp(140px, 22vw, 320px)" }}
      >
        02
      </div>

      <div className="frame relative z-10">
        {/* Chapter eyebrow */}
        <div className="flex items-center gap-4 mb-10 sm:mb-14 justify-end">
          <p data-pivot-eyebrow className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">
            Chapter 02 · The 1991 Pivot
          </p>
          <span className="h-px flex-1 max-w-[60px] bg-accent" />
        </div>

        <Reveal as="div" className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Image */}
          <div className="order-2 lg:order-1 w-full">
            <div
              data-pivot-image
              className="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-neutral-900 shadow-xl"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src={(await pageImage("legacy-pivot"))?.image ?? "/media/legacy/legacy-3.png"}
                alt={(await pageImage("legacy-pivot"))?.alt ?? "The 1991 German hangar pivot"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent" />

              {/* Massive year overlay */}
              <div
                aria-hidden
                className="absolute bottom-0 right-0 leading-none font-mono font-black text-white/10 select-none pointer-events-none"
                style={{ fontSize: "clamp(80px, 18vw, 200px)" }}
              >
                1991
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <span className="font-mono text-[10px] uppercase tracking-wider text-brand-blue block mb-1">
                  Technological Turning Point · 1991
                </span>
                <p className="text-base sm:text-lg font-medium text-white leading-snug">
                  The Transition to Clear-Span Modular Aerospace Aluminium
                </p>
                <p className="text-xs text-white/60 mt-1">{await copyText("legacy-pivot-0")}</p>
              </div>

              {/* Year badge */}
              <div className="absolute top-6 left-6 rounded-full bg-brand-blue px-4 py-2">
                <span className="font-mono text-sm font-bold text-white">1991</span>
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div className="order-1 lg:order-2 space-y-8 lg:pl-6">
            <h2
              data-pivot-headline
              className="font-semibold tracking-tight text-ink text-balance"
              style={{ fontSize: "clamp(28px, 4vw, 52px)", lineHeight: 1.1 }}
            >
              The Asset Moat.{" "}
              <span className="text-brand-blue">Direct Ownership of German Engineering.</span>
            </h2>

            <p data-pivot-body className="text-base sm:text-lg text-body-light leading-relaxed">
              {await copyText("legacy-pivot-1")}
            </p>

            <p className="text-sm sm:text-base text-body-light leading-relaxed">
              While other event companies chose the broker model—renting disparate components from
              fragmented third parties—Raja Enterprises made a monumental capital commitment:{" "}
              <strong className="text-ink">
                directly acquiring industrial-scale German clear-span aluminium hangars
              </strong>{" "}
              and constructing our own staging and flooring production yards.
            </p>

            {/* Pull quote */}
            <blockquote data-pivot-quote className="border-l-[3px] border-accent pl-6 py-2">
              <p className="font-serif italic text-xl sm:text-2xl text-ink leading-snug">
                &ldquo;Own the steel. Control the outcome.&rdquo;
              </p>
              <cite className="font-mono text-[10px] uppercase tracking-wider text-ink/40 not-italic block mt-2">
                — Strategic Decision, 1991
              </cite>
            </blockquote>

            {/* Metadata strip */}
            <div data-pivot-meta className="pt-6 border-t border-ink/10 grid grid-cols-2 gap-6">
              <div>
                <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-ink/40 mb-1">
                  Strategic Decision
                </p>
                <p className="text-sm font-semibold text-ink">100% Direct First-Party Asset Ownership</p>
              </div>
              <div>
                <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-ink/40 mb-1">
                  Market Outcome
                </p>
                <p className="text-sm font-semibold text-ink">
                  Largest Turnkey Infrastructure Contractor in Karnataka
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
