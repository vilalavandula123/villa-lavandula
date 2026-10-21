"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/content/gallery";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/routes";
import { ChevronLeft, ChevronRight, Close } from "./Icons";

/**
 * Достъпен преглед на снимки върху нативния <dialog>:
 * фокусът остава в диалога, Escape затваря, стрелките ←/→ сменят снимката,
 * swipe на телефон е допълнение към бутоните; фокусът се връща към отварящия бутон.
 */
export function useLightbox(photos: Photo[]) {
  const [index, setIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const open = useCallback((i: number, opener: HTMLElement) => {
    openerRef.current = opener;
    setIndex(i);
  }, []);
  const close = useCallback(() => {
    setIndex(null);
    const el = openerRef.current;
    if (el) requestAnimationFrame(() => el.focus());
  }, []);
  return { index, setIndex, open, close, photos };
}

export default function Lightbox({
  locale,
  photos,
  index,
  setIndex,
  onClose,
}: {
  locale: Locale;
  photos: Photo[];
  index: number | null;
  setIndex: (i: number) => void;
  onClose: () => void;
}) {
  const t = getDictionary(locale).galleryPage;
  const ref = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const n = photos.length;
  const isOpen = index !== null && n > 0;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (isOpen && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!isOpen && d.open) {
      d.close();
    }
    if (!isOpen) document.documentElement.style.overflow = "";
  }, [isOpen]);

  useEffect(() => () => void (document.documentElement.style.overflow = ""), []);

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      setIndex((index + delta + n) % n);
    },
    [index, n, setIndex],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const photo = isOpen ? photos[index] : null;
  const nextPhoto = isOpen && n > 1 ? photos[(index + 1) % n] : null;
  const prevPhoto = isOpen && n > 2 ? photos[(index - 1 + n) % n] : null;

  return (
    <dialog
      ref={ref}
      aria-label={t.dialogLabel}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-[#1d2620]/95 p-0 text-paper backdrop:bg-[#1d2620]/80 open:flex open:flex-col"
    >
      {photo && (
        <>
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="text-sm font-semibold tabular-nums" aria-live="polite" aria-atomic="true">
              {t.counter(index! + 1, n)}
            </p>
            <button
              type="button"
              onClick={onClose}
              autoFocus
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-paper/40 px-4 font-semibold hover:bg-paper/10 focus-visible:outline-paper"
            >
              <Close /> {t.close}
            </button>
          </div>

          <figure
            className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-2 sm:px-20"
            onPointerDown={(e) => {
              if (e.pointerType !== "mouse") touchX.current = e.clientX;
            }}
            onPointerUp={(e) => {
              if (touchX.current === null) return;
              const dx = e.clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            }}
            style={{ touchAction: "pan-y" }}
          >
            <div className="relative min-h-0 w-full flex-1">
              <Image
                key={photo.id}
                src={photo.src}
                alt={photo.alt[locale]}
                fill
                sizes="(max-width: 640px) 100vw, 90vw"
                quality={80}
                className="fade-in object-contain"
              />
            </div>

            {n > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow hover:bg-paper focus-visible:outline-paper sm:left-5"
                >
                  <ChevronLeft />
                  <span className="visually-hidden">{t.prev}</span>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow hover:bg-paper focus-visible:outline-paper sm:right-5"
                >
                  <ChevronRight />
                  <span className="visually-hidden">{t.next}</span>
                </button>
              </>
            )}
          </figure>

          {/* умерено предварително зареждане на съседните кадри */}
          <div className="visually-hidden" aria-hidden="true">
            {[nextPhoto, prevPhoto].filter(Boolean).map((p) => (
              <div key={p!.id} style={{ position: "relative", width: 10, height: 10 }}>
                <Image src={p!.src} alt="" fill sizes="(max-width: 640px) 100vw, 90vw" quality={80} loading="eager" />
              </div>
            ))}
          </div>
        </>
      )}
    </dialog>
  );
}
