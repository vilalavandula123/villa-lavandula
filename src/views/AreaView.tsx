import Image from "next/image";
import Link from "next/link";
import { ArrowRight, External, MapPin } from "@/components/Icons";
import { ExternalLink, PageIntro, SectionTitle } from "@/components/ui";
import { getPhoto } from "@/content/gallery";
import { mapsUrl, site } from "@/content/site";
import { formatDate, getDictionary } from "@/lib/i18n";
import { href, type Locale } from "@/lib/routes";

export default function AreaView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const t = d.areaPage;
  const photo = getPhoto("terrace-garden-view");
  return (
    <>
      <PageIntro title={t.title} lead={t.lead}>
        <p className="mt-6 flex max-w-2xl gap-3 rounded-xl border-l-4 border-lavender bg-paper px-4 py-3">
          <MapPin className="mt-0.5 shrink-0 text-olive" /> {t.notConfuse}
        </p>
      </PageIntro>

      <section className="section-y" aria-labelledby="nearby-title">
        <div className="container-site grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <SectionTitle id="nearby-title">{t.nearbyTitle}</SectionTitle>
            <ul className="divide-y divide-line border-y border-line">
              {t.nearby.map((n) => (
                <li key={n.name} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <div>
                    <h3 className="font-sans text-lg font-semibold">{n.name}</h3>
                    <p className="text-ink-soft">{n.text}</p>
                  </div>
                  <p className="shrink-0 font-serif text-lg text-olive">{n.distance}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-ink-soft">{t.nearbyNote}</p>

            <h2 className="mt-14 mb-4 text-3xl">{t.arrivalTitle}</h2>
            <p className="mb-4 max-w-xl text-lg">{t.arrivalLead}</p>
            <ul className="divide-y divide-line border-y border-line">
              {(["plovdiv", "sofia"] as const).map((k) => (
                <li key={k} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h3 className="font-sans text-lg font-semibold">{t.airports[k]}</h3>
                  <p className="shrink-0 text-ink-soft sm:text-right">
                    <span className="font-serif text-lg text-olive">{t.km(site.airports[k].km)}</span>
                    <span className="block text-[15px]">{t.drive(site.airports[k].minutes)}</span>
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-ink-soft">{t.arrivalNote(formatDate(site.airports.checkedOn, locale))}</p>

            <h2 className="mt-14 mb-4 text-3xl">{t.outdoorsTitle}</h2>
            <p className="max-w-xl text-lg">{t.outdoorsText}</p>

            <p className="mt-10">
              <ExternalLink href={site.links.wikipediaVillage} srLabel={d.a11y.opensExternal} className="link inline-flex min-h-11 items-center gap-1.5">
                {t.wikiLink} <External />
              </ExternalLink>
              <span className="block text-sm text-ink-soft">{t.wikiNote}</span>
            </p>
          </div>
          <div className="space-y-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-photo)] lg:rounded-tl-[6rem]">
              <Image src={photo.src} alt={photo.alt[locale]} fill sizes="(min-width: 1024px) 45vw, 100vw" quality={75} className="object-cover" />
            </div>
            <div className="rounded-2xl bg-olive-soft p-6 lg:p-8">
              <h2 className="mb-3 text-2xl">{t.mapTitle}</h2>
              <p className="mb-2 font-semibold">
                {site.location.village[locale]} {site.location.postcode}, {site.location.region[locale]}
              </p>
              <p className="mb-5">{t.mapText}</p>
              <ExternalLink href={mapsUrl} srLabel={d.a11y.opensExternal} className="btn btn-secondary bg-paper">
                <MapPin /> {d.cta.map} <External />
              </ExternalLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand">
        <div className="container-site flex flex-col items-start gap-5 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-2xl">{d.home.enquiryTitle}</p>
            <p className="mt-1 text-ink-soft">{d.home.replyTime}</p>
          </div>
          <Link href={href(locale, "enquiry", "zapitvane-forma")} className="btn btn-primary">
            {d.cta.enquire} <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
