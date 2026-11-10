import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { mediaPath, type ProductListItem } from "@/lib/api";
import { formatPrice, formatPriceFrom } from "@/lib/seo";

type Props = { product: ProductListItem; locale: Locale; t: Dictionary; priority?: boolean };

export default function ProductCard({ product: p, locale, t, priority }: Props) {
  return (
    <Link href={`/${locale}/product/${p.slug}`} className="card">
      <div className="ph">
        {p.image ? (
          <Image
            src={mediaPath(p.image.url)}
            alt={p.image.alt || p.name}
            fill
            sizes="(max-width: 820px) 50vw, 25vw"
            priority={priority}
          />
        ) : (
          <span className="placeholder" aria-hidden>
            SZ
          </span>
        )}
        {p.is_new && <span className="badge">New</span>}
      </div>
      <h3>{p.name}</h3>
      <div className="meta">
        {t.metal[p.metal] ?? p.metal}
        {p.purity ? ` · ${p.purity}` : ""}
      </div>
      <div className="price">
        {formatPriceFrom(p.price_from, locale, t)}
        {p.old_price_from && <s>{formatPrice(p.old_price_from, locale, t.currency)}</s>}
      </div>
    </Link>
  );
}
