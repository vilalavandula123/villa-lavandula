import Link from "next/link";
import Gallery from "@/components/Gallery";
import { ArrowRight } from "@/components/Icons";
import { PageIntro } from "@/components/ui";
import { getDictionary } from "@/lib/i18n";
import { href, type Locale } from "@/lib/routes";

export default function GalleryView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  return (
    <>
      <PageIntro title={d.galleryPage.title} lead={d.galleryPage.lead} />
      <section className="container-site section-y !pt-8">
        <Gallery locale={locale} />
        <div className="mt-14 flex justify-center">
          <Link href={href(locale, "enquiry", "zapitvane-forma")} className="btn btn-primary">
            {d.cta.enquire} <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
