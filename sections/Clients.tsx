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

/* -------------------------------------------------------------------------
   Hex tile sizing constants (in px).
   In a true pointy-top honeycomb the horizontal pitch (column spacing)
   is 0.75 * width because adjacent columns overlap by one quarter-width.
   The vertical pitch is the full height, and odd columns shift down by
   half the height.
------------------------------------------------------------------------- */
const HEX_W = 120; // tile width  (px)
const HEX_H = 138; // tile height (px)
const COL_PITCH = HEX_W * 0.78; // ~93.6 px  horizontal center-to-center
const ROW_PITCH = HEX_H + 6;     // ~144 px  vertical center-to-center
const HALF_ROW = ROW_PITCH / 2;  // odd-column vertical offset

/* center hero is bigger */
const HERO_W = 180;
const HERO_H = 207;

/* Left wing: 3 cols x 3 rows. Positions relative to wing origin. */
const leftPositions = [
  /* col 0 */ { col: 0, row: 0 },
  /* col 0 */ { col: 0, row: 1 },
  /* col 1 */ { col: 1, row: 0 },
  /* col 1 */ { col: 1, row: 1 },
  /* col 2 */ { col: 2, row: 0 },
  /* col 2 */ { col: 2, row: 1 },
];

const rightPositions = leftPositions; // mirror

function tileXY(col: number, row: number) {
  const x = col * COL_PITCH;
  const y = row * ROW_PITCH + (col % 2 === 1 ? HALF_ROW : 0);
  return { x, y };
}

function wingBounds(positions: { col: number; row: number }[]) {
  let maxX = 0, maxY = 0;
  for (const p of positions) {
    const { x, y } = tileXY(p.col, p.row);
    maxX = Math.max(maxX, x + HEX_W);
    maxY = Math.max(maxY, y + HEX_H);
  }
  return { w: maxX, h: maxY };
}

const leftBounds = wingBounds(leftPositions);
const rightBounds = wingBounds(rightPositions);

/* ====================================================================== */

function SmoothHex({ client, isDelayed, style }: { client: Client; isDelayed?: boolean; style: React.CSSProperties }) {
  return (
    <div
      data-logo-tile
      data-reveal
      className={clsx(
        "group absolute flex items-center justify-center transition-all duration-500 hover:scale-110 hover:-translate-y-1.5 hover:z-30 cursor-pointer",
        isDelayed ? "animate-float-delayed" : "animate-float",
      )}
      style={{ width: HEX_W, height: HEX_H, filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.05))", ...style }}
    >
      <svg viewBox="0 0 120 138" className="w-full h-full transition-all duration-300 group-hover:scale-105" fill="none">
        <path
          d="M52 8 Q60 3 68 8 L108 31 Q115 35.5 115 45 L115 93 Q115 102.5 108 107 L68 130 Q60 135 52 130 L12 107 Q5 102.5 5 93 L5 45 Q5 35.5 12 31 Z"
          fill="#FFFFFF"
          stroke="#E5E7EB"
          strokeWidth="1.4"
          className="transition-colors duration-300 group-hover:stroke-accent/60"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Image
          src={client.logo.src}
          alt={client.name}
          width={client.logo.width}
          height={client.logo.height}
          className="max-h-[44px] max-w-[76px] object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </div>
  );
}

