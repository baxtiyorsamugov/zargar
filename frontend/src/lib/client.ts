"use client";

// Запросы из браузера к API на том же домене (/api → Django, ADR-0010).
// Сессия — cookie sessionid, для изменяющих запросов — заголовок X-CSRFToken.

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export type ApiResult<T> = { ok: boolean; status: number; data: T };

let csrfReady: Promise<void> | null = null;

/** Гарантирует, что cookie csrftoken установлена. */
export function ensureCsrf(): Promise<void> {
  if (readCookie("csrftoken")) return Promise.resolve();
  csrfReady ??= fetch("/api/v1/auth/csrf/", { credentials: "same-origin" }).then(() => undefined);
  return csrfReady;
}

export async function api<T = unknown>(
  path: string,
  { method = "GET", body, locale }: { method?: string; body?: unknown; locale?: string } = {},
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (locale) headers["Accept-Language"] = locale;
  if (method !== "GET") {
    await ensureCsrf();
    headers["Content-Type"] = "application/json";
    // токен читаем при каждом запросе: после входа Django его меняет
    const token = readCookie("csrftoken");
    if (token) headers["X-CSRFToken"] = token;
  }
  try {
    const res = await fetch(`/api/v1${path}`, {
      method,
      headers,
      credentials: "same-origin",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    const data = (text ? JSON.parse(text) : null) as T;
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: null as T };
  }
}
