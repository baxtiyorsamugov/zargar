import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { mediaPath, type ProductListItem } from "@/lib/api";
import { formatPrice, formatPriceFrom } from "@/lib/seo";

type Props = { product: ProductListItem; locale: Locale; t: Dictionary; priority?: boolean };

export default function ProductCard({ product: p, locale, t, priority }: Props) {
  const off =
    p.old_price_from && p.price_from
      ? Math.round((1 - Number(p.price_from) / Number(p.old_price_from)) * 100)
      : 0;
  const color = t.ui.color[p.metal_color];
  return (
    <Link href={`/${locale}/product/${p.slug}`} className="card">
      <div className={`ph metal-${p.metal === "silver" ? "silver" : p.metal_color}`}>
        {p.image ? (
          <Image
            src={mediaPath(p.image.url)}
            alt={p.image.alt || p.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 960px) 33vw, 25vw"
            priority={priority}
          />
        ) : (
          <span className="placeholder" aria-hidden>
            SZ
          </span>
        )}
        {off > 0 ? (
          <span className="badge sale">−{off}%</span>
        ) : (
          p.is_new && <span className="badge">{t.ui.newIn}</span>
        )}
      </div>
      <div className="card-info">
        <h3>{p.name}</h3>
        <div className="meta">
          {t.metal[p.metal] ?? p.metal}
          {color && p.metal === "gold" ? ` (${color})` : ""}
          {p.purity ? ` ${p.purity}` : ""}
        </div>
        <div className="price">
          {p.old_price_from && <s>{formatPrice(p.old_price_from, locale, t.currency)}</s>}
          {formatPriceFrom(p.price_from, locale, t)}
        </div>
      </div>
    </Link>
  );
}
