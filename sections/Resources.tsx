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
import type { InventoryTile } from "@/content/inventory";
import type { InventoryLine } from "@/content/inventorySchedule";
import { SECTION_IDS, ROUTES } from "@/content/navigation";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";

export function ResourcesView({ schedule, tiles }: { schedule: InventoryLine[]; tiles: InventoryTile[] }) {
  const root = useRef<HTMLElement>(null);

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

        fadeIn(tl, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.04 }, 0);
        revealLines(q(scope, "[data-statement] h2"), { stagger: 0.09, trigger: { trigger: scope, start: "top 78%", once: true } });
        riseCard(tl, q(scope, "[data-inventory-card]"), { stagger: STAGGER.bento }, 0.4);
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

        {/* All Inventory Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiles.map((tile) => (
            <div
              key={tile.id}
              data-inventory-card
              data-reveal
              className="flex flex-col overflow-hidden rounded-[20px] bg-white shadow-sm border border-ink/5"
            >
              <div className="relative aspect-[16/10] w-full bg-mist overflow-hidden">
                {tile.image && (
                  <Image
                    src={tile.image.src}
                    alt={tile.image.alt}
                    fill
                    sizes="(max-width: 1023px) 50vw, 33vw"
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
                <h3 className="font-serif text-lg text-ink">{tile.title}</h3>
                {tile.body && (
                  <p className="t-body-sm leading-relaxed text-body-light">
                    {tile.body.length > 120 ? `${tile.body.slice(0, 118).trimEnd()}…` : tile.body}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* The section shows six of the categories; the inventory page carries
            the full catalogue, so give the reader a way through to it. */}
        <div data-reveal className="flex justify-center pt-[clamp(28px,4vw,56px)]">
          <Link
            href={ROUTES.inventory}
            className="group inline-flex h-[54px] items-center gap-3 rounded-full bg-brand-blue px-8 text-white transition-colors duration-300 hover:bg-ink"
          >
            <span className="t-body">View the full inventory</span>
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}
