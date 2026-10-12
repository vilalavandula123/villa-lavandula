import "server-only";
import { site } from "@/content/site";
import type { ParsedEnquiry } from "./enquiry-validate";

/**
 * Изпращане на запитвания чрез Resend (https://resend.com) — работи в Cloudflare Workers.
 * Настройки (Cloudflare → Workers → villa-lavandula → Settings → Variables and Secrets):
 *   RESEND_API_KEY  — тайна (Secret), ключ от Resend
 *   MAIL_FROM       — подател от потвърдения домейн, напр. "Вила Лавандула <zapitvania@villa-lavandula.com>"
 *   ENQUIRY_TO      — получател на запитванията (собственикът)
 *   ENQUIRY_GUEST_CONFIRMATION — "true", ако гостът да получава кратко потвърждение
 */
const env = () => ({
  apiKey: process.env.RESEND_API_KEY?.trim(),
  from: process.env.MAIL_FROM?.trim(),
  to: process.env.ENQUIRY_TO?.trim(),
  guestConfirmation: process.env.ENQUIRY_GUEST_CONFIRMATION === "true",
});

/** true само ако всички нужни настройки са зададени. Без тях формата не симулира успех. */
export function isMailConfigured(): boolean {
  const e = env();
  return Boolean(e.apiKey && e.from && e.to);
}

const fmt = (iso: string) => iso.split("-").reverse().join(".");

async function send(
  payload: { from: string; to: string[]; reply_to?: string; subject: string; text: string },
  idempotencyKey?: string,
): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env().apiKey}`,
      "Content-Type": "application/json",
      // Resend не изпраща второ писмо със същия ключ (защита от двойно изпращане)
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 300)}`);
  }
}

export async function sendEnquiry(d: ParsedEnquiry, locale: "bg" | "en", submissionId?: string): Promise<void> {
  const e = env();
  if (!isMailConfigured()) throw new Error("MAIL_NOT_CONFIGURED");

  const petsText = d.pets === "yes" ? "да" : d.pets === "no" ? "не" : "не е посочено";
  const lines = [
    "Ново запитване от сайта (НЕ е потвърдена резервация).",
    "",
    `Пристигане:  ${fmt(d.arrival)}`,
    `Напускане:   ${fmt(d.departure)} (${d.nights} нощувки)`,
    `Възрастни:   ${d.adults}`,
    `Деца:        ${d.children}${d.childrenAges ? ` (възраст: ${d.childrenAges})` : ""}`,
    `Дом. любимец: ${petsText}`,
    "",
    `Име:     ${d.name}`,
    `Имейл:   ${d.email}`,
    `Телефон: ${d.phone || "—"}`,
    `Език на сайта: ${locale.toUpperCase()}`,
    "",
    "Съобщение:",
    d.message || "—",
    "",
    "Отговорът с „Reply“ отива директно до госта.",
  ];

  await send(
    {
      from: e.from!,
      to: e.to!.split(",").map((x) => x.trim()).filter(Boolean),
      reply_to: `${d.name.replace(/[<>"]/g, "")} <${d.email}>`,
      subject: `Запитване: ${fmt(d.arrival)}–${fmt(d.departure)}, ${d.adults} възр.${d.children ? ` + ${d.children} деца` : ""} — ${d.name}`,
      text: lines.join("\n"),
    },
    submissionId ? `enquiry-${submissionId}` : undefined,
  );

  if (e.guestConfirmation) {
    const bg = locale === "bg";
    const text = bg
      ? [
          `Здравейте, ${d.name},`,
          "",
          `получихме запитването ви за ${fmt(d.arrival)}–${fmt(d.departure)} във Вила Лавандула.`,
          "Ще ви отговорим до 12 часа с информация за свободните дати, цената и условията. Запитването НЕ е потвърдена резервация.",
          "",
          `Телефон: ${site.contact.phoneDisplay.value}`,
        ]
      : [
          `Hello ${d.name},`,
          "",
          `we have received your enquiry for ${fmt(d.arrival)}–${fmt(d.departure)} at Villa Lavandula.`,
          "We will reply within 12 hours with available dates, the price and terms. Your enquiry is NOT a confirmed booking.",
          "",
          `Phone: ${site.contact.phoneDisplay.value}`,
        ];
    try {
      await send(
        {
          from: e.from!,
          to: [d.email],
          reply_to: e.to!.split(",")[0].trim(),
          subject: bg ? "Получихме запитването ви — Вила Лавандула" : "We received your enquiry — Villa Lavandula",
          text: text.join("\n"),
        },
        submissionId ? `guest-${submissionId}` : undefined,
      );
    } catch (err) {
      // Запитването до собственика вече е изпратено; неуспешното потвърждение до госта не го отменя.
      console.error("[enquiry] guest confirmation failed", err);
    }
  }
}
