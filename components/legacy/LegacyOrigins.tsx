import Image from "next/image";
import { Reveal } from "@/motion/Reveal";

export function LegacyOrigins() {
  return (
    <section className="relative w-full bg-paper py-16 sm:py-24 md:py-32">
      <div className="frame">
        <Reveal as="div" className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <p className="t-eyebrow text-xs uppercase tracking-[0.2em] text-accent font-medium">
              Chapter 01: 1977
            </p>
            <h2 className="t-statement text-ink text-balance font-semibold">
              The Bengaluru Genesis. <br />
              <span className="text-brand-blue">Founded on 5th Main Road.</span>
            </h2>
            <p className="text-base sm:text-lg text-body-light leading-relaxed">
              In 1977, Bengaluru was a tranquil garden city of universities, public sector enterprises, and burgeoning civic life. Recognizing that major state functions, academic convocations, and political gatherings lacked disciplined physical infrastructure contractors, Raja Enterprises was founded at <strong>#145, 5th Main Road</strong>.
            </p>
            <p className="text-sm sm:text-base text-body-light leading-relaxed">
              Starting with traditional timber poles, bamboo framework lattices, and durable cotton shamianas, Raju and Venkat established a single non-negotiable principle that would define the company for the next half-century: <em>A contractor’s word is an inviolable bond. If the stage is promised for 8:00 AM, it is structurally complete and inspected by 2:00 AM.</em>
            </p>

            <div className="pt-4 border-t border-ink/10 grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-ink/50">Original Headquarters</p>
                <p className="text-sm font-semibold text-ink mt-1">#145, 5th Main Road, Bengaluru-18</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-ink/50">Early Mandates</p>
                <p className="text-sm font-semibold text-ink mt-1">Civic Convocations &amp; State Daises</p>
              </div>
            </div>
          </div>

          {/* Right Image Card */}
          <div className="lg:col-span-6">
            <div className="group relative h-[360px] sm:h-[460px] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-ink/10 bg-neutral-900 shadow-md">
              <Image
                src="/media/events/kanha-campus-aerial.fbf4b561.webp"
                alt="Foundational event infrastructure and civic gatherings in Karnataka"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="font-mono text-[11px] uppercase tracking-wider text-white/70 block mb-1">
                  Historical Archive
                </span>
                <p className="text-base sm:text-lg font-medium">
                  Building the Physical Ground for Karnataka&rsquo;s Early Civic Life
                </p>
                <p className="text-xs text-white/70 mt-1">
                  Establishing the operational standards that earned the trust of state departments and public institutions.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
