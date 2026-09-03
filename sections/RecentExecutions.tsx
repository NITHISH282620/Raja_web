"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  fadeIn,
  growRule,
  revealLines,
  entranceTrigger,
  q,
} from "@/motion/primitives";
import { MOTION_OK } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { recentExecutions } from "@/content/events";
import { clsx } from "@/lib/clsx";

export function RecentExecutions() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      const trackEl = track.current;
      const viewportEl = viewport.current;
      if (!scope || !trackEl || !viewportEl) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // 1. Entrance animation (Header)
        const tlEntrance = gsap.timeline({
          scrollTrigger: entranceTrigger(scope),
        });

        fadeIn(tlEntrance, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.04 }, 0);
        growRule(tlEntrance, q(scope, "[data-eyebrow] [data-reveal-rule]"), {}, 0);
        growRule(tlEntrance, q(scope, "[data-header-rule]"), {}, 0.15);

        const revert = revealLines(q(scope, "[data-gallery-title] h2"), {
          stagger: 0.09,
          trigger: { trigger: scope, start: "top 78%", once: true },
        });

        // 2. Infinite Marquee Animation
        // Duplicate the cards in the DOM to make it seamless
        // We will animate track x from 0 to -50% (since we duplicated it, 50% is the exact length of the original list)
        
        const scrollAmount = trackEl.scrollWidth / 2; // Since it's duplicated, we only want to scroll half of the total width
        
        const tlMarquee = gsap.to(trackEl, {
          x: () => -scrollAmount,
          ease: "none",
          duration: 35, // Adjust speed here
          repeat: -1,
        });

        // Pause on hover over the section (specifically viewport)
        viewportEl.addEventListener('mouseenter', () => tlMarquee.pause());
        viewportEl.addEventListener('mouseleave', () => tlMarquee.play());

        return () => {
          revert();
          viewportEl.removeEventListener('mouseenter', () => tlMarquee.pause());
          viewportEl.removeEventListener('mouseleave', () => tlMarquee.play());
          tlMarquee.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  // We duplicate the array to create the infinite seamless loop effect
  const duplicatedExecutions = [...recentExecutions, ...recentExecutions];

  return (
    <section
      ref={root}
      className="relative w-full overflow-hidden bg-paper flex flex-col justify-center py-12 lg:py-20"
    >
      {/* Header section */}
      <div className="frame flex flex-col gap-4 lg:gap-6 pb-8 lg:pb-12">
        <div data-eyebrow>
          <Eyebrow items={["recent", "events"]} tone="dark" />
        </div>
        <div data-gallery-title>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-display font-bold leading-[0.95] tracking-tight text-ink uppercase">
            Recent<br />Events
          </h2>
        </div>
        <span
          data-header-rule
          data-reveal-rule
          aria-hidden
          className="block h-px w-full origin-left bg-ink/10 mt-4"
        />
      </div>

      {/* Viewport for horizontal scrolling */}
      <div ref={viewport} className="w-full overflow-hidden">
        {/* Track that slides continuously left */}
        <div 
          ref={track} 
          className="grid grid-rows-2 gap-4 md:gap-6 w-max grid-flow-col px-6 h-[50vh] md:h-[60vh] min-h-[400px] max-h-[800px]"
        >
          {duplicatedExecutions.map((exe, i) => (
            <Link
              href={`/events/${exe.slug}`}
              key={i}
              className={clsx(
                "group relative overflow-hidden rounded-[24px] cursor-pointer block h-full",
                exe.size === "tall" ? "row-span-2 w-[280px] md:w-[350px]" : 
                exe.size === "wide" ? "row-span-1 col-span-2 w-[576px] md:w-[724px]" : 
                "row-span-1 col-span-1 w-[280px] md:w-[350px]"
              )}
            >
              {/* Image Container */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={exe.image}
                  alt={exe.project}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
              </div>

              {/* Gradient overlay */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/90"
              />

              {/* Year badge */}
              <div className="absolute top-6 right-6 z-10">
                <span className="inline-block rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-[12px] font-mono font-medium tracking-wider text-white/90 uppercase border border-white/20">
                  {exe.year}
                </span>
              </div>

              {/* Event name */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8">
                <h3 className="text-[clamp(1.25rem,2vw,1.75rem)] font-display font-bold leading-tight text-white uppercase tracking-wide transition-transform duration-500 ease-out group-hover:-translate-y-2">
                  {exe.project}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
