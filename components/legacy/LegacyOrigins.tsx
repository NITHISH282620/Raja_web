import Image from "next/image";
import { Reveal } from "@/motion/Reveal";
import { copyText, pageImage } from "@/lib/store";

export async function LegacyOrigins() {
  return (
    <section data-origins-section className="relative w-full bg-paper py-20 sm:py-28 md:py-40 overflow-hidden">
      {/* Ghost chapter numeral */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 -left-4 sm:-left-8 select-none leading-none font-mono font-black text-ink/[0.04]"
        style={{ fontSize: "clamp(140px, 22vw, 320px)" }}
      >
        01
      </div>

      <div className="frame relative z-10">
        {/* Chapter eyebrow */}
        <div data-origins-eyebrow className="flex items-center gap-4 mb-10 sm:mb-14">
          <span className="h-px flex-1 max-w-[60px] bg-accent" />
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">
            Chapter 01 · 1977
          </p>
        </div>

        <Reveal as="div" className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Text Column */}
          <div className="space-y-8 lg:pr-6">
            <h2
              data-origins-headline
              className="font-semibold tracking-tight text-ink text-balance"
              style={{ fontSize: "clamp(28px, 4vw, 52px)", lineHeight: 1.1 }}
            >
              The Bengaluru Genesis.{" "}
              <span className="text-brand-blue">Founded on 5th Main Road.</span>
            </h2>

            <p data-origins-body className="text-base sm:text-lg text-body-light leading-relaxed">
              In 1977, Bengaluru was a tranquil garden city of universities, public sector enterprises,
              and burgeoning civic life. Recognizing that major state functions, academic convocations,
              and political gatherings lacked disciplined physical infrastructure contractors, Raja
              Enterprises was founded at <strong className="text-ink">#145, 5th Main Road</strong>.
            </p>

            {/* Pull quote */}
            <blockquote data-origins-quote className="border-l-[3px] border-brand-blue pl-6 py-2 space-y-2">
              <p className="font-serif italic text-xl sm:text-2xl text-ink leading-snug">
                &ldquo;A contractor&rsquo;s word is an inviolable bond. If the stage is promised for
                8:00&nbsp;AM, it is structurally complete by 2:00&nbsp;AM.&rdquo;
              </p>
              <cite className="font-mono text-[10px] uppercase tracking-wider text-ink/40 not-italic block mt-2">
                — Founding Principle, 1977
              </cite>
            </blockquote>

            {/* Metadata strip */}
            <div data-origins-meta className="pt-6 border-t border-ink/10 grid grid-cols-2 gap-6">
              <div>
                <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-ink/40 mb-1">
                  Original Headquarters
                </p>
                <p className="text-sm font-semibold text-ink">#145, 5th Main Road, Bengaluru-18</p>
              </div>
              <div>
                <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-ink/40 mb-1">
                  Early Mandates
                </p>
                <p className="text-sm font-semibold text-ink">Civic Convocations &amp; State Daises</p>
              </div>
              <div>
                <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-ink/40 mb-1">
                  Materials
                </p>
                <p className="text-sm font-semibold text-ink">Timber, Bamboo &amp; Cotton Shamianas</p>
              </div>
              <div>
                <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-ink/40 mb-1">
                  First Principle
                </p>
                <p className="text-sm font-semibold text-ink">Zero Deadline Failures</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full">
            <div data-origins-image className="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-neutral-900 shadow-xl"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src={(await pageImage("legacy-origins"))?.image ?? "/media/legacy/legacy-2.png"}
                alt={(await pageImage("legacy-origins"))?.alt ?? "Raja Enterprises founding era"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tl from-black/70 via-black/10 to-transparent" />

              {/* Caption overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/50 block mb-1">
                  Historical Archive
                </span>
                <p className="text-base sm:text-lg font-medium text-white leading-snug">
                  {await copyText("legacy-origins-0")}
                </p>
                <p className="text-xs text-white/60 mt-1">{await copyText("legacy-origins-1")}</p>
              </div>

              {/* Year badge */}
              <div className="absolute top-6 right-6 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 px-4 py-2">
                <span className="font-mono text-sm font-bold text-white">1977</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
