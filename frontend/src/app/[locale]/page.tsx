import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Icon, { type IconName } from "@/components/Icon";
import ProductCard from "@/components/ProductCard";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCategories, getProducts } from "@/lib/api";

export const revalidate = 300; // ISR, как REVALIDATE_SECONDS в lib/api

// Фото категорий для главной (позже — из админки, поле Category.image)
const CATEGORY_PHOTOS: Record<string, string> = {
  rings: "/img/category-rings.webp",
  earrings: "/img/category-earrings.webp",
  pendants: "/img/category-necklaces.webp",
};
const BENEFIT_ICONS: IconName[] = ["gem", "shield", "truck", "gift", "card"];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const home = `/${locale}`;

  const [products, all, categories] = await Promise.all([
    getProducts(locale, { is_new: "true" }),
    getProducts(locale),
    getCategories(locale),
  ]);
  const fresh = products?.results ?? [];
  const items = (fresh.length >= 4 ? fresh : [...fresh, ...(all?.results ?? []).filter((p) => !p.is_new)]).slice(0, 4);
  const counts = new Map<string, number>();
  for (const p of all?.results ?? []) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  const cats = (categories ?? []).filter((c) => CATEGORY_PHOTOS[c.slug]);

  return (
    <>
      <section className="wrap hero">
        <div className="hero-banner">
          <Image src="/img/hero-uzbek.webp" alt="" fill priority sizes="(max-width: 1400px) 100vw, 1400px" />
          <div className="hero-copy">
            <span className="kicker">{t.ui.kicker}</span>
            <h1>{t.ui.heroTitle}</h1>
            <p>{t.ui.heroText}</p>
            <div className="hero-actions">
              <Link href={`${home}/catalog`} className="btn">
                {t.home.heroCta}
              </Link>
              <Link href={`${home}#contacts`} className="btn btn-light">
                {t.ui.findStore}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {cats.length > 0 && (
        <section className="wrap section">
          <div className="section-head">
            <h2>{t.ui.popularCats}</h2>
            <Link className="link-more" href={`${home}/catalog`}>
              {t.ui.viewAll}
            </Link>
          </div>
          <div className="cats">
            {cats.map((c) => (
              <Link key={c.slug} className="cat" href={`${home}/catalog/${c.slug}`}>
                <Image src={CATEGORY_PHOTOS[c.slug]} alt="" fill sizes="(max-width: 760px) 72vw, 33vw" />
                <span className="cat-label">
                  <span>
                    <b>{c.name}</b>
                    <small>
                      {counts.get(c.slug) ?? 0} {t.ui.items}
                    </small>
                  </span>
                  <span className="cat-go">
                    <Icon name="arrow" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="wrap section">
        <div className="section-head">
          <h2>{t.home.newTitle}</h2>
          <Link className="link-more" href={`${home}/catalog?is_new=true`}>
            {t.ui.viewAll}
          </Link>
        </div>
        {items.length ? (
          <div className="grid">
            {items.map((p, i) => (
              <ProductCard key={p.slug} product={p} locale={locale} t={t} priority={i < 2} />
            ))}
          </div>
        ) : (
          <p className="empty">{t.catalog.empty}</p>
        )}
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2>{t.ui.collections}</h2>
        </div>
        <div className="collection">
          <Image src="/img/campaign-hands.webp" alt="" fill sizes="(max-width: 1400px) 100vw, 1400px" />
          <div className="collection-copy">
            <h3>{t.ui.collTitle}</h3>
            <p>{t.ui.collText}</p>
            <Link href={`${home}/catalog`} className="btn">
              {t.ui.collCta}
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap section" id="benefits">
        <div className="benefits">
          {t.ui.benefits.map(([title, sub], i) => (
            <div className="benefit" key={title}>
              <span className="benefit-ico">
                <Icon name={BENEFIT_ICONS[i]} />
              </span>
              <span>
                <b>{title}</b>
                <small>{sub}</small>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap section" id="factory">
        <div className="factory">
          <div className="factory-copy">
            <h2>{t.ui.factoryTitle}</h2>
            <p>{t.ui.factoryText}</p>
            <div className="stats">
              {t.ui.stats.map(([n, label]) => (
                <div key={label}>
                  <b>{n}</b>
                  <small>{label}</small>
                </div>
              ))}
            </div>
          </div>
          <div className="factory-img">
            <Image src="/img/atelier.webp" alt="" fill sizes="(max-width: 860px) 100vw, 45vw" />
          </div>
        </div>
      </section>
    </>
  );
}
