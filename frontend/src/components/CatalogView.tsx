import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProductCard from "@/components/ProductCard";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCategories, getProducts } from "@/lib/api";
import { alternates } from "@/lib/seo";

export type CatalogProps = {
  params: Promise<{ locale: string; category?: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// Разрешённые фильтры, которые прокидываем в API
const FILTERS = ["collection", "metal", "metal_color", "stone", "price_min", "price_max", "ordering", "page", "search"];

export async function catalogMetadata({ params }: CatalogProps): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  const cat = category
    ? (await getCategories(locale))?.find((c) => c.slug === category)
    : undefined;
  const path = cat ? `/catalog/${cat.slug}` : "/catalog";
  return {
    title: cat?.seo_title || cat?.name || t.catalog.title,
    description: cat?.seo_description || t.meta.description,
    alternates: alternates(locale, path),
  };
}

export async function CatalogView({ params, searchParams }: CatalogProps) {
  const { locale, category } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const sp = await searchParams;

  const query: Record<string, string> = {};
  for (const key of FILTERS) {
    const v = sp[key];
    if (typeof v === "string" && v) query[key] = v;
  }
  if (category) query.category = category;

  const [products, categories] = await Promise.all([
    getProducts(locale, query),
    getCategories(locale),
  ]);
  const top = (categories ?? []).filter((c) => !c.parent);
  const current = categories?.find((c) => c.slug === category);
  if (category && categories && !current) notFound();

  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <h1>{current?.name ?? t.catalog.title}</h1>
          {products && <span className="meta">{products.count}</span>}
        </div>
        <nav className="chips">
          <Link className="chip" href={`/${locale}/catalog`} aria-current={!category}>
            {t.catalog.all}
          </Link>
          {top.map((c) => (
            <Link
              key={c.slug}
              className="chip"
              href={`/${locale}/catalog/${c.slug}`}
              aria-current={category === c.slug}
            >
              {c.name}
            </Link>
          ))}
        </nav>
        {products?.results.length ? (
          <div className="grid">
            {products.results.map((p, i) => (
              <ProductCard key={p.slug} product={p} locale={locale} t={t} priority={i < 4} />
            ))}
          </div>
        ) : (
          <p className="empty">{t.catalog.empty}</p>
        )}
      </div>
    </section>
  );
}
