import Link from "next/link";
import { Suspense } from "react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <header className="header">
      <div className="wrap">
        <Link href={`/${locale}`} className="logo" aria-label="SOFIZAR">
          SOFIZAR
        </Link>
        <nav className="nav">
          <Link href={`/${locale}/catalog`}>{t.nav.catalog}</Link>
          <Link href={`/${locale}#about`}>{t.nav.about}</Link>
          <Link href={`/${locale}#contacts`}>{t.nav.contacts}</Link>
        </nav>
        <Suspense fallback={null}>
          <LanguageSwitcher current={locale} />
        </Suspense>
      </div>
    </header>
  );
}
