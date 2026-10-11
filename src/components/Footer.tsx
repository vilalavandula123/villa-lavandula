import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import type { Dictionary } from "@/content/i18n/bg";
import { href, type Locale } from "@/lib/routes";
import { External, Mail, MapPin, Phone } from "./Icons";

export default function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const year = new Date().getFullYear();
  const pages = ["house", "gallery", "area", "enquiry", "contact", "privacy"] as const;
  return (
    <footer className="border-t border-line bg-paper pb-24 lg:pb-0">
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_1fr] lg:py-20">
        <div className="flex flex-col items-start gap-4">
          <Image src="/brand/logo-badge.png" alt={t.meta.siteName} width={624} height={640} sizes="160px" className="h-auto w-[150px]" />
          <p className="max-w-xs text-[15px] text-ink-soft">{t.footer.tagline}</p>
        </div>

        <div>
          <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-olive">{t.footer.contactTitle}</h2>
          <ul className="space-y-2 text-[15px]">
            <li>
              <a href={site.contact.phoneHref} className="inline-flex min-h-11 items-center gap-2 hover:text-action">
                <Phone className="shrink-0 text-olive" /> {site.contact.phoneDisplay.value}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contact.email.value}`} className="inline-flex min-h-11 items-center gap-2 break-all hover:text-action">
                <Mail className="shrink-0 text-olive" /> {site.contact.email.value}
              </a>
            </li>
            <li className="flex items-start gap-2 py-2.5">
              <MapPin className="mt-0.5 shrink-0 text-olive" />
              <span>
                {site.location.village[locale]} {site.location.postcode}, {site.location.region[locale]}
              </span>
            </li>
          </ul>
        </div>

        <nav aria-label={t.a11y.footerNav}>
          <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-olive">{t.footer.pagesTitle}</h2>
          <ul className="space-y-1 text-[15px]">
            {pages.map((p) => (
              <li key={p}>
                <Link href={href(locale, p)} className="inline-flex min-h-10 items-center hover:text-action hover:underline">
                  {t.nav[p]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-olive">{t.footer.followTitle}</h2>
          <ul className="space-y-1 text-[15px]">
            {[
              { url: site.links.booking, label: t.cta.booking },
              { url: site.links.facebook, label: t.cta.facebook },
            ].map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1.5 hover:text-action hover:underline">
                  {l.label} <External className="text-ink-soft" />
                  <span className="visually-hidden">{t.a11y.opensExternal}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line/70">
        <div className="container-site flex flex-col gap-2 py-5 text-sm text-ink-soft sm:flex-row sm:justify-between">
          <p>© {year} {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
