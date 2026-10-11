import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { href, locales, pageKeys, type PageKey } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: PageKey[] = ["home", ...pageKeys];
  return pages.flatMap((p) =>
    locales.map((l) => ({
      url: new URL(href(l, p), site.siteUrl).toString(),
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, new URL(href(x, p), site.siteUrl).toString()])) },
    })),
  );
}
