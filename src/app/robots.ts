import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Докато SITE_INDEXABLE не е true, търсачките не индексират тестовата версия.
export default function robots(): MetadataRoute.Robots {
  if (!site.indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: new URL("/sitemap.xml", site.siteUrl).toString() };
}
