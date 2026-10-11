/**
 * Централни данни за Вила Лавандула.
 *
 * ВАЖНО: всяка стойност има статус.
 *  - "extracted"  — взета от публичните Booking/Facebook страници на 11.10.2026; не е потвърдена от собственика.
 *  - "confirmed"  — потвърдена от собственика (сменете статуса само след изрично потвърждение).
 * Пълният списък за потвърждение е в docs/PRE_PUBLICATION_CHECKLIST.md.
 *
 * НЕ използвайте данните от примерната визитка в брандовото табло
 * (+359 888 123 456, Балчик, info@villalavandula.bg, www.villalavandula.bg) — те са измислени.
 * Истинският домейн е villa-lavandula.com.
 */

export type FactStatus = "extracted" | "confirmed";
type Fact<T> = { value: T; status: FactStatus; source: string };

export const site = {
  name: { bg: "Вила Лавандула", en: "Villa Lavandula" },

  contact: {
    phoneDisplay: { value: "+359 889 060 909", status: "extracted", source: "Facebook, Booking" } as Fact<string>,
    phoneHref: "tel:+359889060909",
    email: { value: "b.r.mihaylov@gmail.com", status: "extracted", source: "Facebook" } as Fact<string>,
    hostLanguages: {
      value: { bg: "български, английски, френски, руски", en: "Bulgarian, English, French, Russian" },
      status: "extracted",
      source: "Booking",
    } as Fact<{ bg: string; en: string }>,
  },

  location: {
    village: { bg: "с. Малко Тръново", en: "Malko Tranovo village" },
    postcode: "6228",
    region: { bg: "област Стара Загора", en: "Stara Zagora Province" },
    country: { bg: "България", en: "Bulgaria" },
    /** Точен адрес и координати НЕ са потвърдени. Докато липсват, картата отваря селото, не къщата. */
    streetAddress: null as string | null,
    coordinates: null as { lat: number; lng: number } | null,
  },

  links: {
    booking: "https://www.booking.com/hotel/bg/vila-lavandula.bg.html",
    facebook: "https://www.facebook.com/profile.php?id=100057594543383",
  },

  facts: {
    wholeHouse: { value: true, status: "extracted", source: "Booking" } as Fact<boolean>,
    maxAdults: { value: 8, status: "extracted", source: "Booking" } as Fact<number>,
    bedrooms: { value: 3, status: "extracted", source: "Booking" } as Fact<number>,
    areaM2: { value: 140, status: "extracted", source: "Booking" } as Fact<number>,
    beds: {
      value: { bg: "3 двойни легла и 1 разтегателен диван", en: "3 double beds and 1 sofa bed" },
      status: "extracted",
      source: "Booking",
    } as Fact<{ bg: string; en: string }>,
  },

  /** Правила от обявата в Booking. Показват се на „Дати и условия“ с бележка, че се потвърждават при отговора. */
  houseRules: {
    show: true,
    checkIn: { value: "14:00–18:00", status: "extracted", source: "Booking" } as Fact<string>,
    checkOut: { value: "08:00–12:00", status: "extracted", source: "Booking" } as Fact<string>,
  },

  /**
   * Оценка в Booking — историческа стойност към датата на проверката.
   * Сложете show: false, ако не желаете да се показва, или обновете стойностите и датата.
   */
  bookingRating: { show: true, score: "9,0", scoreEn: "9.0", reviews: 2, checkedOn: "2026-10-11" },

  /** Басейнът НЕ е потвърден. Не добавяйте басейн в текстове/галерия, докато това не стане true. */
  poolConfirmed: false,

  /** Публичен адрес за canonical/sitemap. Може да се смени чрез SITE_URL (напр. при тестова версия). */
  siteUrl: process.env.SITE_URL ?? "https://villa-lavandula.com",

  /** Индексиране от търсачки — включено. За тестова версия задайте SITE_INDEXABLE=false. */
  indexable: process.env.SITE_INDEXABLE !== "false",

  privacy: {
    /** Администратор на лични данни — да се потвърди (физическо лице или фирма, адрес). */
    controller: { bg: "Вила Лавандула", en: "Villa Lavandula" },
    controllerStatus: "extracted" as FactStatus,
    /** Срок за съхранение на запитвания, които не са довели до престой (в месеци). Решение на собственика. */
    retentionMonths: 12,
    lastUpdated: "2026-10-11",
  },
} as const;

export const mapsUrl = (() => {
  const c = site.location.coordinates;
  if (c) return `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Малко Тръново 6228, България")}`;
})();
