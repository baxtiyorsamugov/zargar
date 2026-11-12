import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";
import { fmt, getDictionary } from "@/i18n/dictionaries";
import { PRIVATE_PAGE } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).checkout.successTitle, ...PRIVATE_PAGE };
}

export default async function SuccessPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { order } = await searchParams;
  const number = (order ?? "").replace(/[^A-Z0-9-]/gi, "").slice(0, 20);

  return (
    <section className="section">
      <div className="wrap success">
        <h1>{t.checkout.successTitle}</h1>
        {number && <p>{fmt(t.checkout.successText, { number })}</p>}
        <div className="buy-row">
          <Link href={`/${locale}/catalog`} className="btn">
            {t.checkout.toCatalog}
          </Link>
          <Link href={`/${locale}/account`} className="btn-ghost">
            {t.checkout.toAccount}
          </Link>
        </div>
      </div>
    </section>
  );
}
