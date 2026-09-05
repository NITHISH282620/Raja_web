"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, growRule, riseCard, release, entranceTrigger, q } from "@/motion/primitives";
import { MOTION_OK } from "@/motion/ease";
import { CLIENTS_27, type ClientItem } from "@/content/clientRoster";
import { SECTION_IDS } from "@/content/navigation";
import { clsx } from "@/lib/clsx";

/* ==========================================================================
   DESKTOP HONEYCOMB GEOMETRY (Matching Production Exactly)
   ========================================================================== */

const HEX_W = 120;
const HEX_H = 104;
const COL_PITCH = 93;
const ROW_PITCH = 108;
const HALF_ROW = 54;

const HERO_W = 158;
const HERO_H = 137;
const WING_GAP = 6;

const WING_COLS = 4;
const TOTAL_DESKTOP_SLOTS = 16; // 8 left + 8 right

const leftWingLayout = [
  { col: 0, row: 0 },
  { col: 0, row: 1 },
  { col: 1, row: 0 },
  { col: 1, row: 1 },
  { col: 2, row: 0 },
  { col: 2, row: 1 },
  { col: 3, row: 0 },
  { col: 3, row: 1 },
];

const rightWingLayout = [
  { col: 0, row: 0 },
  { col: 0, row: 1 },
  { col: 1, row: 0 },
  { col: 1, row: 1 },
  { col: 2, row: 0 },
  { col: 2, row: 1 },
  { col: 3, row: 0 },
  { col: 3, row: 1 },
];

function tilePos(col: number, row: number, isRight = false) {
  const colDrop = (col % 2 === (isRight ? 0 : 1)) ? HALF_ROW : 0;
  return {
    x: col * COL_PITCH,
    y: row * ROW_PITCH + colDrop,
  };
}

const WING_W = (WING_COLS - 1) * COL_PITCH + HEX_W;
const GRID_W = WING_W + WING_GAP + HERO_W + WING_GAP + WING_W;
const GRID_H = ROW_PITCH + HALF_ROW + HEX_H;

const LEFT_X = 0;
const HERO_X = WING_W + WING_GAP;
const RIGHT_X = HERO_X + HERO_W + WING_GAP;
const LEFT_Y = 10;
const HERO_Y = (GRID_H - HERO_H) / 2;
const RIGHT_Y = LEFT_Y;

/* ==========================================================================
   MOBILE HONEYCOMB GEOMETRY (Exact Wing/Center/Wing Architecture, Minimized)
   ========================================================================== */

const M_HEX_W = 68;
const M_HEX_H = 59;
const M_COL_PITCH = 52.5;
const M_ROW_PITCH = 61;
const M_HALF_ROW = 30.5;

const M_HERO_W = 92;
const M_HERO_H = 80;
const M_WING_GAP = 4;

const mobileLeftWingLayout = [
  { col: 0, row: 0 },
  { col: 0, row: 1 },
  { col: 1, row: 0 },
  { col: 1, row: 1 },
  { col: 2, row: 0 },
  { col: 2, row: 1 },
];

const mobileRightWingLayout = [
  { col: 0, row: 0 },
  { col: 0, row: 1 },
  { col: 1, row: 0 },
  { col: 1, row: 1 },
  { col: 2, row: 0 },
  { col: 2, row: 1 },
];

function mobileTilePos(col: number, row: number, isRight = false) {
  const colDrop = (col % 2 === (isRight ? 0 : 1)) ? M_HALF_ROW : 0;
  return {
    x: col * M_COL_PITCH,
    y: row * M_ROW_PITCH + colDrop,
  };
}

const M_WING_W = 2 * M_COL_PITCH + M_HEX_W; // ~173px
const M_GRID_W = M_WING_W + M_WING_GAP + M_HERO_W + M_WING_GAP + M_WING_W; // ~446px
const M_GRID_H = M_ROW_PITCH + M_HALF_ROW + M_HEX_H; // ~150.5px

const M_LEFT_X = 0;
const M_HERO_X = M_WING_W + M_WING_GAP;
const M_RIGHT_X = M_HERO_X + M_HERO_W + M_WING_GAP;
const M_LEFT_Y = 6;
const M_HERO_Y = (M_GRID_H - M_HERO_H) / 2;
const M_RIGHT_Y = M_LEFT_Y;

/* Rounded SVG Hexagon Path */
const HEX_PATH =
  "M37 4 L83 4 Q89 4 93 10 L112 44 Q116 52 112 60 L93 94 Q89 100 83 100 L37 100 Q31 100 27 94 L8 60 Q4 52 8 44 L27 10 Q31 4 37 4 Z";

