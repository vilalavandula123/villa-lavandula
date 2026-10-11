// Създава оптимизирани WebP варианти на снимките и логото в public/_img/.
// Пуска се ръчно след добавяне/смяна на снимка:  npm run images
// (Хостингът в Cloudflare не оптимизира снимки сам — затова вариантите са готови файлове.)
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public/_img");
export const WIDTHS = [320, 480, 828, 1200, 1600, 2000];

const sources = [
  { dir: "public/photos", quality: 60 },
  { dir: "public/brand", quality: 88 },
];

await mkdir(OUT, { recursive: true });
let n = 0;
for (const { dir, quality } of sources) {
  const sub = path.basename(dir);
  await mkdir(path.join(OUT, sub), { recursive: true });
  for (const file of await readdir(path.join(ROOT, dir))) {
    if (!/\.(jpe?g|png)$/i.test(file)) continue;
    const src = path.join(ROOT, dir, file);
    const { width } = await sharp(src).metadata();
    const base = file.replace(/\.(jpe?g|png)$/i, "");
    const widths = WIDTHS.filter((w) => w < width).concat(width);
    for (const w of [...new Set(widths)]) {
      const dest = path.join(OUT, sub, `${base}-${w}.webp`);
      try {
        if ((await stat(dest)).mtimeMs > (await stat(src)).mtimeMs) continue;
      } catch {}
      await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality, effort: 5 }).toFile(dest);
      n++;
    }
  }
}
// Списък с наличните ширини за зареждащата функция (src/lib/image-loader.ts)
const variants = {};
for (const { dir } of sources) {
  const sub = path.basename(dir);
  for (const f of await readdir(path.join(OUT, sub))) {
    const m = f.match(/^(.*)-(\d+)\.webp$/);
    if (m) (variants[`/${sub}/${m[1]}`] ??= []).push(Number(m[2]));
  }
}
for (const k of Object.keys(variants)) variants[k].sort((a, b) => a - b);
const { writeFile } = await import("node:fs/promises");
await writeFile(path.join(ROOT, "src/lib/image-variants.json"), JSON.stringify(variants));
console.log(`images: ${n} new variants; ${Object.keys(variants).length} images listed`);
