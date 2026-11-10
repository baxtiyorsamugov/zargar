import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";
import { getCategories, getProducts } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

/** Все языковые версии страницы с взаимными hreflang-ссылками. */
function entry(path: string, priority: number): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`]));
  return locales.map((l) => ({
    url: `${SITE_URL}/${l}${path}`,
    alternates: { languages },
    changeFrequency: "daily",
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [...entry("", 1), ...entry("/catalog", 0.9)];

  const categories = await getCategories("ru");
  for (const c of categories ?? []) urls.push(...entry(`/catalog/${c.slug}`, 0.8));

  // Обходим все страницы каталога
  for (let page = 1; page < 500; page++) {
    const res = await getProducts("ru", { page: String(page) });
    if (!res) break;
    for (const p of res.results) urls.push(...entry(`/product/${p.slug}`, 0.7));
    if (!res.next) break;
  }
  return urls;
}
