"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  ScrollTrigger,
  fadeUp,
  fadeIn,
  growRule,
  revealLines,
  release,
  entranceTrigger,
  q,
} from "@/motion/primitives";
import { MOTION_OK, MOTION_DESKTOP } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";
import { PlaceholderImage } from "@/components/Placeholder";
import { worksIntro, type Project } from "@/content/works";
import { ROUTES, SECTION_IDS } from "@/content/navigation";

/**
 * Notable Works Section - GSAP Pinned Image Stack with ClipPath Wipe
 *
 * Two-column layout inspired by the CodePen "GSAP pinned image mask reveal on scroll":
 * - LEFT: Text sections stacked vertically, each 100vh, scrolls naturally
 * - RIGHT: Image stack pinned in place, images stacked via z-index
 * - As each text section scrolls through, the current top image wipes away
 *   via clipPath: inset(0 0 100%), revealing the image underneath
 * - Subtle object-position parallax on images during wipe
 */

/* Tint-to-background color map for page color transitions */
const TINT_COLORS: Record<string, string> = {
  pink: "#FFF0F3",
  yellow: "#FFF8E8",
  blue: "#EDF5FF",
  purple: "#F5F0FF",
  green: "#F0FFF4",
  neutral: "#F5F5F7",
};

export function WorksView({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();

      // Header entrance animation
      mm.add(MOTION_OK, () => {
        const intro = gsap.timeline({
          scrollTrigger: entranceTrigger(scope),
          onComplete: () => release(q(scope, "[data-eyebrow] [data-reveal], [data-works-cta]")),
        });
        fadeIn(intro, q(scope, "[data-eyebrow] [data-reveal]"), { stagger: 0.04 }, 0);
        growRule(intro, q(scope, "[data-eyebrow] [data-reveal-rule]"), {}, 0);
        fadeUp(intro, q(scope, "[data-works-cta]"), { distance: 20, scaleFrom: 0.85 }, 0.35);

        const revert = revealLines(q(scope, "[data-statement] h2"), {
          stagger: 0.09,
          trigger: { trigger: scope, start: "top 78%", once: true },
        });
        return () => revert();
      });

      // Desktop: Pinned image stack with clipPath wipe
      mm.add(MOTION_DESKTOP, () => {
        const archEl = scope.querySelector("[data-arch]") as HTMLElement;
        const rightCol = scope.querySelector("[data-arch-right]") as HTMLElement;
        if (!archEl || !rightCol) return;

        const imgs = q(scope, "[data-work-img]");
        const textSections = q(scope, "[data-work-text]");

        // Set z-index: first image on top (highest z), last on bottom
        imgs.forEach((img, i) => {
          (img as HTMLElement).style.zIndex = String(imgs.length - i);
        });

        // Initial clip state
        gsap.set(imgs, {
          clipPath: "inset(0)",
          objectPosition: "center 0%",
        });

        // Main timeline pinning the right column
        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: archEl,
            start: "top top",
            end: "bottom bottom",
            pin: rightCol,
            scrub: true,
          },
        });

        // For each image, create a wipe transition
        imgs.forEach((img, i) => {
          const nextImg = imgs[i + 1] || null;
          if (!nextImg) return;

          const sectionTl = gsap.timeline();

          // Current image wipes away from bottom
          sectionTl.to(
            img,
            {
              clipPath: "inset(0px 0px 100%)",
              objectPosition: "center 60%",
              duration: 1.5,
              ease: "none",
            },
            0,
          );

          // Next image subtle parallax shift
          sectionTl.to(
            nextImg,
            {
              objectPosition: "center 40%",
              duration: 1.5,
              ease: "none",
            },
            0,
          );

          mainTl.add(sectionTl);
        });

        // Text sections entrance animation
        textSections.forEach((section) => {
          const content = section.querySelector("[data-work-content]") as HTMLElement;
          if (!content) return;

          gsap.fromTo(
            content,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
                once: true,
              },
            },
          );
        });
      });

      // Mobile: simple stacked layout with scroll animations
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        const mobileCards = q(scope, "[data-mobile-card]");
        mobileCards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                once: true,
              },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={SECTION_IDS.works} className="relative w-full bg-paper">
      {/* Centered Statement and Header */}
      <div className="frame flex flex-col items-center text-center gap-5 pb-[clamp(44px,6vw,80px)] pt-[clamp(72px,10vw,140px)]">
        <div data-eyebrow className="flex justify-center">
          <Eyebrow items={worksIntro.eyebrow} align="center" />
        </div>
        <div data-statement>
          <Statement
            segments={worksIntro.statement}
            className="t-statement max-w-[28ch] text-center mx-auto"
          />
        </div>
        <div data-works-cta data-reveal className="mt-2 flex justify-center">
          <Link
            href={ROUTES.portfolio}
            className="group inline-flex items-center gap-3 rounded-full bg-brand-blue px-7 py-3.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-brand-blue/90 hover:shadow-xl hover:scale-105"
          >
            <span>Explore All Notable Events</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path d="M7 17l9.2-9.2M17 17V7.8H7.8" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ======== DESKTOP: Two-column pinned image stack ======== */}
      <div data-arch className="hidden lg:flex gap-[clamp(40px,5vw,80px)] max-w-[1200px] mx-auto px-[clamp(24px,4vw,64px)]">
        {/* Left: Text sections, each 100vh */}
        <div className="flex flex-col min-w-[280px] w-[40%] xl:w-[38%] shrink-0">
          {projects.map((work, i) => (
            <div
              key={work.id}
              data-work-text
              className="h-screen flex items-center"
            >
              <div data-work-content className="flex flex-col gap-3 max-w-[400px]">
                <p className="t-eyebrow text-ink/50 font-mono text-xs tracking-wider uppercase">
                  {work.eyebrow}
                </p>
                <h3 className="text-[clamp(1.6rem,2.8vw,2.5rem)] font-bold text-ink tracking-tight leading-[1.12] text-balance">
                  {work.title}
                </h3>
                {work.summary && (
                  <p className="t-body text-body-light leading-relaxed text-sm lg:text-base">
                    {work.summary}
                  </p>
                )}
                {work.href && (
                  <div className="mt-3">
                    <Link
                      href={work.href}
                      className="group inline-flex items-center gap-2 rounded-full border-2 border-ink/80 px-5 py-2 text-sm font-semibold text-ink transition-all duration-300 hover:bg-brand-blue hover:border-brand-blue hover:text-white hover:shadow-lg hover:scale-105"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" className="opacity-70">
                        <path fill="currentColor" d="M5 2c0 1.105-1.895 2-3 2a2 2 0 1 1 0-4c1.105 0 3 .895 3 2ZM11 3.5c0 1.105-.895 3-2 3s-2-1.895-2-3a2 2 0 1 1 4 0ZM6 9a2 2 0 1 1-4 0c0-1.105.895-3 2-3s2 1.895 2 3Z" />
                      </svg>
                      <span>Learn More</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Pinned image stack */}
        <div
          data-arch-right
          className="relative flex-1 h-screen flex flex-col"
        >
          {projects.map((work, i) => (
            <div
              key={work.id}
              className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[460px] xl:h-[520px] rounded-[20px] overflow-hidden"
              style={{ zIndex: projects.length - i }}
            >
              {work.hero ? (
                <Image
                  data-work-img
                  src={work.hero.src}
                  alt={work.hero.alt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 55vw"
                  className="object-cover"
                  style={work.hero.focal ? { objectPosition: work.hero.focal } : undefined}
                />
              ) : (
                <PlaceholderImage className="absolute inset-0 h-full w-full" note={work.note} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ======== MOBILE: Stacked cards ======== */}
      <div className="lg:hidden frame flex flex-col gap-8 pb-[clamp(48px,6vw,80px)]">
        {projects.map((work) => (
          <div
            key={work.id}
            data-mobile-card
            className="flex flex-col gap-4 rounded-[20px] overflow-hidden bg-white border border-ink/8 shadow-sm"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              {work.hero ? (
                <Image
                  src={work.hero.src}
                  alt={work.hero.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  style={work.hero.focal ? { objectPosition: work.hero.focal } : undefined}
                />
              ) : (
                <PlaceholderImage className="absolute inset-0 h-full w-full" note={work.note} />
              )}
            </div>
            <div className="flex flex-col gap-2 p-5 pt-0">
              <p className="t-eyebrow text-ink/50 font-mono text-xs tracking-wider uppercase">
                {work.eyebrow}
              </p>
              <h3 className="text-xl font-bold text-ink tracking-tight leading-tight">
                {work.title}
              </h3>
              {work.summary && (
                <p className="t-body text-body-light text-sm leading-relaxed line-clamp-3">
                  {work.summary}
                </p>
              )}
              {work.href && (
                <Link
                  href={work.href}
                  className="mt-2 group inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition-colors hover:text-accent"
                >
                  <span>Learn More</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
