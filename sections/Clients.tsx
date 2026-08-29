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

/* ==========================================================================
   FLAT-TOP HONEYCOMB GEOMETRY
   Flat-top hex: flat edges at top/bottom, pointed vertices at left/right.
   Column-based tiling: columns interlock horizontally (pointed edges nest).
   COL_PITCH = ~3/4 * HEX_W for tight interlocking.
   Odd columns shift DOWN by HALF_ROW = ROW_PITCH / 2.
   ========================================================================== */

const HEX_W = 120;
const HEX_H = 104;
const COL_PITCH = 93;
const ROW_PITCH = 108;
const HALF_ROW = 54;

const HERO_W = 158;
const HERO_H = 137;
const WING_GAP = 2;

/* 3 columns x 2 rows per wing = 6 logos per side */
const wingLayout = [
  { col: 0, row: 0 },
  { col: 0, row: 1 },
  { col: 1, row: 0 },
  { col: 1, row: 1 },
  { col: 2, row: 0 },
  { col: 2, row: 1 },
];

function tilePos(col: number, row: number) {
  return {
    x: col * COL_PITCH,
    y: row * ROW_PITCH + (col % 2 === 1 ? HALF_ROW : 0),
  };
}

function wingSize() {
  let maxX = 0, maxY = 0;
  for (const { col, row } of wingLayout) {
    const { x, y } = tilePos(col, row);
    maxX = Math.max(maxX, x + HEX_W);
    maxY = Math.max(maxY, y + HEX_H);
  }
  return { w: maxX, h: maxY };
}

const WING = wingSize();
const GRID_W = WING.w + WING_GAP + HERO_W + WING_GAP + WING.w;
const GRID_H = Math.max(WING.h, HERO_H);

const LEFT_X = 0;
const HERO_X = WING.w + WING_GAP;
const RIGHT_X = HERO_X + HERO_W + WING_GAP;
const LEFT_Y = (GRID_H - WING.h) / 2;
const HERO_Y = (GRID_H - HERO_H) / 2;
const RIGHT_Y = LEFT_Y;

/* --- Flat-Top Hex Badge --------------------------------------------------- */

function FlatHex({
  client,
  isDelayed,
  style,
}: {
  client: Client;
  isDelayed?: boolean;
  style: React.CSSProperties;
}) {
  return (
    <div
      data-logo-tile
      data-reveal
      className={clsx(
        "group absolute flex items-center justify-center transition-all duration-500",
        "hover:scale-110 hover:-translate-y-1 hover:z-30 cursor-pointer",
        isDelayed ? "animate-float-delayed" : "animate-float",
      )}
      style={{
        width: HEX_W,
        height: HEX_H,
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.06))",
        ...style,
      }}
    >
      <svg viewBox="0 0 120 104" className="w-full h-full" fill="none">
        <path
          d="M37 4 L83 4 Q89 4 93 10 L112 44 Q116 52 112 60 L93 94 Q89 100 83 100 L37 100 Q31 100 27 94 L8 60 Q4 52 8 44 L27 10 Q31 4 37 4 Z"
          fill="#FFFFFF"
          stroke="#E2E5EA"
          strokeWidth="1.3"
          className="transition-colors duration-300 group-hover:stroke-accent/50"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center p-1.5">
        <Image
          src={client.logo.src}
          alt={client.name}
          width={client.logo.width}
          height={client.logo.height}
          className="max-h-[58px] max-w-[86px] object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </div>
  );
}

