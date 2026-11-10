import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // До запуска (этап 07) staging закрыт от индексации переменной окружения
  if (process.env.NEXT_PUBLIC_NOINDEX === "true") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/*?*ordering="] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
