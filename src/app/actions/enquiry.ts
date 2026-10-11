"use server";

import { headers } from "next/headers";
import type { EnquiryState, EnquiryValues } from "@/lib/enquiry-types";
import { validateEnquiry } from "@/lib/enquiry-validate";
import { isMailConfigured, sendEnquiry } from "@/lib/mailer";
import { markSent, rateLimit, wasSent } from "@/lib/rate-limit";

const FIELDS = ["arrival", "departure", "adults", "children", "childrenAges", "pets", "name", "email", "phone", "message"] as const;
const MIN_FILL_MS = 2500;

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const stamp = Date.now();
  const values: EnquiryValues = {};
  for (const f of FIELDS) {
    const val = formData.get(f);
    if (typeof val === "string") values[f] = val.slice(0, 4000);
  }
  const locale = formData.get("locale") === "en" ? "en" : "bg";

  // 1) Капан за ботове: скрито поле, което хората не виждат.
  const trap = formData.get("website");
  if (typeof trap === "string" && trap.trim() !== "") return { status: "spam", stamp };

  // 2) Прекалено бързо попълване (по-малко от 2,5 s след зареждане) — типично за ботове.
  const started = Number(formData.get("startedAt"));
  if (!Number.isFinite(started) || stamp - started < MIN_FILL_MS) {
    return { status: "spam", values, stamp };
  }

  // 3) Сървърна валидация.
  const result = validateEnquiry(values);
  if (!result.ok) return { status: "invalid", errors: result.errors, values, stamp };

  // 4) Повторно натискане със същото запитване — не изпращаме втори път.
  const submissionId = String(formData.get("submissionId") ?? "").slice(0, 64);
  if (submissionId && wasSent(submissionId)) return { status: "success", stamp };

  // 5) Липсват настройки за изпращане — честно съобщение, без симулиран успех.
  if (!isMailConfigured()) return { status: "not_configured", values, stamp };

  // 6) Лимит на честотата по IP адрес.
  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "unknown").trim();
  if (!rateLimit(`enquiry:${ip}`)) return { status: "rate_limited", values, stamp };

  try {
    await sendEnquiry(result.data, locale);
    if (submissionId) markSent(submissionId);
    return { status: "success", stamp };
  } catch (err) {
    console.error("[enquiry] send failed", err instanceof Error ? err.message : err);
    return { status: "failed", values, stamp };
  }
}
