"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";
import { fmt, type Dictionary } from "@/i18n/dictionaries";
import { mediaPath } from "@/lib/api";
import { api } from "@/lib/client";
import { formatPrice } from "@/lib/seo";
import { MAX_QTY, removeFromCart, setQuantity, useCart, type CartItem } from "@/lib/stores";

export type CartLine = {
  variant_id: number;
  quantity: number;
  error: "not_found" | "out_of_stock" | "not_enough" | null;
  line_total: string;
  product: null | {
    slug: string;
    name: string;
    sku: string;
    size: string;
    price: string;
    stock: number;
    image: { url: string; alt: string } | null;
  };
};
export type CartQuote = { lines: CartLine[]; total: string; is_valid: boolean };

/** Актуальные цены и наличие от сервера для позиций из localStorage. */
export function useCartQuote(locale: Locale, items: CartItem[]) {
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const key = JSON.stringify(items);

  useEffect(() => {
    let cancelled = false;
    const parsed = JSON.parse(key) as CartItem[];
    if (!parsed.length) {
      setQuote({ lines: [], total: "0", is_valid: false });
      return;
    }
    api<CartQuote>("/cart/", { method: "POST", body: { items: parsed }, locale }).then((r) => {
      if (!cancelled && r.ok) setQuote(r.data);
    });
    return () => {
      cancelled = true;
    };
  }, [key, locale]);

  return quote;
}

type T = Pick<Dictionary, "cart" | "currency">;

export function CartLines({ quote, locale, t, editable }: { quote: CartQuote; locale: Locale; t: T; editable: boolean }) {
  return (
    <ul className="lines">
      {quote.lines.map((ln) => {
        const p = ln.product;
        return (
          <li key={ln.variant_id} className={`line${ln.error ? " bad" : ""}`}>
            <div className="thumb">
              {p?.image ? (
                <Image src={mediaPath(p.image.url)} alt={p.image.alt || p.name} fill sizes="72px" />
              ) : (
                <span className="placeholder" aria-hidden>
                  SZ
                </span>
              )}
            </div>
            <div className="info">
              {p ? <Link href={`/${locale}/product/${p.slug}`}>{p.name}</Link> : <span>—</span>}
              <div className="meta">
                {p?.size && `${t.cart.size} ${p.size} · `}
                {p && formatPrice(p.price, locale, t.currency)}
              </div>
              {ln.error && (
                <div className="err">{fmt(t.cart.errors[ln.error], { stock: p?.stock ?? 0 })}</div>
              )}
            </div>
            {editable ? (
              <div className="qty">
                <button type="button" aria-label="−" onClick={() => setQuantity(ln.variant_id, ln.quantity - 1)}>
                  −
                </button>
                <span>{ln.quantity}</span>
                <button
                  type="button"
                  aria-label="+"
                  disabled={ln.quantity >= Math.min(MAX_QTY, p?.stock ?? 0)}
                  onClick={() => setQuantity(ln.variant_id, ln.quantity + 1)}
                >
                  +
                </button>
              </div>
            ) : (
              <span className="meta">× {ln.quantity}</span>
            )}
            <div className="sum">{formatPrice(ln.line_total, locale, t.currency)}</div>
            {editable && (
              <button type="button" className="link" onClick={() => removeFromCart(ln.variant_id)}>
                {t.cart.remove}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function CartView({ locale, t }: { locale: Locale; t: T }) {
  const items = useCart();
  const quote = useCartQuote(locale, items);

  if (!items.length) {
    return (
      <div className="empty-state">
        <p className="empty">{t.cart.empty}</p>
        <Link href={`/${locale}/catalog`} className="btn">
          {t.cart.goCatalog}
        </Link>
      </div>
    );
  }
  if (!quote) return <p className="empty">{t.cart.loading}</p>;

  return (
    <div className="cart">
      <CartLines quote={quote} locale={locale} t={t} editable />
      <div className="cart-total">
        <span>{t.cart.total}</span>
        <strong>{formatPrice(quote.total, locale, t.currency)}</strong>
      </div>
      {!quote.is_valid && <p className="err">{t.cart.fixCart}</p>}
      <div className="right">
        {quote.is_valid ? (
          <Link href={`/${locale}/checkout`} className="btn">
            {t.cart.checkout}
          </Link>
        ) : (
          <button className="btn" disabled>
            {t.cart.checkout}
          </button>
        )}
      </div>
    </div>
  );
}
