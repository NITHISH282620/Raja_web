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
   FLAT-TOP HONEYCOMB GEOMETRY (Matching Production Exactly)
   ========================================================================== */

const HEX_W = 120;
const HEX_H = 104;
const COL_PITCH = 93;
const ROW_PITCH = 108;
const HALF_ROW = 54;

const HERO_W = 158;
const HERO_H = 137;
const WING_GAP = 6;

/* 4 columns x 2 rows per wing = 8 tiles on Left, 8 tiles on Right */
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
  // Odd columns shift DOWN by HALF_ROW to nest hexagons
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

/* Rounded SVG Hexagon Path used across desktop & mobile */
const HEX_PATH =
  "M37 4 L83 4 Q89 4 93 10 L112 44 Q116 52 112 60 L93 94 Q89 100 83 100 L37 100 Q31 100 27 94 L8 60 Q4 52 8 44 L27 10 Q31 4 37 4 Z";

/* --- Flat-Top Hexagon Component ------------------------------------------- */

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

/* --- Mobile Hexagon Tile (Rounded SVG, Fluid Scaling, Touch-Friendly) ---- */

function MobileHex({
  client,
  isDelayed,
  isFlipping,
}: {
  client: ClientItem;
  isDelayed?: boolean;
  isFlipping?: boolean;
}) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div
      data-logo-tile
      data-reveal
      onClick={() => setShowDetail((v) => !v)}
      className={clsx(
        "relative flex h-[74px] w-[86px] sm:h-[88px] sm:w-[102px] items-center justify-center cursor-pointer select-none",
        isDelayed ? "animate-float-delayed" : "animate-float"
      )}
      style={{ filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.06))" }}
    >
      <div
        className={clsx(
          "relative w-full h-full transition-all duration-300 ease-out",
          isFlipping ? "[transform:rotateY(90deg)_scale(0.88)] opacity-40" : "[transform:rotateY(0deg)_scale(1)] opacity-100"
        )}
      >
        <svg viewBox="0 0 120 104" className="w-full h-full" fill="none">
          <path
            d={HEX_PATH}
            fill="#FFFFFF"
            stroke="#E2E5EA"
            strokeWidth="1.4"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center p-2.5">
          <Image
            src={client.logo.src}
            alt={client.name}
            width={client.logo.width}
            height={client.logo.height}
            draggable={false}
            className="max-h-[42px] max-w-[62px] sm:max-h-[50px] sm:max-w-[74px] object-contain"
          />
        </div>

        {/* Mobile Tap Popup */}
        {showDetail && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap px-2.5 py-1 rounded-md bg-[#063c5a] text-white text-[10px] shadow-lg">
            <span className="font-semibold">{client.name}</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#063c5a] rotate-45" />
          </div>
        )}
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
  const queueIndexRef = useRef(TOTAL_DESKTOP_SLOTS);

  /* Dynamic Logo Cycling Effect */
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
          <div className="relative w-full py-12 sm:py-16 lg:py-20 lg:min-h-[85vh] rounded-[28px] sm:rounded-[44px] lg:rounded-[56px] bg-gradient-to-b from-white via-[#fafbfe] to-[#f0f3f7] border border-ink/8 shadow-[0_28px_80px_-20px_rgba(0,0,0,0.08)] p-4 sm:p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center overflow-hidden">
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
              className="mx-auto max-w-[760px] text-center mb-8 sm:mb-12 lg:mb-14"
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

            {/* -------- DESKTOP: Expanded 17-Tile Honeycomb Grid -------- */}
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

            {/* -------- MOBILE / TABLET: Responsive Interlocking Honeycomb -------- */}
            <div className="lg:hidden mx-auto flex w-full max-w-[460px] flex-col items-center mt-2">
              {/* Row 1: 3 tiles */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {[0, 1, 2].map((idx) => (
                  <MobileHex
                    key={idx}
                    client={activeClients[idx] || CLIENTS_27[idx]}
                    isFlipping={flippingSlots.has(idx)}
                    isDelayed={idx % 2 === 1}
                  />
                ))}
              </div>

              {/* Row 2: 2 tiles */}
              <div className="flex justify-center gap-2 sm:gap-3 -mt-2.5 sm:-mt-3.5">
                {[3, 4].map((idx) => (
                  <MobileHex
                    key={idx}
                    client={activeClients[idx] || CLIENTS_27[idx]}
                    isFlipping={flippingSlots.has(idx)}
                    isDelayed={idx % 2 === 0}
                  />
                ))}
              </div>

              {/* Row 3: 1 tile + Center Raja Badge + 1 tile */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 -mt-2.5 sm:-mt-3.5">
                <MobileHex
                  client={activeClients[5] || CLIENTS_27[5]}
                  isFlipping={flippingSlots.has(5)}
                  isDelayed={false}
                />

                {/* Mobile Center Hexagon Badge */}
                <div
                  data-center-hexagon
                  data-reveal
                  className="relative flex h-[82px] w-[94px] sm:h-[96px] sm:w-[110px] items-center justify-center transition-all duration-300 hover:scale-105 z-20"
                  style={{ filter: "drop-shadow(0 0 24px rgba(6,60,90,0.4))" }}
                >
                  <svg viewBox="0 0 158 137" className="w-full h-full" fill="none">
                    <path
                      d="M48 5 L110 5 Q117 5 122 13 L148 58 Q153 68.5 148 79 L122 124 Q117 132 110 132 L48 132 Q41 132 36 124 L10 79 Q5 68.5 10 58 L36 13 Q41 5 48 5 Z"
                      fill="#063c5a"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeOpacity="0.4"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center p-3">
                    <Image
                      src="/media/brand-raja-logo.webp"
                      alt="Raja Enterprises Logo"
                      width={120}
                      height={45}
                      draggable={false}
                      className="max-h-[30px] sm:max-h-[36px] w-auto object-contain brightness-0 invert drop-shadow-sm"
                    />
                  </div>
                </div>

                <MobileHex
                  client={activeClients[6] || CLIENTS_27[6]}
                  isFlipping={flippingSlots.has(6)}
                  isDelayed={true}
                />
              </div>

              {/* Row 4: 2 tiles */}
              <div className="flex justify-center gap-2 sm:gap-3 -mt-2.5 sm:-mt-3.5">
                {[7, 8].map((idx) => (
                  <MobileHex
                    key={idx}
                    client={activeClients[idx] || CLIENTS_27[idx]}
                    isFlipping={flippingSlots.has(idx)}
                    isDelayed={idx % 2 === 1}
                  />
                ))}
              </div>

              {/* Row 5: 3 tiles */}
              <div className="flex justify-center gap-2 sm:gap-3 -mt-2.5 sm:-mt-3.5">
                {[9, 10, 11].map((idx) => (
                  <MobileHex
                    key={idx}
                    client={activeClients[idx] || CLIENTS_27[idx]}
                    isFlipping={flippingSlots.has(idx)}
                    isDelayed={idx % 2 === 0}
                  />
                ))}
              </div>
            </div>

            {/* Interactive hint */}
            <div className="mt-8 sm:mt-10 flex items-center gap-2 text-ink/40 font-mono text-[11px] tracking-wider uppercase">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-blue animate-ping" />
              <span>Showcasing {CLIENTS_27.length} Commissioning Bodies &amp; Flagship Summits</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}