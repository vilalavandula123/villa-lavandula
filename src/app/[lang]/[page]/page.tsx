import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale, locales, pageFromSlug, pageKeys, slugs } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import AreaView from "@/views/AreaView";
import ContactView from "@/views/ContactView";
import EnquiryView from "@/views/EnquiryView";
import GalleryView from "@/views/GalleryView";
import HouseView from "@/views/HouseView";
import PrivacyView from "@/views/PrivacyView";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((lang) => pageKeys.map((k) => ({ lang, page: slugs[k][lang] })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[page]">): Promise<Metadata> {
  const { lang, page } = await params;
  if (!isLocale(lang)) return {};
  const key = pageFromSlug(lang, page);
  if (!key) return {};
  const t = getDictionary(lang);
  const map = {
    house: t.housePage,
    gallery: t.galleryPage,
    area: t.areaPage,
    enquiry: t.enquiryPage,
    contact: t.contactPage,
    privacy: t.privacyPage,
  } as const;
  return pageMetadata(lang, key, map[key].title, map[key].metaDescription);
}

export default async function Page({ params }: PageProps<"/[lang]/[page]">) {
  const { lang, page } = await params;
  if (!isLocale(lang)) notFound();
  const key = pageFromSlug(lang, page);
  switch (key) {
    case "house":
      return <HouseView locale={lang} />;
    case "gallery":
      return <GalleryView locale={lang} />;
    case "area":
      return <AreaView locale={lang} />;
    case "enquiry":
      return <EnquiryView locale={lang} />;
    case "contact":
      return <ContactView locale={lang} />;
    case "privacy":
      return <PrivacyView locale={lang} />;
    default:
      notFound();
  }
}
