import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MobileActionBar from "@/components/MobileActionBar";
import { site } from "@/content/site";
import { getDictionary } from "@/lib/i18n";
import { href, isLocale, locales } from "@/lib/routes";

// true: началните страници /bg и /en могат да се генерират и при заявка, ако кешът не ги намери (OpenNext на Cloudflare).
// Невалиден език пак дава 404 чрез isLocale() + notFound().
export const dynamicParams = true;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#F4EFE6",
  colorScheme: "light",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(site.siteUrl),
    title: { default: t.meta.siteName, template: `%s · ${t.meta.siteName}` },
    description: t.meta.defaultDescription,
    robots: site.indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      siteName: t.meta.siteName,
      locale: lang === "bg" ? "bg_BG" : "en_GB",
      type: "website",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: t.meta.siteName }],
    },
    formatDetection: { telephone: false },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const fontFiles =
    lang === "bg"
      ? ["manrope-cyrillic-400-normal.woff2", "noto-serif-cyrillic-400-normal.woff2"]
      : ["manrope-latin-400-normal.woff2", "noto-serif-latin-400-normal.woff2"];

  return (
    <html lang={lang}>
      <head>
        {fontFiles.map((f) => (
          <link key={f} rel="preload" href={`/fonts/${f}`} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="visually-hidden focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:!m-0 focus:!h-auto focus:!w-auto focus:!overflow-visible focus:!whitespace-normal focus:![clip:auto] focus:rounded-lg focus:bg-paper focus:px-4 focus:py-3 focus:font-semibold focus:shadow-lg"
        >
          {t.a11y.skip}
        </a>
        <Header
          locale={lang}
          labels={{ nav: t.nav, a11y: t.a11y, cta: t.cta, langNames: t.langNames }}
        />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer locale={lang} t={t} />
        <MobileActionBar
          enquiryHref={href(lang, "enquiry", "zapitvane-forma")}
          phoneHref={site.contact.phoneHref}
          labels={{ enquire: t.cta.enquire, call: t.cta.call, region: t.a11y.quickActions }}
        />
      </body>
    </html>
  );
}
