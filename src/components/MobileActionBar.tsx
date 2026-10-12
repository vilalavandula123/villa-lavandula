"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone } from "./Icons";

/**
 * Долна лента на телефон: „Запитване за дати“ + обаждане.
 * Скрива се, докато е фокусирано поле за въвеждане (екранната клавиатура), за да не закрива формата.
 * На страницата с формата бутонът „Запитване за дати“ не се показва (води към същата форма) — остава само обаждането.
 */
export default function MobileActionBar({
  enquiryHref,
  phoneHref,
  labels,
}: {
  enquiryHref: string;
  phoneHref: string;
  labels: { enquire: string; call: string; region: string };
}) {
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const onEnquiryPage = pathname === enquiryHref.split("#")[0];

  useEffect(() => {
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLElement && el.matches("input, textarea, select, [contenteditable='true']");
    const onIn = (e: FocusEvent) => setHidden(isField(e.target));
    const onOut = () => setHidden(isField(document.activeElement));
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  return (
    <aside
      aria-label={labels.region}
      data-mobile-bar
      className={`fixed inset-x-0 bottom-0 z-20 border-t border-line bg-cream/95 px-4 pt-2.5 backdrop-blur-sm transition-transform duration-200 lg:hidden ${
        hidden ? "translate-y-full" : ""
      }`}
      style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
      aria-hidden={hidden || undefined}
      inert={hidden || undefined}
    >
      <div className="mx-auto flex max-w-md gap-2.5">
        {!onEnquiryPage && (
          <Link href={enquiryHref} className="btn btn-primary !min-h-12 flex-1 whitespace-nowrap !px-3 text-[15px]">
            {labels.enquire}
          </Link>
        )}
        <a
          href={phoneHref}
          className={`btn btn-secondary !min-h-12 whitespace-nowrap !px-3 text-[15px] ${onEnquiryPage ? "flex-1" : ""}`}
        >
          <Phone /> {labels.call}
        </a>
      </div>
    </aside>
  );
}
