import "server-only";
import nodemailer from "nodemailer";
import { site } from "@/content/site";
import type { ParsedEnquiry } from "./enquiry-validate";

const env = () => ({
  host: process.env.SMTP_HOST?.trim(),
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  user: process.env.SMTP_USER?.trim(),
  pass: process.env.SMTP_PASS,
  from: process.env.MAIL_FROM?.trim(),
  to: process.env.ENQUIRY_TO?.trim(),
  guestConfirmation: process.env.ENQUIRY_GUEST_CONFIRMATION === "true",
});

/** true само ако всички нужни настройки за изпращане са зададени. Без тях формата не симулира успех. */
export function isMailConfigured(): boolean {
  const e = env();
  return Boolean(e.host && e.user && e.pass && e.from && e.to);
}

const fmt = (iso: string) => iso.split("-").reverse().join(".");

export async function sendEnquiry(d: ParsedEnquiry, locale: "bg" | "en"): Promise<void> {
  const e = env();
  if (!isMailConfigured()) throw new Error("MAIL_NOT_CONFIGURED");
  const transport = nodemailer.createTransport({
    host: e.host,
    port: e.port,
    secure: e.secure,
    auth: { user: e.user, pass: e.pass },
  });

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

  await transport.sendMail({
    from: e.from,
    to: e.to,
    replyTo: { name: d.name, address: d.email },
    subject: `Запитване: ${fmt(d.arrival)}–${fmt(d.departure)}, ${d.adults} възр.${d.children ? ` + ${d.children} деца` : ""} — ${d.name}`,
    text: lines.join("\n"),
  });

  if (e.guestConfirmation) {
    const bg = locale === "bg";
    const text = bg
      ? [
          `Здравейте, ${d.name},`,
          "",
          `получихме запитването ви за ${fmt(d.arrival)}–${fmt(d.departure)} във Вила Лавандула.`,
          "Това НЕ е потвърдена резервация. Ще ви отговорим лично за наличност, цена и условия.",
          "",
          `Телефон: ${site.contact.phoneDisplay.value}`,
        ]
      : [
          `Hello ${d.name},`,
          "",
          `we have received your enquiry for ${fmt(d.arrival)}–${fmt(d.departure)} at Villa Lavandula.`,
          "This is NOT a confirmed booking. We will reply personally about availability, price and terms.",
          "",
          `Phone: ${site.contact.phoneDisplay.value}`,
        ];
    try {
      await transport.sendMail({
        from: e.from,
        to: d.email,
        replyTo: e.to,
        subject: bg ? "Получихме запитването ви — Вила Лавандула" : "We received your enquiry — Villa Lavandula",
        text: text.join("\n"),
      });
    } catch (err) {
      // Запитването до собственика вече е изпратено; неуспешното потвърждение до госта не го отменя.
      console.error("[enquiry] guest confirmation failed", err);
    }
  }
}
