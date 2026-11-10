"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { api } from "@/lib/client";
import { isUzPhone } from "@/lib/phone";
import { formatPrice } from "@/lib/seo";
import { clearCart, useCart } from "@/lib/stores";

import { CartLines, useCartQuote, type CartQuote } from "./CartView";

type T = Pick<Dictionary, "cart" | "checkout" | "currency">;
type Me = { phone: string; first_name: string; last_name: string; email: string };
type Errors = Record<string, string>;


export default function CheckoutView({ locale, t }: { locale: Locale; t: T }) {
  const router = useRouter();
  const items = useCart();
  const quote = useCartQuote(locale, items);
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "+998 ",
    customer_email: "",
    delivery_method: "courier",
    address: "",
    comment: "",
    payment_method: "on_receipt",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [banner, setBanner] = useState("");
  const [serverQuote, setServerQuote] = useState<CartQuote | null>(null);

  // Залогиненному — подставляем данные профиля
  useEffect(() => {
    api<Me>("/auth/me/").then((r) => {
      if (!r.ok) return;
      setForm((f) => ({
        ...f,
        customer_name: f.customer_name || `${r.data.first_name} ${r.data.last_name}`.trim(),
        customer_phone: r.data.phone,
        customer_email: f.customer_email || r.data.email,
      }));
    });
  }, []);

  const set = (k: keyof typeof form) => (value: string) => {
    setForm((f) => ({ ...f, [k]: value }));
    // ошибка поля пропадает, как только его начали исправлять
    setErrors((prev) => {
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  function validate(): Errors {
    const e: Errors = {};
    if (!form.customer_name.trim()) e.customer_name = t.checkout.required;
    if (!isUzPhone(form.customer_phone)) e.customer_phone = t.checkout.invalidPhone;
    if (form.delivery_method === "courier" && !form.address.trim()) e.address = t.checkout.required;
    return e;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSending(true);
    setBanner("");
    const r = await api<{ number?: string; code?: string; cart?: CartQuote } & Errors>("/orders/", {
      method: "POST",
      locale,
      body: { ...form, items },
    });
    setSending(false);
    if (r.status === 201 && r.data.number) {
      clearCart();
      router.push(`/${locale}/checkout/success?order=${encodeURIComponent(r.data.number)}`);
    } else if (r.status === 409 && r.data.cart) {
      setServerQuote(r.data.cart);
      setBanner(t.checkout.cartChanged);
    } else if (r.status === 400 && r.data) {
      const fieldErrors: Errors = {};
      for (const k of Object.keys(r.data)) {
        fieldErrors[k] = k === "customer_phone" ? t.checkout.invalidPhone : t.checkout.required;
      }
      setErrors(fieldErrors);
    } else {
      setBanner(t.checkout.error);
    }
  }

  if (!items.length) {
    return (
      <div className="empty-state">
        <p className="empty">{t.cart.empty}</p>
        <Link href={`/${locale}/catalog`} className="btn">
          {t.cart.goCatalog}
        </Link>
      </div>
    );
  }

  const shown = serverQuote ?? quote;

  return (
    <form className="checkout" onSubmit={onSubmit} noValidate>
      <div className="fields">
        <fieldset>
          <legend>{t.checkout.contacts}</legend>
          <Field label={t.checkout.name} error={errors.customer_name}>
            <input
              value={form.customer_name}
              onChange={(e) => set("customer_name")(e.target.value)}
              autoComplete="name"
              required
            />
          </Field>
          <Field label={t.checkout.phone} error={errors.customer_phone}>
            <input
              value={form.customer_phone}
              onChange={(e) => set("customer_phone")(e.target.value)}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              required
            />
          </Field>
          <Field label={t.checkout.email} error={errors.customer_email}>
            <input
              value={form.customer_email}
              onChange={(e) => set("customer_email")(e.target.value)}
              type="email"
              autoComplete="email"
            />
          </Field>
        </fieldset>

        <fieldset>
          <legend>{t.checkout.delivery}</legend>
          {(["courier", "pickup"] as const).map((m) => (
            <label key={m} className="radio">
              <input
                type="radio"
                name="delivery"
                checked={form.delivery_method === m}
                onChange={() => set("delivery_method")(m)}
              />
              {t.checkout[m]}
            </label>
          ))}
          {form.delivery_method === "courier" && (
            <Field label={t.checkout.address} error={errors.address}>
              <textarea
                value={form.address}
                onChange={(e) => set("address")(e.target.value)}
                autoComplete="street-address"
                rows={2}
              />
            </Field>
          )}
          <Field label={t.checkout.comment} error={errors.comment}>
            <textarea value={form.comment} onChange={(e) => set("comment")(e.target.value)} rows={2} />
          </Field>
        </fieldset>

        <fieldset>
          <legend>{t.checkout.payment}</legend>
          <label className="radio">
            <input type="radio" name="payment" checked readOnly />
            {t.checkout.onReceipt}
          </label>
          {/* UZQR подключается на этапе 06 */}
          <label className="radio off">
            <input type="radio" name="payment" disabled />
            {t.checkout.uzqrSoon}
          </label>
        </fieldset>
      </div>

      <aside className="summary">
        <h2>{t.checkout.yourOrder}</h2>
        {shown ? (
          <>
            <CartLines quote={shown} locale={locale} t={t} editable={false} />
            <div className="cart-total">
              <span>{t.cart.total}</span>
              <strong>{formatPrice(shown.total, locale, t.currency)}</strong>
            </div>
          </>
        ) : (
          <p className="meta">{t.cart.loading}</p>
        )}
        {banner && (
          <p className="err" role="alert">
            {banner} {serverQuote && <Link href={`/${locale}/cart`}>{t.cart.title} →</Link>}
          </p>
        )}
        <button className="btn wide" disabled={sending || !shown?.is_valid}>
          {sending ? t.checkout.submitting : t.checkout.submit}
        </button>
      </aside>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className={`field${error ? " has-error" : ""}`}>
      <span>{label}</span>
      {children}
      {error && <small className="err">{error}</small>}
    </label>
  );
}
