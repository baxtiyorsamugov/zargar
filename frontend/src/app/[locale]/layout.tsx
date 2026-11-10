import "@fontsource-variable/manrope";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "../globals.css";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
      <body>
        <Header locale={locale} t={t} />
        <main>{children}</main>
        <footer className="footer" id="contacts">
          <div className="wrap">
            <span>
              © {new Date().getFullYear()} SOFIZAR. {t.footer.rights}
            </span>
            <span>Tashkent</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
