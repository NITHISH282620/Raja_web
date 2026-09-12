import { Reveal } from "@/motion/Reveal";
import { copyText } from "@/lib/store";

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
    nowDesc: "German-engineered modular clear spans, column-free across the full floor plate, engineered for monsoon wind loading.",
  },
  {
    domain: "Weather Enclosures",
    thenTitle: "1970s: Cotton Canvas Shamianas",
    thenDesc: "Permeable canvas tarpaulins susceptible to water pooling, wind billow, and fire hazards.",
    nowTitle: "2020s: Flame-Retardant Coated PVC",
    nowDesc: "Blackout PVC-coated membranes with integrated aluminium rainwater gutters and thermal roof lining.",
  },
  {
    domain: "Ground Terrain & Subfloor",
    thenTitle: "1970s: Manual Timber Planking",
    thenDesc: "Direct ground contact with uneven wooden planks vulnerable to mud seepage and slope variations.",
    nowTitle: "2020s: Rotary Laser-Aligned Steel Grids",
    nowDesc: "Laser-levelled steel sub-frames that take up ground slope and carry vehicle as well as delegate traffic.",
  },
  {
    domain: "Climate Management",
    thenTitle: "1970s: Oscillating Pedestal Fans",
    thenDesc: "Circulating ambient hot air with no temperature reduction or dust filtration.",
    nowTitle: "2020s: Mobile Chiller & Ducting Fleet",
    nowDesc: "Industrial package chillers and laminar textile duct socks sustaining 22°C comfort against 45°C ambient heat.",
  },
  {
    domain: "Crowd Security & VIP Protocol",
    thenTitle: "1970s: Bamboo Ropes & Wooden Railings",
    thenDesc: "Basic rope-and-post crowd cordons.",
    nowTitle: "2020s: Police-Certified Interlocking Steel",
    nowDesc: "Galvanised iron interlocking barricade runs and multi-tiered ceremonial rostrums.",
  },
];

export async function LegacyEvolution() {
  return (
    <section data-evolution-section className="relative w-full py-20 sm:py-28 md:py-36 overflow-hidden bg-paper">
      {/* Ghost chapter numeral */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 -left-4 sm:-left-8 select-none leading-none font-mono font-black text-ink/5"
        style={{ fontSize: "clamp(140px, 22vw, 320px)" }}
      >
        03
      </div>

      <div className="frame relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 sm:mb-14">
          <span className="h-px flex-1 max-w-[60px] bg-accent/60" />
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">
            Chapter 03 · Evolution of the Craft
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-14 sm:mb-20 max-w-3xl">
          <h2
            data-evolution-header
            className="font-semibold tracking-tight text-ink text-balance"
            style={{ fontSize: "clamp(28px, 4vw, 52px)", lineHeight: 1.1 }}
          >
            The Technological Leap.{" "}
            <span className="text-brand-blue">Then vs. Now Across Four Decades.</span>
          </h2>
          <p data-evolution-header className="text-base text-body-light leading-relaxed max-w-[50ch]">
            {await copyText("legacy-evolution-0")}
          </p>
        </div>

        {/* Column headers */}
        <div data-evolution-labels className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-8 items-center">
          <div className="rounded-xl border border-ink/10 bg-white/50 px-5 py-3 text-center">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink/60">
              Foundational Heritage · 1970s–1980s
            </span>
          </div>
          <div className="w-px bg-ink/10 self-stretch" />
          <div className="rounded-xl border border-brand-blue/20 bg-brand-blue/5 px-5 py-3 text-center">
            <span className="font-mono text-[10px] uppercase tracking-wider text-brand-blue font-semibold">
              Contemporary Standard · 2020s
            </span>
          </div>
        </div>

        {/* Evolution Rows */}
        <Reveal as="div" variant="land" className="space-y-4">
          {EVOLUTION_DATA.map((row, index) => (
            <div
              key={row.domain}
              data-evolution-row
              className="rounded-2xl border border-ink/10 bg-white shadow-sm overflow-hidden hover:border-brand-blue/30 hover:shadow-md transition-all duration-300"
            >
              {/* Domain header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-ink/5 bg-neutral-50/50">
                <span className="font-mono text-xs text-accent font-bold bg-accent/10 px-2 py-0.5 rounded-md">
                  0{index + 1}
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                  {row.domain}
                </span>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ink/10">
                {/* Then */}
                <div className="p-5 sm:p-6 space-y-3 bg-neutral-50/30">
                  <h3 className="text-sm sm:text-base font-semibold text-ink/70">{row.thenTitle}</h3>
                  <p className="text-xs sm:text-sm text-body-light leading-relaxed">{row.thenDesc}</p>
                </div>

                {/* Now */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-brand-blue shrink-0" />
                    <h3 className="text-sm sm:text-base font-semibold text-brand-blue">{row.nowTitle}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-body-light leading-relaxed">{row.nowDesc}</p>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
