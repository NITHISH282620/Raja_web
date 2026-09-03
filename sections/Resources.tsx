"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  fadeUp,
  fadeIn,
  riseCard,
  releaseScope,
  revealLines,
  entranceTrigger,
  q,
} from "@/motion/primitives";
import { MOTION_OK, STAGGER } from "@/motion/ease";
import { inventoryTiles } from "@/content/inventory";
import { inventorySchedule } from "@/content/inventorySchedule";
import { SECTION_IDS, ROUTES } from "@/content/navigation";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";

export function ResourcesView() {
  const root = useRef<HTMLElement>(null);

  const topCards = inventoryTiles.slice(0, 2);
  const bottomCards = inventoryTiles.slice(2, 6);
  const scheduleItems = inventorySchedule.slice(0, 4);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: entranceTrigger(scope),
          onComplete: releaseScope(scope),
        });

        // Animate the top row cards and schedule panel
        fadeIn(tl, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.04 }, 0);
        revealLines(q(scope, "[data-statement] h2"), { stagger: 0.09, trigger: { trigger: scope, start: "top 78%", once: true } });
        riseCard(tl, q(scope, "[data-top-card]"), { stagger: STAGGER.works }, 0.4);
        fadeIn(tl, q(scope, "[data-schedule-panel]"), { distance: 20 }, 0.2);
        
        // Animate schedule items
        fadeUp(tl, q(scope, "[data-schedule-item]"), { stagger: 0.05, distance: 10 }, 0.3);

        // Animate the bottom row cards
        riseCard(tl, q(scope, "[data-bottom-card]"), { stagger: STAGGER.bento }, 0.4);
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id={SECTION_IDS.resources} className="relative w-full overflow-hidden bg-paper py-[clamp(56px,8vw,104px)]">
      <div className="frame flex flex-col gap-6 lg:gap-10">
        
                <div className="flex flex-col items-center gap-5 pb-8 text-center">
          <div data-eyebrow>
            <Eyebrow items={["our", "resource"]} tone="dark" align="center" />
          </div>
          <div data-statement>
            <Statement segments={[{ text: "We don't " }, { text: "think", accent: true }, { text: " in metres.\nWe think " }, { text: "in scale.", accent: true }]} tone="dark" className="t-statement max-w-[27ch]" />
          </div>
        </div>

        {/* Top Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Top Cards */}
          <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
            {topCards.map((tile) => (
              <div
                key={tile.id}
                data-top-card
                data-reveal
                className="flex flex-col overflow-hidden rounded-[20px] bg-white shadow-sm border border-ink/5"
              >
                <div className="relative aspect-[4/3] w-full bg-mist overflow-hidden">
                  {tile.image && (
                    <Image
                      src={tile.image.src}
                      alt={tile.image.alt}
                      fill
                      sizes="(max-width: 767px) 100vw, 33vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col flex-1 p-6 gap-4">
                  <div className="flex items-center gap-3">
                    <span className="t-eyebrow text-ink font-bold tabular-nums">{tile.index}</span>
                    <div className="h-px w-8 bg-ink/20"></div>
                    <span className="t-eyebrow text-ink/50 uppercase tracking-wider">{tile.eyebrow}</span>
                  </div>
                  <h3 className="text-2xl font-serif text-ink leading-tight">{tile.title}</h3>
                  {tile.body && (
                    <p className="t-body-sm text-body-light leading-relaxed mt-auto">
                      {tile.body}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Schedule Panel */}
          <div 
            data-schedule-panel 
            data-reveal
            className="flex flex-col overflow-hidden rounded-[20px] bg-white shadow-sm border border-ink/5 p-8 lg:p-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-ink/20"></div>
              <span className="t-eyebrow text-ink/50 uppercase tracking-wider">Held in stock</span>
            </div>
            
            <h3 className="text-3xl font-serif text-ink mb-6">The inventory schedule</h3>
            <p className="t-body-sm text-body-light leading-relaxed mb-10">
              Raja Enterprises completely owns its entire inventory line. This eliminates reliance on third-party sub-rentals, giving us absolute control over deployment timelines and massive scale across India.
            </p>

            <ul className="flex flex-col gap-5 flex-1">
              {scheduleItems.map((item, i) => (
                <li key={i} data-schedule-item data-reveal className="flex items-end justify-between gap-4 border-b border-ink/5 pb-4">
                  <span className="t-body-sm text-ink/80">{item.item}</span>
                  <span className="t-body-sm font-bold text-ink text-right tabular-nums whitespace-nowrap">
                    {item.capacity} <span className="text-[10px] uppercase tracking-wider text-ink/50 ml-1">{item.unit}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Link 
                href={ROUTES.inventory}
                className="t-eyebrow text-brand-blue uppercase tracking-widest flex items-center gap-2 hover:text-accent transition-colors"
              >
                Full schedule <span className="text-lg">&rarr;</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {bottomCards.map((tile) => (
            <div
              key={tile.id}
              data-bottom-card
              data-reveal
              className="flex flex-col overflow-hidden rounded-[20px] bg-white shadow-sm border border-ink/5"
            >
              <div className="relative aspect-[4/3] w-full bg-mist overflow-hidden">
                {tile.image && (
                  <Image
                    src={tile.image.src}
                    alt={tile.image.alt}
                    fill
                    sizes="(max-width: 1023px) 50vw, 25vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col p-5 gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-px w-6 bg-ink/20"></div>
                  <span className="text-[10px] uppercase tracking-wider text-ink/50 tabular-nums">
                    {tile.index} {tile.eyebrow}
                  </span>
                </div>
                <h3 className="text-lg font-serif text-ink">{tile.title}</h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
