"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";
import { eventsWeBuildFor } from "@/content/events";
import { fadeUp, riseCard, settle } from "@/motion/primitives";

export function EventsWeBuildFor() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const scope = root.current;
      if (!scope) return;

      const q = gsap.utils.selector(scope);
      const release = (targets: any[]) => gsap.set(targets, { clearProps: "all" });

      mm.add("(min-width: 1024px)", () => {
        const cards = q("[data-slide]");
        const images = q("[data-slide-image] img");
        
        const reveal = gsap.timeline({
          scrollTrigger: { trigger: scope, start: "top 70%", once: true },
          onComplete: () => release([...cards, ...q("[data-slide-meta]")])
        });
        riseCard(reveal, cards, { stagger: 0.1, scaleFrom: 0.92 }, 0);
        if (images.length) settle(reveal, images, { stagger: 0.1, scaleFrom: 1.14 }, 0);
        fadeUp(reveal, q("[data-slide-meta]"), { stagger: 0.1, distance: 24 }, 0.6);

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
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const bar = scope.querySelector<HTMLElement>("[data-track-progress]");
              if (bar) bar.style.transform = `scaleX(${self.progress})`;
              const counter = scope.querySelector<HTMLElement>("[data-track-index]");
              if (counter) {
                const i = Math.min(eventsWeBuildFor.length - 1, Math.round(self.progress * (eventsWeBuildFor.length - 1)));
                counter.textContent = "0" + (i + 1);
              }
            },
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      mm.add("(max-width: 1023px)", () => {
        const cards = q("[data-slide]");
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
      id="events-we-build-for"
      className="relative z-30 w-full overflow-hidden bg-paper lg:h-svh lg:min-h-[720px] shadow-[0_-30px_70px_rgba(0,0,0,0.12)] border-t border-ink/5"
    >
      <div className="relative z-20 flex flex-col gap-[14px] px-[clamp(20px,5.55vw,80px)] pt-[clamp(72px,10vw,140px)] lg:absolute lg:left-0 lg:top-1/2 lg:w-[min(33vw,470px)] lg:-translate-y-1/2 lg:pr-0 lg:pt-0">
        <div data-eyebrow>
          <Eyebrow items={["events we", "build for"]} tone="dark" />
        </div>
        <div data-statement>
          <Statement
            segments={[{text: "Scale and precision for every format."}]}
            tone="dark"
            className="t-statement lg:text-[clamp(1.75rem,2.6vw,2.4rem)]"
          />
        </div>
        <p data-intro-body data-reveal className="t-body max-w-[38ch] text-body-light">
          From high-security national inaugurations to mega-scale industrial trade fairs, we build the physical environments that major events demand.
        </p>

        <div className="mt-[clamp(20px,2.4vw,34px)] hidden items-center gap-4 lg:flex">
          <span data-track-index className="t-eyebrow tabular-nums text-ink">
            01
          </span>
          <span aria-hidden className="relative h-px w-[120px] overflow-hidden bg-ink/15">
            <span
              data-track-progress
              className="absolute inset-0 origin-left bg-accent"
              style={{ transform: "scaleX(0)" }}
            />
          </span>
          <span className="t-eyebrow text-ink/40">
            0{eventsWeBuildFor.length}
          </span>
        </div>
      </div>

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
          {eventsWeBuildFor.map((event, index) => (
            <li
              key={event.id}
              data-slide
              data-reveal
              className="group relative flex flex-col justify-end aspect-[950/700] w-[84vw] max-w-[950px] shrink-0 snap-center overflow-hidden rounded-[20px] bg-ink lg:w-[min(60vw,880px)] px-[clamp(20px,2.7vw,39px)] pb-[clamp(20px,2.2vw,31px)]"
            >
              {event.image && (
                <div data-slide-image className="absolute inset-0">
                  <Image
                    src={event.image.src}
                    alt={event.image.alt || event.title}
                    fill
                    sizes="(max-width: 1023px) 84vw, 60vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.82) 100%)",
                }}
              />
              <div className="absolute
              <div className="absolute right-[clamp(16px,2vw,36px)] top-[clamp(12px,1.5vw,24px)] z-10">
                <span
                  data-slide-meta
                  data-reveal
                  className="block font-serif text-[clamp(3rem,6vw,5.5rem)] font-bold leading-none text-white/35"
                >
                  0{index + 1}
                </span>
              </div>

              <div className="relative z-20 flex flex-col gap-[6px]">
                <h3 data-slide-meta data-reveal className="t-slide max-w-[14ch] text-white">
                  {event.title}
                </h3>
                <p
                  data-slide-meta
                  data-reveal
                  className="t-body-sm max-w-[46ch] text-white/70"
                >
                  {event.summary}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
