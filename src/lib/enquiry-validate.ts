import { z } from "zod";
import { site } from "@/content/site";
import type { EnquiryErrorCode, EnquiryField, EnquiryValues } from "./enquiry-types";

/** Днешна дата (ГГГГ-ММ-ДД) в часовата зона на къщата. */
export function todayInSofia(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Sofia", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

const isoDate = /^\d{4}-\d{2}-\d{2}$/;
const validIso = (s: string) => {
  if (!isoDate.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
};
const addYears = (iso: string, n: number) => `${Number(iso.slice(0, 4)) + n}${iso.slice(4)}`;

// Премахва управляващи символи и нови редове от еднoредови полета (защита на имейл заглавките).
export const oneLine = (s: string) => s.replace(/[\u0000-\u001F\u007F]+/g, " ").replace(/\s+/g, " ").trim();
const multiLine = (s: string) => s.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();

const emailSchema = z.string().max(254).email();

export type ParsedEnquiry = {
  arrival: string;
  departure: string;
  nights: number;
  adults: number;
  children: number;
  childrenAges: string;
  pets: "yes" | "no" | "";
  name: string;
  email: string;
  phone: string;
  message: string;
};

export function validateEnquiry(raw: EnquiryValues, today = todayInSofia()):
  | { ok: true; data: ParsedEnquiry }
  | { ok: false; errors: Partial<Record<EnquiryField, EnquiryErrorCode>> } {
  const errors: Partial<Record<EnquiryField, EnquiryErrorCode>> = {};
  const v = (k: EnquiryField) => (raw[k] ?? "").toString();

  const arrival = v("arrival").trim();
  const departure = v("departure").trim();
  const maxDate = addYears(today, 2);
  if (!arrival || !validIso(arrival)) errors.arrival = "arrivalRequired";
  else if (arrival < today) errors.arrival = "arrivalPast";
  else if (arrival > maxDate) errors.arrival = "rangeTooFar";
  if (!departure || !validIso(departure)) errors.departure = "departureRequired";
  else if (!errors.arrival && departure <= arrival) errors.departure = "departureOrder";
  else if (departure > maxDate) errors.departure = "rangeTooFar";

  const maxAdults = site.facts.maxAdults.status === "confirmed" ? site.facts.maxAdults.value : 30;
  const adults = Number(v("adults"));
  if (!Number.isInteger(adults) || adults < 1) errors.adults = "adults";
  else if (adults > maxAdults) errors.adults = site.facts.maxAdults.status === "confirmed" ? "adultsMax" : "adults";

  const childrenRaw = v("children").trim();
  const children = childrenRaw === "" ? 0 : Number(childrenRaw);
  if (!Number.isInteger(children) || children < 0 || children > 20) errors.children = "children";

  const childrenAges = oneLine(v("childrenAges"));
  if (childrenAges.length > 120) errors.childrenAges = "tooLong";

  const petsRaw = v("pets");
  const pets = petsRaw === "yes" || petsRaw === "no" ? petsRaw : "";

  const name = oneLine(v("name"));
  if (name.length < 2) errors.name = "name";
  else if (name.length > 100) errors.name = "tooLong";

  const email = oneLine(v("email")).toLowerCase();
  if (!emailSchema.safeParse(email).success) errors.email = "email";

  const phone = oneLine(v("phone"));
  if (phone && !/^\+?[0-9()\s.\-/]{6,24}$/.test(phone)) errors.phone = "phone";

  const message = multiLine(v("message"));
  if (message.length > 2000) errors.message = "tooLong";

  if (Object.keys(errors).length) return { ok: false, errors };

  const nights = Math.round((Date.parse(departure) - Date.parse(arrival)) / 86_400_000);
  return {
    ok: true,
    data: { arrival, departure, nights, adults, children, childrenAges: children > 0 ? childrenAges : "", pets, name, email, phone, message },
  };
}

/** Време на генериране на страницата (за защитата от прекалено бързо изпращане). */
export const requestTime = () => Date.now();
