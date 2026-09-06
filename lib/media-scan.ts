import "server-only";
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { db } from "./db";

/**
 * Registers the images already on disk into the media library.
 *
 * WHY THIS EXISTS. The admin's image picker offers whatever the `media` table
 * holds. That table was empty, while 107 photographs sat in `public/media`
 * being rendered by the public site — so every image field showed a "Choose
 * image" button over an empty grid, and the owner could not replace a single
 * picture. The images were there; nothing had ever told the library about them.
 *
 * Runs once, when the table is empty, and is a no-op afterwards. An upload adds
 * a row directly, so this is a backfill rather than a sync: a file deleted from
 * disk later is a broken row to fix in the library, not something to silently
 * remove behind the owner's back.
 */

const ROOT = join(process.cwd(), "public");
const MEDIA_DIR = join(ROOT, "media");

/**
 * Dimensions straight from the file header.
 *
 * next/image needs real width and height — guessing them produces the wrong
 * aspect ratio and a visible layout shift. Only the three formats actually
 * present here are parsed; anything else is skipped rather than guessed at.
 */
function dimensions(file: string): { width: number; height: number } | null {
  let buf: Buffer;
  try {
    buf = readFileSync(file);
  } catch {
    return null;
  }

  // PNG: IHDR width/height are big-endian at a fixed offset.
  if (buf.length > 24 && buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // WebP: three sub-formats, each storing the size differently.
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const kind = buf.toString("ascii", 12, 16);
    if (kind === "VP8X") {
      return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
    }
    if (kind === "VP8L") {
      const bits = buf.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (kind === "VP8 ") {
      return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
  }

  // JPEG: walk the segment markers to the frame header.
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1]!;
      // SOF0..SOF15, excluding the non-frame markers in that range.
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[] = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(webp|png|jpe?g|svg)$/i.test(entry)) out.push(full);
  }
  return out;
}

/**
 * A readable starting alt text, derived from the filename.
 *
 * Deliberately NOT presented as a real description: it is a label so the owner
 * can find the file in a grid, and every one of them needs replacing with a
 * sentence saying what is actually in the picture. Inventing a description of a
 * photograph nobody has looked at would be worse than leaving it obviously
 * provisional.
 */
function labelFrom(file: string): string {
  return file
    .split("/")
    .pop()!
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/\.[0-9a-f]{8}$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

/**
 * Files that are demonstrably NOT Raja's work.
 *
 * Established by opening them: `capability-structure` is PONCHO 2025, an
 * Argentine craft fair, and `capability-exhibition` is the Baku Cinema Breeze
 * Festival at the Heydar Aliyev Center. Both were sitting in the folder under
 * names that read like Raja capabilities.
 *
 * Registering the library made them selectable, so they are registered as
 * `representative` instead of `raja-original`. That is not cosmetic:
 * `projectEvidence()` in content/media.ts refuses anything outside
 * raja-original, client-approved and figma-supplied, so a stand-in can
 * illustrate a capability but can never become proof that Raja built something.
 */
const NOT_RAJA = [
  "capability-structure",
  "capability-exhibition",
  // Both opened and checked. inventory-german-hanger is an outdoor stage show
  // with no structure in frame; inventory-stage is an empty hotel conference
  // room. Each was captioned on /inventory as the equipment it is not.
  "inventory-german-hanger",
  "inventory-stage",
];

/**
 * Anything under this folder is sourced, not Raja's.
 *
 * `public/media/representative/` says so in its name, and it holds nine files —
 * service and category illustrations, the barricade and fleet pictures. The
 * first version of this backfill registered every file as `raja-original`,
 * which would have let a sourced photograph be picked as proof of a Raja
 * project. The folder is the statement of provenance; this honours it.
 */
const REPRESENTATIVE_DIR = "/media/representative/";

export function backfillMediaLibrary(): number {
  const existing = (db().prepare(`SELECT COUNT(*) AS n FROM media`).get() as { n: number }).n;
  if (existing > 0) return 0;

  const files = walk(MEDIA_DIR);
  const insert = db().prepare(
    `INSERT INTO media (id, src, alt, width, height, kind, clearance)
     VALUES (?, ?, ?, ?, ?, 'image', ?)`,
  );

  let added = 0;
  for (const file of files) {
    const src = "/" + relative(ROOT, file).split("\\").join("/");
    const isSvg = /\.svg$/i.test(file);
    const dim = isSvg ? { width: 200, height: 60 } : dimensions(file);
    if (!dim) continue;
    try {
      const clearance =
        src.startsWith(REPRESENTATIVE_DIR) || NOT_RAJA.some((n) => src.includes(n))
          ? "representative"
          : "raja-original";
      insert.run(src, src, labelFrom(file), dim.width, dim.height, clearance);
      added += 1;
    } catch {
      /* already present */
    }
  }
  return added;
}
