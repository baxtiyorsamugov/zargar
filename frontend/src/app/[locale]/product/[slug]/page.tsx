import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getProduct, mediaPath, type ProductDetail } from "@/lib/api";
import { alternates, formatPrice, formatPriceFrom, SITE_URL } from "@/lib/seo";

export const revalidate = 300; // ISR, как REVALIDATE_SECONDS в lib/api

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const p = await getProduct(locale, slug);
  if (!p) return {};
  const image = p.images[0] ? mediaPath(p.images[0].image) : undefined;
  return {
    title: p.seo_title || p.name,
    description: p.seo_description || p.description.slice(0, 160),
    alternates: alternates(locale, `/product/${p.slug}`),
    openGraph: { title: p.name, images: image ? [image] : undefined },
  };
}

/** Schema.org Product — расширенный сниппет с ценой и наличием в выдаче. */
function productJsonLd(p: ProductDetail, url: string) {
  const prices = p.variants.map((v) => Number(v.price));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    description: p.description,
    brand: { "@type": "Brand", name: "SOFIZAR" },
    image: p.images.map((i) => `${SITE_URL}${mediaPath(i.image)}`),
    material: p.metal,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "UZS",
      lowPrice: prices.length ? Math.min(...prices) : undefined,
      highPrice: prices.length ? Math.max(...prices) : undefined,
      offerCount: p.variants.length,
      availability: p.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const p = await getProduct(locale, slug);
  if (!p) notFound();

  const url = `${SITE_URL}/${locale}/product/${p.slug}`;
  const sized = p.variants.filter((v) => v.size);
  const weight = p.variants.find((v) => v.weight)?.weight;

  return (
    <div className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(p, url)) }}
      />
      <div className="pdp">
        <div className="card">
          <div className="ph">
            {p.images[0] ? (
              <Image
                src={mediaPath(p.images[0].image)}
                alt={p.images[0].alt || p.name}
                fill
                sizes="(max-width: 820px) 100vw, 55vw"
                priority
              />
            ) : (
              <span className="placeholder" aria-hidden>
                SOFIZAR
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="crumbs">
            <Link href={`/${locale}/catalog`}>{t.catalog.title}</Link> /{" "}
            <Link href={`/${locale}/catalog/${p.category.slug}`}>{p.category.name}</Link>
          </div>
          <h1>{p.name}</h1>
          <div className="price">
            {sized.length > 1
              ? formatPriceFrom(p.price_from, locale, t)
              : formatPrice(p.price_from, locale, t.currency)}
            {p.old_price_from && <s>{formatPrice(p.old_price_from, locale, t.currency)}</s>}
          </div>
          <p className="meta">{p.in_stock ? t.product.inStock : t.product.outOfStock}</p>

          {sized.length > 0 && (
            <>
              <div className="meta">{t.product.size}</div>
              <div className="sizes">
                {sized.map((v) => (
                  <span key={v.id} className={`size${v.in_stock ? "" : " off"}`}>
                    {v.size}
                  </span>
                ))}
              </div>
            </>
          )}

          <button className="btn" disabled={!p.in_stock}>
            {t.product.addToCart}
          </button>

          <dl className="specs">
            <dt>{t.product.metal}</dt>
            <dd>{t.metal[p.metal] ?? p.metal}</dd>
            {p.purity && (
              <>
                <dt>{t.product.purity}</dt>
                <dd>{p.purity}</dd>
              </>
            )}
            {weight && (
              <>
                <dt>{t.product.weight}</dt>
                <dd>
                  {weight} {t.product.gram}
                </dd>
              </>
            )}
            {p.inserts.length > 0 && (
              <>
                <dt>{t.product.inserts}</dt>
                <dd>{p.inserts.map((i) => `${i.stone} × ${i.count}`).join(", ")}</dd>
              </>
            )}
          </dl>
          {p.description && <p className="desc">{p.description}</p>}
        </div>
      </div>
    </div>
  );
}
