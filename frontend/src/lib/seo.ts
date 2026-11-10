import type { Metadata } from "next";

import { locales, type Locale } from "@/i18n/config";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

/** canonical + hreflang для страницы, путь без префикса языка: "/catalog" */
export function alternates(locale: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${SITE_URL}/${l}${path}`;
  languages["x-default"] = `${SITE_URL}/ru${path}`;
  return { canonical: `${SITE_URL}/${locale}${path}`, languages };
}

export function formatPrice(value: string | null, locale: Locale, currency: string): string {
  if (value == null) return "";
  const n = Math.round(Number(value));
  const tag = locale === "en" ? "en-US" : "ru-RU";
  return `${new Intl.NumberFormat(tag).format(n)} ${currency}`;
}

/** «от 1 000 сум» / «1 000 so'mdan» / «from 1,000 UZS» */
export function formatPriceFrom(
  value: string | null,
  locale: Locale,
  t: { currency: string; product: { from: string } },
): string {
  const price = formatPrice(value, locale, t.currency);
  if (!price) return "";
  return locale === "uz" ? `${price}${t.product.from}` : `${t.product.from} ${price}`;
}

/** Личные страницы (корзина, кабинет…) не индексируются. */
export const PRIVATE_PAGE = { robots: { index: false, follow: false } } as const;
