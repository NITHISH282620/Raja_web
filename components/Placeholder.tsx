import { clsx } from "@/lib/clsx";

/**
 * Stands in for content the Figma file does not supply.
 *
 * Deliberately visible rather than silent. The design is semi-approved, so a
 * missing case study summary or client logo must read as missing — both to
 * whoever reviews the build and to anyone who later greps the codebase. It
 * holds the exact space the real content will occupy so the composition and
 * the scroll geometry stay correct.
 */
export function Placeholder({
  label = "Copy pending",
  note,
  lines = 3,
  tone = "dark",
  className,
}: {
  label?: string;
  note?: string;
  lines?: number;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      data-provisional
      title={note}
      aria-label={`${label}. Content not yet supplied.`}
      className={clsx(
        "flex flex-col gap-[9px] rounded-[6px] border border-dashed px-3 py-3",
        tone === "light" ? "border-white/25" : "border-ink/20",
        className,
      )}
    >
      <span
        className={clsx(
          "t-eyebrow text-[10px] tracking-[0.18em]",
          tone === "light" ? "text-white/45" : "text-ink/40",
        )}
      >
        {label}
      </span>
      <span className="flex flex-col gap-[7px]" aria-hidden>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className={clsx("block h-[7px] rounded-full", tone === "light" ? "bg-white/12" : "bg-ink/10")}
            style={{ width: i === lines - 1 ? "58%" : "100%" }}
          />
        ))}
      </span>
    </div>
  );
}

/**
 * Image slot for a card whose photograph was never supplied. Keeps the tile's
 * aspect ratio so the bento and the works stack do not reflow when the real
 * image arrives.
 */
export function PlaceholderImage({
  className,
  tone = "dark",
  note,
}: {
  className?: string;
  tone?: "dark" | "light";
  note?: string;
}) {
  return (
    <div
      data-provisional
      title={note}
      role="img"
      aria-label="Photograph not yet supplied"
      className={clsx(
        "flex items-center justify-center rounded-[20px] border border-dashed",
        tone === "light" ? "border-white/20 bg-white/5" : "border-ink/15 bg-ink/[0.04]",
        className,
      )}
    >
      <span className={clsx("t-eyebrow text-[10px]", tone === "light" ? "text-white/40" : "text-ink/35")}>
        Photography pending
      </span>
    </div>
  );
}