/* --- Main Section --------------------------------------------------------- */

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
        fadeUp(tl, q(scope, "[data-cta-eyebrow]"), { distance: 18 }, 0.8);
        riseCard(
          tl,
          q(scope, "[data-cta-button]"),
          { distance: 18, scaleFrom: 0.9 },
          1.0,
        );
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

  return (
    <section
      ref={root}
      id={SECTION_IDS.clients}
      className="relative w-full min-h-screen bg-paper py-[clamp(64px,8vw,110px)] flex flex-col"
    >
      <div className="w-full">
        <div className="frame">
          <span
            data-divider
            aria-hidden
            className="block h-px w-full origin-left bg-ink/12 mb-[clamp(40px,5vw,70px)]"
          />
        </div>

        <div className="frame w-full">
          <div className="relative w-full min-h-[85vh] lg:min-h-[90vh] rounded-[32px] sm:rounded-[44px] lg:rounded-[56px] bg-gradient-to-b from-white via-[#fafbfe] to-[#f0f3f7] border border-ink/8 shadow-[0_28px_80px_-20px_rgba(0,0,0,0.08)] p-6 sm:p-10 md:p-14 lg:p-20 flex flex-col items-center justify-center overflow-hidden">
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

            {/* -------- DESKTOP: Pixel-Perfect Honeycomb Grid -------- */}
            <div
              className="relative mx-auto my-auto hidden lg:block lg:scale-[1.05] xl:scale-[1.25] origin-center"
              style={{ width: GRID_W, height: GRID_H }}
            >
              {/* Left Wing */}
              {wingLayout.map((pos, i) => {
                const { x, y } = tilePos(pos.col, pos.row);
                return (
                  <FlatHex
                    key={clients[i].id}
                    client={clients[i]}
                    isDelayed={i % 2 === 1}
                    style={{ left: LEFT_X + x, top: LEFT_Y + y }}
                  />
                );
              })}

              {/* --- Central Hero Hexagon --- */}
              <div
                data-center-hexagon
                data-reveal
                className="group absolute flex items-center justify-center cursor-pointer transition-all duration-500 hover:scale-110 hover:rotate-2 hover:z-40"
                style={{
                  left: HERO_X,
                  top: HERO_Y,
                  width: HERO_W,
                  height: HERO_H,
                  filter: "drop-shadow(0 0 50px rgba(6,60,90,0.45))",
                }}
              >
                <svg
                  viewBox="0 0 158 137"
                  className="w-full h-full transition-all duration-500 group-hover:scale-105"
                  fill="none"
                >
                  <defs>
                    <linearGradient
                      id="reDarkHex"
                      x1="79"
                      y1="0"
                      x2="79"
                      y2="137"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#0c2333" />
                      <stop offset="50%" stopColor="#063c5a" />
                      <stop offset="100%" stopColor="#031622" />
                    </linearGradient>
                    <linearGradient
                      id="reBorderGlow"
                      x1="0"
                      y1="0"
                      x2="158"
                      y2="137"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                      <stop offset="50%" stopColor="#eb5557" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M48 5 L110 5 Q117 5 122 13 L148 58 Q153 68.5 148 79 L122 124 Q117 132 110 132 L48 132 Q41 132 36 124 L10 79 Q5 68.5 10 58 L36 13 Q41 5 48 5 Z"
                    fill="url(#reDarkHex)"
                    stroke="url(#reBorderGlow)"
                    strokeWidth="2.5"
                    className="transition-all duration-500 group-hover:stroke-accent"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <Image
                    src="/media/brand-raja-logo.webp"
                    alt="Raja Enterprises Logo"
                    width={180}
                    height={80}
                    className="max-h-[60px] w-auto object-contain transition-transform duration-500 group-hover:scale-110 brightness-0 invert drop-shadow-sm"
                  />
                </div>
              </div>

              {/* Right Wing */}
              {wingLayout.map((pos, i) => {
                const { x, y } = tilePos(pos.col, pos.row);
                return (
                  <FlatHex
                    key={clients[6 + i].id}
                    client={clients[6 + i]}
                    isDelayed={i % 2 === 0}
                    style={{ left: RIGHT_X + x, top: RIGHT_Y + y }}
                  />
                );
              })}
            </div>

            {/* -------- MOBILE / TABLET: Responsive Grid -------- */}
            <div className="lg:hidden grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-[540px] mx-auto my-auto justify-items-center">
              {clients.slice(0, 5).map((c) => (
                <div
                  key={c.id}
                  data-logo-tile
                  data-reveal
                  className="group flex h-[80px] w-[80px] sm:h-[90px] sm:w-[90px] items-center justify-center rounded-2xl bg-white border border-ink/8 shadow-sm p-2 transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-md"
                >
                  <Image
                    src={c.logo.src}
                    alt={c.name}
                    width={c.logo.width}
                    height={c.logo.height}
                    className="max-h-[50px] max-w-[70px] object-contain"
                  />
                </div>
              ))}

              <div
                data-center-hexagon
                data-reveal
                className="group col-span-1 flex h-[80px] w-[80px] sm:h-[90px] sm:w-[90px] items-center justify-center rounded-2xl bg-brand-blue shadow-md p-3 transition-all duration-300 hover:scale-110"
              >
                <Image
                  src="/media/brand-raja-logo.webp"
                  alt="Raja Enterprises Logo"
                  width={160}
                  height={50}
                  className="max-h-[30px] w-auto object-contain brightness-0 invert drop-shadow-sm"
                />
              </div>

              {clients.slice(6, 12).map((c) => (
                <div
                  key={c.id}
                  data-logo-tile
                  data-reveal
                  className="group flex h-[80px] w-[80px] sm:h-[90px] sm:w-[90px] items-center justify-center rounded-2xl bg-white border border-ink/8 shadow-sm p-2 transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-md"
                >
                  <Image
                    src={c.logo.src}
                    alt={c.name}
                    width={c.logo.width}
                    height={c.logo.height}
                    className="max-h-[50px] max-w-[70px] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* -------- Closing CTA -------- */}
        <div className="frame flex flex-col items-center gap-[clamp(16px,1.9vw,26px)] pt-[clamp(72px,10vw,140px)] text-center">
          <p
            data-cta-eyebrow
            data-reveal
            className="t-eyebrow text-accent font-mono tracking-[0.16em] uppercase"
          >
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

/* --- Contact CTA Button --------------------------------------------------- */

function ContactButton({ contact }: { contact: typeof ContactShape }) {
  const className =
    "group inline-flex h-[54px] items-center justify-center gap-3 rounded-full bg-brand-blue px-9 text-white shadow-md transition-all duration-300 hover:bg-brand-blue/90 hover:shadow-xl hover:scale-105";

  const inner = (
    <>
      <span className="t-body font-medium">{closingCta.label}</span>
      <span
        aria-hidden
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
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