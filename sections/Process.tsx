"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, fadeIn, growRule, riseCard, entranceTrigger, q } from "@/motion/primitives";
import { DUR, EASE, STAGGER, MOTION_OK } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";
import { processIntro, processSteps } from "@/content/process";
import { SECTION_IDS } from "@/content/navigation";
import { clsx } from "@/lib/clsx";

/** Index of the step shown at full size. Figma centres step 01. */
const ACTIVE = 1;

/**
 * Figma 4843–5676px. "The making of an event" — a three-up step viewport with
 * the active step at full size and its neighbours at 60% opacity.
 *
 * The section only tells its story with one photograph of the SAME site at each
 * stage; Figma supplies one photograph reused three times, so what renders here
 * is the authored composition with its content gap left visible.
 *
 * Below 1024 the three-up peek becomes a snap rail: at 390px a 366px neighbour
 * card would be 12px of visible sliver, which communicates nothing.
 */
export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {

        const tl = gsap.timeline({ scrollTrigger: entranceTrigger(scope) });

        growRule(tl, q(scope, "[data-divider]"), { duration: 0.9 }, 0);
        fadeIn(tl, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.04 }, 0.2);
        growRule(tl, q(scope, "[data-eyebrow] [data-reveal-rule]"), {}, 0.2);
        fadeUp(tl, q(scope, "[data-statement]"), { duration: DUR.statement }, 0.35);

        // Track grows, then the three nodes pop on the spring, then the cards.
        growRule(tl, q(scope, "[data-track]"), { duration: 0.95 }, 0.6);
        const dots = q(scope, "[data-dot]");
        if (dots.length) {
          tl.fromTo(
            dots,
            { scale: 0 },
            { scale: 1, duration: 0.55, stagger: 0.15, ease: EASE.spring },
            0.8,
          );
        }
        riseCard(tl, q(scope, "[data-step]"), { stagger: STAGGER.process, distance: 48, scaleFrom: 0.95 }, 0.85);
        fadeUp(tl, q(scope, "[data-step-caption]"), { stagger: STAGGER.process, distance: 20 }, 1.05);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={SECTION_IDS.process} className="relative w-full bg-paper pb-[clamp(72px,10vw,140px)]">
      <div className="frame">
        <span data-divider aria-hidden className="block h-px w-full origin-left bg-ink/20" />
      </div>

      <div className="frame flex flex-col items-center gap-5 pb-[clamp(48px,6vw,88px)] pt-[clamp(56px,8vw,120px)] text-center">
        <div data-eyebrow>
          <Eyebrow items={processIntro.eyebrow} align="center" />
        </div>
        <div data-statement data-reveal>
          <Statement segments={processIntro.statement} className="t-statement max-w-[520px]" />
        </div>
      </div>

      {/* ---------- Progress track ---------- */}
      <div className="frame mb-[clamp(28px,3.4vw,48px)] flex justify-center">
        <div className="relative flex w-full max-w-[807px] items-center justify-between">
          <span
            data-track
            aria-hidden
            className="absolute inset-x-0 top-1/2 block h-px origin-left -translate-y-1/2 bg-ink/25"
          />
          {processSteps.map((step, i) => (
            <span
              key={step.id}
              data-dot
              aria-hidden
              className={clsx(
                "relative block rounded-full",
                i === ACTIVE ? "size-[20px] bg-accent" : "size-[13px] bg-ink/25",
              )}
            />
          ))}
        </div>
      </div>

      {/* ---------- Steps ---------- */}
      <ol
        className={[
          "flex gap-[clamp(16px,3.68vw,53px)]",
          "snap-x snap-mandatory overflow-x-auto px-[clamp(20px,5.55vw,80px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "lg:mx-auto lg:max-w-[1440px] lg:snap-none lg:items-end lg:justify-between lg:overflow-visible",
        ].join(" ")}
      >
        {processSteps.map((step, i) => {
          const active = i === ACTIVE;
          return (
            <li
              key={step.id}
              data-step
              data-reveal
              className={clsx(
                "flex w-[78vw] max-w-[420px] shrink-0 snap-center flex-col gap-[10px]",
                active
                  ? "lg:w-[27.8vw] lg:max-w-[400px] lg:opacity-100"
                  : "lg:w-[25.4vw] lg:max-w-[366px] lg:opacity-60",
              )}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="t-eyebrow text-ink">{step.index}</span>
                <span className="t-eyebrow text-ink">{step.label}</span>
              </div>

              <div
                className={clsx(
                  "relative w-full overflow-hidden",
                  active ? "aspect-[400/450]" : "aspect-[366/412]",
                )}
              >
                {step.image && (
                  <Image
                    src={step.image.src}
                    alt={step.image.alt}
                    fill
                    sizes="(max-width: 1023px) 78vw, 28vw"
                    className="object-cover"
                  />
                )}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(102,102,102,0) 46.7%, rgba(0,0,0,0.8) 91.4%)",
                  }}
                />
                <p
                  data-step-caption
                  data-reveal
                  className="absolute bottom-[clamp(14px,1.6vw,22px)] left-[clamp(12px,1.4vw,20px)] max-w-[268px] pr-4 t-body text-white"
                >
                  {step.caption ?? (
                    <span className="opacity-60" title={step.note}>
                      Caption pending — not supplied for this step.
                    </span>
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
