"use client";
// Зареждаща функция за next/image: вместо сървърна оптимизация (която Cloudflare не прави безплатно)
// използва предварително създадените WebP варианти от public/_img (виж scripts/build-images.mjs).
import variants from "./image-variants.json";

const table = variants as Record<string, number[]>;

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  const base = src.replace(/\.(jpe?g|png)$/i, "");
  const widths = table[base];
  if (!widths) return src; // напр. SVG или файл без варианти
  const w = widths.find((x) => x >= width) ?? widths[widths.length - 1];
  return `/_img${base}-${w}.webp`;
}
