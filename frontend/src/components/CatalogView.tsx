import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProductCard from "@/components/ProductCard";
import { isLocale, type Locale } from "@/i18n/config";
import { fmt, getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { getCategories, getProducts } from "@/lib/api";
import { alternates } from "@/lib/seo";

export type CatalogProps = {
  params: Promise<{ locale: string; category?: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// Разрешённые фильтры, которые прокидываем в API
const FILTERS = [
  "collection",
  "metal",
  "metal_color",
  "stone",
  "price_min",
  "price_max",
  "in_stock",
  "ordering",
  "page",
  "search",
] as const;
const SORTS = ["", "-created_at", "price_from", "-price_from"] as const;

function readQuery(sp: Record<string, string | string[] | undefined>) {
  const query: Record<string, string> = {};
  for (const key of FILTERS) {
    const v = sp[key];
    if (typeof v === "string" && v.trim()) query[key] = v.trim().slice(0, 100);
  }
  return query;
}

export async function catalogMetadata({ params, searchParams }: CatalogProps): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  const query = readQuery(await searchParams);
  const cat = category
    ? (await getCategories(locale))?.find((c) => c.slug === category)
    : undefined;
  const path = cat ? `/catalog/${cat.slug}` : "/catalog";
  // Страницы с фильтрами и поиском — дубли категории: не индексируем, но ссылки обходим
  const filtered = Object.keys(query).some((k) => k !== "page");
  return {
    title: query.search
      ? fmt(t.catalog.searchTitle, { q: query.search })
      : cat?.seo_title || cat?.name || t.catalog.title,
    description: cat?.seo_description || t.meta.description,
    alternates: alternates(locale, path),
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

export async function CatalogView({ params, searchParams }: CatalogProps) {
  const { locale, category } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const query = readQuery(await searchParams);

  const [products, categories] = await Promise.all([
    getProducts(locale, category ? { ...query, category } : query),
    getCategories(locale),
  ]);
  const top = (categories ?? []).filter((c) => !c.parent);
  const current = categories?.find((c) => c.slug === category);
  if (category && categories && !current) notFound();

  const base = `/${locale}/catalog${category ? `/${category}` : ""}`;
  const page = Number(query.page) || 1;
  const pageHref = (n: number) => {
    const q = new URLSearchParams({ ...query, page: String(n) });
    if (n === 1) q.delete("page");
    const s = q.toString();
    return s ? `${base}?${s}` : base;
  };
  const hasFilters = Object.keys(query).some((k) => k !== "page");

  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <h1>
            {query.search
              ? fmt(t.catalog.searchTitle, { q: query.search })
              : (current?.name ?? t.catalog.title)}
          </h1>
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
              aria-current={category === c.slug || current?.parent === c.slug}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <Filters action={base} query={query} t={t} locale={locale} hasFilters={hasFilters} />

        {products?.results.length ? (
          <>
            <div className="grid">
              {products.results.map((p, i) => (
                <ProductCard key={p.slug} product={p} locale={locale} t={t} priority={i < 4} />
              ))}
            </div>
            {(products.previous || products.next) && (
              <nav className="pager">
                {products.previous ? <Link href={pageHref(page - 1)}>{t.catalog.prev}</Link> : <span />}
                <span className="meta">{page}</span>
                {products.next ? <Link href={pageHref(page + 1)}>{t.catalog.next}</Link> : <span />}
              </nav>
            )}
          </>
        ) : (
          <p className="empty">{hasFilters ? t.catalog.nothingFound : t.catalog.empty}</p>
        )}
      </div>
    </section>
  );
}

/** Фильтры — обычная GET-форма: работает без JavaScript, адрес можно скопировать. */
function Filters({
  action,
  query,
  t,
  locale,
  hasFilters,
}: {
  action: string;
  query: Record<string, string>;
  t: Dictionary;
  locale: Locale;
  hasFilters: boolean;
}) {
  const c = t.catalog;
  const sortLabel: Record<(typeof SORTS)[number], string> = {
    "": c.sortDefault,
    "-created_at": c.sortNew,
    price_from: c.sortPriceAsc,
    "-price_from": c.sortPriceDesc,
  };
  return (
    <form action={action} className="filters" key={JSON.stringify(query)}>
      {query.search && <input type="hidden" name="search" value={query.search} />}
      <label>
        <span>{c.metal}</span>
        <select name="metal" defaultValue={query.metal ?? ""}>
          <option value="">{c.any}</option>
          {Object.entries(t.metal).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>{c.priceFrom}</span>
        <input name="price_min" inputMode="numeric" defaultValue={query.price_min} placeholder="0" />
      </label>
      <label>
        <span>{c.priceTo}</span>
        <input name="price_max" inputMode="numeric" defaultValue={query.price_max} placeholder="∞" />
      </label>
      <label>
        <span>{c.sort}</span>
        <select name="ordering" defaultValue={query.ordering ?? ""}>
          {SORTS.map((s) => (
            <option key={s} value={s}>
              {sortLabel[s]}
            </option>
          ))}
        </select>
      </label>
      <label className="check">
        <input type="checkbox" name="in_stock" value="true" defaultChecked={query.in_stock === "true"} />
        <span>{c.inStockOnly}</span>
      </label>
      <button className="btn small">{c.apply}</button>
      {hasFilters && (
        <Link href={action} className="link" hrefLang={locale}>
          {c.reset}
        </Link>
      )}
    </form>
  );
}
