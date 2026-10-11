import Image from "next/image";
import Link from "next/link";
import { PhotoPreview } from "@/components/Gallery";
import { Area, ArrowRight, Bed, External, House, Leaf, Mail, MapPin, Phone, Users } from "@/components/Icons";
import { ExternalLink, SectionTitle } from "@/components/ui";
import { getPhoto, homePreviewIds } from "@/content/gallery";
import { mapsUrl, site } from "@/content/site";
import { formatDate, getDictionary } from "@/lib/i18n";
import { href, type Locale } from "@/lib/routes";

export function Facts({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).home;
  const f = site.facts;
  const items = [
    { icon: House, label: t.facts.wholeHouse, sub: t.facts.wholeHouseSub },
    { icon: Users, label: t.facts.adults(f.maxAdults.value), sub: t.facts.adultsSub },
    { icon: Bed, label: t.facts.bedrooms(f.bedrooms.value), sub: t.facts.bedroomsSub },
    { icon: Area, label: t.facts.area(f.areaM2.value), sub: t.facts.areaSub },
  ];
  return (
    <section aria-label={t.factsLabel} className="container-site">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 border-y border-line py-7 lg:grid-cols-4 lg:py-8">
        {items.map(({ icon: Icon, label, sub }) => (
          <li key={label} className="flex items-start gap-3">
            <Icon width={26} height={26} className="mt-0.5 shrink-0 text-olive" />
            <div>
              <p className="font-serif text-lg leading-tight lg:text-xl">{label}</p>
              <p className="text-[15px] text-ink-soft">{sub}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FaqList({ locale }: { locale: Locale }) {
  const faq = getDictionary(locale).faq;
  return (
    <div className="divide-y divide-line border-y border-line">
      {faq.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              aria-hidden="true"
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-olive transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="max-w-3xl pb-5 text-ink-soft">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function ContactBlock({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      <li>
        <a href={site.contact.phoneHref} className="flex min-h-full items-start gap-3 rounded-2xl border border-line bg-paper p-5 hover:border-olive">
          <Phone className="mt-1 shrink-0 text-olive" />
          <span>
            <span className="block text-sm font-semibold text-ink-soft">{t.contactPage.phone}</span>
            <span className="text-lg font-semibold">{site.contact.phoneDisplay.value}</span>
          </span>
        </a>
      </li>
      <li>
        <a href={`mailto:${site.contact.email.value}`} className="flex min-h-full items-start gap-3 rounded-2xl border border-line bg-paper p-5 hover:border-olive">
          <Mail className="mt-1 shrink-0 text-olive" />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-ink-soft">{t.contactPage.email}</span>
            <span className="block break-all text-lg font-semibold">{site.contact.email.value}</span>
          </span>
        </a>
      </li>
      <li>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-full items-start gap-3 rounded-2xl border border-line bg-paper p-5 hover:border-olive">
          <MapPin className="mt-1 shrink-0 text-olive" />
          <span>
            <span className="block text-sm font-semibold text-ink-soft">{t.contactPage.address}</span>
            <span className="block text-lg font-semibold">
              {site.location.village[locale]} {site.location.postcode}
            </span>
            <span className="block text-[15px] text-ink-soft">{site.location.region[locale]}</span>
            <span className="mt-1 inline-flex items-center gap-1 text-[15px] font-semibold text-action underline underline-offset-4">
              {t.cta.map} <External />
            </span>
            <span className="visually-hidden"> {t.a11y.opensExternal}</span>
          </span>
        </a>
      </li>
    </ul>
  );
}

export default function HomeView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const t = d.home;
  const hero = getPhoto("house-garden-summer");
  const introA = getPhoto("bedroom-butterflies");
  const introB = getPhoto("living-dining-room");

  return (
    <>
      {/* ---------- Hero: текст вляво, снимка вдясно ---------- */}
      <section className="relative" aria-labelledby="hero-title">
        <div className="lg:grid lg:min-h-[600px] lg:grid-cols-[minmax(0,44fr)_minmax(0,56fr)] lg:items-center xl:min-h-[640px]">
          <div className="container-site relative z-10 pb-8 pt-4 lg:!max-w-none lg:py-16 lg:pl-[max(56px,calc((100vw-1200px)/2))] lg:pr-12">
            <h1 id="hero-title" className="text-[2.35rem] leading-[1.08] sm:text-5xl lg:text-[clamp(2.6rem,3.6vw,3.7rem)]">
              <span className="block">{t.heroTitleLine1}</span>
              <span className="block">{t.heroTitleLine2}</span>
            </h1>
            <p className="mt-4 font-serif text-lg text-ink-soft lg:text-xl">{t.heroPlace}</p>
            <span className="rule-short my-6" aria-hidden="true" />
            <p className="max-w-md text-[1.0625rem] lg:text-lg">{t.heroText}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href={href(locale, "enquiry", "zapitvane-forma")} className="btn btn-primary">
                {d.cta.enquire} <ArrowRight />
              </Link>
              <Link href={href(locale, "house")} className="link inline-flex min-h-11 items-center">
                {d.cta.seeHouse}
              </Link>
            </div>
          </div>

          <div className="container-site lg:!max-w-none lg:!px-0 lg:self-stretch">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[600px] lg:rounded-none lg:rounded-bl-[3rem] lg:rounded-tl-[11rem]">
              <Image
                src={hero.src}
                alt={hero.alt[locale]}
                fill
                priority
                fetchPriority="high"
                quality={70}
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="object-cover object-[55%_50%]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="pt-8 lg:pt-12">
        <Facts locale={locale} />
      </div>

      {/* ---------- Място за спокойни дни ---------- */}
      <section className="mt-14 bg-olive-soft lg:mt-20" aria-labelledby="intro-title">
        <div className="container-site section-y grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <div>
            <SectionTitle id="intro-title" className="!mb-6">{t.introTitle}</SectionTitle>
            {t.introText.map((p) => (
              <p key={p} className="mb-4 max-w-xl text-[1.0625rem] lg:text-lg">
                {p}
              </p>
            ))}
            <p className="mt-8 flex items-center gap-3 font-serif text-lg">
              <Leaf className="text-olive" /> {t.introNote}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:relative lg:block lg:h-[520px]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-photo)] border-[5px] border-paper lg:absolute lg:left-0 lg:top-0 lg:aspect-auto lg:h-[420px] lg:w-[54%]">
              <Image src={introA.src} alt={introA.alt[locale]} fill sizes="(min-width: 1024px) 340px, 50vw" quality={75} className="object-cover" />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-photo)] border-[5px] border-paper lg:absolute lg:bottom-0 lg:right-0 lg:aspect-auto lg:h-[400px] lg:w-[54%]">
              <Image src={introB.src} alt={introB.alt[locale]} fill sizes="(min-width: 1024px) 340px, 50vw" quality={75} className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Разгледайте къщата ---------- */}
      <section className="section-y" aria-labelledby="preview-title">
        <div className="container-site">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 lg:mb-10">
            <div>
              <span className="rule-short mb-5" aria-hidden="true" />
              <h2 id="preview-title" className="h-section">{t.previewTitle}</h2>
              <p className="mt-2 text-ink-soft">{t.previewText}</p>
            </div>
            <Link href={href(locale, "gallery")} className="btn btn-secondary">
              {d.cta.allPhotos} <ArrowRight />
            </Link>
          </div>
          <PhotoPreview locale={locale} ids={homePreviewIds} />
        </div>
      </section>

      {/* ---------- Какво ви очаква ---------- */}
      <section className="border-t border-line/70 bg-paper section-y" aria-labelledby="expect-title">
        <div className="container-site">
          <SectionTitle id="expect-title">{t.houseTitle}</SectionTitle>
          <ul className="grid gap-8 md:grid-cols-3 md:gap-10">
            {t.houseCards.map((c, i) => {
              const Icon = [Bed, House, Leaf][i];
              return (
                <li key={c.title}>
                  <Icon width={28} height={28} className="mb-3 text-olive" />
                  <h3 className="mb-2 text-2xl">{c.title}</h3>
                  <p className="text-ink-soft">{c.text}</p>
                </li>
              );
            })}
          </ul>
          <Link href={href(locale, "house")} className="link mt-10 inline-flex min-h-11 items-center gap-2">
            {t.houseLink} <ArrowRight />
          </Link>
        </div>
      </section>

      {/* ---------- Районът + оценка ---------- */}
      <section className="section-y" aria-labelledby="area-title">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionTitle id="area-title" className="!mb-5">{t.areaTitle}</SectionTitle>
            <p className="max-w-xl text-lg">{t.areaText}</p>
            <Link href={href(locale, "area")} className="link mt-6 inline-flex min-h-11 items-center gap-2">
              {t.areaLink} <ArrowRight />
            </Link>
          </div>
          {site.bookingRating.show && (
            <div className="self-start rounded-2xl border border-line bg-paper p-6 lg:p-8">
              <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.08em] text-olive">{t.ratingTitle}</h2>
              <p className="mt-3 font-serif text-5xl">
                {locale === "bg" ? site.bookingRating.score : site.bookingRating.scoreEn}
                <span className="text-2xl text-ink-soft"> / 10</span>
              </p>
              <p className="mt-3 text-ink-soft">
                {t.ratingText(
                  site.bookingRating.reviews,
                  formatDate(site.bookingRating.checkedOn, locale),
                )}
              </p>
              <ExternalLink href={site.links.booking} srLabel={d.a11y.opensExternal} className="link mt-4 inline-flex min-h-11 items-center gap-1.5">
                {t.ratingLink} <External />
              </ExternalLink>
            </div>
          )}
        </div>
      </section>

      {/* ---------- Дати ---------- */}
      <section className="bg-sand" aria-labelledby="dates-title">
        <div className="container-site section-y flex flex-col gap-8 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
          <div className="lg:max-w-[46rem] lg:flex-1">
            <SectionTitle id="dates-title" className="!mb-5">{t.enquiryTitle}</SectionTitle>
            <p className="max-w-2xl text-lg">{t.enquiryText}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href={href(locale, "enquiry", "zapitvane-forma")} className="btn btn-primary">
              {d.cta.enquire} <ArrowRight />
            </Link>
            <a href={site.contact.phoneHref} className="btn btn-secondary whitespace-nowrap">
              <Phone /> {site.contact.phoneDisplay.value}
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Въпроси ---------- */}
      <section className="section-y" aria-labelledby="faq-title">
        <div className="container-site">
          <div className="max-w-3xl">
          <SectionTitle id="faq-title">{t.faqTitle}</SectionTitle>
          <FaqList locale={locale} />
          </div>
        </div>
      </section>

      {/* ---------- Контакти ---------- */}
      <section className="pb-16 lg:pb-24" aria-labelledby="contact-title">
        <div className="container-site">
          <SectionTitle id="contact-title" className="!mb-4">{t.contactTitle}</SectionTitle>
          <p className="mb-8 text-lg text-ink-soft">{t.contactText}</p>
          <ContactBlock locale={locale} />
        </div>
      </section>
    </>
  );
}
