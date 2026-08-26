import Image from "next/image";
import { Placeholder } from "@/components/Placeholder";
import type { InventoryTile as Tile } from "@/content/inventory";
import { clsx } from "@/lib/clsx";

const TINT: Record<Tile["tint"], string> = {
  blue: "bg-tint-blue",
  yellow: "bg-tint-yellow",
  green: "bg-tint-green",
  pink: "bg-tint-pink",
  purple: "bg-tint-purple",
  neutral: "bg-tint-neutral",
};

/**
 * One tile of the "What we deploy" bento.
 *
 * Five internal arrangements exist in the design and each is read off the tile
 * geometry rather than guessed — the 763-wide flooring tile puts its render on
 * the left, the 878-wide audience tile puts its copy on the left, the catering
 * tile alone runs its copy over the photograph.
 */
export function InventoryTile({ tile }: { tile: Tile }) {
  const overlay = tile.layout === "overlay";
  const tone = overlay ? "light" : "dark";

  const copy = (
    <div
      data-tile-copy
      className={clsx(
        "flex flex-col gap-[12px]",
        overlay ? "relative z-10" : undefined,
        tile.layout === "image-left" || tile.layout === "text-left" ? "max-w-[345px]" : "max-w-[420px]",
      )}
    >
      <p className={clsx("t-eyebrow flex items-center gap-[9px]", overlay ? "text-white" : "text-ink")}>
        <span>{tile.eyebrow}</span>
        <span aria-hidden className="h-px w-[22.5px] bg-current opacity-70" />
        <span>{tile.index}</span>
      </p>
      <h3 className={clsx("t-tile text-balance", overlay ? "text-white" : "text-ink")}>{tile.title}</h3>
      {tile.body ? (
        <p className={clsx("t-body-sm", overlay ? "text-white/75" : "text-body-card")}>{tile.body}</p>
      ) : (
        <Placeholder label="Description pending" note={tile.note} lines={2} tone={tone} />
      )}
    </div>
  );

  const media = tile.image ? (
    <div
      data-tile-image
      className={clsx(
        "relative",
        overlay ? "absolute inset-0" : undefined,
        tile.layout === "text-top" && "mt-auto aspect-[4/3] w-full lg:aspect-auto lg:h-[67%]",
        tile.layout === "image-top" && "aspect-[4/3] w-full shrink-0 lg:aspect-auto lg:h-[52%]",
        tile.layout === "image-left" && "aspect-square w-full shrink-0 lg:aspect-auto lg:h-full lg:w-[410px]",
        tile.layout === "text-left" && "aspect-[16/10] w-full shrink-0 lg:aspect-auto lg:h-full lg:w-[512px]",
      )}
    >
      <Image
        src={tile.image.src}
        alt={tile.image.alt}
        fill
        sizes="(max-width: 1023px) 100vw, 500px"
        className={clsx(
          tile.fit === "contain-bottom" ? "object-contain object-bottom" : "object-cover",
        )}
      />
      {tile.fit === "cover-scrim" && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)" }}
        />
      )}
    </div>
  ) : null;

  return (
    <article
      className={clsx(
        "relative flex h-full min-h-[280px] w-full overflow-hidden rounded-[20px]",
        TINT[tile.tint],
        tile.layout === "image-left" && "flex-col lg:flex-row lg:items-center",
        tile.layout === "text-left" && "flex-col-reverse lg:flex-row lg:items-center",
        (tile.layout === "text-top" || tile.layout === "image-top" || overlay) && "flex-col",
      )}
    >
      {tile.layout === "image-top" || tile.layout === "image-left" ? (
        <>
          {media}
          <div className="p-[clamp(20px,2.4vw,34px)]">{copy}</div>
        </>
      ) : overlay ? (
        <>
          {media}
          <div className="mt-auto p-[clamp(20px,2.1vw,30px)]">{copy}</div>
        </>
      ) : (
        <>
          <div className="p-[clamp(20px,2.4vw,34px)] pb-[clamp(12px,1.4vw,20px)]">{copy}</div>
          {media}
        </>
      )}
    </article>
  );
}
