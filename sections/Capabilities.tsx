"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, fadeIn, growRule, riseCard, settle, entranceTrigger, q } from "@/motion/primitives";
import { DUR, STAGGER, MOTION_OK, MOTION_DESKTOP, MOTION_COMPACT } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";
import { CircleButton } from "@/components/Buttons";
import { capabilities, capabilitiesIntro } from "@/content/capabilities";
import { SECTION_IDS } from "@/content/navigation";

/**
 * Figma 1782–2780px. "What we build" — the pinned horizontal carousel.
 *
 * Node 6:57 in the export animates `x` and nothing else, which is the tell that
 * this is a scrubbed horizontal track rather than a set of discrete slides.
 *
 * Desktop pins the section and scrubs the track. Touch does not: a hijacked
 * horizontal pin is the single worst-behaving pattern on mobile, it fights the
 * iOS address bar, and it strands anyone who scrolls fast. Below 1024 the same
 * track becomes a native snap rail — same content, same order, no hijack.
 */
export function Capabilities() {
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
        const intro = gsap.timeline({ scrollTrigger: entranceTrigger(scope) });
        fadeIn(intro, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.04 }, 0);
        growRule(intro, q(scope, "[data-eyebrow] [data-reveal-rule]"), {}, 0);
        fadeUp(intro, q(scope, "[data-statement]"), { duration: DUR.statement }, 0.2);
        fadeUp(intro, q(scope, "[data-intro-body]"), {}, 0.45);
      });

      // ---- Slides: card rise + image settle, 0.15s apart in the export ----
      mm.add(MOTION_DESKTOP, () => {
        const cards = q(scope, "[data-slide]");
        const images = q(scope, "[data-slide-image]");

        const reveal = gsap.timeline({
          scrollTrigger: { trigger: viewport.current!, start: "top 85%", once: true },
        });
        riseCard(reveal, cards, { stagger: STAGGER.capabilities, scaleFrom: 0.92 }, 0);
        settle(reveal, images, { stagger: STAGGER.capabilities, scaleFrom: 1.14 }, 0);
        fadeUp(reveal, q(scope, "[data-slide-meta]"), { stagger: 0.1, distance: 24 }, 0.6);

        // ---- The pin ----
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
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      // ---- Touch: reveal in place, no pin ----
      mm.add(MOTION_COMPACT, () => {
        const reveal = gsap.timeline({
          scrollTrigger: { trigger: viewport.current!, start: "top 85%", once: true },
        });
        riseCard(reveal, q(scope, "[data-slide]"), { stagger: 0.12, scaleFrom: 0.96 }, 0);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={SECTION_IDS.capabilities}
      className="relative w-full overflow-hidden bg-ink lg:h-svh lg:min-h-[720px]"
    >
      {/* ---------- Copy block ---------- */}
      <div className="frame relative z-20 flex flex-col gap-[14px] pt-[clamp(72px,10vw,140px)] lg:absolute lg:left-0 lg:right-auto lg:top-1/2 lg:w-[min(24vw,345px)] lg:-translate-y-1/2 lg:pt-0">
        <div data-eyebrow>
          <Eyebrow items={capabilitiesIntro.eyebrow} tone="light" />
        </div>
        <div data-statement data-reveal>
          <Statement segments={capabilitiesIntro.statement} tone="light" className="t-statement" />
        </div>
        <p data-intro-body data-reveal className="t-body max-w-[334px] text-body-dark">
          {capabilitiesIntro.body}
        </p>
      </div>

      {/* ---------- Track ---------- */}
      <div
        ref={viewport}
        className="relative lg:absolute lg:inset-y-0 lg:left-[30%] lg:right-0 lg:flex lg:items-center lg:overflow-hidden"
      >
        <ul
          ref={track}
          data-capability-track
          className={[
            "flex gap-[34px] py-[clamp(40px,7vw,72px)]",
            // Mobile: a real scroll rail with snap points.
            "snap-x snap-mandatory overflow-x-auto px-[clamp(20px,5.55vw,80px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            // Desktop: GSAP owns x, so native scrolling is off.
            "lg:overflow-visible lg:px-0 lg:pr-[90px] lg:py-0 lg:snap-none",
          ].join(" ")}
        >
          {capabilities.map((capability, i) => (
            <li
              key={capability.id}
              data-slide
              data-reveal
              className="relative aspect-[950/700] w-[84vw] max-w-[950px] shrink-0 snap-center overflow-hidden rounded-[20px] bg-ink-soft lg:w-[min(64vw,920px)]"
            >
              {capability.image && (
                <div data-slide-image className="absolute inset-0">
                  <Image
                    src={capability.image.src}
                    alt={capability.image.alt}
                    fill
                    sizes="(max-width: 1023px) 84vw, 64vw"
                    className="object-cover"
                  />
                </div>
              )}
              {/* Bottom-weighted scrim: transparent at 15%, 85% black at 105%. */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(102,102,102,0) 15%, rgba(0,0,0,0.85) 105%)",
                }}
              />

              {i === 0 && (
                <div className="absolute right-[36px] top-[16px] z-10">
                  <CircleButton href={null} label="Next capability" />
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-[clamp(20px,2.7vw,39px)] pb-[clamp(20px,2.2vw,31px)]">
                <h3 data-slide-meta data-reveal className="t-slide max-w-[265px] text-white">
                  {capability.title}
                </h3>
                <p data-slide-meta data-reveal className="t-index text-white">
                  {capability.index}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
