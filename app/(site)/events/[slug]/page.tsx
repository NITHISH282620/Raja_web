import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { recentExecutions } from "@/content/events";
import { Eyebrow } from "@/components/Eyebrow";

export function generateStaticParams() {
  return recentExecutions.map((exe) => ({
    slug: exe.slug,
  }));
}

export default function EventPage({ params }: { params: { slug: string } }) {
  const event = recentExecutions.find((e) => e.slug === params.slug);

  if (!event) {
    notFound();
  }

  return (
    <main className="relative bg-paper min-h-screen pt-32 pb-24 px-[clamp(20px,5.55vw,80px)]">
      <div className="mx-auto max-w-5xl flex flex-col gap-12">
        {/* Navigation */}
        <div className="flex items-center">
          <Link 
            href="/#recent-events" 
            className="t-eyebrow text-ink/50 hover:text-ink transition-colors flex items-center gap-2 uppercase tracking-widest"
          >
            <span className="text-xl leading-none mb-1">&larr;</span> Back to Events
          </Link>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col gap-6">
          <div data-eyebrow>
            <Eyebrow items={["project", event.year]} tone="dark" />
          </div>
          <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-display font-bold leading-[1] tracking-tight text-ink uppercase">
            {event.project}
          </h1>
        </div>

        {/* Image */}
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-ink/5 mt-4 shadow-sm border border-ink/5">
          <Image
            src={event.image}
            alt={event.project}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Placeholder Content */}
        <div className="grid md:grid-cols-12 gap-8 md:gap-16 mt-8">
          <div className="md:col-span-4">
            <h3 className="text-xl font-serif text-ink mb-4">Event Overview</h3>
            <p className="t-body-sm text-ink/70">
              Raja Enterprises executed the complete infrastructure for this major gathering. 
              The project required rapid deployment and adhered to the highest safety and structural standards.
            </p>
          </div>
          <div className="md:col-span-8 flex flex-col gap-6">
            <p className="t-body text-ink/80 leading-relaxed">
              This is a placeholder description for <strong>{event.project}</strong>. 
              Raja Enterprises was proud to deliver world-class infrastructure for this event in {event.year}.
              Our teams worked closely with the organizers to ensure every detail was perfect, from the ground 
              works and flooring to the massive clear-span hanger structures and bespoke staging.
            </p>
            <p className="t-body text-ink/80 leading-relaxed">
              Leveraging our vast owned inventory, we were able to scale rapidly and meet tight deployment timelines 
              without relying on third-party sub-rentals, providing absolute control over quality and delivery.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
