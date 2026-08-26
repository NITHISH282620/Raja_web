"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, fadeIn, growRule, riseCard, entranceTrigger, q } from "@/motion/primitives";
import { DUR, STAGGER, MOTION_OK } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";
import { stats } from "@/content/company";
import { SECTION_IDS } from "@/content/navigation";
import { clsx } from "@/lib/clsx";

const statement = [
  { text: "We don’t " },
  { text: "think", accent: true },
  { text: " in meters.\nWe think " },
  { text: "in scale.", accent: true },
];

/**
 * Figma 2780–3569px. "Our resource" — a centred statement over four full-bleed
 * stat rows, each 107px tall on hairline rules.
 *
 * The rules run edge to edge rather than stopping at the 1440 frame: in the
 * design they are frame-width, and frame-width *is* edge-to-edge at 1440. The
 * labels stay on the page gutter so they line up with every other section.
 *
 * The photograph overlapping the rows is in the design — it is the Uttarakhand
 * frame from the legacy collage, reused.
 */
export function Resources() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {

        const tl = gsap.timeline({ scrollTrigger: entranceTrigger(scope) });

        fadeIn(tl, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.04 }, 0);
        growRule(tl, q(scope, "[data-eyebrow] [data-reveal-rule]"), {}, 0);
        fadeUp(tl, q(scope, "[data-statement]"), { duration: DUR.statement }, 0.2);

        // Per row: rule grows, label slides in, figure rises. 0.16s apart.
        growRule(tl, q(scope, "[data-row-rule]"), { stagger: STAGGER.stats }, 0.6);
        fadeIn(tl, q(scope, "[data-row-label]"), { stagger: STAGGER.stats, distance: 20 }, 0.66);
        fadeUp(tl, q(scope, "[data-row-value]"), { stagger: STAGGER.stats, distance: 26 }, 0.7);

        riseCard(tl, q(scope, "[data-overlap]"), { scaleFrom: 0.9 }, 0.9);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={SECTION_IDS.resources} className="relative w-full overflow-hidden bg-ink">
      <div className="frame flex flex-col items-center gap-5 pb-[clamp(64px,9vw,124px)] pt-[clamp(72px,7vw,100px)] text-center">
        <div data-eyebrow>
          <Eyebrow items={["our", "resource"]} tone="light" align="center" />
        </div>
        <div data-statement data-reveal>
          <Statement segments={statement} tone="light" className="t-statement" />
        </div>
      </div>

      <dl className="relative">
        {/* Reused frame from the legacy collage — overlaps the rows in Figma. */}
        <div
          data-overlap
          data-reveal
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[18%] z-10 hidden aspect-[323/175] w-[22.4%] -translate-x-1/2 overflow-hidden rounded-[10px] lg:block"
        >
          <Image
            src="/media/legacy-uttarakhand-gis.webp"
            alt=""
            fill
            sizes="23vw"
            className="object-cover"
          />
        </div>

        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={clsx(
              "relative border-t border-white/15",
              i === stats.length - 1 && "border-b",
              // Figma alternates the row ground: rows 2 and 4 sit on pure black,
              // row 3 on #101010. Row 1 inherits the section ground.
              i === 2 ? "bg-ink-alt" : "bg-ink",
            )}
          >
            <span
              data-row-rule
              aria-hidden
              className="absolute inset-x-0 top-0 block h-px origin-left bg-white/25"
            />
            <div className="frame flex min-h-[clamp(72px,7.4vw,107px)] items-center justify-between gap-6 py-4 lg:grid lg:grid-cols-[66.1%_1fr] lg:gap-0">
              <dt data-row-label data-reveal className="t-stat-label text-white">
                {stat.label}
              </dt>
              <dd data-row-value data-reveal className="t-stat m-0 text-white">
                {stat.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
