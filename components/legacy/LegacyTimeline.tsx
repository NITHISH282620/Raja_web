import Image from "next/image";

const MILESTONES = [
  {
    year: "1977",
    title: "Founded in Bengaluru",
    desc: "Timber poles and cotton shamianas for civic convocations on 5th Main Road.",
    image: "/media/legacy/legacy-1.png",
  },
  {
    year: "1985",
    title: "State-Level Contracts",
    desc: "First Karnataka government mandates — Republic Day grounds and political summits.",
    image: "/media/legacy/legacy-2.png",
  },
  {
    year: "1991",
    title: "The German Pivot",
    desc: "Direct acquisition of aerospace-grade 6061-T6 aluminium clear-span hangar systems.",
    image: "/media/legacy/legacy-3.png",
  },
  {
    year: "2000",
    title: "National Expansion",
    desc: "Deployments across Tamil Nadu, Andhra Pradesh, and Maharashtra for multi-thousand delegate events.",
    image: "/media/projects/aicog-2019-tent-city-dawn.webp",
  },
  {
    year: "2010",
    title: "The Flooring Guild",
    desc: "In-house precision wooden sub-floor production yard commissioned. 10,00,000+ sq. ft. deployed.",
    image: "/media/projects/aicog-2019-flooring-install.webp",
  },
  {
    year: "2024",
    title: "Full-Stack Infrastructure",
    desc: "Structures, staging, lighting, AV, flooring, barricading — all owned, all operated by Raja crew.",
    image: "/media/projects/aicog-2019-hanger-complex-aerial.webp",
  },
];

export function LegacyTimeline() {
  return (
    <section data-timeline-section className="relative w-full py-20 sm:py-28 md:py-36 overflow-hidden bg-paper">

      <div className="frame relative z-10">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-16 sm:mb-24">
          <span className="h-px flex-1 max-w-[60px] bg-brand-blue/30" />
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-blue font-semibold text-center">
            Key Milestones · 1977–2024
          </p>
          <span className="h-px flex-1 max-w-[60px] bg-brand-blue/30" />
        </div>

        {/* Vertical Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Vertical central rule */}
          <div
            data-timeline-rule
            className="absolute top-0 bottom-0 left-[2rem] md:left-1/2 w-px bg-ink/10 md:-translate-x-1/2"
            style={{ transformOrigin: "top center" }}
          />

          <div className="flex flex-col gap-12 sm:gap-16 md:gap-24">
            {MILESTONES.map((m, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={m.year}
                  data-timeline-item
                  className="relative flex flex-col md:grid md:grid-cols-2 items-center w-full group gap-6 md:gap-0 pl-[4rem] md:pl-0"
                >
                  {/* Central Dot Marker */}
                  <div className="absolute left-[2rem] md:left-1/2 -translate-x-1/2 top-[3rem] md:top-1/2 md:-translate-y-1/2 w-4 h-4 rounded-full bg-paper border-[3px] border-brand-blue z-10 transition-all duration-500 group-hover:scale-125 group-hover:bg-brand-blue shadow-sm" />

                  {/* Text Card Side - First on mobile */}
                  <div
                    className={`w-full order-1 ${
                      isEven ? "md:pl-10 lg:pl-16 md:order-2" : "md:pr-10 lg:pr-16 md:order-1"
                    }`}
                  >
                    <div className="flex flex-col gap-4 bg-white rounded-[1.5rem] p-6 sm:p-8 shadow-sm border border-ink/5 hover:shadow-xl hover:shadow-ink/5 transition-all duration-500">
                      <div className="flex items-end justify-between mb-2">
                        <span className="font-mono text-4xl sm:text-5xl font-black text-ink tracking-tighter leading-none">
                          {m.year}
                        </span>
                        <span className="font-mono text-[9px] sm:text-[10px] text-accent uppercase tracking-widest font-semibold bg-accent/5 px-3 py-1 rounded-full">
                          Phase 0{i + 1}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-ink mb-1">
                        {m.title}
                      </h3>
                      <p className="text-sm sm:text-base text-body-light leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>

                  {/* Image Side - Second on mobile */}
                  <div
                    className={`w-full order-2 ${
                      isEven ? "md:pr-10 lg:pr-16 md:order-1" : "md:pl-10 lg:pl-16 md:order-2"
                    }`}
                  >
                    <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-neutral-100 shadow-md">
                      <Image
                        src={m.image}
                        alt={m.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
