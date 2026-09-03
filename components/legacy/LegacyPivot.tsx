import Image from "next/image";

export function LegacyPivot() {
  return (
    <section className="relative w-full bg-paper py-16 sm:py-24 md:py-32 border-t border-ink/10">
      <div className="frame">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Image Card */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="group relative h-[360px] sm:h-[460px] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-ink/10 bg-neutral-900 shadow-md">
              <Image
                src="/media/inventory-german-hanger.1631d7b1.webp"
                alt="Pioneering German clear-span aluminium hangars in South India"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="font-mono text-[11px] uppercase tracking-wider text-brand-blue block mb-1">
                  Technological Turning Point · 1991
                </span>
                <p className="text-base sm:text-lg font-medium">
                  The Transition to Clear-Span Modular Aerospace Aluminium
                </p>
                <p className="text-xs text-white/70 mt-1">
                  Investing in first-party German hangar assets to eliminate sub-rental middlemen and guarantee structural safety.
                </p>
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink/60">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span>Chapter 02: 1991 Pivot</span>
            </div>
            <h2 className="t-statement text-ink text-balance font-semibold">
              The Asset Moat. <br />
              <span className="text-brand-blue">Direct Ownership of German Engineering.</span>
            </h2>
            <p className="text-base sm:text-lg text-body-light leading-relaxed">
              When India initiated economic liberalization in 1991, Bengaluru rapidly emerged as the nation’s technology capital. International delegations, multinational IT conglomerates, and large industrial expos demanded infrastructure that met European safety and aesthetic criteria.
            </p>
            <p className="text-sm sm:text-base text-body-light leading-relaxed">
              While other event companies chose the broker model—renting disparate components from fragmented third parties—Raja Enterprises made a monumental capital commitment: <strong>directly acquiring industrial-scale German clear-span aluminium hangars and constructing our own staging and flooring production yards</strong>.
            </p>

            <div className="pt-4 border-t border-ink/10 grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-ink/50">Strategic Decision</p>
                <p className="text-sm font-semibold text-ink mt-1">100% Direct First-Party Asset Ownership</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-ink/50">Market Outcome</p>
                <p className="text-sm font-semibold text-ink mt-1">Largest Turnkey Infrastructure Contractor in Karnataka</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
