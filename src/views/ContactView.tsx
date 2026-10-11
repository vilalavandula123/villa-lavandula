import Link from "next/link";
import { ArrowRight, External } from "@/components/Icons";
import { ExternalLink, PageIntro } from "@/components/ui";
import { site } from "@/content/site";
import { getDictionary } from "@/lib/i18n";
import { href, type Locale } from "@/lib/routes";
import { ContactBlock } from "./HomeView";

export default function ContactView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const t = d.contactPage;
  return (
    <>
      <PageIntro title={t.title} lead={t.lead} />
      <section className="container-site section-y !pt-10 space-y-12">
        <ContactBlock locale={locale} />
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-2xl">{t.languages}</h2>
            <p className="text-lg">{site.contact.hostLanguages.value[locale]}</p>
          </div>
          <div>
            <h2 className="mb-3 text-2xl">{t.online}</h2>
            <ul className="space-y-1">
              {[
                { url: site.links.booking, label: d.cta.booking },
                { url: site.links.facebook, label: d.cta.facebook },
              ].map((l) => (
                <li key={l.url}>
                  <ExternalLink href={l.url} srLabel={d.a11y.opensExternal} className="link inline-flex min-h-11 items-center gap-1.5">
                    {l.label} <External />
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-olive-soft p-6 sm:flex-row sm:items-center sm:justify-between lg:p-8">
          <p className="font-serif text-2xl">{t.enquiryBox}</p>
          <Link href={href(locale, "enquiry", "zapitvane-forma")} className="btn btn-primary">
            {d.cta.enquire} <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
