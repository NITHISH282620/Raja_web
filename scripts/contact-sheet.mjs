/** Contact sheet for a folder of candidates, labelled with its index. */
import sharp from "sharp";
import { readdir, readFile } from "node:fs/promises";
const dir = process.argv[2];
const out = process.argv[3];
const COLS = 5, W = 380, H = 250;
const files = (await readdir(dir)).filter((f) => f.endsWith(".jpg")).sort();
const rows = Math.ceil(files.length / COLS);
const tiles = [];
for (const [i, f] of files.entries()) {
  const buf = await sharp(await readFile(`${dir}/${f}`))
    .resize(W, H, { fit: "cover" })
    .composite([{
      input: Buffer.from(
        `<svg width="${W}" height="${H}"><rect x="0" y="0" width="52" height="34" fill="#000" opacity="0.75"/>` +
        `<text x="10" y="24" font-family="monospace" font-size="20" fill="#ffe600">${String(i).padStart(2,"0")}</text></svg>`),
      top: 0, left: 0,
    }])
    .jpeg({ quality: 78 })
    .toBuffer();
  tiles.push({ input: buf, top: Math.floor(i / COLS) * H, left: (i % COLS) * W });
}
await sharp({ create: { width: COLS * W, height: rows * H, channels: 3, background: "#111" } })
  .composite(tiles).png().toFile(out);
console.log(out, files.length, "tiles");
