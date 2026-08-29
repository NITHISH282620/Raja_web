"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, growRule, riseCard, revealLines, release, entranceTrigger, q } from "@/motion/primitives";
import { MOTION_OK } from "@/motion/ease";
import { Statement } from "@/components/Statement";
import { closingCta, type Client } from "@/content/clients";
import type { contact as ContactShape } from "@/content/company";
import { SECTION_IDS } from "@/content/navigation";
import { clsx } from "@/lib/clsx";

/**
 * Clients & Closing CTA Section:
 * 
 * - Seamless Infinite Logo Marquee Slider (Logos only, no text names).
 * - Closing CTA: "Start a build / Let's build the ground your event stands on."
 */
export function ClientsView({
  clients,
  contact,
}: {
  clients: Client[];
  contact: typeof ContactShape;
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
          onComplete: () => release(q(scope, "[data-reveal], [data-reveal-rule]")),
        });

        growRule(tl, q(scope, "[data-divider]"), { duration: 0.9 }, 0);
        fadeUp(tl, q(scope, "[data-clients-label]"), { distance: 16 }, 0.15);
        fadeUp(tl, q(scope, "[data-marquee-wrap]"), { distance: 24, scaleFrom: 0.96 }, 0.28);
        fadeUp(tl, q(scope, "[data-cta-eyebrow]"), { distance: 18 }, 0.5);
        riseCard(tl, q(scope, "[data-cta-button]"), { distance: 18, scaleFrom: 0.9 }, 0.85);

        const revert = revealLines(q(scope, "[data-cta-statement] h2"), {
          stagger: 0.09,
          trigger: { trigger: scope, start: "top 65%", once: true },
        });
        return () => revert();
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  // Duplicate for seamless infinite loop
  const marqueeLogos = [...clients, ...clients];

  return (
    <section ref={root} id={SECTION_IDS.clients} className="relative w-full overflow-hidden bg-paper">
      <div className="frame">
        <span data-divider aria-hidden className="block h-px w-full origin-left bg-ink/12" />
      </div>

      {/* ---------- Who we build for ---------- */}
      <div className="flex flex-col items-center gap-[clamp(24px,3vw,36px)] pt-[clamp(64px,8vw,110px)]">
        <p data-clients-label data-reveal className="t-section-label text-ink/45 tracking-[0.16em] uppercase text-xs font-mono">
          Who we build for
        </p>

        {/* Continuous Infinite Logo Marquee Slider */}
        <div data-marquee-wrap data-reveal className="relative w-full overflow-hidden py-4">
          {/* Edge fade gradients */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 sm:w-36 bg-gradient-to-r from-paper to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 sm:w-36 bg-gradient-to-l from-paper to-transparent"
          />

          <div className="animate-marquee flex items-center gap-6 sm:gap-8 px-4">
            {marqueeLogos.map((client, i) => (
              <div
                key={`${client.id}-${i}`}
                className="group flex h-[84px] w-[170px] sm:h-[94px] sm:w-[195px] shrink-0 items-center justify-center rounded-[16px] border border-hairline bg-surface p-4 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.14)] hover:scale-[1.03]"
              >
                <Image
                  src={client.logo.src}
                  alt={client.name}
                  width={client.logo.width}
                  height={client.logo.height}
                  className="h-auto w-auto max-h-[56px] max-w-[140px] object-contain transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- The closing CTA ---------- */}
      <div className="frame flex flex-col items-center gap-[clamp(16px,1.9vw,26px)] py-[clamp(72px,10vw,140px)] text-center">
        <p data-cta-eyebrow data-reveal className="t-eyebrow text-accent font-mono tracking-[0.16em] uppercase">
          {closingCta.eyebrow}
        </p>
        <div data-cta-statement className="w-full">
          <Statement
            segments={closingCta.statement}
            tone="dark"
            className="t-statement mx-auto max-w-[20ch]"
          />
        </div>
        <div data-cta-button data-reveal className="mt-[clamp(8px,1vw,14px)]">
          <ContactButton contact={contact} />
        </div>
      </div>
    </section>
  );
}

/**
 * Renders as a real link the moment `contact.email` exists
 */
function ContactButton({ contact }: { contact: typeof ContactShape }) {
  const className =
    "group inline-flex h-[54px] items-center justify-center gap-3 rounded-full bg-brand-blue px-9 text-white shadow-md transition-all duration-300 hover:bg-brand-blue/90 hover:shadow-xl hover:scale-105";

  const inner = (
    <>
      <span className="t-body font-medium">{closingCta.label}</span>
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
        &rarr;
      </span>
    </>
  );

  if (contact.email) {
    return (
      <a href={`mailto:${contact.email}`} className={className}>
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-disabled
      data-provisional
      title={contact.note}
      className={clsx(className, "cursor-not-allowed opacity-70")}
    >
      {inner}
    </button>
  );
}