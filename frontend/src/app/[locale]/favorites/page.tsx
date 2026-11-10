import type { Metadata } from "next";
import { notFound } from "next/navigation";

import FavoritesView from "@/components/FavoritesView";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PRIVATE_PAGE } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).favorites.title, ...PRIVATE_PAGE };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <h1>{t.favorites.title}</h1>
        </div>
        <FavoritesView locale={locale} t={t} />
      </div>
    </section>
  );
}
