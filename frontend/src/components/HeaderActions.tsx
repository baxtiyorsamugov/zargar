"use client";

import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { cartCount, useCart, useFavorites } from "@/lib/stores";

type Props = {
  locale: Locale;
  t: { cart: string; account: string; favorites: string };
};

export default function HeaderActions({ locale, t }: Props) {
  const count = cartCount(useCart());
  const favorites = useFavorites().length;

  return (
    <div className="actions">
      <Link href={`/${locale}/favorites`} aria-label={t.favorites} title={t.favorites}>
        ♡{favorites > 0 && <span className="count">{favorites}</span>}
      </Link>
      <Link href={`/${locale}/account`}>{t.account}</Link>
      <Link href={`/${locale}/cart`}>
        {t.cart}
        {count > 0 && <span className="count">{count}</span>}
      </Link>
    </div>
  );
}
