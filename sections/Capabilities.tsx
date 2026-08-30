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
  settle,
  revealLines,
  release,
  entranceTrigger,
  q,
} from "@/motion/primitives";
import { STAGGER, MOTION_OK, MOTION_DESKTOP, MOTION_COMPACT } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";
import { capabilitiesIntro } from "@/content/capabilities";
import type { Capability } from "@/content/capabilities";
import { SECTION_IDS } from "@/content/navigation";

export function CapabilitiesView({ capabilities }: { capabilities: Capability[] }) {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();

      // ---- Copy block: identical on every breakpoint ----
      mm.add(MOTION_OK, () => {
        const intro = gsap.timeline({
          scrollTrigger: entranceTrigger(scope),
          onComplete: () => release(q(scope, "[data-intro-body], [data-eyebrow] [data-reveal]")),
        });
        fadeIn(intro, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.04 }, 0);
        growRule(intro, q(scope, "[data-eyebrow] [data-reveal-rule]"), {}, 0);
        fadeUp(intro, q(scope, "[data-intro-body]"), {}, 0.5);

        // The statement is typeset line by line rather than moved as a block.
        const revert = revealLines(q(scope, "[data-statement] h2"), {
          stagger: 0.09,
          trigger: { trigger: scope, start: "top 78%", once: true },
        });

        return () => revert();
      });

      // ---- Slides: card rise + image settle, then the pin ----
      mm.add(MOTION_DESKTOP, () => {
        const cards = q(scope, "[data-slide]");
        const images = q(scope, "[data-slide-image]");

        const reveal = gsap.timeline({
          scrollTrigger: { trigger: viewport.current!, start: "top 85%", once: true },
          onComplete: () => release([...cards, ...q(scope, "[data-slide-meta]")]),
        });
        riseCard(reveal, cards, { stagger: STAGGER.capabilities, scaleFrom: 0.92 }, 0);
        settle(reveal, images, { stagger: STAGGER.capabilities, scaleFrom: 1.14 }, 0);
        fadeUp(reveal, q(scope, "[data-slide-meta]"), { stagger: 0.1, distance: 24 }, 0.6);

        const trackEl = track.current;
        const viewportEl = viewport.current;
        if (!trackEl || !viewportEl) return;

        const distance = () => Math.max(0, trackEl.scrollWidth - viewportEl.clientWidth);

        const tween = gsap.to(trackEl, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: scope,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            // A shorter catch-up than the previous 1.1. Above about 0.8 the
            // track visibly lags the wheel, which reads as weight on the way
            // in and as unresponsiveness on the way back out.
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // The progress bar and the counter are driven off the same
              // ScrollTrigger rather than a second one, so they cannot desync.
              const bar = scope.querySelector<HTMLElement>("[data-track-progress]");
              if (bar) bar.style.transform = `scaleX(${self.progress})`;
              const counter = scope.querySelector<HTMLElement>("[data-track-index]");
              if (counter) {
                const i = Math.min(capabilities.length - 1, Math.round(self.progress * (capabilities.length - 1)));
                counter.textContent = capabilities[i].index;
              }
            },
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      // ---- Touch: reveal in place, no pin ----
      mm.add(MOTION_COMPACT, () => {
        const cards = q(scope, "[data-slide]");
        const reveal = gsap.timeline({
          scrollTrigger: { trigger: viewport.current!, start: "top 85%", once: true },
          onComplete: () => release(cards),
        });
        riseCard(reveal, cards, { stagger: 0.12, scaleFrom: 0.96 }, 0);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={SECTION_IDS.capabilities}
      // z-30 and the negative top margin let this section slide up over the
      // legacy collage as it leaves, which is what closes the seam between two
      // sections that share the same ground colour.
      className="relative z-30 w-full overflow-hidden bg-paper lg:h-svh lg:min-h-[720px] rounded-t-[36px] md:rounded-t-[48px] shadow-[0_-30px_70px_rgba(0,0,0,0.12)] border-t border-ink/5"
    >
      {/* ---------- Copy block ----------
          NOT `.frame`. That utility carries `width:100%`, and because it is
          authored after Tailwind's own utilities in globals.css it wins the
          cascade against `lg:w-[...]` — which is what made this column run the
          full 1440 and sit underneath the sliding cards. The gutter is stated
          directly here instead. */}
      <div className="relative z-20 flex flex-col gap-[14px] px-[clamp(20px,5.55vw,80px)] pt-[clamp(72px,10vw,140px)] lg:absolute lg:left-0 lg:top-1/2 lg:w-[min(33vw,470px)] lg:-translate-y-1/2 lg:pr-0 lg:pt-0">
        <div data-eyebrow>
          <Eyebrow items={capabilitiesIntro.eyebrow} tone="dark" />
        </div>
        <div data-statement>
          <Statement
            segments={capabilitiesIntro.statement}
            tone="dark"
            className="t-statement lg:text-[clamp(1.75rem,2.6vw,2.4rem)]"
          />
        </div>
        <p data-intro-body data-reveal className="t-body max-w-[38ch] text-body-light">
          {capabilitiesIntro.body}
        </p>

        {/* Desktop-only scroll affordance. A pinned horizontal track with no
            indicator gives a visitor no way to tell how much is left, which is
            the most common reason people scroll straight past one. */}
        <div className="mt-[clamp(20px,2.4vw,34px)] hidden items-center gap-4 lg:flex">
          <span data-track-index className="t-eyebrow tabular-nums text-ink">
            {capabilities[0].index}
          </span>
          <span aria-hidden className="relative h-px w-[120px] overflow-hidden bg-ink/15">
            <span
              data-track-progress
              className="absolute inset-0 origin-left bg-accent"
              style={{ transform: "scaleX(0)" }}
            />
          </span>
          <span className="t-eyebrow text-ink/40">
            {String(capabilities.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* ---------- Track ---------- */}
      <div
        ref={viewport}
        className="relative lg:absolute lg:inset-y-0 lg:left-[min(35vw,500px)] lg:right-0 lg:flex lg:items-center lg:overflow-hidden"
      >
        <ul
          ref={track}
          data-capability-track
          className={[
            "flex gap-[34px] py-[clamp(40px,7vw,72px)]",
            "snap-x snap-mandatory overflow-x-auto px-[clamp(20px,5.55vw,80px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "lg:overflow-visible lg:px-0 lg:pr-[90px] lg:py-0 lg:snap-none",
          ].join(" ")}
        >
          {capabilities.map((capability) => (
            <li
              key={capability.id}
              data-slide
              data-reveal
              className="group relative aspect-[950/700] w-[84vw] max-w-[950px] shrink-0 snap-center overflow-hidden rounded-[20px] bg-mist lg:w-[min(60vw,880px)]"
            >
              {capability.image && (
                <div data-slide-image className="absolute inset-0">
                  <Image
                    src={capability.image.src}
                    alt={capability.image.alt}
                    fill
                    sizes="(max-width: 1023px) 84vw, 60vw"
                    priority={capability.index === "01" || capability.index === "02"}
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                    style={
                      capability.image.focal ? { objectPosition: capability.image.focal } : undefined
                    }
                  />
                </div>
              )}

              {/* Two scrims, not one: a light top wash so the chapter number
                  holds on a bright frame, and the heavy bottom ramp for the
                  title. A single bottom gradient left the number invisible on
                  the daylight shots. */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.82) 100%)",
                }}
              />

              <div className="absolute right-[clamp(16px,2vw,36px)] top-[clamp(12px,1.5vw,24px)] z-10">
                <span
                  data-slide-meta
                  data-reveal
                  className="block font-serif text-[clamp(3rem,6vw,5.5rem)] font-bold leading-none text-white/35"
                >
                  {capability.index}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[6px] px-[clamp(20px,2.7vw,39px)] pb-[clamp(20px,2.2vw,31px)]">
                <h3 data-slide-meta data-reveal className="t-slide max-w-[14ch] text-white">
                  {capability.title}
                </h3>
                {capability.summary && (
                  <p
                    data-slide-meta
                    data-reveal
                    className="t-body-sm max-w-[46ch] text-white/70"
                  >
                    {capability.summary}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
