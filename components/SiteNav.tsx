"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "@/lib/clsx";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/motion/primitives";
import { EASE } from "@/motion/ease";
import { primaryNav, navItems } from "@/content/navigation";
import { company, FOUNDED_YEAR } from "@/content/company";
import type { ContactSettings } from "@/lib/store";
import { brand } from "@/content/site";

export function SiteNav({ contact }: { contact: ContactSettings }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  const overHero = pathname === "/";

  /**
   * One passive scroll listener drives the pill's solid state, progress rail,
   * and smart auto-hide on mobile scroll down (glides back on scroll up).
   */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);

      if (y > 160 && y > lastScrollY.current + 8) {
        setHidden(true);
      } else if (y < lastScrollY.current - 6 || y < 80) {
        setHidden(false);
      }
      lastScrollY.current = y;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const bar = progress.current;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

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
          "fixed top-4 sm:top-6 inset-x-0 z-50 flex justify-center w-full px-4 lg:px-8 pointer-events-none transition-transform duration-300 ease-out",
          hidden && !open ? "-translate-y-28" : "translate-y-0"
        )}
      >
        <div
          className={clsx(
            "pointer-events-auto relative flex items-center justify-between rounded-full transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500",
            // 75% viewport width on desktop, strictly capped, creating the compact floating pill effect
            "w-full max-w-[1100px] lg:w-[75vw]",
            // Fixed height to ensure perfect geometric proportions
            "h-[64px] lg:h-[76px]",
            // Asymmetric padding: generous on the left for the logo, tight on the right to hug the CTA
            "pl-6 pr-2 lg:pl-10 lg:pr-3",
            // On scroll / solid: sleek white pill with soft shadow and subtle border
            // Over hero at top: translucent glass pill
            solid
              ? "bg-white/95 border border-ink/10 shadow-[0_10px_34px_-12px_rgba(16,16,20,0.15)] backdrop-blur-md"
              : "border border-white/15 bg-white/[0.06] shadow-none backdrop-blur-[6px]"
          )}
        >
          {/* LOGO: Sized to match reference scale, vertically centered */}
          <Link
            href="/"
            data-hero-logo
            className="block w-[100px] lg:w-[125px] shrink-0"
            aria-label={`${company.name} - home`}
          >
            <div 
              className={clsx(
                "w-full h-[24px] lg:h-[28px] transition-colors duration-500",
                solid ? "bg-brand-blue" : "bg-white"
              )}
              style={{
                WebkitMaskImage: `url(${brand.logo.src})`,
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center left",
                maskImage: `url(${brand.logo.src})`,
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center left",
              }}
            />
            <span className="sr-only">{company.name}</span>
          </Link>

          {/* Reading progress. Inside the pill's own radius so it reads as part
              of the component rather than as a bar stuck to the viewport. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-6 bottom-0 h-[2px] overflow-hidden rounded-full lg:inset-x-10"
          >
            <span
              ref={progress}
              className={clsx(
                "block h-full origin-left rounded-full transition-colors duration-500",
                solid ? "bg-brand-blue/60" : "bg-white/60",
              )}
              style={{ transform: "scaleX(0)" }}
            />
          </span>

          {/* NAVIGATION: Absolutely centered within the pill to ensure perfect balance */}
          <nav aria-label="Primary" className="hidden lg:flex lg:items-center lg:gap-[clamp(24px,2.5vw,40px)] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {primaryNav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "group relative px-2 py-2 text-[14px] font-medium tracking-wide capitalize transition-colors duration-300",
                    solid
                      ? active
                        ? "text-brand-blue font-semibold"
                        : "text-brand-blue/80 hover:text-brand-blue"
                      : active
                        ? "text-white font-medium"
                        : "text-white/85 hover:text-white"
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={clsx(
                      "absolute inset-x-2 -bottom-1 h-[1.5px] origin-left transition-transform duration-300",
                      solid ? "bg-brand-blue" : "bg-white",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CONTACT BUTTON & MOBILE TOGGLE */}
          <div className="flex items-center gap-3">
            {/* CTA: Large, fully rounded pill hugging the right edge of the navbar */}
            <Link
              href="/contact"
              className={clsx(
                "hidden shrink-0 items-center justify-center rounded-full px-8 h-[52px] text-[15px] font-medium capitalize tracking-wide transition-colors duration-300 lg:inline-flex",
                solid
                  ? "bg-brand-blue text-white hover:bg-brand-blue/90 shadow-sm"
                  : "bg-white text-ink hover:bg-white/90"
              )}
            >
              Contact
            </Link>

            <button
              ref={trigger}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className={clsx(
                "group flex items-center gap-3 h-[48px] px-5 rounded-full lg:hidden transition-colors duration-300"
              )}
            >
              <span
                className={clsx(
                  "text-[13px] font-medium tracking-wide uppercase transition-colors duration-300",
                  solid ? "text-brand-blue" : "text-white"
                )}
              >
                {open ? "Close" : "Menu"}
              </span>
              <span aria-hidden className="flex w-[24px] flex-col gap-[5px]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    data-reveal-rule
                    className={clsx(
                      "block h-[1.5px] w-full origin-right transition-transform duration-300 group-hover:scale-x-75",
                      solid ? "bg-brand-blue" : "bg-white"
                    )}
                  />
                ))}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU FULLSCREEN */}
      <div
        id="site-menu"
        ref={overlay}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        style={{ opacity: 0, pointerEvents: "none" }}
        className="fixed inset-0 z-40 flex flex-col justify-between bg-paper px-[clamp(20px,5.55vw,80px)] pb-[clamp(28px,4vw,48px)] pt-[clamp(100px,12vw,132px)] lg:hidden"
        {...(open ? {} : { inert: true })}
      >
        <nav aria-label="Site" className="flex flex-col">
          {navItems.map((item) => (
            <span key={item.href} className="overflow-hidden py-[clamp(2px,0.6vw,6px)]">
              <Link
                href={item.href}
                data-nav-link
                onClick={() => setOpen(false)}
                className="t-slide block w-fit text-brand-blue capitalize transition-colors duration-300 hover:text-ink"
              >
                {item.label}
              </Link>
            </span>
          ))}
        </nav>

        <div data-nav-meta className="flex flex-col gap-2">
          <p className="t-eyebrow text-ink/45">
            Est. {FOUNDED_YEAR} — {company.city}
          </p>
          {contact.phone && (
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="t-body text-ink/80 hover:text-brand-blue">
              {contact.phone}
            </a>
          )}
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="t-body text-ink/80 hover:text-brand-blue">
              {contact.email}
            </a>
          )}
        </div>
      </div>
    </>
  );
}