import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "@/components/Icons";
import { PageIntro, SectionTitle } from "@/components/ui";
import { getPhoto } from "@/content/gallery";
import { site } from "@/content/site";
import { getDictionary } from "@/lib/i18n";
import { href, type Locale } from "@/lib/routes";
import { Facts } from "./HomeView";

export default function HouseView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const t = d.housePage;
  return (
    <>
      <PageIntro title={t.title} lead={t.lead}>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={href(locale, "enquiry", "zapitvane-forma")} className="btn btn-primary">
            {d.cta.enquire} <ArrowRight />
          </Link>
          <Link href={href(locale, "gallery")} className="btn btn-secondary">{d.cta.allPhotos}</Link>
        </div>
      </PageIntro>

      <div className="pt-10">
        <Facts locale={locale} />
      </div>

      <section className="section-y" aria-labelledby="spaces-title">
        <div className="container-site">
          <SectionTitle id="spaces-title">{t.spacesTitle}</SectionTitle>
          <ul className="space-y-14 lg:space-y-20">
            {t.spaces.map((s, i) => {
              const p = getPhoto(s.photo);
              return (
                <li key={s.title} className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-[var(--radius-photo)] ${i % 2 ? "md:order-2" : ""}`}>
                    <Image src={p.src} alt={p.alt[locale]} fill sizes="(min-width: 768px) 50vw, 100vw" quality={75} className="object-cover" />
                  </div>
                  <div>
                    <h3 className="mb-3 text-3xl">{s.title}</h3>
                    <p className="max-w-md text-lg text-ink-soft">{s.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="border-t border-line/70 bg-paper section-y" aria-labelledby="amen-title">
        <div className="container-site">
          <div className="mb-12 rounded-2xl bg-olive-soft p-6 lg:p-8">
            <h2 className="mb-2 text-2xl">{t.bedsTitle}</h2>
            <p className="text-lg">{site.facts.beds.value[locale]}</p>
          </div>
          <SectionTitle id="amen-title">{t.amenitiesTitle}</SectionTitle>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.amenityGroups.map((g) => (
              <div key={g.title}>
                <h3 className="mb-4 border-b border-line pb-2 text-xl">{g.title}</h3>
                <ul className="space-y-2.5">
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-2.5">
                      <Check className="mt-1 shrink-0 text-olive" width={18} height={18} /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-2xl text-ink-soft">{t.amenitiesNote}</p>
        </div>
      </section>
    </>
  );
}
