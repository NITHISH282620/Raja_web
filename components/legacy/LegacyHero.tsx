"use client";

import Image from "next/image";
import { FOUNDED_YEAR, yearsInOperation } from "@/content/company";

export function LegacyHero() {
  return (
    <section data-hero-section className="relative w-full min-h-screen bg-paper flex flex-col items-center pt-32 sm:pt-44 pb-20 overflow-hidden">
      
      {/* Background ghost numeral - centered softly behind text */}
      <div
        aria-hidden
        data-hero-ghost
        className="pointer-events-none absolute top-32 left-0 right-0 flex justify-center overflow-hidden"
      >
        <span
          className="font-mono font-black text-ink/[0.025] leading-none"
          style={{ fontSize: "clamp(200px, 35vw, 500px)" }}
        >
          {yearsInOperation()}
        </span>
      </div>

      {/* Centered Typography */}
      <div className="flex flex-col items-center text-center max-w-4xl px-6 mb-16 sm:mb-20 relative z-10">
        <div data-hero-eyebrow className="flex items-center justify-center gap-4 mb-8">
          <span className="w-8 sm:w-16 h-[2px] bg-brand-blue/30" />
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-brand-blue font-semibold">
            Est. {FOUNDED_YEAR} &mdash; {new Date().getFullYear()}
          </span>
          <span className="w-8 sm:w-16 h-[2px] bg-brand-blue/30" />
        </div>

        <h1 data-hero-headline className="text-5xl sm:text-7xl lg:text-[7rem] font-medium tracking-tight text-ink leading-[1.02] mb-8 text-balance">
          The 49-Year <br />
          <span className="text-brand-blue italic font-serif pr-4">Chronicle.</span>
        </h1>

        <p data-hero-lead className="text-base sm:text-lg text-body-light leading-relaxed max-w-2xl text-balance">
          From humble timber pandals to aerospace-grade German hangars. Four decades of pioneering the temporary cities where India gathers.
        </p>
      </div>

      {/* Bento Grid Gallery */}
      <div className="w-full max-w-[90rem] px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 relative z-10">
        
        {/* Left tall image */}
        <div data-hero-grid-item className="md:col-span-5 lg:col-span-4 aspect-[4/5] md:aspect-auto md:h-[600px] lg:h-[640px] rounded-[2rem] overflow-hidden relative shadow-lg bg-neutral-100">
          <Image
            src="/media/projects/aicog-2019-hanger-erection.webp"
            alt="Historical infrastructure construction"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-1000 hover:scale-[1.03]"
          />
        </div>
        
        {/* Right side: Top wide + Bottom split */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-4 sm:gap-6">
          
          {/* Top wide image */}
          <div data-hero-grid-item className="h-[280px] sm:h-[340px] lg:h-[380px] rounded-[2rem] overflow-hidden relative shadow-lg bg-neutral-100">
            <Image
              src="/media/projects/aicog-2019-hanger-complex-aerial.webp"
              alt="Scale of massive hangar operations"
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover transition-transform duration-1000 hover:scale-[1.03]"
            />
          </div>
          
          {/* Bottom split: Stat card + Square image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 h-auto sm:h-[240px] lg:h-[236px]">
            
            <div data-hero-grid-item className="rounded-[2rem] overflow-hidden relative bg-white border border-ink/5 flex flex-col items-center justify-center p-8 text-center shadow-lg group hover:border-brand-blue/20 transition-colors">
              <span className="font-mono text-6xl lg:text-7xl font-bold text-ink mb-3 group-hover:text-brand-blue transition-colors duration-500 tracking-tighter">
                {yearsInOperation()}
              </span>
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-ink/50 leading-relaxed">
                Years of Unbroken <br/> Execution Record
              </span>
            </div>
            
            <div data-hero-grid-item className="aspect-square sm:aspect-auto sm:h-full rounded-[2rem] overflow-hidden relative shadow-lg bg-neutral-100">
              <Image
                src="/media/projects/aicog-2019-tent-city-dawn.webp"
                alt="Modern infrastructure deployment"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-1000 hover:scale-[1.03]"
              />
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
