"use client";

import { useRef } from "react";
import { ClientHive } from "@/components/ClientHive";
import { clientRoster } from "@/content/clientRoster";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, growRule, riseCard, release, entranceTrigger, q } from "@/motion/primitives";
import { MOTION_OK } from "@/motion/ease";
import type { Client } from "@/content/clients";
import type { contact as ContactShape } from "@/content/company";
import { SECTION_IDS } from "@/content/navigation";

export function ClientsView({}: {
  clients: Client[];
  contact?: typeof ContactShape;
  events?: { organisation: string; event: string }[];
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: entranceTrigger(scope),
          onComplete: () =>
            release(q(scope, "[data-reveal], [data-reveal-rule]")),
        });
        growRule(tl, q(scope, "[data-divider]"), { duration: 0.9 }, 0);
        fadeUp(tl, q(scope, "[data-clients-header]"), { distance: 20 }, 0.15);
        riseCard(
          tl,
          q(scope, "[data-center-hexagon]"),
          { distance: 35, scaleFrom: 0.8 },
          0.35,
        );
        fadeUp(
          tl,
          q(scope, "[data-logo-tile]"),
          { stagger: 0.04, distance: 24, scaleFrom: 0.88 },
          0.45,
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={SECTION_IDS.clients}
      className="relative w-full bg-paper py-[clamp(40px,6vw,90px)] flex flex-col"
    >
      <div className="w-full">
        <div className="frame">
          <span
            data-divider
            aria-hidden
            className="block h-px w-full origin-left bg-ink/12 mb-[clamp(32px,5vw,70px)]"
          />
        </div>

        <div className="frame w-full">
          <div className="relative w-full py-12 sm:py-16 lg:py-20 lg:min-h-[85vh] rounded-[28px] sm:rounded-[44px] lg:rounded-[56px] bg-gradient-to-b from-white via-[#fafbfe] to-[#f0f3f7] border border-ink/8 shadow-[0_28px_80px_-20px_rgba(0,0,0,0.08)] p-5 sm:p-10 md:p-14 lg:p-20 flex flex-col items-center justify-center overflow-hidden">
            {/* Atmospheric blurs */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-brand-blue/8 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-purple-500/8 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full bg-brand-blue/5 blur-[110px]"
            />

            {/* Header */}
            <div
              data-clients-header
              data-reveal
              className="mx-auto max-w-[760px] text-center mb-10 sm:mb-14 lg:mb-16"
            >
              <p className="t-eyebrow text-accent font-mono tracking-[0.2em] uppercase text-xs sm:text-sm mb-3 font-medium">
                Institutional &amp; Enterprise Trust
              </p>
              <h2 className="text-[clamp(2rem,5vw,3.25rem)] font-bold text-ink tracking-tight leading-[1.08]">
                Partners &amp; Clients with Raja Enterprises
              </h2>
              <p className="mt-3.5 text-body-light text-sm sm:text-base md:text-lg leading-relaxed max-w-[58ch] mx-auto">
                From government mega-summits to global corporate forums and
                trade exhibitions &mdash; we build the ground where leaders
                gather.
              </p>
            </div>

            <ClientHive roster={clientRoster()} />

          </div>
        </div>
      </div>
    </section>
  );
}