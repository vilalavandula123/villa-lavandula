"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { href, otherLocale, pageFromSlug, type Locale, type PageKey } from "@/lib/routes";
import { ArrowRight, Close, Menu } from "./Icons";

type Labels = {
  nav: { house: string; gallery: string; area: string; contact: string; enquiry: string; home: string };
  a11y: { mainNav: string; langSwitch: string; openMenu: string; closeMenu: string; homeLink: string };
  cta: { enquire: string };
  langNames: { bg: string; en: string };
};

const navKeys = ["house", "gallery", "area", "contact"] as const;

export function useCurrentPage(locale: Locale): PageKey | null {
  const pathname = usePathname() ?? "";
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length <= 1) return "home";
  return pageFromSlug(locale, parts[1]);
}

function LanguageSwitch({ locale, labels, className = "" }: { locale: Locale; labels: Labels; className?: string }) {
  const current = useCurrentPage(locale);
  const target = otherLocale(locale);
  return (
    <ul className={`flex items-center gap-1 ${className}`} aria-label={labels.a11y.langSwitch}>
      {(["bg", "en"] as const).map((l) => (
        <li key={l} className="flex items-center">
          {l === "en" && <span aria-hidden="true" className="px-1 text-ink-soft">/</span>}
          {l === locale ? (
            <span
              className="inline-flex min-h-11 min-w-10 items-center justify-center font-semibold text-ink underline decoration-lavender decoration-2 underline-offset-[6px]"
              aria-current="true"
            >
              <abbr title={labels.langNames[l]} className="no-underline">{l.toUpperCase()}</abbr>
            </span>
          ) : (
            <Link
              href={href(target, current ?? "home")}
              hrefLang={l}
              lang={l}
              className="inline-flex min-h-11 min-w-10 items-center justify-center text-ink-soft hover:text-ink"
            >
              <span className="visually-hidden">{labels.langNames[l]}</span>
              <span aria-hidden="true">{l.toUpperCase()}</span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Header({ locale, labels }: { locale: Locale; labels: Labels }) {
  const current = useCurrentPage(locale);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Затваряне при смяна на страницата
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const linkCls = (active: boolean) =>
    `relative inline-flex min-h-11 items-center px-1 text-[15px] font-semibold transition-colors ${
      active ? "text-ink after:absolute after:inset-x-1 after:bottom-1.5 after:h-0.5 after:bg-lavender" : "text-ink-soft hover:text-ink"
    }`;

  return (
    <header className="relative z-30 bg-cream">
      <div className="container-site flex min-h-[72px] flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 lg:min-h-[96px]">
        <Link href={href(locale, "home")} className="shrink-0" aria-label={labels.a11y.homeLink}>
          <Image
            src="/brand/logo-header.png"
            alt=""
            width={1370}
            height={229}
            loading="eager"
            sizes="280px"
            className="hidden h-auto w-[220px] lg:block xl:w-[270px]"
          />
          <Image
            src="/brand/logo-wordmark.png"
            alt=""
            width={953}
            height={202}
            priority
            sizes="170px"
            className="block h-auto w-[138px] min-[400px]:w-[160px] sm:w-[175px] lg:hidden"
          />
        </Link>

        <nav aria-label={labels.a11y.mainNav} className="hidden lg:block">
          <ul className="flex flex-wrap items-center gap-x-4 xl:gap-x-8">
            {navKeys.map((k) => (
              <li key={k}>
                <Link href={href(locale, k)} className={linkCls(current === k)} aria-current={current === k ? "page" : undefined}>
                  {labels.nav[k]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitch locale={locale} labels={labels} className="border-l border-line pl-4" />
          <Link
            href={href(locale, "enquiry", "zapitvane-forma")}
            className="btn btn-primary !min-h-[46px] whitespace-nowrap !px-5 text-[15px]"
            aria-current={current === "enquiry" ? "page" : undefined}
          >
            {labels.cta.enquire}
          </Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitch locale={locale} labels={labels} />
          <button
            ref={buttonRef}
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 font-semibold text-ink hover:bg-sand"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Close /> : <Menu />}
            <span className="visually-hidden">{open ? labels.a11y.closeMenu : labels.a11y.openMenu}</span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-t border-line bg-cream shadow-[0_12px_24px_-12px_rgb(40_58_48/0.25)] lg:hidden"
      >
        <nav aria-label={labels.a11y.mainNav} className="container-site py-4">
          <ul className="flex flex-col">
            {(["home", ...navKeys, "enquiry"] as const).map((k) => (
              <li key={k} className="border-b border-line/60 last:border-0">
                <Link
                  href={href(locale, k)}
                  className={`flex min-h-12 items-center text-lg ${current === k ? "font-semibold text-ink" : "text-ink-soft"}`}
                  aria-current={current === k ? "page" : undefined}
                >
                  {labels.nav[k]}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={href(locale, "enquiry", "zapitvane-forma")} className="btn btn-primary mt-4 w-full">
            {labels.cta.enquire} <ArrowRight />
          </Link>
        </nav>
      </div>
    </header>
  );
}
