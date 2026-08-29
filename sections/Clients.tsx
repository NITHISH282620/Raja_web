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
 * Modern Constellation Logo Section:
 * - Glowing Central Raja Enterprises Hexagonal Shield Emblem with hover animation
 * - Symmetrical left & right floating partner logo clusters with float micro-animations
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
        fadeUp(tl, q(scope, "[data-clients-header]"), { distance: 20 }, 0.15);
        riseCard(tl, q(scope, "[data-center-shield]"), { distance: 35, scaleFrom: 0.82 }, 0.35);
        fadeUp(tl, q(scope, "[data-logo-tile]"), { stagger: 0.04, distance: 24, scaleFrom: 0.9 }, 0.45);
        fadeUp(tl, q(scope, "[data-cta-eyebrow]"), { distance: 18 }, 0.8);
        riseCard(tl, q(scope, "[data-cta-button]"), { distance: 18, scaleFrom: 0.9 }, 1.0);

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

  const leftClients = clients.slice(0, 6);
  const rightClients = clients.slice(6, 12);

  return (
    <section ref={root} id={SECTION_IDS.clients} className="relative w-full overflow-hidden bg-paper py-[clamp(64px,8vw,110px)]">
      <div className="frame">
        <span data-divider aria-hidden className="block h-px w-full origin-left bg-ink/12 mb-[clamp(48px,6vw,80px)]" />

        {/* ====================================================================
            Modern Dribbble-Style Constellation Hub Card
           ==================================================================== */}
        <div className="relative w-full overflow-hidden rounded-[28px] sm:rounded-[36px] lg:rounded-[48px] bg-gradient-to-b from-white via-[#fbfcfd] to-[#f2f4f7] border border-ink/8 shadow-[0_24px_70px_-16px_rgba(0,0,0,0.07)] p-6 sm:p-10 md:p-14 lg:p-16">
          {/* Subtle Ambient Background Gradient Glows */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-blue/5 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/5 blur-3xl"
          />

          {/* Section Header */}
          <div data-clients-header data-reveal className="mx-auto max-w-[700px] text-center mb-10 md:mb-14">
            <p className="t-eyebrow text-accent font-mono tracking-[0.18em] uppercase text-xs sm:text-sm mb-3">
              Institutional &amp; Enterprise Trust
            </p>
            <h2 className="text-[clamp(1.75rem,4.5vw,2.75rem)] font-bold text-ink tracking-tight leading-[1.12]">
              Partners &amp; Clients with Raja Enterprises
            </h2>
            <p className="mt-3 text-body-light text-sm sm:text-base leading-relaxed max-w-[54ch] mx-auto">
              From state and federal governments to premier universities and global trade forums ’ we build the ground where leaders gather.
            </p>
          </div>

          {/* ====================================================================
              Constellation Layout: Left Cluster + Center Raja Emblem + Right Cluster
             ==================================================================== */}
          <div className="relative flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 xl:gap-10">
            {/* Left Partner Cluster (6 Logos) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 w-full lg:w-auto shrink-0 justify-items-center">
              {leftClients.map((client, idx) => (
                <div
                  key={client.id}
                  data-logo-tile
                  data-reveal
                  className={clsx(
                    "group relative flex h-[76px] w-[130px] sm:h-[84px] sm:w-[150px] md:h-[90px] md:w-[160px] items-center justify-center rounded-[18px] sm:rounded-[22px] bg-white/90 backdrop-blur-md p-3.5 shadow-[0_6px_20px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.06] transition-all duration-300 hover:scale-110 hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(0,0,0,0.12)] hover:ring-accent/40",
                    idx % 2 === 0 ? "animate-float" : "animate-float-delayed",
                  )}
                >
                  <Image
                    src={client.logo.src}
                    alt={client.name}
                    width={client.logo.width}
                    height={client.logo.height}
                    className="max-h-[48px] max-w-[115px] object-contain transition-all duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>

            {/* Central Elevated Raja Enterprises Shield Emblem */}
            <div
              data-center-shield
              data-reveal
              className="group relative my-4 lg:my-0 flex h-[160px] w-[160px] sm:h-[185px] sm:w-[185px] md:h-[205px] md:w-[205px] shrink-0 items-center justify-center rounded-[32px] sm:rounded-[40px] md:rounded-[48px] bg-gradient-to-br from-[#0c2333] via-[#063c5a] to-[#041c2c] p-6 shadow-[0_0_50px_rgba(6,60,90,0.4),0_20px_40px_rgba(0,0,0,0.25)] ring-2 ring-white/20 transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-[0_0_70px_rgba(235,85,87,0.5),0_25px_50px_rgba(6,60,90,0.45)] hover:ring-accent cursor-pointer"
            >
              {/* Internal glowing radial backdrop */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_50%_30%,rgba(235,85,87,0.25),transparent_70%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100"
              />

              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                {/* Clean RE Monogram Emblem */}
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/30 shadow-inner mb-2 transition-transform duration-500 group-hover:scale-110 group-hover:bg-accent group-hover:ring-accent">
                  <span className="font-mono text-lg sm:text-xl font-black text-white tracking-tighter">
                    RE
                  </span>
                </div>
                <span className="font-display font-bold text-xs sm:text-sm tracking-wider text-white uppercase leading-tight">
                  RAJA
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-white/70 uppercase">
                  ENTERPRISES
                </span>
                <span className="mt-1 font-mono text-[8px] sm:text-[9px] tracking-widest text-accent font-semibold">
                  EST. 1977
                </span>
              </div>
            </div>

            {/* Right Partner Cluster (6 Logos) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 w-full lg:w-auto shrink-0 justify-items-center">
              {rightClients.map((client, idx) => (
                <div
                  key={client.id}
                  data-logo-tile
                  data-reveal
                  className={clsx(
                    "group relative flex h-[76px] w-[130px] sm:h-[84px] sm:w-[150px] md:h-[90px] md:w-[160px] items-center justify-center rounded-[18px] sm:rounded-[22px] bg-white/90 backdrop-blur-md p-3.5 shadow-[0_6px_20px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.06] transition-all duration-300 hover:scale-110 hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(0,0,0,0.12)] hover:ring-accent/40",
                    idx % 2 === 0 ? "animate-float-delayed" : "animate-float",
                  )}
                >
                  <Image
                    src={client.logo.src}
                    alt={client.name}
                    width={client.logo.width}
                    height={client.logo.height}
                    className="max-h-[48px] max-w-[115px] object-contain transition-all duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ====================================================================
            The Closing CTA
           ==================================================================== */}
        <div className="flex flex-col items-center gap-[clamp(16px,1.9vw,26px)] pt-[clamp(64px,9vw,120px)] text-center">
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
      </div>
    </section>
  );
}

/**
 * Contact CTA Button
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