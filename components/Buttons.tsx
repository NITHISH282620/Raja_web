import Image from "next/image";
import { clsx } from "@/lib/clsx";

/**
 * The 58px black disc with a diagonal arrow, used on the capabilities carousel
 * and the works section. Figma rotates the exported arrow -36°.
 *
 * Renders as a link when a destination exists and as a disabled button when it
 * does not — the design supplies no destinations, and a dead anchor is worse
 * than an honestly inert control.
 */
export function CircleButton({
  href,
  label,
  className,
}: {
  href: string | null;
  label: string;
  className?: string;
}) {
  const inner = (
    <Image
      src="/vector/arrow-right.svg"
      alt=""
      width={22}
      height={11}
      className="-rotate-[36deg] transition-transform duration-300 group-hover:rotate-0"
    />
  );

  const shared = clsx(
    "group grid size-[58px] shrink-0 place-items-center rounded-full bg-ink text-white",
    "transition-colors duration-300 hover:bg-accent",
    !href && "cursor-not-allowed opacity-60 hover:bg-ink",
    className,
  );

  if (!href) {
    return (
      <button type="button" aria-disabled title="Destination not yet defined" className={shared} data-provisional>
        <span className="sr-only">{label} — destination pending</span>
        {inner}
      </button>
    );
  }

  return (
    <a href={href} className={shared}>
      <span className="sr-only">{label}</span>
      {inner}
    </a>
  );
}

/** The small mono pill — "know more →". */
export function Pill({
  href,
  children,
  tone = "dark",
  className,
}: {
  href: string | null;
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  const shared = clsx(
    "t-pill inline-flex items-center justify-center rounded-full px-6 py-[7px] transition-colors duration-300",
    tone === "light" ? "bg-white text-ink hover:bg-accent hover:text-white" : "bg-ink text-white hover:bg-accent",
    !href && "cursor-not-allowed opacity-70",
    className,
  );

  if (!href) {
    return (
      <button type="button" aria-disabled title="Destination not yet defined" className={shared} data-provisional>
        {children}
      </button>
    );
  }
  return (
    <a href={href} className={shared}>
      {children}
    </a>
  );
}
