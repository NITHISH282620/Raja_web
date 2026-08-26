"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { heroMedia } from "@/content/site";

/**
 * The hero background: a poster image that always renders, with Raja's own
 * aerial loop fading in over it when conditions justify the download.
 *
 * The poster owns the LCP. The video is never part of the initial render and
 * never blocks it — it is only requested after mount, and only when all of
 * these hold:
 *
 *   - the visitor has not asked for reduced motion
 *   - the viewport is wide enough for the detail to read
 *   - the browser is not reporting a metered or slow connection
 *
 * It also pauses whenever the hero scrolls out of view, so a looping video is
 * not burning battery for the whole page.
 */
const QUERIES = ["(prefers-reduced-motion: reduce)", "(min-width: 768px)"] as const;

/**
 * Read as external browser state rather than assigning it in an effect: this
 * stays correct through SSR (the server snapshot is always false, so the poster
 * is what gets rendered) and it re-evaluates live if the visitor turns reduced
 * motion on or resizes across the breakpoint.
 */
function useVideoAllowed(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const lists = QUERIES.map((q) => window.matchMedia(q));
      lists.forEach((l) => l.addEventListener("change", onChange));
      return () => lists.forEach((l) => l.removeEventListener("change", onChange));
    },
    () => {
      const [reduced, wide] = QUERIES.map((q) => window.matchMedia(q).matches);
      // navigator.connection is non-standard; treat its absence as "no signal".
      const conn = (navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }).connection;
      const thrifty = Boolean(conn?.saveData) || /(^|-)2g$/.test(conn?.effectiveType ?? "");
      return !reduced && wide && !thrifty;
    },
    () => false,
  );
}

export function HeroMedia() {
  const showVideo = useVideoAllowed();
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Pause while off-screen.
  useEffect(() => {
    const node = wrapRef.current;
    const video = videoRef.current;
    if (!node || !video || !showVideo) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [showVideo]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Image
        src={heroMedia.image.src}
        alt={heroMedia.image.alt}
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: heroMedia.image.focal ?? "center" }}
      />

      {showVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          autoPlay
          aria-label={heroMedia.video.description}
          onCanPlay={() => setReady(true)}
          className={[
            "absolute inset-0 h-full w-full object-cover",
            "transition-opacity duration-[1200ms] ease-out",
            ready ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          {heroMedia.sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      )}
    </div>
  );
}
