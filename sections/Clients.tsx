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
 * Reusable Rounded Hexagon Partner Badge
 */
function HexagonPartnerBadge({
  client,
  className,
  isDelayed = false,
}: {
  client: Client;
  className?: string;
  isDelayed?: boolean;
}) {
  return (
    <div
      data-logo-tile
      data-reveal
      className={clsx(
        "group relative flex items-center justify-center transition-all duration-500 hover:scale-110 hover:-translate-y-2 hover:z-30 cursor-pointer",
        isDelayed ? "animate-float-delayed" : "animate-float",
        className,
      )}
      style={{ filter: "drop-shadow(0 10px 22px rgba(0, 0, 0, 0.06))" }}
    >
      {/* Crisp Vector Hexagon Background */}
      <svg
        viewBox="0 0 140 160"
        className="w-[110px] h-[126px] sm:w-[125px] sm:h-[143px] md:w-[136px] md:h-[156px] transition-all duration-300 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M70 8 L130 42.5 L130 117.5 L70 152 L10 117.5 L10 42.5 Z"
          fill="#FFFFFF"
          stroke="#E5E7EB"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="transition-colors duration-300 group-hover:stroke-accent/60 group-hover:fill-white"
        />
      </svg>

      {/* Partner Logo Centered Inside Hexagon */}
      <div className="absolute inset-0 flex items-center justify-center p-5">
        <Image
          src={client.logo.src}
          alt={client.name}
          width={client.logo.width}
          height={client.logo.height}
          className="max-h-[44px] max-w-[76px] sm:max-h-[50px] sm:max-w-[88px] object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </div>
  );
}

/**
 * Full-Screen Constellation Logo Section with Honeycomb Hexagons
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
        riseCard(tl, q(scope, "[data-center-hexagon]"), { distance: 35, scaleFrom: 0.8 }, 0.35);
        fadeUp(tl, q(scope, "[data-logo-tile]"), { stagger: 0.04, distance: 24, scaleFrom: 0.88 }, 0.45);
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
    <section
      ref={root}
      id={SECTION_IDS.clients}
      className="relative w-full min-h-screen bg-paper py-[clamp(64px,8vw,110px)] flex flex-col justify-between"
    >
      <div className="w-full">
        <div className="frame">
          <span data-divider aria-hidden className="block h-px w-full origin-left bg-ink/12 mb-[clamp(40px,5vw,70px)]" />
        </div>

        {/* ====================================================================
            Full-Bleed Modern Constellation Hub Container
           ==================================================================== */}
        <div className="frame w-full">
          <div className="relative w-full min-h-[85vh] lg:min-h-[90vh] rounded-[32px] sm:rounded-[44px] lg:rounded-[56px] bg-gradient-to-b from-white via-[#fafbfe] to-[#f0f3f7] border border-ink/8 shadow-[0_28px_80px_-20px_rgba(0,0,0,0.08)] p-6 sm:p-10 md:p-14 lg:p-20 flex flex-col items-center justify-center overflow-hidden">
            {/* Ambient Radial Color Halos */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-28 top-1/4 h-96 w-96 rounded-full bg-brand-blue/6 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-28 top-1/4 h-96 w-96 rounded-full bg-accent/6 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-brand-blue/5 blur-[120px]"
            />

            {/* Section Header */}
            <div data-clients-header data-reveal className="mx-auto max-w-[760px] text-center mb-12 sm:mb-16 lg:mb-20">
              <p className="t-eyebrow text-accent font-mono tracking-[0.2em] uppercase text-xs sm:text-sm mb-3.5 font-medium">
                Institutional &amp; Enterprise Trust
              </p>
              <h2 className="text-[clamp(2rem,5vw,3.25rem)] font-bold text-ink tracking-tight leading-[1.08]">
                Partners &amp; Clients with Raja Enterprises
              </h2>
              <p className="mt-4 text-body-light text-sm sm:text-base md:text-lg leading-relaxed max-w-[58ch] mx-auto">
                From government mega-summits to global corporate forums and trade exhibitions ’ we build the ground where leaders gather.
              </p>
            </div>

            {/* ====================================================================
                Hexagonal Honeycomb Constellation
               ==================================================================== */}
            <div className="relative w-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-4 xl:gap-8 my-auto">
              {/* Left Wing (6 Hexagons in Honeycomb Formation) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:-space-x-4 items-center justify-items-center">
                {leftClients.map((client, idx) => (
                  <HexagonPartnerBadge
                    key={client.id}
                    client={client}
                    isDelayed={idx % 2 === 1}
                    className={clsx(
                      idx === 1 || idx === 4 ? "lg:translate-y-6" : "lg:-translate-y-3",
                    )}
                  />
                ))}
              </div>

              {/* Central Elevated Raja Enterprises Glowing Hexagon Shield */}
              <div
                data-center-hexagon
                data-reveal
                className="group relative my-6 lg:my-0 flex items-center justify-center shrink-0 cursor-pointer transition-all duration-500 hover:scale-110 hover:rotate-2 hover:z-40"
                style={{ filter: "drop-shadow(0 0 45px rgba(6, 60, 90, 0.4))" }}
              >
                {/* Vector Dark Hexagon with Gradient and Glow */}
                <svg
                  viewBox="0 0 200 230"
                  className="w-[180px] h-[207px] sm:w-[200px] sm:h-[230px] md:w-[220px] md:h-[253px] transition-all duration-500 group-hover:scale-105"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="reDarkHex" x1="100" y1="0" x2="100" y2="230" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#0c2333" />
                      <stop offset="50%" stopColor="#063c5a" />
                      <stop offset="100%" stopColor="#031622" />
                    </linearGradient>
                    <linearGradient id="reBorderGlow" x1="0" y1="0" x2="200" y2="230" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                      <stop offset="50%" stopColor="#eb5557" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M100 10 L190 62 L190 168 L100 220 L10 168 L10 62 Z"
                    fill="url(#reDarkHex)"
                    stroke="url(#reBorderGlow)"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    className="transition-all duration-500 group-hover:stroke-accent"
                  />
                </svg>

                {/* Content Inside Central Hexagon */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  {/* Monogram Badge */}
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/30 backdrop-blur-md mb-2 transition-transform duration-500 group-hover:scale-110 group-hover:bg-accent group-hover:ring-accent">
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
                  <span className="mt-1 font-mono text-[8px] sm:text-[9px] tracking-widest text-accent font-bold">
                    EST. 1977
                  </span>
                </div>
              </div>

              {/* Right Wing (6 Hexagons in Honeycomb Formation) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:-space-x-4 items-center justify-items-center">
                {rightClients.map((client, idx) => (
                  <HexagonPartnerBadge
                    key={client.id}
                    client={client}
                    isDelayed={idx % 2 === 0}
                    className={clsx(
                      idx === 1 || idx === 4 ? "lg:translate-y-6" : "lg:-translate-y-3",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            The Closing CTA
           ==================================================================== */}
        <div className="frame flex flex-col items-center gap-[clamp(16px,1.9vw,26px)] pt-[clamp(72px,10vw,140px)] text-center">
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