/* --- Desktop Flat-Top Hexagon Component ----------------------------------- */

function FlatHex({
  client,
  isDelayed,
  isFlipping,
  style,
  onHover,
  onLeave,
}: {
  client: ClientItem;
  isDelayed?: boolean;
  isFlipping?: boolean;
  style?: React.CSSProperties;
  onHover?: () => void;
  onLeave?: () => void;
}) {
  return (
    <div
      data-logo-tile
      data-reveal
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={clsx(
        "group absolute flex items-center justify-center cursor-pointer",
        "transition-all duration-300",
        isDelayed ? "animate-float-delayed" : "animate-float"
      )}
      style={{
        width: HEX_W,
        height: HEX_H,
        filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.06))",
        zIndex: 10,
        ...style,
      }}
    >
      <div
        className={clsx(
          "relative w-full h-full transition-all duration-300 ease-out",
          "group-hover:scale-110 group-hover:-translate-y-1.5",
          isFlipping ? "[transform:rotateY(90deg)_scale(0.88)] opacity-40" : "[transform:rotateY(0deg)_scale(1)] opacity-100"
        )}
      >
        <svg viewBox="0 0 120 104" className="w-full h-full drop-shadow-sm" fill="none">
          <path
            d={HEX_PATH}
            fill="#FFFFFF"
            stroke="#E2E5EA"
            strokeWidth="1.3"
            className="transition-colors duration-300 group-hover:stroke-brand-blue/40 group-hover:fill-[#FAFBFD]"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center p-2">
          <Image
            src={client.logo.src}
            alt={client.name}
            width={client.logo.width}
            height={client.logo.height}
            draggable={false}
            className="max-h-[58px] max-w-[86px] object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Floating Tooltip */}
        <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#063c5a] text-white text-[11px] shadow-xl">
          <span className="font-semibold">{client.name}</span>
          <span className="text-white/60 mx-1.5">•</span>
          <span className="text-accent text-[10px] font-mono uppercase tracking-wider">{client.event}</span>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#063c5a] rotate-45" />
        </div>
      </div>
    </div>
  );
}

/* --- Mobile Minimized Hexagon (Exact Same Shape, Scaled Down & Aligned) --- */

function MobileMinimizedHex({
  client,
  isDelayed,
  isFlipping,
  style,
  onClick,
}: {
  client: ClientItem;
  isDelayed?: boolean;
  isFlipping?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      data-logo-tile
      data-reveal
      onClick={onClick}
      className={clsx(
        "group absolute flex items-center justify-center cursor-pointer select-none",
        "transition-all duration-300",
        isDelayed ? "animate-float-delayed" : "animate-float"
      )}
      style={{
        width: M_HEX_W,
        height: M_HEX_H,
        filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.05))",
        zIndex: 10,
        ...style,
      }}
    >
      <div
        className={clsx(
          "relative w-full h-full transition-all duration-300 ease-out",
          "active:scale-95",
          isFlipping ? "[transform:rotateY(90deg)_scale(0.85)] opacity-40" : "[transform:rotateY(0deg)_scale(1)] opacity-100"
        )}
      >
        <svg viewBox="0 0 120 104" className="w-full h-full" fill="none">
          <path
            d={HEX_PATH}
            fill="#FFFFFF"
            stroke="#E2E5EA"
            strokeWidth="1.4"
            className="transition-colors duration-200 group-hover:stroke-brand-blue/30"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center p-1.5">
          <Image
            src={client.logo.src}
            alt={client.name}
            width={client.logo.width}
            height={client.logo.height}
            draggable={false}
            className="max-h-[34px] max-w-[48px] object-contain transition-transform duration-200"
          />
        </div>
      </div>
    </div>
  );
}

/* --- Main Clients Section ------------------------------------------------- */

