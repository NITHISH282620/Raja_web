interface EvolutionRow {
  domain: string;
  thenTitle: string;
  thenDesc: string;
  nowTitle: string;
  nowDesc: string;
}

const EVOLUTION_DATA: EvolutionRow[] = [
  {
    domain: "Structural Space Frames",
    thenTitle: "1970s: Timber Posts & Bamboo Lattices",
    thenDesc: "Manual rope lashing and eucalyptus poles requiring dense interior support columns every 15 feet.",
    nowTitle: "2020s: Aerospace-Grade 6061-T6 Aluminium",
    nowDesc: "German-engineered modular clear spans up to 40 meters. 100% column-free with 120 km/h wind certification.",
  },
  {
    domain: "Weather Enclosures",
    thenTitle: "1970s: Cotton Canvas Shamianas",
    thenDesc: "Permeable canvas tarpaulins susceptible to water pooling, wind billow, and fire hazards.",
    nowTitle: "2020s: DIN 4102 B1 Flame-Retardant PVC",
    nowDesc: "850 g/m² blackout membranes with integrated aluminum rainwater drainage gutters and thermal roof liners.",
  },
  {
    domain: "Ground Terrain & Subfloor",
    thenTitle: "1970s: Manual Timber Planking",
    thenDesc: "Direct ground contact with uneven wooden planks vulnerable to mud seepage and slope variations.",
    nowTitle: "2020s: Rotary Laser-Aligned Steel Grids",
    nowDesc: "Precision laser leveling accommodating up to 1.5m slopes; 1,000 kg/m² load-bearing capacity for heavy vehicles.",
  },
  {
    domain: "Climate Management",
    thenTitle: "1970s: Oscillating Pedestal Fans",
    thenDesc: "Circulating ambient hot air with no temperature reduction or dust filtration.",
    nowTitle: "2020s: 3,000-Ton Mobile HVAC Division",
    nowDesc: "Industrial package chillers and laminar textile duct socks sustaining 22°C comfort against 45°C ambient heat.",
  },
  {
    domain: "Crowd Security & VIP Protocol",
    thenTitle: "1970s: Bamboo Ropes & Wooden Railings",
    thenDesc: "Basic crowd cordons without structural crash resistance or ballistic rating.",
    nowTitle: "2020s: Police-Certified Interlocking Steel",
    nowDesc: "1,00,000 RFT galvanized iron barricading and SPG Level-1 certified presidential rostrums.",
  },
];

export function LegacyEvolution() {
  return (
    <section className="relative w-full bg-paper py-16 sm:py-24 md:py-32 border-t border-ink/10">
      <div className="frame">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-12 sm:mb-16 max-w-3xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink/60">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>Chapter 03: Evolution of the Craft</span>
          </div>
          <h2 className="t-statement text-ink text-balance font-semibold">
            The Technological Leap. <br />
            <span className="text-brand-blue">Then vs. Now Across Four Decades.</span>
          </h2>
          <p className="t-body text-body-light leading-relaxed max-w-[50ch]">
            How Indian event engineering evolved from temporary artisanal shamianas into high-precision modular structural civil engineering.
          </p>
        </div>

        {/* Evolution Cards Progression */}
        <div className="space-y-6">
          {EVOLUTION_DATA.map((row, index) => (
            <div
              key={row.domain}
              className="rounded-2xl border border-ink/10 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:border-brand-blue/30 hover:shadow-md"
            >
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-blue font-semibold border-b border-ink/10 pb-3 mb-6">
                <span>Domain 0{index + 1}:</span>
                <span>{row.domain}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-start">
                {/* Then */}
                <div className="rounded-xl border border-ink/10 bg-neutral-50/70 p-5 space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink/50 block">
                    Foundational Heritage (1970s–1980s)
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold text-ink/80">{row.thenTitle}</h3>
                  <p className="text-xs sm:text-sm text-body-light leading-relaxed">{row.thenDesc}</p>
                </div>

                {/* Now */}
                <div className="rounded-xl border border-brand-blue/30 bg-brand-blue/[0.03] p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-brand-blue font-semibold block">
                      Contemporary Standard (2020s)
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-ink">{row.nowTitle}</h3>
                  <p className="text-xs sm:text-sm text-body-light leading-relaxed">{row.nowDesc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
