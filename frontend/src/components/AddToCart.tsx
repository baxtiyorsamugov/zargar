"use client";

import Link from "next/link";
import { useState } from "react";

import type { Dictionary } from "@/i18n/dictionaries";
import type { Variant } from "@/lib/api";
import { formatPrice } from "@/lib/seo";
import { addToCart, toggleFavorite, useFavorites } from "@/lib/stores";
import type { Locale } from "@/i18n/config";

type Props = {
  locale: Locale;
  slug: string;
  variants: Variant[];
  t: Pick<Dictionary, "product" | "currency">;
};

export default function AddToCart({ locale, slug, variants, t }: Props) {
  const sized = variants.filter((v) => v.size);
  const firstAvailable = variants.find((v) => v.in_stock);
  // Без размеров — единственный вариант выбран сразу
  const [selected, setSelected] = useState<Variant | undefined>(
    sized.length ? undefined : firstAvailable,
  );
  const [added, setAdded] = useState(false);
  const [hint, setHint] = useState(false);
  const favorites = useFavorites();
  const isFavorite = favorites.includes(slug);

  function onAdd() {
    if (!selected) {
      setHint(true);
      return;
    }
    addToCart(selected.id);
    setAdded(true);
  }

  return (
    <div className="buy">
      {sized.length > 0 && (
        <>
          <div className="meta">
            {t.product.size}
            {selected && sized.length > 1 && ` · ${formatPrice(selected.price, locale, t.currency)}`}
          </div>
          <div className="sizes" role="radiogroup" aria-label={t.product.size}>
            {sized.map((v) => (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={selected?.id === v.id}
                className={`size${v.in_stock ? "" : " off"}${selected?.id === v.id ? " on" : ""}`}
                disabled={!v.in_stock}
                onClick={() => {
                  setSelected(v);
                  setHint(false);
                  setAdded(false);
                }}
              >
                {v.size}
              </button>
            ))}
          </div>
        </>
      )}
      <div className="buy-row">
        <button className="btn" type="button" disabled={!firstAvailable} onClick={onAdd}>
          {t.product.addToCart}
        </button>
        <button
          type="button"
          className={`btn-ghost${isFavorite ? " on" : ""}`}
          aria-pressed={isFavorite}
          onClick={() => toggleFavorite(slug)}
        >
          {isFavorite ? "♥ " + t.product.inFavorites : "♡ " + t.product.addToFavorites}
        </button>
      </div>
      <p className="note" aria-live="polite">
        {hint && t.product.chooseSize}
        {added && (
          <>
            {t.product.added} · <Link href={`/${locale}/cart`}>{t.product.goToCart} →</Link>
          </>
        )}
      </p>
    </div>
  );
}
