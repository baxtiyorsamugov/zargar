import "../globals.css";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { alternates, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: "%s — SOFIZAR" },
    description: t.meta.description,
    alternates: alternates(locale, ""),
    openGraph: { siteName: "SOFIZAR", locale, type: "website" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Params & { children: React.ReactNode }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <html lang={locale}>
      <head>
        <link rel="preload" href="/fonts/gilroy-regular.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/gilroy-black.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <Header locale={locale} t={t} />
        <main>{children}</main>
        <Footer locale={locale} t={t} />
      </body>
    </html>
  );
}
