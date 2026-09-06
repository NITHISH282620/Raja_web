"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, release, q } from "@/motion/primitives";
import { EASE, MOTION_OK } from "@/motion/ease";
import { audiences } from "@/content/solutions";
import { CTA } from "@/content/site";

/**
 * "Who We Build For" — the homepage's buyer-segment grid.
 *
 * WHY IT SITS HIGH ON THE PAGE. Everything else on the homepage answers "what
 * does Raja build". This is the only section that answers "is this for me",
 * which is the question a corporate marketing lead or an exhibition organiser
 * is actually holding when they land. Six named segments let them self-select
 * in one glance and leave for the page written for them, instead of reading a
 * capabilities tour that never says their job title.
 *
 * Cards are links, not decorations: each is the entry point to a solution page,
 * which is where the qualified brief actually gets submitted.
 */
export function Audiences() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: scope, start: "top 78%", once: true },
        });
        fadeUp(tl, q(scope, "[data-audience-head]"), {}, 0);
        const cards = q(scope, "[data-audience-card]");
        tl.fromTo(
          cards,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.06,
            ease: EASE.primary,
            onComplete: () => release(cards),
          },
          0.15,
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="who-we-build-for"
      className="frame py-[clamp(56px,7vw,120px)]"
    >
      <div data-audience-head data-reveal className="max-w-[760px]">
        <p className="t-eyebrow font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Who we build for
        </p>
        <h2
          id="who-we-build-for"
          className="mt-3 text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.1] tracking-tight text-ink"
        >
          Six kinds of buyer. One set of structures.
        </h2>
        <p className="t-body mt-4 max-w-[58ch] text-body-light">
          The inventory does not change with the occasion &mdash; the plan does. Find the
          brief closest to yours.
        </p>
      </div>

      <ul className="mt-[clamp(28px,3.4vw,52px)] grid gap-[clamp(12px,1.4vw,20px)] sm:grid-cols-2 lg:grid-cols-3">
        {audiences.map((a) => (
          <li key={a.href} data-audience-card data-reveal>
            <Link
              href={a.href}
              data-analytics="audience-card"
              data-analytics-label={a.label}
              className="group flex h-full flex-col rounded-[15px] border border-ink/12 bg-white p-[clamp(20px,2.1vw,28px)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-blue/50 hover:shadow-[0_14px_30px_rgba(15,26,48,0.07)]"
            >
              <h3 className="t-work text-ink">{a.label}</h3>
              <p className="t-body-sm mt-2.5 flex-1 text-body-light">{a.line}</p>
              <span className="t-body-sm mt-5 inline-flex items-center gap-2 text-brand-blue">
                See what we install
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-[clamp(24px,2.6vw,40px)] flex flex-wrap items-center gap-4">
        <Link
          href={CTA.primary.href}
          data-analytics="cta-primary"
          data-analytics-location="who-we-build-for"
          className="group inline-flex h-[54px] items-center gap-3 rounded-full bg-brand-blue px-8 text-white transition-colors duration-300 hover:bg-ink"
        >
          <span className="t-body">{CTA.primary.label}</span>
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
        <Link
          href={CTA.secondary.href}
          data-analytics="cta-secondary"
          data-analytics-location="who-we-build-for"
          className="t-body inline-flex items-center gap-2 text-ink underline-offset-4 hover:underline"
        >
          {CTA.secondary.label} <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
