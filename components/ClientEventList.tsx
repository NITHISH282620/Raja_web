"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, release, q } from "@/motion/primitives";
import { MOTION_OK } from "@/motion/ease";
import type { ClientEvent } from "@/content/clientEvents";

/**
 * The recent-engagements table.
 *
 * This is the strongest evidence on the page — ten named organisations and the
 * events Raja delivered for them — so it is set as a table rather than as a
 * grid of cards. A reader scanning for "have they done anything like mine?"
 * wants to run their eye down a column, not read ten boxes.
 */
export function ClientEventList({ events }: { events: ClientEvent[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rows = q(scope, "[data-row]");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: scope, start: "top 82%", once: true },
          onComplete: () => release([...rows, ...q(scope, "[data-list-head]")]),
        });
        fadeUp(tl, q(scope, "[data-list-head]"), { distance: 18 }, 0);
        fadeUp(
          tl,
          rows,
          { stagger: 0.055, distance: 22, staggerEase: "power1.inOut" },
          0.15,
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="mx-auto w-full max-w-5xl">
      <div data-list-head data-reveal className="mb-[clamp(20px,2.4vw,34px)] flex items-baseline justify-between gap-6">
        <h3 className="t-section-label text-ink/45">Recent engagements</h3>
        <span className="t-eyebrow tabular-nums text-ink/30">
          {String(events.length).padStart(2, "0")}
        </span>
      </div>

      <ul className="flex flex-col">
        {events.map((item, i) => (
          <li
            key={item.organisation + item.event}
            data-row
            data-reveal
            className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-1 border-t border-hairline py-[clamp(16px,1.9vw,26px)] last:border-b sm:grid-cols-[2.5rem_1.1fr_1fr] sm:gap-x-8"
          >
            <span className="t-eyebrow tabular-nums text-ink/30 transition-colors duration-300 group-hover:text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="t-body font-medium text-ink">{item.organisation}</p>
            <p className="col-start-2 t-body-sm text-body-light sm:col-start-3 sm:text-right">
              {item.event}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
