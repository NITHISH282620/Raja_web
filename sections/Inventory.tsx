"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, fadeIn, growRule, riseCard, entranceTrigger, q } from "@/motion/primitives";
import { DUR, EASE, STAGGER, MOTION_OK } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";
import { InventoryTile } from "@/components/InventoryTile";
import { inventoryIntro, inventoryTiles } from "@/content/inventory";
import { SECTION_IDS } from "@/content/navigation";
import { clsx } from "@/lib/clsx";

const CATERING_ID = "catering";

/**
 * Figma 5918–7441px. "What we deploy" — the six-tile bento.
 *
 * Column widths (488 / 373 / 375) and the three 410px rows are taken straight
 * off the export, along with the 15px gutter. Tiles assemble rather than fade:
 * the card rises while its artwork rotates and scales into place, which is the
 * one place the design's motion is literally about construction.
 *
 * The coral CTA shares column 3 row 3 with the catering tile, exactly as
 * authored — it is not a full-width bar.
 */
export function Inventory() {
  const root = useRef<HTMLElement>(null);

  const tiles = inventoryTiles.filter((tile) => tile.id !== CATERING_ID);
  const catering = inventoryTiles.find((tile) => tile.id === CATERING_ID);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {

        const intro = gsap.timeline({ scrollTrigger: entranceTrigger(scope) });
        fadeIn(intro, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.04 }, 0);
        growRule(intro, q(scope, "[data-eyebrow] [data-reveal-rule]"), {}, 0);
        fadeUp(intro, q(scope, "[data-statement]"), { duration: DUR.statement }, 0.2);

        const grid = q(scope, "[data-bento]")[0];
        if (!grid) return;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: grid, start: "top 82%", once: true },
        });

        // Card rises; artwork rotates and scales into place 0.11s behind it.
        riseCard(tl, q(scope, "[data-tile]"), { stagger: STAGGER.bento, staggerEase: "power1.inOut", distance: 52, scaleFrom: 0.93 }, 0);

        const art = q(scope, "[data-tile-image]");
        if (art.length) {
          tl.fromTo(
            art,
            { rotate: 6, scale: 1.16 },
            { rotate: 0, scale: 1, duration: DUR.image, stagger: STAGGER.bento, ease: EASE.spring },
            0.05,
          );
        }
        fadeUp(tl, q(scope, "[data-tile-copy]"), { stagger: STAGGER.bento, staggerEase: "power1.inOut", distance: 22 }, 0.22);
        riseCard(tl, q(scope, "[data-inventory-cta]"), { distance: 24, scaleFrom: 0.9 }, 0.9);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={SECTION_IDS.inventory} className="relative w-full bg-paper pb-[clamp(80px,10vw,150px)]">
      <div className="frame flex flex-col items-center gap-5 pb-[clamp(48px,7vw,110px)] pt-[clamp(72px,10vw,145px)] text-center">
        <div data-eyebrow>
          <Eyebrow items={inventoryIntro.eyebrow} align="center" />
        </div>
        <div data-statement data-reveal>
          <Statement segments={inventoryIntro.statement} className="t-statement max-w-[520px]" />
        </div>
      </div>

      <div
        data-bento
        className={clsx(
          "mx-auto grid w-full max-w-[1266px] gap-[15px] px-[clamp(20px,5.55vw,80px)] lg:px-0",
          "grid-cols-1",
          "md:grid-cols-2",
          "lg:grid-cols-[488fr_373fr_375fr] lg:grid-rows-[410px_410px_410px]",
        )}
      >
        {tiles.map((tile) => (
          <div
            key={tile.id}
            data-tile
            data-reveal
            className="lg:[grid-column:var(--col)] lg:[grid-row:var(--row)]"
            style={{ ["--col" as string]: tile.area.col, ["--row" as string]: tile.area.row }}
          >
            <InventoryTile tile={tile} />
          </div>
        ))}

        {/* Column 3, row 3: catering tile with the CTA beneath it. */}
        {catering && (
          <div
            className="flex flex-col gap-[16px] lg:[grid-column:3/4] lg:[grid-row:3/4]"
          >
            <div data-tile data-reveal className="min-h-0 flex-1">
              <InventoryTile tile={catering} />
            </div>
            <CtaBar />
          </div>
        )}
      </div>
    </section>
  );
}

function CtaBar() {
  const { cta } = inventoryIntro;
  const className =
    "flex h-[62px] w-full shrink-0 items-center justify-center rounded-[20px] bg-accent text-white transition-opacity duration-300 hover:opacity-90";

  return (
    <div data-inventory-cta data-reveal>
      {cta.href ? (
        <a href={cta.href} className={className}>
          <span className="t-body-sm">{cta.label}</span>
        </a>
      ) : (
        <button
          type="button"
          aria-disabled
          data-provisional
          title="Destination not yet defined"
          className={clsx(className, "cursor-not-allowed opacity-80")}
        >
          <span className="t-body-sm">{cta.label}</span>
        </button>
      )}
    </div>
  );
}
