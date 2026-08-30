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
 * Notable Works Section - GSAP Pinned Arch-Mask Scroll Reveal
 *
 * Each project is a full-viewport pinned section with:
 * - Left: text content (eyebrow, title, description, Learn More CTA)
 * - Right: image with an arch-shaped clip-path that reveals/scales on scroll
 * - Sections stack: next section scrolls over the previous pinned one
 *
 * Inspired by the CodePen "GSAP pinned image mask reveal on scroll" by gridmorphic.
 */

/* Arch clip-path polygon - a tall rounded-arch shape */
const ARCH_CLIP = "polygon(0% 12%, 2% 6%, 6% 2%, 12% 0%, 88% 0%, 94% 2%, 98% 6%, 100% 12%, 100% 100%, 0% 100%)";

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

      // Desktop: Pinned arch-mask reveal for each project
      mm.add(MOTION_DESKTOP, () => {
        const archSections = q(scope, "[data-arch-section]");

        archSections.forEach((section, i) => {
          const archImage = section.querySelector("[data-arch-image]") as HTMLElement;
          const archContent = section.querySelector("[data-arch-content]") as HTMLElement;
          const learnMoreBtn = section.querySelector("[data-learn-more]") as HTMLElement;

          if (!archImage) return;

          // Pin each section
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "+=100%",
            pin: true,
            pinSpacing: true,
          });

          // Animate arch image scale reveal on scroll
          gsap.fromTo(
            archImage,
            {
              scale: 0.6,
              opacity: 0.3,
            },
            {
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=80%",
                scrub: 0.6,
              },
            },
          );

          // Text content fade in
          if (archContent) {
            gsap.fromTo(
              archContent,
              { opacity: 0, x: -30 },
              {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 60%",
                  once: true,
                },
              },
            );
          }

          // Learn More button pop
          if (learnMoreBtn) {
            gsap.fromTo(
              learnMoreBtn,
              { opacity: 0, y: 20, scale: 0.9 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: "back.out(1.7)",
                scrollTrigger: {
                  trigger: section,
                  start: "top 40%",
                  once: true,
                },
              },
            );
          }
        });
      });

      // Mobile/Tablet: simple stacked cards
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = q(scope, "[data-arch-section]");
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
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

      {/* Pinned Arch-Mask Scroll Reveal Sections */}
      <div className="relative">
        {projects.map((work, i) => (
          <ArchSection key={work.id} work={work} index={i} total={projects.length} />
        ))}
      </div>
    </section>
  );
}

/* ---- Individual Arch Section ---- */

function ArchSection({
  work,
  index,
  total,
}: {
  work: Project;
  index: number;
  total: number;
}) {
  const isLast = index === total - 1;

  return (
    <div
      data-arch-section
      className="relative w-full bg-paper lg:h-screen lg:min-h-[700px] flex flex-col lg:flex-row items-center overflow-hidden"
      style={{ zIndex: 10 + index }}
    >
      {/* Left: Content */}
      <div
        data-arch-content
        className={`
          relative z-10 flex flex-col justify-center gap-4
          px-6 py-10 sm:px-10 lg:px-0
          w-full lg:w-[45%] xl:w-[40%]
          lg:pl-[clamp(48px,6vw,96px)] lg:pr-[clamp(24px,3vw,48px)]
        `}
      >
        <p className="t-eyebrow text-ink/60 font-mono text-xs tracking-wider uppercase">
          {work.eyebrow}
        </p>
        <h3 className="text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold text-ink tracking-tight leading-[1.12] text-balance">
          {work.title}
        </h3>
        {work.summary && (
          <p className="t-body text-body-light leading-relaxed max-w-[480px]">
            {work.summary}
          </p>
        )}
        {work.href && (
          <div data-learn-more className="mt-3">
            <Link
              href={work.href}
              className="group inline-flex items-center gap-2.5 rounded-full border-2 border-ink/90 px-6 py-2.5 text-sm font-semibold text-ink transition-all duration-300 hover:bg-brand-blue hover:border-brand-blue hover:text-white hover:shadow-lg hover:scale-105"
            >
              <span>Learn More</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* Right: Arch-Masked Image */}
      <div className="relative w-full lg:w-[55%] xl:w-[60%] h-[50vh] sm:h-[60vh] lg:h-full flex items-center justify-center p-4 lg:p-8">
        <div
          data-arch-image
          className="relative w-full h-full max-w-[700px] lg:max-w-none overflow-hidden rounded-t-[40%] rounded-b-[8px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)]"
          style={{ clipPath: ARCH_CLIP }}
        >
          {work.hero ? (
            <Image
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

          {/* Gradient overlay at bottom for depth */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}