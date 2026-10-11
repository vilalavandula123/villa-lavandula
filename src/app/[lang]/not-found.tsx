import Link from "next/link";
import bg from "@/content/i18n/bg";

// Показва се при notFound() вътре в езиков раздел. Съдържанието е двуезично, защото параметърът не е достъпен тук.
export default function NotFound() {
  return (
    <div className="container-site py-24 text-center">
      <p className="font-serif text-6xl text-lavender">404</p>
      <h1 className="mt-4 text-3xl">{bg.notFound.title}</h1>
      <p className="mt-2 text-ink-soft">{bg.notFound.text}</p>
      <p lang="en" className="mt-4 text-ink-soft">Page not found.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/bg" className="btn btn-primary">{bg.notFound.back}</Link>
        <Link href="/en" lang="en" className="btn btn-secondary">English home</Link>
      </div>
    </div>
  );
}
