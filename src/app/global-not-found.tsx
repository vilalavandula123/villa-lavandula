import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 · Вила Лавандула",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="bg">
      <body className="flex min-h-dvh items-center justify-center bg-cream p-6">
        <main className="max-w-lg text-center">
          <p className="font-serif text-6xl text-lavender">404</p>
          <h1 className="mt-4 text-3xl">Страницата не е намерена</h1>
          <p className="mt-2 text-ink-soft">Адресът може да е грешен или страницата да е преместена.</p>
          <p lang="en" className="mt-6 text-ink-soft">Page not found. The address may be wrong or the page may have moved.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/bg" className="btn btn-primary">Към началото</Link>
            <Link href="/en" lang="en" className="btn btn-secondary">English home</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
