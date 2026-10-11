import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import HomeView from "@/views/HomeView";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return pageMetadata(lang, "home", t.home.title, t.meta.defaultDescription, true);
}

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <HomeView locale={lang} />;
}
