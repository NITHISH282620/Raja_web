"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { registerEases } from "./ease";

/**
 * Registers GSAP once for the whole app.
 *
 * Deliberately does not own any timelines — each section builds and disposes of
 * its own through `useGSAP`, scoped to its own ref. That is what keeps the
 * choreography modular: a section's motion can be retimed or removed without
 * touching anything else on the page.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
    registerEases();

    // iOS collapses its address bar on scroll, which fires a resize and would
    // otherwise recalculate every pin mid-scroll.
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Pin positions are measured from laid-out geometry. Fonts and images both
    // change that geometry after first paint, so refresh once each has settled.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) void document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => window.removeEventListener("load", refresh);
  }, []);

  return <>{children}</>;
}

/**
 * True when the visitor has asked for reduced motion. Sections use this to
 * choose a branch rather than to disable themselves — content must remain
 * reachable and complete either way.
 */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
