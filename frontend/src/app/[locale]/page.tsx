import Link from "next/link";
import { notFound } from "next/navigation";

import ProductCard from "@/components/ProductCard";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCategories, getProducts } from "@/lib/api";

export const revalidate = 300; // ISR, как REVALIDATE_SECONDS в lib/api

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const [products, categories] = await Promise.all([
    getProducts(locale, { is_new: "true" }),
    getCategories(locale),
  ]);
  const items = products?.results.slice(0, 8) ?? [];
  const topCategories = (categories ?? []).filter((c) => !c.parent);

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1>{t.home.heroTitle}</h1>
          <p>{t.home.heroText}</p>
          <Link href={`/${locale}/catalog`} className="btn">
            {t.home.heroCta}
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>{t.home.newTitle}</h2>
            <Link href={`/${locale}/catalog`}>{t.nav.catalog} →</Link>
          </div>
          {items.length ? (
            <div className="grid">
              {items.map((p, i) => (
                <ProductCard key={p.slug} product={p} locale={locale} t={t} priority={i < 4} />
              ))}
            </div>
          ) : (
            <p className="empty">{t.catalog.empty}</p>
          )}
        </div>
      </section>

      {topCategories.length > 0 && (
        <section className="section" id="about">
          <div className="wrap">
            <div className="section-head">
              <h2>{t.home.categoriesTitle}</h2>
            </div>
            <div className="chips">
              {topCategories.map((c) => (
                <Link key={c.slug} className="chip" href={`/${locale}/catalog/${c.slug}`}>
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
