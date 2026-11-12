import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CheckoutView from "@/components/CheckoutView";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PRIVATE_PAGE } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).checkout.title, ...PRIVATE_PAGE };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <h1>{t.checkout.title}</h1>
        </div>
        <CheckoutView locale={locale} t={{ cart: t.cart, checkout: t.checkout, currency: t.currency }} />
      </div>
    </section>
  );
}
