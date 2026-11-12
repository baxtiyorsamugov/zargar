"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/i18n/config";
import { cartCount, useCart, useFavorites } from "@/lib/stores";

import Icon from "./Icon";

type Props = {
  locale: Locale;
  t: { cart: string; account: string; favorites: string };
};

export default function HeaderActions({ locale, t }: Props) {
  const count = cartCount(useCart());
  const favorites = useFavorites().length;
  const path = usePathname();
  const items = [
    { href: `/${locale}/account`, icon: "user" as const, label: t.account, n: 0 },
    { href: `/${locale}/favorites`, icon: "heart" as const, label: t.favorites, n: favorites },
    { href: `/${locale}/cart`, icon: "bag" as const, label: t.cart, n: count },
  ];

  return (
    <nav className="actions">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className={`action${path.startsWith(it.href) ? " is-current" : ""}`}
          aria-current={path.startsWith(it.href) ? "page" : undefined}
        >
          <Icon name={it.icon} />
          <span className="action-label">{it.label}</span>
          {it.n > 0 && <span className="count">{it.n}</span>}
        </Link>
      ))}
    </nav>
  );
}
