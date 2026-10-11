import bg, { type Dictionary } from "@/content/i18n/bg";
import en from "@/content/i18n/en";
import type { Locale } from "./routes";

const dictionaries: Record<Locale, Dictionary> = { bg, en };
export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

export function formatDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
