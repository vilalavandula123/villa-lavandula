import { PageIntro } from "@/components/ui";
import { site } from "@/content/site";
import { formatDate, getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/routes";

export default function PrivacyView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).privacyPage;
  const sections = t.sections({
    controller: site.privacy.controller[locale],
    email: site.contact.email.value,
    phone: site.contact.phoneDisplay.value,
    months: site.privacy.retentionMonths,
  });
  return (
    <>
      <PageIntro title={t.title}>
        <p className="mt-4 text-ink-soft">{t.updated(formatDate(site.privacy.lastUpdated, locale))}</p>
      </PageIntro>
      <div className="container-site section-y !pt-10">
        <div className="max-w-[68ch] space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="mb-3 text-2xl">{s.title}</h2>
              {s.body.map((p) => (
                <p key={p} className="mb-3">{p}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
