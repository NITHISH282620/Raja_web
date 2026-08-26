"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/motion/primitives";
import { EASE } from "@/motion/ease";
import { brand } from "@/content/site";
import { company, contact, FOUNDED_YEAR } from "@/content/company";
import { navItems, primaryNav } from "@/content/navigation";
import { clsx } from "@/lib/clsx";

/**
 * The site header.
 *
 * Figma authored only a logo and a three-line hamburger floating over the hero,
 * which reads as decoration rather than navigation. The routes are made
 * explicit here at 1024 and above — set in the design's own mono label style so
 * the aesthetic is unchanged — while the overlay is kept for narrower screens.
 *
 * The header is transparent over the homepage hero and solid everywhere else,
 * because on an interior page there is no dark photograph to sit against.
 */
export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const overHero = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape, focus trap and scroll lock while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !overlay.current) return;
      const f = overlay.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    overlay.current?.querySelector<HTMLElement>("a[href]")?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // GSAP owns the overlay so the links arrive as one orchestrated move rather
  // than a CSS fade. Same expo curve as the rest of the site.
  useGSAP(
    () => {
      const node = overlay.current;
      if (!node) return;
      const links = node.querySelectorAll("[data-nav-link]");
      const meta = node.querySelectorAll("[data-nav-meta]");

      if (open) {
        gsap.set(node, { pointerEvents: "auto" });
        gsap
          .timeline()
          .to(node, { opacity: 1, duration: 0.35, ease: EASE.primary })
          .fromTo(links, { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.7, stagger: { each: 0.055, ease: "power1.inOut" }, ease: EASE.primary }, 0.08)
          .fromTo(meta, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.35);
      } else {
        gsap.to(node, {
          opacity: 0,
          duration: 0.3,
          ease: EASE.primary,
          onComplete: () => gsap.set(node, { pointerEvents: "none" }),
        });
      }
    },
    { dependencies: [open], scope: overlay },
  );

  const solid = !overHero || scrolled;

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
          solid
            ? "border-b border-white/10 bg-ink/90 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="frame flex items-center justify-between gap-6 py-[clamp(14px,1.5vw,20px)]">
          <Link
            href="/"
            data-hero-logo
            className="block w-[clamp(96px,9vw,131px)] shrink-0"
            aria-label={`${company.name} — home`}
          >
            <Image
              src={brand.logo.src}
              alt={company.name}
              width={brand.logo.width}
              height={brand.logo.height}
              priority
              className="h-auto w-full"
            />
          </Link>

          {/* Desktop: the routes, stated plainly. */}
          <nav aria-label="Primary" className="hidden lg:flex lg:items-center lg:gap-[clamp(18px,2.2vw,34px)]">
            {primaryNav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "t-eyebrow relative py-2 text-white/70 transition-colors duration-300 hover:text-white",
                    active && "text-white",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={clsx(
                      "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-300",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="t-pill hidden shrink-0 rounded-full bg-white px-5 py-2 text-ink transition-colors duration-300 hover:bg-accent hover:text-white sm:inline-flex"
            >
              Contact
            </Link>

            {/* The overlay trigger — labelled, not a bare icon. */}
            <button
              ref={trigger}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group flex items-center gap-3 py-2 lg:hidden"
            >
              <span className="t-eyebrow text-white">{open ? "Close" : "Menu"}</span>
              <span aria-hidden className="flex w-[26px] flex-col gap-[6px]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    data-reveal-rule
                    className="block h-px w-full origin-right bg-white transition-transform duration-300 group-hover:scale-x-75"
                  />
                ))}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Overlay (below 1024) ---------- */}
      <div
        id="site-menu"
        ref={overlay}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        style={{ opacity: 0, pointerEvents: "none" }}
        className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-[clamp(20px,5.55vw,80px)] pb-[clamp(28px,4vw,48px)] pt-[clamp(88px,12vw,132px)] lg:hidden"
        {...(open ? {} : { inert: true })}
      >
        <nav aria-label="Site" className="flex flex-col">
          {navItems.map((item) => (
            <span key={item.href} className="overflow-hidden py-[clamp(2px,0.6vw,6px)]">
              <Link
                href={item.href}
                data-nav-link
                onClick={() => setOpen(false)}
                className="t-slide block w-fit text-white transition-colors duration-300 hover:text-accent"
              >
                {item.label}
              </Link>
            </span>
          ))}
        </nav>

        <div data-nav-meta className="flex flex-col gap-2">
          <p className="t-eyebrow text-white/45">
            Est. {FOUNDED_YEAR} — {company.city}
          </p>
          {contact.phone && (
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="t-body text-white/80 hover:text-accent">
              {contact.phone}
            </a>
          )}
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="t-body text-white/80 hover:text-accent">
              {contact.email}
            </a>
          )}
        </div>
      </div>
    </>
  );
}
