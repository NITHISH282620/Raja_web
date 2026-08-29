"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  fadeUp,
  fadeIn,
  growRule,
  revealLines,
  countUp,
  release,
  entranceTrigger,
  q,
} from "@/motion/primitives";
import { STAGGER, MOTION_OK } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";
import type { Stat } from "@/content/company";
import { SECTION_IDS } from "@/content/navigation";
import { clsx } from "@/lib/clsx";

const statement = [
  { text: "We don’t " },
  { text: "think", accent: true },
  { text: " in metres.\nWe think " },
  { text: "in scale.", accent: true },
];

/**
 * "Our resource" — a centred statement over four full-bleed stat rows.
 *
 * The rules run edge to edge rather than stopping at the 1440 frame: in the
 * design they are frame-width, and frame-width *is* edge-to-edge at 1440. The
 * labels stay on the page gutter so they line up with every other section.
 *
 * The photograph that used to float over these rows is gone. It was the
 * Uttarakhand frame from the legacy collage, reused, `aria-hidden`, with an
 * empty alt — a picture of dancers laid across a table of vehicle counts and
 * floor areas, carrying no information and obscuring two of the four figures it
 * sat on. The rows are the content of this section; nothing needs to be in
 * front of them.
 */
export function ResourcesView({ stats }: { stats: Stat[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: entranceTrigger(scope),
          onComplete: () => release(q(scope, "[data-reveal], [data-reveal-rule]")),
        });

        fadeIn(tl, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.04 }, 0);
        growRule(tl, q(scope, "[data-eyebrow] [data-reveal-rule]"), {}, 0);

        // Per row: rule grows, label slides in, figure rises. 0.16s apart.
        growRule(tl, q(scope, "[data-row-rule]"), { stagger: STAGGER.stats, staggerEase: "power1.inOut" }, 0.5);
        fadeIn(tl, q(scope, "[data-row-label]"), { stagger: STAGGER.stats, staggerEase: "power1.inOut", distance: 20 }, 0.56);
        fadeUp(tl, q(scope, "[data-row-value]"), { stagger: STAGGER.stats, staggerEase: "power1.inOut", distance: 26 }, 0.6);

        // The figures count, on the same timeline and at the same offsets as
        // the reveal above. This is the one section on the page whose entire
        // argument is magnitude, and a number that arrives already at rest
        // makes the same claim as one that climbs to it while you watch — but
        // only one of them makes you read it.
        q(scope, "[data-row-value]").forEach((node, i) =>
          countUp(tl, node, { duration: 1.9 }, 0.6 + i * STAGGER.stats),
        );

        const revert = revealLines(q(scope, "[data-statement] h2"), {
          stagger: 0.09,
          trigger: { trigger: scope, start: "top 78%", once: true },
        });
        return () => revert();
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={SECTION_IDS.resources} className="relative w-full overflow-hidden bg-paper">
      <div className="frame flex flex-col items-center gap-5 pb-[clamp(56px,8vw,104px)] pt-[clamp(72px,7vw,100px)] text-center">
        <div data-eyebrow>
          <Eyebrow items={["our", "resource"]} tone="dark" align="center" />
        </div>
        <div data-statement>
          <Statement segments={statement} tone="dark" className="t-statement max-w-[27ch]" />
        </div>
      </div>

      <dl className="relative">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            data-row
            className={clsx(
              "relative border-t border-ink/12",
              i === stats.length - 1 && "border-b",
              // Figma alternates the row ground. Row 3 sits on white; the rest
              // inherit the section paper.
              i === 2 ? "bg-surface" : "bg-paper",
            )}
          >
            <span
              data-row-rule
              aria-hidden
              className="absolute inset-x-0 top-0 block h-px origin-left bg-ink/20"
            />
            <div className="frame flex min-h-[clamp(72px,7.4vw,107px)] items-center justify-between gap-6 py-4 lg:grid lg:grid-cols-[66.1%_1fr] lg:gap-0">
              <dt data-row-label data-reveal className="t-stat-label text-ink">
                {stat.label}
              </dt>
              <dd data-row-value data-reveal className="t-stat m-0 text-ink">
                {stat.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