export function ClientsView({}: {
  clients?: unknown[];
  contact?: unknown;
  events?: unknown[];
}) {
  const root = useRef<HTMLElement>(null);
  const hoveredSlot = useRef<number | null>(null);

  /* Rotating Client Pool State */
  const [activeClients, setActiveClients] = useState<ClientItem[]>(() =>
    CLIENTS_27.slice(0, TOTAL_DESKTOP_SLOTS)
  );
  const [flippingSlots, setFlippingSlots] = useState<Set<number>>(new Set());
  const [selectedClient, setSelectedClient] = useState<ClientItem | null>(null);
  const queueIndexRef = useRef(TOTAL_DESKTOP_SLOTS);

  /* Dynamic Logo Cycling Effect across both desktop and mobile */
  useEffect(() => {
    const timer = setInterval(() => {
      const availableSlots: number[] = [];
      for (let i = 0; i < TOTAL_DESKTOP_SLOTS; i++) {
        if (i !== hoveredSlot.current) {
          availableSlots.push(i);
        }
      }
      if (availableSlots.length === 0) return;

      const leftCandidates = availableSlots.filter((idx) => idx < 8);
      const rightCandidates = availableSlots.filter((idx) => idx >= 8);

      const targetSlots: number[] = [];
      if (leftCandidates.length) {
        targetSlots.push(leftCandidates[Math.floor(Math.random() * leftCandidates.length)]);
      }
      if (rightCandidates.length) {
        targetSlots.push(rightCandidates[Math.floor(Math.random() * rightCandidates.length)]);
      }

      setFlippingSlots(new Set(targetSlots));

      setTimeout(() => {
        setActiveClients((prev) => {
          const next = [...prev];
          for (const slot of targetSlots) {
            const nextClient = CLIENTS_27[queueIndexRef.current % CLIENTS_27.length];
            queueIndexRef.current = (queueIndexRef.current + 1) % CLIENTS_27.length;
            next[slot] = nextClient;
          }
          return next;
        });

        setTimeout(() => {
          setFlippingSlots(new Set());
        }, 60);
      }, 260);
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  /* GSAP Entrance Animations */
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
        riseCard(
          tl,
          q(scope, "[data-center-hexagon]"),
          { distance: 35, scaleFrom: 0.8 },
          0.35
        );
        fadeUp(
          tl,
          q(scope, "[data-logo-tile]"),
          { stagger: 0.03, distance: 24, scaleFrom: 0.88 },
          0.45
        );
      });
      return () => mm.revert();
    },
    { scope: root }
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
          <div className="relative w-full py-10 sm:py-16 lg:py-20 lg:min-h-[85vh] rounded-[28px] sm:rounded-[44px] lg:rounded-[56px] bg-gradient-to-b from-white via-[#fafbfe] to-[#f0f3f7] border border-ink/8 shadow-[0_28px_80px_-20px_rgba(0,0,0,0.08)] px-3 py-8 sm:p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center overflow-hidden">
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
              className="mx-auto max-w-[760px] text-center mb-6 sm:mb-12 lg:mb-14"
            >
              <p className="t-eyebrow text-accent font-mono tracking-[0.2em] uppercase text-xs sm:text-sm mb-2.5 font-medium">
                Institutional &amp; Enterprise Trust
              </p>
              <h2 className="text-[clamp(1.75rem,5vw,3.25rem)] font-bold text-ink tracking-tight leading-[1.1]">
                Partners &amp; Clients with Raja Enterprises
              </h2>
              <p className="mt-3 text-body-light text-xs sm:text-base md:text-lg leading-relaxed max-w-[58ch] mx-auto">
                From government mega-summits to global corporate forums and
                trade exhibitions &mdash; we build the ground where leaders
                gather.
              </p>
            </div>

            {/* -------- DESKTOP: Expanded 17-Tile Honeycomb Grid (lg+) -------- */}
            <div
              className="relative mx-auto my-auto hidden lg:block scale-[0.98] xl:scale-[1.12] 2xl:scale-[1.2] origin-center"
              style={{ width: GRID_W, height: GRID_H }}
            >
              {/* Left Wing (8 tiles across 4 columns) */}
              {leftWingLayout.map((pos, i) => {
                const { x, y } = tilePos(pos.col, pos.row, false);
                const client = activeClients[i] || CLIENTS_27[i % CLIENTS_27.length];
                return (
                  <FlatHex
                    key={`left-${i}`}
                    client={client}
                    isDelayed={i % 2 === 1}
                    isFlipping={flippingSlots.has(i)}
                    onHover={() => { hoveredSlot.current = i; }}
                    onLeave={() => { hoveredSlot.current = null; }}
                    style={{ left: LEFT_X + x, top: LEFT_Y + y }}
                  />
                );
              })}

              {/* Central Hero Hexagon */}
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
                  zIndex: 20,
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
                    draggable={false}
                    className="max-h-[60px] w-auto object-contain transition-transform duration-500 group-hover:scale-110 brightness-0 invert drop-shadow-sm"
                  />
                </div>
              </div>

              {/* Right Wing (8 tiles across 4 columns) */}
              {rightWingLayout.map((pos, i) => {
                const { x, y } = tilePos(pos.col, pos.row, true);
                const slotIndex = 8 + i;
                const client = activeClients[slotIndex] || CLIENTS_27[(8 + i) % CLIENTS_27.length];
                return (
                  <FlatHex
                    key={`right-${i}`}
                    client={client}
                    isDelayed={i % 2 === 0}
                    isFlipping={flippingSlots.has(slotIndex)}
                    onHover={() => { hoveredSlot.current = slotIndex; }}
                    onLeave={() => { hoveredSlot.current = null; }}
                    style={{ left: RIGHT_X + x, top: RIGHT_Y + y }}
                  />
                );
              })}
            </div>

            {/* -------- MOBILE / TABLET: Exact Wing/Center/Wing Architecture (Minimized & Aligned) -------- */}
            <div className="lg:hidden w-full flex flex-col items-center justify-center my-auto py-2">
              <div
                className="relative flex items-center justify-center origin-center transition-transform duration-300 scale-[0.72] min-[370px]:scale-[0.76] min-[390px]:scale-[0.80] min-[420px]:scale-[0.86] sm:scale-100"
                style={{ width: M_GRID_W, height: M_GRID_H }}
              >
                {/* Mobile Left Wing (6 tiles across 3 columns, interlocking) */}
                {mobileLeftWingLayout.map((pos, i) => {
                  const { x, y } = mobileTilePos(pos.col, pos.row, false);
                  const client = activeClients[i] || CLIENTS_27[i % CLIENTS_27.length];
                  return (
                    <MobileMinimizedHex
                      key={`m-left-${i}`}
                      client={client}
                      isDelayed={i % 2 === 1}
                      isFlipping={flippingSlots.has(i)}
                      onClick={() => setSelectedClient(client)}
                      style={{ left: M_LEFT_X + x, top: M_LEFT_Y + y }}
                    />
                  );
                })}

                {/* Mobile Central Hero Badge (Exactly like Desktop, Scaled) */}
                <div
                  data-center-hexagon
                  data-reveal
                  className="group absolute flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 z-20"
                  style={{
                    left: M_HERO_X,
                    top: M_HERO_Y,
                    width: M_HERO_W,
                    height: M_HERO_H,
                    filter: "drop-shadow(0 0 28px rgba(6,60,90,0.45))",
                  }}
                >
                  <svg
                    viewBox="0 0 158 137"
                    className="w-full h-full"
                    fill="none"
                  >
                    <defs>
                      <linearGradient
                        id="reDarkHexMobile"
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
                        id="reBorderGlowMobile"
                        x1="0"
                        y1="0"
                        x2="158"
                        y2="137"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#eb5557" stopOpacity="0.65" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M48 5 L110 5 Q117 5 122 13 L148 58 Q153 68.5 148 79 L122 124 Q117 132 110 132 L48 132 Q41 132 36 124 L10 79 Q5 68.5 10 58 L36 13 Q41 5 48 5 Z"
                      fill="url(#reDarkHexMobile)"
                      stroke="url(#reBorderGlowMobile)"
                      strokeWidth="2.5"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center p-3">
                    <Image
                      src="/media/brand-raja-logo.webp"
                      alt="Raja Enterprises Logo"
                      width={120}
                      height={50}
                      draggable={false}
                      className="max-h-[34px] w-auto object-contain brightness-0 invert drop-shadow-sm"
                    />
                  </div>
                </div>

                {/* Mobile Right Wing (6 tiles across 3 columns, interlocking) */}
                {mobileRightWingLayout.map((pos, i) => {
                  const { x, y } = mobileTilePos(pos.col, pos.row, true);
                  const slotIndex = 6 + i;
                  const client = activeClients[slotIndex] || CLIENTS_27[(6 + i) % CLIENTS_27.length];
                  return (
                    <MobileMinimizedHex
                      key={`m-right-${i}`}
                      client={client}
                      isDelayed={i % 2 === 0}
                      isFlipping={flippingSlots.has(slotIndex)}
                      onClick={() => setSelectedClient(client)}
                      style={{ left: M_RIGHT_X + x, top: M_RIGHT_Y + y }}
                    />
                  );
                })}
              </div>

              {/* Mobile Tap Details Popup Banner */}
              {selectedClient && (
                <div
                  className="mt-4 flex items-center justify-between gap-3 w-full max-w-[340px] px-3.5 py-2 rounded-xl bg-[#063c5a] text-white text-[11px] shadow-lg animate-fadeIn"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold truncate">{selectedClient.name}</span>
                    <span className="text-accent text-[10px] font-mono uppercase tracking-wider truncate">
                      {selectedClient.event}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedClient(null)}
                    className="p-1 text-white/70 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Interactive hint */}
            <div className="mt-6 sm:mt-10 flex items-center gap-2 text-ink/40 font-mono text-[11px] tracking-wider uppercase text-center">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-blue animate-ping" />
              <span>Showcasing {CLIENTS_27.length} Commissioning Bodies &amp; Flagship Summits</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}