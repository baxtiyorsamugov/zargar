"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { ProductListItem } from "@/lib/api";
import { api } from "@/lib/client";
import { useFavorites } from "@/lib/stores";

import ProductCard from "./ProductCard";

export default function FavoritesView({ locale, t }: { locale: Locale; t: Dictionary }) {
  const slugs = useFavorites();
  const [products, setProducts] = useState<ProductListItem[] | null>(null);
  const key = slugs.join(",");

  useEffect(() => {
    if (!key) {
      setProducts([]);
      return;
    }
    api<{ results: ProductListItem[] }>(`/products/?slugs=${encodeURIComponent(key)}`, { locale }).then(
      (r) => {
        if (!r.ok) return setProducts([]);
        // порядок — как добавляли в избранное
        const order = key.split(",");
        setProducts([...r.data.results].sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug)));
      },
    );
  }, [key, locale]);

  if (products === null) return <p className="empty">{t.cart.loading}</p>;
  if (!products.length) {
    return (
      <div className="empty-state">
        <p className="empty">{t.favorites.empty}</p>
        <Link href={`/${locale}/catalog`} className="btn">
          {t.cart.goCatalog}
        </Link>
      </div>
    );
  }
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} locale={locale} t={t} />
      ))}
    </div>
  );
}
