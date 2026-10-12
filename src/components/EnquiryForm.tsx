"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { submitEnquiry } from "@/app/actions/enquiry";
import { site } from "@/content/site";
import { initialEnquiryState, type EnquiryField } from "@/lib/enquiry-types";
import { getDictionary } from "@/lib/i18n";
import { href, type Locale } from "@/lib/routes";
import { Alert, ArrowRight, Check, Mail, Phone } from "./Icons";

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function Fallback({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <div className="mt-3">
      <p className="mb-2">{t.form.fallback}</p>
      <ul className="flex flex-col gap-1 sm:flex-row sm:gap-6">
        <li>
          <a href={site.contact.phoneHref} className="link inline-flex min-h-11 items-center gap-2">
            <Phone /> {site.contact.phoneDisplay.value}
          </a>
        </li>
        <li>
          <a href={`mailto:${site.contact.email.value}`} className="link inline-flex min-h-11 items-center gap-2 break-all">
            <Mail /> {site.contact.email.value}
          </a>
        </li>
      </ul>
    </div>
  );
}

/** Избраната дата с думи (напр. „петък, 12 юни 2027 г.“), за да е недвусмислена независимо от формата на браузъра. */
function longDate(iso: string, locale: Locale): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

function nights(a: string, b: string, locale: Locale): string {
  if (!a || !b) return "";
  const n = Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
  if (!Number.isFinite(n) || n <= 0) return "";
  if (locale === "bg") return ` · ${n} ${n === 1 ? "нощувка" : "нощувки"}`;
  return ` · ${n} ${n === 1 ? "night" : "nights"}`;
}