/* ====================================================================== */

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

  const GAP = 24; // px gap between wings and hero

  const totalW = leftBounds.w + GAP + HERO_W + GAP + rightBounds.w;
  const totalH = Math.max(leftBounds.h, rightBounds.h, HERO_H);

  const leftOriginX = 0;
  const heroOriginX = leftBounds.w + GAP;
  const rightOriginX = heroOriginX + HERO_W + GAP;

  const leftOriginY = (totalH - leftBounds.h) / 2;
  const heroOriginY = (totalH - HERO_H) / 2;
  const rightOriginY = (totalH - rightBounds.h) / 2;

  return (
    <section ref={root} id={SECTION_IDS.clients} className="relative w-full min-h-screen bg-paper py-[clamp(64px,8vw,110px)] flex flex-col">
      <div className="w-full">
        <div className="frame">
          <span data-divider aria-hidden className="block h-px w-full origin-left bg-ink/12 mb-[clamp(40px,5vw,70px)]" />
        </div>

        <div className="frame w-full">
          <div className="relative w-full min-h-[85vh] lg:min-h-[90vh] rounded-[32px] sm:rounded-[44px] lg:rounded-[56px] bg-gradient-to-b from-white via-[#fafbfe] to-[#f0f3f7] border border-ink/8 shadow-[0_28px_80px_-20px_rgba(0,0,0,0.08)] p-6 sm:p-10 md:p-14 lg:p-20 flex flex-col items-center justify-center overflow-hidden">
            {/* atmospheric blurs */}
            <div aria-hidden className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-brand-blue/8 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-purple-500/8 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full bg-brand-blue/5 blur-[110px]" />

            {/* Header */}
            <div data-clients-header data-reveal className="mx-auto max-w-[760px] text-center mb-10 sm:mb-14 lg:mb-16">
              <p className="t-eyebrow text-accent font-mono tracking-[0.2em] uppercase text-xs sm:text-sm mb-3 font-medium">
                Institutional &amp; Enterprise Trust
              </p>
              <h2 className="text-[clamp(2rem,5vw,3.25rem)] font-bold text-ink tracking-tight leading-[1.08]">
                Partners &amp; Clients with Raja Enterprises
              </h2>
              <p className="mt-3.5 text-body-light text-sm sm:text-base md:text-lg leading-relaxed max-w-[58ch] mx-auto">
                From government mega-summits to global corporate forums and trade exhibitions ’ we build the ground where leaders gather.
              </p>
            </div>

            {/* ============================================================
                Absolutely-positioned honeycomb matrix (pixel-perfect)
               ============================================================ */}
            <div
              className="relative mx-auto my-auto hidden lg:block"
              style={{ width: totalW, height: totalH }}
            >
              {/* Left wing */}
              {leftPositions.map((pos, i) => {
                const { x, y } = tileXY(pos.col, pos.row);
                return (
                  <SmoothHex
                    key={clients[i].id}
                    client={clients[i]}
                    isDelayed={i % 2 === 1}
                    style={{ left: leftOriginX + x, top: leftOriginY + y }}
                  />
                );
              })}

              {/* Central Hero Hexagon */}
              <div
                data-center-hexagon
                data-reveal
                className="group absolute flex items-center justify-center cursor-pointer transition-all duration-500 hover:scale-110 hover:rotate-2 hover:z-40"
                style={{
                  left: heroOriginX,
                  top: heroOriginY,
                  width: HERO_W,
                  height: HERO_H,
                  filter: "drop-shadow(0 0 50px rgba(6,60,90,0.45))",
                }}
              >
                <svg viewBox="0 0 180 207" className="w-full h-full transition-all duration-500 group-hover:scale-105" fill="none">
                  <defs>
                    <linearGradient id="reDarkHex" x1="90" y1="0" x2="90" y2="207" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#0c2333" />
                      <stop offset="50%" stopColor="#063c5a" />
                      <stop offset="100%" stopColor="#031622" />
                    </linearGradient>
                    <linearGradient id="reBorderGlow" x1="0" y1="0" x2="180" y2="207" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                      <stop offset="50%" stopColor="#eb5557" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M78 12 Q90 5 102 12 L163 47 Q173 53 173 66 L173 141 Q173 154 163 160 L102 195 Q90 202 78 195 L17 160 Q7 154 7 141 L7 66 Q7 53 17 47 Z"
                    fill="url(#reDarkHex)"
                    stroke="url(#reBorderGlow)"
                    strokeWidth="2.5"
                    className="transition-all duration-500 group-hover:stroke-accent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/30 backdrop-blur-md mb-2 transition-transform duration-500 group-hover:scale-110 group-hover:bg-accent group-hover:ring-accent">
                    <span className="font-mono text-lg sm:text-xl font-black text-white tracking-tighter">RE</span>
                  </div>
                  <span className="font-display font-bold text-xs sm:text-sm tracking-wider text-white uppercase leading-tight">RAJA</span>
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-white/70 uppercase">ENTERPRISES</span>
                  <span className="mt-1 font-mono text-[8px] sm:text-[9px] tracking-widest text-accent font-bold">EST. 1977</span>
                </div>
              </div>

              {/* Right wing */}
              {rightPositions.map((pos, i) => {
                const { x, y } = tileXY(pos.col, pos.row);
                return (
                  <SmoothHex
                    key={clients[6 + i].id}
                    client={clients[6 + i]}
                    isDelayed={i % 2 === 0}
                    style={{ left: rightOriginX + x, top: rightOriginY + y }}
                  />
                );
              })}
            </div>

            {/* ============================================================
                Mobile / Tablet fallback: simple responsive grid
               ============================================================ */}
            <div className="lg:hidden grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-[600px] mx-auto my-auto justify-items-center">
              {clients.slice(0, 5).map((c, i) => (
                <div key={c.id} data-logo-tile data-reveal className="group flex h-[80px] w-[80px] sm:h-[90px] sm:w-[90px] items-center justify-center rounded-2xl bg-white border border-ink/8 shadow-sm p-3 transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-md">
                  <Image src={c.logo.src} alt={c.name} width={c.logo.width} height={c.logo.height} className="max-h-[40px] max-w-[60px] object-contain" />
                </div>
              ))}

              {/* Central hero tile (mobile) */}
              <div data-center-hexagon data-reveal className="group col-span-1 flex h-[80px] w-[80px] sm:h-[90px] sm:w-[90px] items-center justify-center rounded-2xl bg-brand-blue shadow-md p-3 transition-all duration-300 hover:scale-110">
                <span className="font-mono text-sm font-black text-white tracking-tighter">RE</span>
              </div>

              {clients.slice(6, 12).map((c, i) => (
                <div key={c.id} data-logo-tile data-reveal className="group flex h-[80px] w-[80px] sm:h-[90px] sm:w-[90px] items-center justify-center rounded-2xl bg-white border border-ink/8 shadow-sm p-3 transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-md">
                  <Image src={c.logo.src} alt={c.name} width={c.logo.width} height={c.logo.height} className="max-h-[40px] max-w-[60px] object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="frame flex flex-col items-center gap-[clamp(16px,1.9vw,26px)] pt-[clamp(72px,10vw,140px)] text-center">
          <p data-cta-eyebrow data-reveal className="t-eyebrow text-accent font-mono tracking-[0.16em] uppercase">{closingCta.eyebrow}</p>
          <div data-cta-statement className="w-full">
            <Statement segments={closingCta.statement} tone="dark" className="t-statement mx-auto max-w-[20ch]" />
          </div>
          <div data-cta-button data-reveal className="mt-[clamp(8px,1vw,14px)]">
            <ContactButton contact={contact} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactButton({ contact }: { contact: typeof ContactShape }) {
  const className = "group inline-flex h-[54px] items-center justify-center gap-3 rounded-full bg-brand-blue px-9 text-white shadow-md transition-all duration-300 hover:bg-brand-blue/90 hover:shadow-xl hover:scale-105";
  const inner = (
    <>
      <span className="t-body font-medium">{closingCta.label}</span>
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
    </>
  );
  if (contact.email) {
    return <a href={`mailto:${contact.email}`} className={className}>{inner}</a>;
  }
  return (
    <button type="button" aria-disabled data-provisional title={contact.note} className={clsx(className, "cursor-not-allowed opacity-70")}>{inner}</button>
  );
}