"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, growRule, riseCard, entranceTrigger, q } from "@/motion/primitives";
import { DUR, EASE, STAGGER, MOTION_OK } from "@/motion/ease";
import { Statement } from "@/components/Statement";
import { clients, clientsMeta, closingCta, GRID_SLOTS } from "@/content/clients";
import { contact } from "@/content/company";
import { SECTION_IDS } from "@/content/navigation";
import { clsx } from "@/lib/clsx";

/**
 * Figma 7687–8530px. The client logo field with the closing CTA punched into it.
 *
 * Figma repeats three logos across eighteen tiles. The repetition is not
 * reproduced — the three real clients fill the first three slots and the rest
 * render as bare tiles, which keeps the dense field the circular mask reads
 * against without asserting clients that do not exist.
 *
 * The two edge gradients are the vignette that isolates the circle; in the
 * export they wipe open on scaleY, which is preserved here.
 */
export function Clients() {
  const root = useRef<HTMLElement>(null);
  const slots = Array.from({ length: GRID_SLOTS }, (_, i) => clients[i] ?? null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {

        const tl = gsap.timeline({ scrollTrigger: entranceTrigger(scope) });

        growRule(tl, q(scope, "[data-divider]"), { duration: 0.9 }, 0);

        // Edge vignettes wipe open, then the circles scale up, then the tiles.
        const masks = q(scope, "[data-mask]");
        if (masks.length) {
          tl.fromTo(
            masks,
            { scaleY: 0 },
            { scaleY: 1, transformOrigin: "center", duration: 0.9, stagger: 0.1, ease: EASE.primary },
            0.15,
          );
        }
        const rings = q(scope, "[data-ring]");
        if (rings.length) {
          tl.fromTo(
            rings,
            { opacity: 0, scale: 0.55 },
            { opacity: 1, scale: 1, duration: 1.1, stagger: 0.15, ease: EASE.spring },
            0.25,
          );
        }
        riseCard(tl, q(scope, "[data-logo-tile]"), { stagger: STAGGER.clients, distance: 20, scaleFrom: 0.9 }, 0.5);

        fadeUp(tl, q(scope, "[data-cta-eyebrow]"), { distance: 18 }, 1.15);
        fadeUp(tl, q(scope, "[data-cta-statement]"), { duration: DUR.statement }, 1.25);
        riseCard(tl, q(scope, "[data-cta-button]"), { distance: 18, scaleFrom: 0.88 }, 1.5);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={SECTION_IDS.clients} className="relative w-full overflow-hidden bg-ink">
      <div className="frame">
        <span data-divider aria-hidden className="block h-px w-full origin-left bg-white/15" />
      </div>

      <div className="relative py-[clamp(96px,11vw,165px)]">
        {/* ---------- Logo field ---------- */}
        <ul
          aria-label="Clients"
          title={clientsMeta.note}
          className="mx-auto grid w-full max-w-[1140px] grid-cols-3 justify-items-center gap-[16px] px-[clamp(20px,5.55vw,80px)] sm:grid-cols-4 lg:grid-cols-6 lg:gap-[23px] lg:px-0"
        >
          {slots.map((client, i) => (
            <li
              key={client?.id ?? `empty-${i}`}
              data-logo-tile
              data-reveal
              {...(client ? {} : { "data-provisional": true, "aria-hidden": true })}
              className={clsx(
                "grid h-[clamp(72px,7vw,100px)] w-full max-w-[130px] place-items-center rounded-[15px] bg-ink-soft",
                !client && "border border-dashed border-white/10",
              )}
            >
              {client ? (
                <Image
                  src={client.logo.src}
                  alt={client.name}
                  width={client.logo.width}
                  height={client.logo.height}
                  className="h-auto w-auto max-w-[80%] object-contain"
                  style={{ maxHeight: `${(client.box.height / 100) * 80}%` }}
                />
              ) : null}
            </li>
          ))}
        </ul>

        {/* ---------- Edge vignettes ---------- */}
        <div
          data-mask
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[clamp(80px,18vw,257px)]"
          style={{ background: "linear-gradient(to right, #000 0%, rgba(0,0,0,0) 100%)" }}
        />
        <div
          data-mask
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[clamp(80px,18vw,257px)]"
          style={{ background: "linear-gradient(to left, #000 0%, rgba(0,0,0,0) 100%)" }}
        />

        {/* ---------- Concentric rings + CTA ---------- */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="relative grid place-items-center">
            <span
              data-ring
              aria-hidden
              className="absolute size-[clamp(330px,36vw,521px)] rounded-full border border-[#565656] bg-ink"
            />
            <span
              data-ring
              aria-hidden
              className="absolute size-[clamp(309px,33.8vw,488px)] rounded-full bg-ink-soft"
            />

            <div className="pointer-events-auto relative flex w-[min(66vw,432px)] flex-col items-center gap-[clamp(14px,1.6vw,23px)] px-6 text-center">
              <p data-cta-eyebrow data-reveal className="t-eyebrow text-white">
                {closingCta.eyebrow}
              </p>
              <div data-cta-statement data-reveal>
                <Statement segments={closingCta.statement} tone="light" className="t-statement" />
              </div>
              <div data-cta-button data-reveal>
                <ContactButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The Figma file contains no email, phone or contact page. Rather than invent
 * one, the button renders inert and says so — add `contact.email` in
 * content/company.ts and it becomes a real mailto link with no other change.
 */
function ContactButton() {
  const className =
    "inline-flex h-[43px] w-[161px] items-center justify-center rounded-[38px] bg-white text-ink transition-colors duration-300 hover:bg-accent hover:text-white";

  if (contact.email) {
    return (
      <a href={`mailto:${contact.email}`} className={className}>
        <span className="t-body-sm">{closingCta.label}</span>
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-disabled
      data-provisional
      title={contact.note}
      className={clsx(className, "cursor-not-allowed opacity-80")}
    >
      <span className="t-body-sm">{closingCta.label}</span>
    </button>
  );
}
