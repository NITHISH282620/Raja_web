import { recentExecutions } from "@/content/events";
import { Eyebrow } from "@/components/Eyebrow";

export function RecentExecutions() {
  return (
    <section className="bg-paper py-[clamp(80px,12vw,160px)] px-[clamp(20px,5.55vw,80px)]">
      <div className="mx-auto max-w-[1200px] flex flex-col gap-12">
        <div data-eyebrow>
          <Eyebrow items={["recent", "executions"]} tone="dark" />
        </div>
        <div className="flex flex-col gap-4 border-t border-ink/10 pt-8">
          {recentExecutions.map((exe, i) => (
            <div key={i} className="flex justify-between items-center py-4 border-b border-ink/5 group hover:border-ink/20 transition-colors">
              <span className="t-body text-ink font-medium">{exe.project}</span>
              <span className="t-body-sm text-ink/40 tabular-nums">{exe.year}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
