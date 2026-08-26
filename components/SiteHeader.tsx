"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { navItems } from "@/content/navigation";
import { company, FOUNDED_YEAR, yearsInOperation } from "@/content/company";
import { clsx } from "@/lib/clsx";

/**
 * Logo plus the three-line menu control that Figma animates into the hero.
 *
 * The file defines no open state and no routes, so the overlay is built in the
 * design's own language — black ground, oversized Poppins, mono meta — and
 * anchors to the sections that actually exist on the page.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-[clamp(20px,2.08vw,30px)] py-[clamp(20px,2.15vw,31px)]">
        <a
          href="#top"
          data-reveal
          data-hero-logo
          className="pointer-events-auto block w-[clamp(96px,9.1vw,131px)] mix-blend-difference"
        >
          <Image
            src="/media/brand-raja-logo.webp"
            alt={`${company.name} home`}
            width={400}
            height={101}
            priority
            className="h-auto w-full"
          />
        </a>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="site-menu"
          className="pointer-events-auto group flex w-[38px] flex-col gap-[8px] py-2"
        >
          <span className="sr-only">Open menu</span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              data-reveal-rule
              aria-hidden
              className="block h-px w-full bg-white transition-transform duration-300 group-hover:scale-x-75"
              style={{ transformOrigin: "right center" }}
            />
          ))}
        </button>
      </div>

      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        ref={panelRef}
        className={clsx(
          "fixed inset-0 z-50 flex flex-col justify-between bg-ink px-[clamp(20px,5.55vw,80px)] py-[clamp(24px,4vw,48px)]",
          "transition-opacity duration-500",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        // Keeps the closed overlay out of the accessibility tree and out of
        // the tab order without unmounting it, so the transition can play.
        inert={!open}
      >
        <div className="flex items-start justify-between">
          <p className="t-eyebrow text-white/50">
            Est. {FOUNDED_YEAR} — {company.city}
          </p>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            className="t-eyebrow text-white/70 transition-colors hover:text-accent"
          >
            Close
          </button>
        </div>

        <nav className="flex flex-col gap-[clamp(6px,1.2vw,14px)]">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="t-slide w-fit text-white transition-colors duration-300 hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <p className="t-eyebrow text-white/40">
          {yearsInOperation()} years in operation — thousands of builds
        </p>
      </div>
    </>
  );
}
