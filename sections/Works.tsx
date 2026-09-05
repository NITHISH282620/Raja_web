"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  fadeUp,
  fadeIn,
  growRule,
  revealLines,
  release,
  entranceTrigger,
  q,
} from "@/motion/primitives";
import { MOTION_OK, MOTION_DESKTOP, MOTION_COMPACT, EASE } from "@/motion/ease";
import { Eyebrow } from "@/components/Eyebrow";
import { Statement } from "@/components/Statement";
import { PlaceholderImage } from "@/components/Placeholder";
import { worksIntro, type Project } from "@/content/works";
import { ROUTES, SECTION_IDS } from "@/content/navigation";

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
        const textTrack = scope.querySelector("[data-text-track]");

        // Set z-index: first image on top (highest z), last on bottom
        imgs.forEach((img, i) => {
          (img as HTMLElement).style.zIndex = String(imgs.length - i);
        });

        // Initial clip state
        gsap.set(imgs, {
          clipPath: "inset(0)",
          objectPosition: "center 0%",
        });

        const archCard = scope.querySelector("[data-arch-card]");

        // Main timeline pinning the entire card
        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: archCard,
            start: "top 120px",
            end: `+=${projects.length * 100}%`,
            pin: true,
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
          
          // Animate card background color to next image's tint
          if (archCard && projects[i + 1]) {
            sectionTl.to(
              archCard,
              {
                backgroundColor: TINT_COLORS[projects[i + 1].tint] || "#F5F5F7",
                duration: 1.5,
                ease: "power2.inOut",
              },
              0
            );
          }
          
          // Animate text track up
          if (textTrack) {
            sectionTl.to(
              textTrack,
              {
                yPercent: -100 * (i + 1),
                duration: 1.5,
                ease: "none", // MUST BE "none" TO MATCH IMAGE WIPE EXACTLY
              },
              0
            );
          }

          mainTl.add(sectionTl);
        });
      });

      // Mobile: simple stacked layout with scroll animations
      /**
       * Mobile.
       *
       * There were two matchMedia blocks here registered on the SAME query —
       * `(max-width: 1023px) and (prefers-reduced-motion: no-preference)` is
       * exactly what MOTION_COMPACT expands to — both tweening
       * [data-mobile-card] from different starting values, the second with
       * clearProps wiping whatever the first had set. They fought, and the
       * result read as no motion at all.
       *
       * One block now. The card enters, and its image scrubs against scroll so
       * the section has the same sense of movement the desktop stack has,
       * without pinning anything on a touch device.
       */
      mm.add(MOTION_COMPACT, () => {
        const mobileCards = q(scope, "[data-mobile-card]");

        mobileCards.forEach((card) => {
          const img = card.querySelector<HTMLElement>("[data-mobile-card-image]");

          gsap.fromTo(
            card,
            { opacity: 0, y: 28, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.65,
              ease: EASE.primary,
              scrollTrigger: { trigger: card, start: "top 90%", once: true },
              onComplete: () => release([card]),
            },
          );

          // Scrubbed image drift. Transform only, so it stays on the compositor.
          if (img) {
            gsap.fromTo(
              img,
              { yPercent: -6, scale: 1.08 },
              {
                yPercent: 6,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.6,
                },
              },
            );
          }
        });

        // Each card recedes while the next rides over it, so the stack reads as
        // depth rather than as cards simply overlapping. The last one is left
        // alone — nothing comes over it.
        mobileCards.slice(0, -1).forEach((card, i) => {
          const next = mobileCards[i + 1];
          gsap.fromTo(
            card,
            { scale: 1, opacity: 1 },
            {
              scale: 0.94,
              opacity: 0.55,
              ease: "none",
              scrollTrigger: {
                trigger: next,
                start: "top bottom",
                end: "top top+=120",
                scrub: 0.4,
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
      <div className="relative lg:sticky lg:top-[10vh] z-0 frame flex flex-col items-center text-center gap-4 sm:gap-5 pb-6 sm:pb-[clamp(24px,4vw,40px)] pt-12 sm:pt-[clamp(40px,6vw,80px)]">
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
            href={ROUTES.projects}
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
      {/* Wrapped in `.frame` rather than given a hand-computed max-width: the
          frame collapses to the viewport below 1440px, so any calc against the
          fixed container value drifts out of alignment at 1280 and 1024. This
          way the card's edges match every other section's content edges at
          every width, by construction. */}
      <div className="frame hidden lg:block">
      <div 
        data-arch-card 
        className="relative z-10 w-full rounded-[40px] py-[4vh] px-[clamp(24px,4vw,64px)] shadow-2xl transition-colors duration-1000 ease-in-out lg:px-[clamp(40px,6vw,100px)] xl:rounded-[60px]"
        style={{ backgroundColor: TINT_COLORS[projects[0]?.tint || "neutral"] || "#F5F5F7" }}
      >
        <div data-arch className="flex gap-8 lg:gap-16 max-w-[1200px] mx-auto">
        {/* Left: Text track with mask */}
        <div className="flex flex-col min-w-[280px] w-[40%] xl:w-[38%] shrink-0 overflow-hidden h-[60vh]">
          <div data-text-track className="flex flex-col w-full h-full">
          {projects.map((work) => (
            <div
              key={work.id}
              data-work-text
              className="h-[60vh] flex-shrink-0 flex items-center"
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
        </div>

        {/* Right: Pinned image stack */}
        <div
          data-arch-right
          className="relative flex-1 h-[60vh] flex flex-col"
        >
          {projects.map((work, i) => (
            <div
              key={work.id}
              className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[400px] xl:h-[480px] rounded-[20px] overflow-hidden"
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
      </div>
      </div>

      {/* ======== MOBILE: Stacked cards with rich interaction & animations ======== */}
      {/*
        Mobile: a sticky card stack.

        Desktop pins the whole card and scrubs a timeline, sliding the text
        track up by one card height per project. Pinning a touch viewport and
        driving it from scrub is the part that does not travel — it fights
        momentum scrolling and costs a repaint per frame.

        `position: sticky` gets the same reading for free. Each card parks below
        the nav and the next one rides up over it, so the cards advance one by
        one exactly as they do on desktop, at native scroll performance. The
        scrubbed tween below only dims and shrinks the outgoing card.
      */}
      <div className="relative z-10 lg:hidden frame pb-14 sm:pb-[clamp(48px,6vw,80px)]">
        {projects.map((work, i) => (
          <div
            key={work.id}
            data-mobile-card
            style={{ zIndex: i + 1, top: `calc(88px + ${i * 10}px)` }}
            className="group sticky mb-6 flex flex-col gap-4 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-xs sm:mb-8 sm:rounded-[20px]"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
              {work.hero ? (
                <div data-mobile-card-image className="absolute inset-0 will-change-transform">
                  <Image
                    src={work.hero.src}
                    alt={work.hero.alt}
                    fill
                    sizes="(max-width: 1023px) 100vw, 55vw"
                    className="object-cover"
                    style={work.hero.focal ? { objectPosition: work.hero.focal } : undefined}
                  />
                </div>
              ) : (
                <PlaceholderImage className="absolute inset-0 h-full w-full" note={work.note} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3">
                <span className="font-mono text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-md">
                  {work.eyebrow}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-5 pt-1">
              <h3 className="text-xl font-bold text-ink tracking-tight leading-tight group-hover:text-brand-blue transition-colors">
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
                  className="mt-2 group/btn inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition-colors hover:text-accent"
                >
                  <span>Explore Architecture</span>
                  <span className="transition-transform duration-300 group-hover/btn:translate-x-1">&rarr;</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
