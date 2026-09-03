"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  fadeUp,
  fadeIn,
  growRule,
  riseCard,
  revealLines,
  release,
  entranceTrigger,
  q,
} from "@/motion/primitives";
import { EASE, STAGGER, MOTION_OK, MOTION_DESKTOP, MOTION_COMPACT } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";
import { processIntro, type ProcessStep } from "@/content/process";
import { SECTION_IDS } from "@/content/navigation";
import { clsx } from "@/lib/clsx";

/** Index of the step shown at full size. Figma centres step 01. */
const ACTIVE = 1;

/**
 * "The making of an event" — a three-up step viewport with the active step at
 * full size and its neighbours held back.
 *
 * Below 1024 the three-up peek becomes a snap rail: at 390px a 366px neighbour
 * card would be 12px of visible sliver, which communicates nothing.
 */
export function ProcessView({ processSteps }: { processSteps: ProcessStep[] }) {
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

        growRule(tl, q(scope, "[data-divider]"), { duration: 0.9 }, 0);
        fadeIn(tl, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.04 }, 0.2);
        growRule(tl, q(scope, "[data-eyebrow] [data-reveal-rule]"), {}, 0.2);

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

        const revert = revealLines(q(scope, "[data-statement] h2"), {
          stagger: 0.08,
          trigger: { trigger: scope, start: "top 78%", once: true },
        });
        return () => revert();
      });

      // Slow counter-parallax inside each frame. The photograph drifts against
      // the card it sits in, which is what stops three static crops in a row
      // from reading as a slide deck.
      mm.add(MOTION_DESKTOP, () => {
        q(scope, "[data-step]").forEach((step) => {
          const img = step.querySelector("[data-step-image]");
          if (!img) return;
          gsap.fromTo(
            img,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: step, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });

      /* Mobile: Stagger steps reveal */
      mm.add(MOTION_COMPACT, () => {
        const steps = q(scope, "[data-step]");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: scope.querySelector("ol"), start: "top 85%", once: true },
        });
        riseCard(tl, steps, { stagger: 0.1, scaleFrom: 0.96 }, 0);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={SECTION_IDS.process} className="relative w-full bg-paper pb-[clamp(72px,10vw,140px)]">
      <div className="frame">
        <span data-divider aria-hidden className="block h-px w-full origin-left bg-hairline" />
      </div>

      <div className="frame flex flex-col items-center gap-5 pb-[clamp(48px,6vw,88px)] pt-[clamp(56px,8vw,120px)] text-center">
        <div data-eyebrow>
          <Eyebrow items={processIntro.eyebrow} align="center" />
        </div>
        <div data-statement>
          <Statement segments={processIntro.statement} className="t-statement max-w-[32ch]" />
        </div>
        <p data-step-caption data-reveal className="t-body max-w-[58ch] text-body-light">
          {processIntro.body}
        </p>
      </div>

      {/* ---------- Progress track ---------- */}
      <div className="frame mb-[clamp(28px,3.4vw,48px)] flex justify-center">
        <div className="relative flex w-full max-w-[807px] items-center justify-between">
          <span
            data-track
            aria-hidden
            className="absolute inset-x-0 top-1/2 block h-px origin-left -translate-y-1/2 bg-hairline"
          />
          {processSteps.map((step, i) => (
            <span
              key={step.id}
              data-dot
              aria-hidden
              className={clsx(
                "relative block rounded-full",
                i === ACTIVE ? "size-[20px] bg-accent" : "size-[13px] bg-hairline",
              )}
            />
          ))}
        </div>
      </div>

      {/* ---------- Steps ----------
          `items-start` rather than `items-end`: the index/label row is the top
          edge of each card, so bottom-aligning cards of different heights left
          the three labels sitting at three different heights, which read as a
          layout accident rather than as emphasis. */}
      <ol
        className={[
          "flex gap-[clamp(16px,3.68vw,53px)]",
          "snap-x snap-mandatory overflow-x-auto px-[clamp(20px,5.55vw,80px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "lg:mx-auto lg:max-w-[1440px] lg:snap-none lg:items-start lg:justify-between lg:overflow-visible",
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
                "group flex w-[78vw] max-w-[420px] shrink-0 snap-center flex-col gap-[10px]",
                active
                  ? "lg:w-[27.8vw] lg:max-w-[400px]"
                  : "lg:w-[25.4vw] lg:max-w-[366px]",
              )}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className={clsx("t-eyebrow tabular-nums", active ? "text-accent" : "text-ink/45")}>
                  {step.index}
                </span>
                <span className={clsx("t-eyebrow", active ? "text-ink" : "text-ink/55")}>
                  {step.label}
                </span>
              </div>

              <div
                className={clsx(
                  "relative w-full overflow-hidden rounded-[15px]",
                  active ? "aspect-[400/450]" : "aspect-[366/412]",
                )}
              >
                {step.image && (
                  // Oversized and offset so the parallax has somewhere to
                  // travel without exposing the card ground at either end.
                  <div data-step-image className="absolute -inset-y-[8%] inset-x-0">
                    <Image
                      src={step.image.src}
                      alt={step.image.alt}
                      fill
                      sizes="(max-width: 1023px) 78vw, 28vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.88) 100%)",
                  }}
                />
                {/* text-white, not text-ink. This caption sits on an 88%-black
                    ramp; in ink it was invisible on every one of the three. */}
                <p
                  data-step-caption
                  data-reveal
                  className="absolute inset-x-0 bottom-0 px-[clamp(14px,1.6vw,22px)] pb-[clamp(14px,1.6vw,22px)] t-body-sm text-white/90"
                >
                  {step.caption ?? (
                    <span className="text-white/50" title={step.note}>
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
