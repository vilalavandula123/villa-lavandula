import type { Metadata } from "next";
import { href, otherLocale, type Locale, type PageKey } from "./routes";

export function pageMetadata(locale: Locale, page: PageKey, title: string, description: string, absoluteTitle = false): Metadata {
  const url = href(locale, page);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        [locale]: url,
        [otherLocale(locale)]: href(otherLocale(locale), page),
        "x-default": href("bg", page),
      },
    },
    openGraph: { title, description, url },
  };
}
