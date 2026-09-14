import Image from "next/image";
import { getLegacyMilestones } from "@/lib/store";

export async function LegacyTimeline() {
  const MILESTONES = await getLegacyMilestones();

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
                  <div className="absolute left-[2rem] md:left-1/2 -translate-x-1/2 top-[1.5rem] md:top-1/2 md:-translate-y-1/2 w-4 h-4 rounded-full bg-paper border-[3px] border-brand-blue z-10 transition-all duration-500 group-hover:scale-125 group-hover:bg-brand-blue shadow-sm" />

                  {/* Text Card Side - First on mobile */}
                  <div
                    className={`w-full order-1 ${
                      isEven ? "md:pl-10 lg:pl-16 md:order-2" : "md:pr-10 lg:pr-16 md:order-1"
                    }`}
                  >
                    <div className="flex flex-col gap-4 py-2 sm:py-4 transition-all duration-500">
                      <div className="flex items-end justify-between mb-2">
                        <span className="font-serif text-5xl sm:text-6xl font-medium text-ink leading-none">
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
                        alt={m.alt}
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
