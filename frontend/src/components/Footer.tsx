import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

import { MENU, MENU_NAMES, PHONE } from "./Header";

export default function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const home = `/${locale}`;
  return (
    <footer className="footer" id="contacts">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <span className="logo" aria-label="SOFIZAR" />
            <p>{t.ui.footerAbout}</p>
          </div>
          <div>
            <h3>{t.nav.catalog}</h3>
            <ul>
              {MENU.map((slug) => (
                <li key={slug}>
                  <Link href={`${home}/catalog/${slug}`}>{MENU_NAMES[locale][slug]}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{t.ui.forBuyers}</h3>
            <ul>
              <li>
                <Link href={`${home}#factory`}>{t.ui.aboutFactory}</Link>
              </li>
              <li>
                <Link href={`${home}#benefits`}>{t.ui.delivery}</Link>
              </li>
              <li>
                <Link href={`${home}#benefits`}>{t.ui.payment}</Link>
              </li>
              <li>
                <Link href={`${home}#benefits`}>{t.ui.warranty}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>{t.nav.account}</h3>
            <ul>
              <li>
                <Link href={`${home}/account`}>{t.nav.account}</Link>
              </li>
              <li>
                <Link href={`${home}/favorites`}>{t.nav.favorites}</Link>
              </li>
              <li>
                <Link href={`${home}/cart`}>{t.nav.cart}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>{t.nav.contacts}</h3>
            <ul>
              <li>{PHONE}</li>
              <li>sofizar.uz</li>
              <li>{t.ui.city}</li>
            </ul>
          </div>
        </div>
        <div className="fineprint">
          <span>
            © {new Date().getFullYear()} SOFIZAR. {t.footer.rights}
          </span>
          <span>{t.ui.demo}</span>
        </div>
      </div>
    </footer>
  );
}
