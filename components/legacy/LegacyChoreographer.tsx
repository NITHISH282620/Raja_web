"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/motion/primitives";
import { EASE, MOTION_OK } from "@/motion/ease";

export function LegacyChoreographer() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {

      /* ─── HERO — page load entrance ─────────────────────────────── */
      gsap.set("[data-hero-eyebrow]",    { opacity: 0, y: -14 });
      gsap.set("[data-hero-headline]",   { opacity: 0, y: 44 });
      gsap.set("[data-hero-lead]",       { opacity: 0, y: 24 });
      gsap.set("[data-hero-image]",      { opacity: 0, y: 40, scale: 0.98 });
      gsap.set("[data-hero-stat-card]",  { opacity: 0, y: 20 });

      const heroTl = gsap.timeline({ defaults: { ease: EASE.primary } });
      heroTl
        .to("[data-hero-eyebrow]",    { opacity: 1, y: 0, duration: 0.65 }, 0.2)
        .to("[data-hero-headline]",   { opacity: 1, y: 0, duration: 0.9  }, 0.35)
        .to("[data-hero-lead]",       { opacity: 1, y: 0, duration: 0.8  }, 0.5)
        .to("[data-hero-image]",      { opacity: 1, y: 0, scale: 1, duration: 1.2 }, 0.65)
        .to("[data-hero-stat-card]",  { opacity: 1, y: 0, duration: 0.8 }, 1.0);

      /* Hero ghost numeral parallax */
      gsap.to("[data-hero-ghost]", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero-section]",
          start: "top top",
          end: "bottom top",
          scrub: 1.8,
        },
      });

      /* ─── ORIGINS — slide in from sides ─────────────────────────── */
      gsap.set("[data-origins-eyebrow]", { opacity: 0, x: -20 });
      gsap.set("[data-origins-headline]",{ opacity: 0, y: 36 });
      gsap.set("[data-origins-body]",    { opacity: 0, y: 24 });
      gsap.set("[data-origins-quote]",   { opacity: 0, x: -28 });
      gsap.set("[data-origins-meta]",    { opacity: 0, y: 16 });
      gsap.set("[data-origins-image]",   { opacity: 0, x: 48, scale: 0.96 });

      ScrollTrigger.create({
        trigger: "[data-origins-section]",
        start: "top 68%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: EASE.primary } });
          tl
            .to("[data-origins-image]",   { opacity: 1, x: 0, scale: 1, duration: 1.2 }, 0)
            .to("[data-origins-eyebrow]", { opacity: 1, x: 0, duration: 0.6 }, 0.1)
            .to("[data-origins-headline]",{ opacity: 1, y: 0, duration: 0.9 }, 0.28)
            .to("[data-origins-body]",    { opacity: 1, y: 0, duration: 0.75 }, 0.48)
            .to("[data-origins-quote]",   { opacity: 1, x: 0, duration: 0.8 }, 0.62)
            .to("[data-origins-meta]",    { opacity: 1, y: 0, duration: 0.65 }, 0.8);
        },
      });

      /* ─── TIMELINE — rule draws down, then dots fire ──────── */
      gsap.set("[data-timeline-rule]", { scaleY: 0, transformOrigin: "top center" });
      gsap.set("[data-timeline-item]", { opacity: 0, y: 28 });

      ScrollTrigger.create({
        trigger: "[data-timeline-section]",
        start: "top 60%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: EASE.primary } });
          tl
            .to("[data-timeline-rule]", { scaleY: 1, duration: 1.2 })
            .to("[data-timeline-item]", { opacity: 1, y: 0, stagger: 0.15, duration: 0.7 }, "-=0.9");
        },
      });

      /* ─── PIVOT — image sweeps left, text arrives right ─────────── */
      gsap.set("[data-pivot-image]",   { opacity: 0, x: -48, scale: 0.96 });
      gsap.set("[data-pivot-eyebrow]", { opacity: 0, x: 20 });
      gsap.set("[data-pivot-headline]",{ opacity: 0, y: 36 });
      gsap.set("[data-pivot-body]",    { opacity: 0, y: 24 });
      gsap.set("[data-pivot-quote]",   { opacity: 0, x: 28 });
      gsap.set("[data-pivot-meta]",    { opacity: 0, y: 16 });

      ScrollTrigger.create({
        trigger: "[data-pivot-section]",
        start: "top 68%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: EASE.primary } });
          tl
            .to("[data-pivot-image]",   { opacity: 1, x: 0, scale: 1, duration: 1.2 }, 0)
            .to("[data-pivot-eyebrow]", { opacity: 1, x: 0, duration: 0.6 }, 0.12)
            .to("[data-pivot-headline]",{ opacity: 1, y: 0, duration: 0.9 }, 0.3)
            .to("[data-pivot-body]",    { opacity: 1, y: 0, duration: 0.75 }, 0.5)
            .to("[data-pivot-quote]",   { opacity: 1, x: 0, duration: 0.8 }, 0.65)
            .to("[data-pivot-meta]",    { opacity: 1, y: 0, duration: 0.65 }, 0.82);
        },
      });

      /* ─── EVOLUTION — cascade rows down with stagger ─────────────── */
      gsap.set("[data-evolution-header]", { opacity: 0, y: 28 });
      gsap.set("[data-evolution-labels]", { opacity: 0, y: 16 });
      gsap.set("[data-evolution-row]",    { opacity: 0, x: -12, y: 14 });

      ScrollTrigger.create({
        trigger: "[data-evolution-section]",
        start: "top 70%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: EASE.primary } });
          tl
            .to("[data-evolution-header]", { opacity: 1, y: 0, stagger: 0.1, duration: 0.8 })
            .to("[data-evolution-labels]", { opacity: 1, y: 0, duration: 0.65 }, "-=0.4")
            .to("[data-evolution-row]",    { opacity: 1, x: 0, y: 0, stagger: 0.1, duration: 0.65 }, "-=0.35");
        },
      });

      /* ─── TRUST — tiles scale-pop, quote box arrives last ─────────── */
      gsap.set("[data-trust-header]",    { opacity: 0, y: 28 });
      gsap.set("[data-trust-tile]",      { opacity: 0, y: 40, scale: 0.93 });
      gsap.set("[data-trust-quote-box]", { opacity: 0, y: 36 });

      ScrollTrigger.create({
        trigger: "[data-trust-section]",
        start: "top 70%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: EASE.primary } });
          tl
            .to("[data-trust-header]",    { opacity: 1, y: 0, stagger: 0.08, duration: 0.8 })
            .to("[data-trust-tile]",      { opacity: 1, y: 0, scale: 1, stagger: 0.13, duration: 0.8 }, "-=0.45")
            .to("[data-trust-quote-box]", { opacity: 1, y: 0, duration: 1.0 }, "-=0.2");
        },
      });
    });

    return () => mm.revert();
  }, []);

  return null;
}
