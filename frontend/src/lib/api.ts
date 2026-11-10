import type { Locale } from "@/i18n/config";

// Адрес Django API для запросов с сервера Next.js
const API_URL = process.env.API_URL ?? "http://localhost:8000";

// ISR: страницы каталога пересобираются не чаще раза в 5 минут
export const REVALIDATE_SECONDS = 300;

export type ProductImage = { url: string; alt: string };

export type ProductListItem = {
  slug: string;
  sku: string;
  name: string;
  category: string;
  metal: string;
  metal_color: string;
  purity: number | null;
  is_new: boolean;
  price_from: string | null;
  old_price_from: string | null;
  in_stock: boolean;
  image: ProductImage | null;
};

export type Category = {
  slug: string;
  name: string;
  parent: string | null;
  description: string;
  image: string | null;
  seo_title: string;
  seo_description: string;
};

export type Variant = {
  id: number;
  sku: string;
  size: string;
  weight: string | null;
  price: string;
  old_price: string | null;
  in_stock: boolean;
};

export type ProductDetail = Omit<ProductListItem, "category"> & {
  category: Category;
  gender: string;
  description: string;
  care: string;
  video_url: string;
  variants: Variant[];
  inserts: { stone: string; count: number; carat: string | null }[];
  images: { image: string; alt: string }[];
  seo_title: string;
  seo_description: string;
};

type Page<T> = { count: number; next: string | null; previous: string | null; results: T[] };

/**
 * GET к API. При недоступном API возвращает null — страница рендерится без данных,
 * а не падает (важно для сборки в CI, где бэкенда нет).
 */
async function get<T>(path: string, locale: Locale): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1${path}`, {
      headers: { "Accept-Language": locale },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getProducts(locale: Locale, params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  return get<Page<ProductListItem>>(`/products/${qs ? `?${qs}` : ""}`, locale);
}

export async function getProduct(locale: Locale, slug: string) {
  return get<ProductDetail>(`/products/${encodeURIComponent(slug)}/`, locale);
}

export async function getCategories(locale: Locale) {
  return get<Category[]>("/categories/", locale);
}

/** Медиа отдаём через свой домен (/media → rewrite на бэкенд), а не по адресу из API. */
export function mediaPath(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}
