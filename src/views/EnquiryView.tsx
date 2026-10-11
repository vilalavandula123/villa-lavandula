import { connection } from "next/server";
import EnquiryForm from "@/components/EnquiryForm";
import { Check, External } from "@/components/Icons";
import { ExternalLink, PageIntro, SectionTitle } from "@/components/ui";
import { site } from "@/content/site";
import { requestTime, todayInSofia } from "@/lib/enquiry-validate";
import { getDictionary } from "@/lib/i18n";
import { isMailConfigured } from "@/lib/mailer";
import type { Locale } from "@/lib/routes";
import { FaqList } from "./HomeView";

export default async function EnquiryView({ locale }: { locale: Locale }) {
  await connection(); // днешната дата и настройките се четат при всяка заявка
  const d = getDictionary(locale);
  const t = d.enquiryPage;
  const today = todayInSofia();
  const maxDate = `${Number(today.slice(0, 4)) + 2}${today.slice(4)}`;
  const r = site.houseRules;

  return (
    <>
      <PageIntro title={t.title} lead={t.lead} />
      <div className="container-site section-y !pt-10 grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
        <section aria-labelledby="zapitvane-forma-title" id="zapitvane-forma" className="scroll-mt-6">
          <h2 id="zapitvane-forma-title" className="h-section mb-6">{d.form.title}</h2>
          <EnquiryForm
            locale={locale}
            today={today}
            maxDate={maxDate}
            mailConfigured={isMailConfigured()}
            renderedAt={requestTime()}
          />
        </section>

        <aside className="space-y-10" aria-label={t.howTitle}>
          <div>
            <h2 className="mb-5 text-2xl">{t.howTitle}</h2>
            <ol className="space-y-5">
              {t.how.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-olive-soft font-serif text-lg text-ink" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-sans font-semibold">{s.title}</h3>
                    <p className="text-[15px] text-ink-soft">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl bg-paper p-6">
            <h2 className="mb-2 text-2xl">{t.pricesTitle}</h2>
            <p className="text-ink-soft">{t.pricesText}</p>
          </div>
          {r.show && (
            <div>
              <h2 className="mb-4 text-2xl">{t.rulesTitle}</h2>
              <ul className="space-y-2.5 text-[15px]">
                {[t.rules.checkIn(r.checkIn.value), t.rules.checkOut(r.checkOut.value), t.rules.children, t.rules.pets, t.rules.smoking].map((x) => (
                  <li key={x} className="flex gap-2.5">
                    <Check width={18} height={18} className="mt-0.5 shrink-0 text-olive" /> {x}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-ink-soft">{t.rulesNote}</p>
            </div>
          )}
          <p className="text-[15px]">
            {t.bookingAlt}{" "}
            <ExternalLink href={site.links.booking} srLabel={d.a11y.opensExternal} className="link inline-flex items-center gap-1">
              Booking.com <External />
            </ExternalLink>
          </p>
        </aside>
      </div>

      <section className="border-t border-line/70 section-y" aria-labelledby="faq-title">
        <div className="container-site">
          <div className="max-w-3xl">
          <SectionTitle id="faq-title">{d.home.faqTitle}</SectionTitle>
          <FaqList locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}
