"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { categoryOrder, photos as allPhotos, type GalleryCategory, type Photo } from "@/content/gallery";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/routes";
import Lightbox, { useLightbox } from "./Lightbox";

type Filter = "all" | GalleryCategory;

export function PhotoButton({
  photo,
  locale,
  onOpen,
  sizes,
  className = "",
  imgClassName = "",
  eager = false,
}: {
  photo: Photo;
  locale: Locale;
  onOpen: (el: HTMLElement) => void;
  sizes: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  const t = getDictionary(locale).galleryPage;
  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      className={`group relative block w-full overflow-hidden rounded-[var(--radius-photo)] bg-sand ${className}`}
    >
      <Image
        src={photo.src}
        alt=""
        fill
        sizes={sizes}
        quality={75}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        className={`object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] ${imgClassName}`}
      />
      <span className="visually-hidden">{t.open(photo.alt[locale])}</span>
    </button>
  );
}

export default function Gallery({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).galleryPage;
  const [filter, setFilter] = useState<Filter>("all");

  const available = categoryOrder.filter((c) => allPhotos.some((p) => p.category === c));
  const shown = useMemo(
    () => (filter === "all" ? allPhotos : allPhotos.filter((p) => p.category === filter)),
    [filter],
  );
  const lb = useLightbox(shown);

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: t.all },
    ...available.map((c) => ({ key: c as Filter, label: t.categories[c] })),
  ];

  return (
    <>
      <div role="group" aria-label={t.filterLabel} className="-mx-1 mb-3 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.key)}
              className={`inline-flex min-h-11 items-center rounded-full border px-4 text-[15px] font-semibold transition-colors ${
                active
                  ? "border-olive bg-olive text-paper"
                  : "border-line bg-paper text-ink hover:border-olive hover:bg-olive-soft"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
      <p className="mb-6 text-[15px] text-ink-soft" aria-live="polite">
        {t.count(shown.length)}
      </p>

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        {shown.map((p, i) => (
          <li key={p.id}>
            <figure>
              <PhotoButton
                photo={p}
                locale={locale}
                onOpen={(el) => lb.open(i, el)}
                sizes="(max-width: 1024px) 50vw, 400px"
                className="aspect-[4/5]"
                eager={i < 2}
              />
              <figcaption className="mt-2 text-sm text-ink-soft">{p.caption[locale]}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <Lightbox locale={locale} photos={shown} index={lb.index} setIndex={lb.setIndex} onClose={lb.close} />
    </>
  );
}

export function PhotoPreview({ locale, ids }: { locale: Locale; ids: string[] }) {
  const list = ids.map((id) => allPhotos.find((p) => p.id === id)).filter((p): p is Photo => Boolean(p));
  const lb = useLightbox(list);
  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6">
        {list.map((p, i) => (
          <li key={p.id}>
            <PhotoButton
              photo={p}
              locale={locale}
              onOpen={(el) => lb.open(i, el)}
              sizes="(max-width: 1024px) 50vw, 380px"
              className="aspect-[4/3]"
            />
          </li>
        ))}
      </ul>
      <Lightbox locale={locale} photos={list} index={lb.index} setIndex={lb.setIndex} onClose={lb.close} />
    </>
  );
}
