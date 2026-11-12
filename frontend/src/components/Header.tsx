import Link from "next/link";
import { Suspense } from "react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

import HeaderActions from "./HeaderActions";
import Icon from "./Icon";
import LanguageSwitcher from "./LanguageSwitcher";

// Категории в меню — slug из каталога (пока фиксированы; после 1С — из API)
const MENU = ["rings", "earrings", "pendants", "bracelets"] as const;
const MENU_NAMES: Record<Locale, Record<(typeof MENU)[number], string>> = {
  uz: { rings: "Uzuklar", earrings: "Sirg'alar", pendants: "Kulonlar", bracelets: "Bilaguzuklar" },
  ru: { rings: "Кольца", earrings: "Серьги", pendants: "Подвески", bracelets: "Браслеты" },
  en: { rings: "Rings", earrings: "Earrings", pendants: "Pendants", bracelets: "Bracelets" },
};

export const PHONE = "+998 55 500-00-00";

export default function Header({ locale, t }: { locale: Locale; t: Dictionary }) {
  const home = `/${locale}`;
  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <span className="city">
            <Icon name="pin" />
            {t.ui.city}
          </span>
          <nav aria-label={t.ui.forBuyers}>
            <Link href={`${home}#benefits`}>{t.ui.delivery}</Link>
            <Link href={`${home}#benefits`}>{t.ui.payment}</Link>
            <Link href={`${home}#benefits`}>{t.ui.warranty}</Link>
            <Link href={`${home}#factory`}>{t.nav.about}</Link>
            <Link href={`${home}#contacts`}>{t.nav.contacts}</Link>
          </nav>
          <div className="topbar-end">
            <a className="phone" href={`tel:${PHONE.replace(/[^+\d]/g, "")}`}>
              <Icon name="phone" />
              <span>{PHONE}</span>
            </a>
            <Suspense fallback={null}>
              <LanguageSwitcher current={locale} />
            </Suspense>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="wrap header-row">
          <Link href={home} className="logo" aria-label="SOFIZAR" />
          {/* Обычная GET-форма: поиск работает и без JavaScript */}
          <form action={`${home}/catalog`} className="search" role="search">
            <Icon name="search" />
            <input type="search" name="search" placeholder={t.nav.search} aria-label={t.nav.search} />
          </form>
          <HeaderActions
            locale={locale}
            t={{ cart: t.nav.cart, account: t.nav.account, favorites: t.nav.favorites }}
          />
        </div>
        <nav className="catnav" aria-label={t.nav.catalog}>
          <div className="wrap">
            <Link className="catalog-btn" href={`${home}/catalog`}>
              <Icon name="menu" />
              {t.nav.catalog}
            </Link>
            {MENU.map((slug) => (
              <Link key={slug} href={`${home}/catalog/${slug}`}>
                {MENU_NAMES[locale][slug]}
              </Link>
            ))}
            <Link href={`${home}/catalog?is_new=true`}>{t.ui.newIn}</Link>
            <Link href={`${home}#factory`}>{t.ui.aboutFactory}</Link>
          </div>
        </nav>
      </header>
    </>
  );
}

export { MENU, MENU_NAMES };
