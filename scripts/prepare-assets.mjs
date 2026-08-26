/**
 * Converts the raw Figma exports in _figma_assets/ into optimised, semantically
 * named files under public/media (rasters) and public/vector (SVG).
 *
 * Rasters are resized to ~2x their largest on-screen box and written as WebP.
 * next/image handles AVIF/WebP negotiation and per-breakpoint resizing from there.
 *
 * Run: node scripts/prepare-assets.mjs
 */
import sharp from "sharp";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";

const SRC = "_figma_assets";
const MEDIA = "public/media";
const VECTOR = "public/vector";

/** [source constant, output name, max width (null = keep native)] */
const RASTERS = [
  ["imgDsc026941200X8001", "hero-crowd", null],
  ["imgRajaLogo0211", "brand-raja-logo", 400],

  ["imgTnieImport2023128OriginalUttarakhandGlobalInvestor1", "legacy-uttarakhand-gis", 700],
  ["img230324420251912511Cmauthoritymeeting1120X6301", "legacy-cm-authority-meeting", 700],
  ["imgAicog2019031120X8401", "legacy-aicog-2019", 700],
  ["imgSnapInstaTo3548284361405974157053466282408507372448101N1", "legacy-dsmax-anniversary", 700],
  ["imgAmbedkarJayanti1", "legacy-ambedkar-jayanti", 700],
  ["imgWhatsAppImage20250521At21159Pm21", "legacy-felicitation", 700],

  ["imgHangerInterior20251", "capability-hanger-interior", 1900],
  ["imgPmDedication1", "work-pm-dedication", null],
  ["imgHeroVidhanaSoudha1", "process-vidhana-soudha", 900],

  ["imgGermanHanger3D1", "inventory-german-hanger", null],
  ["imgWoodenFloor3DNew1", "inventory-wooden-floor", null],
  ["imgOctonormStalls3DNew1", "inventory-octonorm-stalls", null],
  ["imgLighting3DWide1", "inventory-lighting", null],
  ["imgStage3DWide1", "inventory-stage", null],
  ["imgCateringService1", "inventory-catering", null],

  ["imgTheKarnatakaGovernmentKannadaSeeklogo1300X3001", "client-karnataka-govt", null],
  ["imgCdLearnLogo1300X1701", "client-collegedunia-learn", null],
  ["imgGovernmentOfIndiaLogo1", "client-government-of-india", null],
];

/** Only vectors we cannot faithfully rebuild in CSS: the four decorative arcs
 *  and the button arrow. Every hairline rule and plain circle in the export is
 *  a CSS element instead — cheaper to animate and it inherits theme colour. */
const VECTORS = [
  ["imgEllipse1", "arc-1"],
  ["imgEllipse2", "arc-2"],
  ["imgEllipse3", "arc-3"],
  ["imgEllipse4", "arc-4"],
  ["imgArrow3", "arrow-right"],
];

await rm(MEDIA, { recursive: true, force: true });
await rm(VECTOR, { recursive: true, force: true });
await mkdir(MEDIA, { recursive: true });
await mkdir(VECTOR, { recursive: true });

const manifest = [];

for (const [src, name, maxWidth] of RASTERS) {
  const input = path.join(SRC, `${src}.png`);
  let pipeline = sharp(input);
  const meta = await pipeline.metadata();

  if (maxWidth && meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  const out = path.join(MEDIA, `${name}.webp`);
  const info = await pipeline.webp({ quality: 82, effort: 5 }).toFile(out);
  manifest.push({ name, width: info.width, height: info.height, bytes: info.size });
  console.log(
    `${name.padEnd(32)} ${meta.width}x${meta.height} -> ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}kb`,
  );
}

for (const [src, name] of VECTORS) {
  const svg = await readFile(path.join(SRC, `${src}.svg`), "utf8");
  // Figma stamps a layer id on every path; strip it so the markup stays clean.
  await writeFile(path.join(VECTOR, `${name}.svg`), svg.replace(/\s*id="[^"]*"/g, ""));
  console.log(`${name.padEnd(32)} svg`);
}

const total = manifest.reduce((sum, m) => sum + m.bytes, 0);
console.log(`\n${manifest.length} rasters, ${VECTORS.length} vectors, ${(total / 1024 / 1024).toFixed(2)}MB total`);
