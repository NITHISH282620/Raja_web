"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, riseCard, release, entranceTrigger, q } from "@/motion/primitives";
import { MOTION_OK } from "@/motion/ease";
import { Placeholder } from "@/components/Placeholder";
import { navItems } from "@/content/navigation";
import Link from "next/link";
import { company, FOUNDED_YEAR, yearsInOperation } from "@/content/company";
import type { ContactSettings } from "@/lib/store";

/**
 * Figma 8530–9224px.
 *
 * The design's entire footer is the word RAJA set at 458px. No address, phone,
 * email, nav, social or legal line exists anywhere in the file — for a
 * contractor selling to government and corporate buyers that is a missing
 * conversion surface, not a stylistic choice.
 *
 * The wordmark is reproduced exactly. Above it sits the structure a real footer
 * needs, with the contact block held open by <Placeholder> until details are
 * supplied. Nothing here is invented.
 */
export function SiteFooter({ contact }: { contact: ContactSettings }) {
  const hasContactDetails = Boolean(
    contact.email || contact.phone || contact.addressLines.length,
  );

  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {

        const tl = gsap.timeline({
          scrollTrigger: entranceTrigger(scope),
          onComplete: () => release(q(scope, "[data-reveal]")),
        });
        riseCard(tl, q(scope, "[data-footer-col]"), { stagger: 0.1, distance: 28, scaleFrom: 0.98 }, 0);
        // The wordmark is the last beat of the whole page — 17.60s in the
        // export. It rises out of its own clip rather than scaling, so the
        // 458px letterforms never soften on the way in.
        tl.fromTo(
          q(scope, "[data-wordmark]"),
          { yPercent: 42, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.5 },
          0.35,
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative w-full overflow-hidden bg-paper pt-[clamp(64px,8vw,110px)]">
      <div className="frame grid gap-10 pb-[clamp(48px,6vw,88px)] sm:grid-cols-2 lg:grid-cols-4">
        <div data-footer-col data-reveal className="flex flex-col gap-3">
          <p className="t-eyebrow text-ink/50">Est. {FOUNDED_YEAR}</p>
          <p className="t-body max-w-[28ch] text-body-light">
            {company.name} — {yearsInOperation()} years building the physical environments where
            India&rsquo;s most important gatherings happen.
          </p>
        </div>

        <nav data-footer-col data-reveal className="flex flex-col gap-3" aria-label="Footer">
          <p className="t-eyebrow text-ink/50">Sections</p>
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="t-body text-body-light transition-colors hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div data-footer-col data-reveal className="flex flex-col gap-3">
          <p className="t-eyebrow text-ink/50">Contact</p>
          {hasContactDetails ? (
            <address className="t-body not-italic text-body-light">
              {contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="block transition-colors hover:text-accent">
                  {contact.phone}
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="block transition-colors hover:text-accent">
                  {contact.email}
                </a>
              )}
            </address>
          ) : (
            <Placeholder label="Contact details pending" note={contact.note} lines={3} />
          )}
        </div>

        <div data-footer-col data-reveal className="flex flex-col gap-3">
          <p className="t-eyebrow text-ink/50">Based in</p>
          <p className="t-body text-body-light">{company.city}, Karnataka, India</p>
        </div>
      </div>

      {/* The wordmark: 458px at 1440, tracked in to -0.1em.
          `pb` on the paragraph and a matching negative margin give the J its
          descender back — the clip that reveals the rise was cropping it — and
          `leading-[0.78]` closes the empty band the 0.99 line-height left
          above the caps. */}
      <div className="relative w-full overflow-hidden">
        <p
          data-wordmark
          data-reveal
          aria-hidden
          className="t-wordmark w-full select-none pb-[0.1em] text-center leading-[0.84] text-ink"
        >
          Raja
        </p>
      </div>

      <div className="frame flex flex-wrap items-center justify-between gap-3 pt-[clamp(28px,3.4vw,44px)] pb-8">
        <p className="t-eyebrow text-ink/40">
          © {new Date().getFullYear()} {company.name}
        </p>
        <p className="t-eyebrow text-ink/40">{company.city}</p>
      </div>
    </footer>
  );
}
