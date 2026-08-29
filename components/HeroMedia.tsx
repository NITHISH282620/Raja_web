"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { heroMedia } from "@/content/site";

/**
 * The hero background: a poster image that always renders, with Raja's own
 * project film fading in over it when conditions allow.
 *
 * The poster owns the LCP. The video is never part of the initial render and
 * never blocks it — it is only requested after mount, and only when the visitor
 * has not asked for reduced motion and the browser is not reporting a metered
 * or slow connection.
 *
 * The 640px width gate that used to sit here was there because the "mobile"
 * encode was 25 MB. It is 1.3 MB now, which is less than the poster plus a
 * couple of section photographs, so phones get the film too. `saveData` and
 * slow-connection reporting still opt out — those are statements about cost and
 * bandwidth, not about screen size.
 */
const REDUCED = "(prefers-reduced-motion: reduce)";

function useVideoAllowed(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(REDUCED);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => {
      if (window.matchMedia(REDUCED).matches) return false;
      const conn = (
        navigator as Navigator & {
          connection?: { saveData?: boolean; effectiveType?: string };
        }
      ).connection;
      if (conn?.saveData) return false;
      return !/(^|-)(2g|slow-2g)$/.test(conn?.effectiveType ?? "");
    },
    // Server snapshot. False, so the poster is what gets rendered and the
    // markup the client hydrates against matches.
    () => false,
  );
}

/** Chooses the 960px encode below the desktop breakpoint. */
function useIsCompact(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia("(max-width: 1023px)");
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(max-width: 1023px)").matches,
    () => true,
  );
}

export function HeroMedia() {
  const showVideo = useVideoAllowed();
  const isCompact = useIsCompact();
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Pause while off-screen, play when visible. A 20-second loop decoding behind
  // eight sections of scroll is pure battery cost.
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

  const videoSrc = isCompact ? heroMedia.mobileSrc : heroMedia.video.src;

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {/* Poster — owns LCP, always visible until the video is ready. */}
      <Image
        src={heroMedia.poster.src}
        alt={heroMedia.poster.alt}
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: heroMedia.poster.focal ?? "center" }}
      />

      {showVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          autoPlay
          aria-label={heroMedia.video.description}
          onCanPlay={() => setReady(true)}
          className={[
            "absolute inset-0 h-full w-full object-cover",
            "transition-opacity duration-[1400ms] ease-out",
            ready ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
