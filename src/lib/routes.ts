export const locales = ["bg", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "bg";

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

export type PageKey = "home" | "house" | "gallery" | "area" | "enquiry" | "contact" | "privacy";

/** Адреси на страниците за всеки език. Ако смените адрес, сменете го само тук. */
export const slugs: Record<Exclude<PageKey, "home">, Record<Locale, string>> = {
  house: { bg: "kashtata", en: "the-house" },
  gallery: { bg: "galeriya", en: "gallery" },
  area: { bg: "rayonat", en: "the-area" },
  enquiry: { bg: "zapitvane", en: "enquiry" },
  contact: { bg: "kontakti", en: "contact" },
  privacy: { bg: "poveritelnost", en: "privacy" },
};

export const pageKeys = Object.keys(slugs) as Exclude<PageKey, "home">[];

export function href(locale: Locale, page: PageKey, hash?: string): string {
  const base = page === "home" ? `/${locale}` : `/${locale}/${slugs[page][locale]}`;
  return hash ? `${base}#${hash}` : base;
}

export function pageFromSlug(locale: Locale, slug: string): Exclude<PageKey, "home"> | null {
  return pageKeys.find((k) => slugs[k][locale] === slug) ?? null;
}

export const otherLocale = (l: Locale): Locale => (l === "bg" ? "en" : "bg");
