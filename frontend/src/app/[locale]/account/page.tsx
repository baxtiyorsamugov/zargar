import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AccountView from "@/components/AccountView";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PRIVATE_PAGE } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).account.title, ...PRIVATE_PAGE };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <h1>{t.account.title}</h1>
        </div>
        <AccountView locale={locale} t={{ account: t.account, status: t.status, currency: t.currency, cart: t.cart }} />
      </div>
    </section>
  );
}
