"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

import type { Locale } from "@/i18n/config";
import { fmt, type Dictionary } from "@/i18n/dictionaries";
import { api } from "@/lib/client";
import { isUzPhone } from "@/lib/phone";
import { formatPrice } from "@/lib/seo";

type T = Pick<Dictionary, "account" | "status" | "currency" | "cart">;
type Me = { phone: string; first_name: string; last_name: string; email: string };
type OrderItem = { product_name: string; size: string; quantity: number; line_total: string };
type Order = {
  number: string;
  created_at: string;
  status: string;
  total: string;
  items: OrderItem[];
};

export default function AccountView({ locale, t }: { locale: Locale; t: T }) {
  const [me, setMe] = useState<Me | null | undefined>(undefined);

  useEffect(() => {
    api<Me>("/auth/me/").then((r) => setMe(r.ok ? r.data : null));
  }, []);

  if (me === undefined) return <p className="empty">{t.cart.loading}</p>;
  if (me === null) return <Login locale={locale} t={t} onDone={setMe} />;
  return <Cabinet locale={locale} t={t} me={me} onLogout={() => setMe(null)} />;
}

// --- Вход: телефон → код из SMS ---

function Login({ locale, t, onDone }: { locale: Locale; t: T; onDone: (me: Me) => void }) {
  const [phone, setPhone] = useState("+998 ");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return;
    const id = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(id);
  }, [wait]);

  const errorText = useCallback(
    (data: unknown) => {
      const code = (data as { code?: string } | null)?.code;
      if (data && typeof data === "object" && "phone" in data) return t.account.errors.invalid_phone;
      return t.account.errors[code ?? ""] ?? t.account.errors.generic;
    },
    [t],
  );

  async function requestCode(ev?: FormEvent) {
    ev?.preventDefault();
    if (!isUzPhone(phone)) {
      setError(t.account.errors.invalid_phone);
      return;
    }
    setBusy(true);
    setError("");
    const r = await api<{ resend_in?: number; retry_after?: number; code?: string }>(
      "/auth/otp/request/",
      { method: "POST", body: { phone }, locale },
    );
    setBusy(false);
    if (r.ok) {
      setStep("code");
      setWait(r.data.resend_in ?? 60);
    } else {
      setError(errorText(r.data));
      // код уже отправлялся недавно — всё равно даём ввести его
      if (r.data?.code === "too_soon") {
        setStep("code");
        setWait(r.data.retry_after ?? 60);
      }
    }
  }

  async function verify(ev: FormEvent) {
    ev.preventDefault();
    setBusy(true);
    setError("");
    const r = await api<Me>("/auth/otp/verify/", { method: "POST", body: { phone, code }, locale });
    setBusy(false);
    if (r.ok) onDone(r.data);
    else setError(errorText(r.data));
  }

  return (
    <div className="login">
      <h2>{t.account.loginTitle}</h2>
      {step === "phone" ? (
        <form onSubmit={requestCode} noValidate>
          <p className="meta">{t.account.loginText}</p>
          <label className="field">
            <span>{t.account.phone}</span>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoFocus
            />
          </label>
          {error && <p className="err" role="alert">{error}</p>}
          <button className="btn wide" disabled={busy}>
            {t.account.getCode}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} noValidate>
          <p className="meta">{fmt(t.account.codeSent, { phone })}</p>
          <label className="field">
            <span>{t.account.code}</span>
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              autoFocus
            />
          </label>
          {error && <p className="err" role="alert">{error}</p>}
          <button className="btn wide" disabled={busy || code.length < 4}>
            {t.account.verify}
          </button>
          <div className="login-links">
            {wait > 0 ? (
              <span className="meta">{fmt(t.account.resendIn, { s: wait })}</span>
            ) : (
              <button type="button" className="link" onClick={() => requestCode()}>
                {t.account.resend}
              </button>
            )}
            <button
              type="button"
              className="link"
              onClick={() => {
                setStep("phone");
                setCode("");
                setError("");
              }}
            >
              {t.account.changePhone}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// --- Кабинет: профиль и заказы ---

function Cabinet({ locale, t, me, onLogout }: { locale: Locale; t: T; me: Me; onLogout: () => void }) {
  const [profile, setProfile] = useState(me);
  const [saved, setSaved] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const dateFmt = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "ru-RU", { dateStyle: "medium" });

  useEffect(() => {
    api<{ results: Order[] }>("/orders/", { locale }).then((r) => setOrders(r.ok ? r.data.results : []));
  }, [locale]);

  async function save(ev: FormEvent) {
    ev.preventDefault();
    const r = await api<Me>("/auth/me/", {
      method: "PATCH",
      body: { first_name: profile.first_name, last_name: profile.last_name, email: profile.email },
    });
    if (r.ok) {
      setProfile(r.data);
      setSaved(true);
    }
  }

  async function logout() {
    await api("/auth/logout/", { method: "POST" });
    onLogout();
  }

  const field = (k: "first_name" | "last_name" | "email", label: string, type = "text") => (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={profile[k]}
        onChange={(e) => {
          setProfile({ ...profile, [k]: e.target.value });
          setSaved(false);
        }}
      />
    </label>
  );

  return (
    <div className="cabinet">
      <section>
        <h2>{t.account.orders}</h2>
        {orders === null ? (
          <p className="meta">{t.cart.loading}</p>
        ) : orders.length === 0 ? (
          <p className="empty">{t.account.noOrders}</p>
        ) : (
          <ul className="orders">
            {orders.map((o) => (
              <li key={o.number}>
                <details>
                  <summary>
                    <strong>{o.number}</strong>
                    <span className="meta">{dateFmt.format(new Date(o.created_at))}</span>
                    <span className="status">{t.status[o.status] ?? o.status}</span>
                    <span>{formatPrice(o.total, locale, t.currency)}</span>
                  </summary>
                  <ul className="order-items">
                    {o.items.map((it, i) => (
                      <li key={i}>
                        {it.product_name}
                        {it.size && ` · ${it.size}`} × {it.quantity}
                        <span>{formatPrice(it.line_total, locale, t.currency)}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>{t.account.profile}</h2>
        <form onSubmit={save} className="profile">
          <p className="meta">{profile.phone}</p>
          {field("first_name", t.account.firstName)}
          {field("last_name", t.account.lastName)}
          {field("email", t.account.email, "email")}
          <div className="buy-row">
            <button className="btn">{t.account.save}</button>
            <button type="button" className="btn-ghost" onClick={logout}>
              {t.account.logout}
            </button>
          </div>
          {saved && <p className="note">{t.account.saved}</p>}
        </form>
      </section>
    </div>
  );
}