export default function EnquiryForm({
  locale,
  today,
  maxDate,
  mailConfigured,
  renderedAt,
}: {
  locale: Locale;
  today: string;
  maxDate: string;
  mailConfigured: boolean;
  renderedAt: number;
}) {
  const t = getDictionary(locale);
  const f = t.form;
  const [state, action, pending] = useActionState(submitEnquiry, initialEnquiryState);
  const [submissionId, setSubmissionId] = useState("");
  const [startedAt, setStartedAt] = useState(renderedAt);
  const [children, setChildren] = useState(Number(state.values?.children || 0));
  const [arrival, setArrival] = useState(state.values?.arrival ?? "");
  const [departure, setDeparture] = useState(state.values?.departure ?? "");
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  useEffect(() => {
    setSubmissionId(newId());
    setStartedAt(Date.now());
  }, []);

  // След отговор от сървъра — синхронизиране на полетата и фокус към резултата
  const [seenStamp, setSeenStamp] = useState(state.stamp);
  if (state.stamp !== seenStamp) {
    setSeenStamp(state.stamp);
    setChildren(Number(state.values?.children || 0));
    setArrival(state.values?.arrival ?? "");
    setDeparture(state.values?.departure ?? "");
    if (state.status === "success") setSubmissionId(newId());
  }
  useEffect(() => {
    if (state.stamp === 0) return;
    if (state.status === "invalid") summaryRef.current?.focus();
    else statusRef.current?.focus();
  }, [state.stamp, state.status]);

  const err = (k: EnquiryField) => {
    const code = state.status === "invalid" ? state.errors?.[k] : undefined;
    if (!code) return undefined;
    const e = f.errors[code];
    return typeof e === "function" ? e(site.facts.maxAdults.value) : e;
  };
  const id = (k: string) => `${uid}-${k}`;
  const dv = (k: EnquiryField) => state.values?.[k] ?? "";

  const describedBy = (k: EnquiryField, hint?: boolean) =>
    [hint ? `${id(k)}-hint` : "", err(k) ? `${id(k)}-err` : ""].filter(Boolean).join(" ") || undefined;

  const errorText = (k: EnquiryField) =>
    err(k) ? (
      <p id={`${id(k)}-err`} className="field-error">
        <Alert className="mt-0.5 shrink-0" /> {err(k)}
      </p>
    ) : null;

  const label = (k: string, text: string, req?: boolean) => (
    <label htmlFor={id(k)} className="field-label">
      {text}{" "}
      <span className="font-normal text-ink-soft">({req ? f.required : f.optional})</span>
    </label>
  );

  if (state.status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-2xl border border-success/30 bg-paper p-6 sm:p-8">
        <p className="flex items-center gap-3 font-serif text-2xl text-success">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-success/10">
            <Check />
          </span>
          {f.success.title}
        </p>
        <p className="mt-3 max-w-prose">{f.success.text}</p>
        <button
          type="button"
          className="btn btn-secondary mt-6"
          onClick={() => window.location.reload()}
        >
          {f.success.another}
        </button>
      </div>
    );
  }

  const errorKeys = (state.status === "invalid" ? Object.keys(state.errors ?? {}) : []) as EnquiryField[];
  const labelFor: Record<EnquiryField, string> = {
    arrival: f.arrival,
    departure: f.departure,
    adults: f.adults,
    children: f.children,
    childrenAges: f.childrenAges,
    pets: f.pets,
    name: f.name,
    email: f.email,
    phone: f.phone,
    message: f.message,
  };

  const problem =
    state.status === "not_configured"
      ? f.notConfigured.result
      : state.status === "failed"
        ? f.failure.generic
        : state.status === "rate_limited"
          ? f.failure.rateLimited
          : state.status === "spam"
            ? f.errors.spam
            : null;

  return (
    <form key={state.stamp} action={action} noValidate aria-describedby={`${uid}-disc`} className="space-y-6">
      <div id={`${uid}-disc`} className="rounded-xl border-l-4 border-lavender bg-paper px-4 py-3 text-[15px]">
        <p className="font-semibold">{f.replyTime}</p>
        <p className="mt-1">{f.disclaimer}</p>
      </div>

      {!mailConfigured && (
        <div className="rounded-xl border border-[#a8842f]/50 bg-[#fbf3df] px-4 py-3 text-[15px]">
          <p className="flex gap-2 font-semibold">
            <Alert className="mt-0.5 shrink-0" /> {f.notConfigured.notice}
          </p>
          <Fallback locale={locale} />
        </div>
      )}

      {errorKeys.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-xl border border-error/40 bg-[#fbeeee] px-4 py-3">
          <p className="font-semibold text-error">{f.errorSummary}</p>
          <ul className="mt-2 list-disc pl-5">
            {errorKeys.map((k) => (
              <li key={k}>
                <a href={`#${id(k)}`} className="link !text-error">
                  {labelFor[k]}: {err(k)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {problem && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="rounded-xl border border-error/40 bg-[#fbeeee] px-4 py-3">
          <p className="flex gap-2 font-semibold text-error">
            <Alert className="mt-0.5 shrink-0" /> {problem}
          </p>
          <Fallback locale={locale} />
        </div>
      )}

      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="submissionId" value={submissionId} />
      <input type="hidden" name="startedAt" value={startedAt} />
      {/* Капан за ботове — скрит за хората и екранните четци */}
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor={id("website")}>{f.honeypot}</label>
        <input id={id("website")} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="visually-hidden">{t.enquiryPage.title}</legend>
        <div>
          {label("arrival", f.arrival, true)}
          <input
            id={id("arrival")}
            name="arrival"
            type="date"
            min={today}
            max={maxDate}
            required
            defaultValue={dv("arrival")}
            onChange={(e) => setArrival(e.target.value)}
            className="field"
            aria-invalid={err("arrival") ? true : undefined}
            aria-describedby={describedBy("arrival", true)}
          />
          <span id={`${id("arrival")}-hint`} className="field-hint min-h-[1.4em]">{longDate(arrival, locale)}</span>
          {errorText("arrival")}
        </div>
        <div>
          {label("departure", f.departure, true)}
          <input
            id={id("departure")}
            name="departure"
            type="date"
            min={arrival || today}
            max={maxDate}
            required
            defaultValue={dv("departure")}
            onChange={(e) => setDeparture(e.target.value)}
            className="field"
            aria-invalid={err("departure") ? true : undefined}
            aria-describedby={describedBy("departure", true)}
          />
          <span id={`${id("departure")}-hint`} className="field-hint min-h-[1.4em]">
            {longDate(departure, locale)}
            {nights(arrival, departure, locale)}
          </span>
          {errorText("departure")}
        </div>
        <div>
          {label("adults", f.adults, true)}
          <input
            id={id("adults")}
            name="adults"
            type="number"
            inputMode="numeric"
            min={1}
            max={site.facts.maxAdults.status === "confirmed" ? site.facts.maxAdults.value : undefined}
            required
            defaultValue={dv("adults") || "2"}
            className="field"
            aria-invalid={err("adults") ? true : undefined}
            aria-describedby={describedBy("adults")}
          />
          {errorText("adults")}
        </div>
        <div>
          {label("children", f.children)}
          <input
            id={id("children")}
            name="children"
            type="number"
            inputMode="numeric"
            min={0}
            max={20}
            defaultValue={dv("children") || "0"}
            onChange={(e) => setChildren(Number(e.target.value) || 0)}
            className="field"
            aria-invalid={err("children") ? true : undefined}
            aria-describedby={describedBy("children")}
          />
          {errorText("children")}
        </div>
        {children > 0 && (
          <div className="sm:col-span-2">
            {label("childrenAges", f.childrenAges)}
            <input
              id={id("childrenAges")}
              name="childrenAges"
              type="text"
              maxLength={120}
              defaultValue={dv("childrenAges")}
              className="field"
              aria-invalid={err("childrenAges") ? true : undefined}
              aria-describedby={describedBy("childrenAges", true)}
            />
            <span id={`${id("childrenAges")}-hint`} className="field-hint">{f.childrenAgesHint}</span>
            {errorText("childrenAges")}
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="field-label">
          {f.pets} <span className="font-normal text-ink-soft">({f.optional})</span>
        </legend>
        <div className="flex gap-3">
          {(["yes", "no"] as const).map((v) => (
            <label key={v} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-field bg-white px-4 has-[:checked]:border-action has-[:checked]:bg-[#efe9f3]">
              <input type="radio" name="pets" value={v} defaultChecked={dv("pets") === v} className="size-4 accent-[#5F4478]" />
              {v === "yes" ? f.petsYes : f.petsNo}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          {label("name", f.name, true)}
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            defaultValue={dv("name")}
            className="field"
            aria-invalid={err("name") ? true : undefined}
            aria-describedby={describedBy("name")}
          />
          {errorText("name")}
        </div>
        <div>
          {label("email", f.email, true)}
          <input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={254}
            defaultValue={dv("email")}
            className="field"
            aria-invalid={err("email") ? true : undefined}
            aria-describedby={describedBy("email")}
          />
          {errorText("email")}
        </div>
        <div>
          {label("phone", f.phone)}
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={24}
            defaultValue={dv("phone")}
            className="field"
            aria-invalid={err("phone") ? true : undefined}
            aria-describedby={describedBy("phone", true)}
          />
          <span id={`${id("phone")}-hint`} className="field-hint">{f.phoneHint}</span>
          {errorText("phone")}
        </div>
        <div className="sm:col-span-2">
          {label("message", f.message)}
          <textarea
            id={id("message")}
            name="message"
            rows={5}
            maxLength={2000}
            defaultValue={dv("message")}
            className="field resize-y"
            aria-invalid={err("message") ? true : undefined}
            aria-describedby={describedBy("message", true)}
          />
          <span id={`${id("message")}-hint`} className="field-hint">{f.messageHint}</span>
          {errorText("message")}
        </div>
      </div>

      <p className="text-[15px] text-ink-soft">
        {f.privacy}{" "}
        <Link href={href(locale, "privacy")} className="link">
          {f.privacyLink}
        </Link>
      </p>

      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={pending} aria-disabled={pending || undefined}>
        {pending ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
            {f.submitting}
          </>
        ) : (
          <>
            {f.submit} <ArrowRight />
          </>
        )}
      </button>
      <p className="visually-hidden" role="status" aria-live="polite">
        {pending ? f.submitting : ""}
      </p>
    </form>
  );
}
