// Клиент HTTP-сервиса Billing (1С) по документу «SOFIZAR — API для получения данных из 1С», v1.2.
// Только GET. Нужны оба ключа: Basic + X-API-Token. Не чаще 60 запросов в минуту.

export class BillingError extends Error {
  constructor(message, { status, code, url } = {}) {
    super(message);
    this.name = "BillingError";
    this.status = status;
    this.code = code;
    this.url = url;
  }
}

const RETRYABLE = new Set([500, 502, 503, 504]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function createClient({ baseUrl, user, password, token }, { timeoutMs = 35000, minGapMs = 1000, retries = 3, fetchImpl = fetch } = {}) {
  if (!baseUrl) throw new BillingError("Не задан адрес API (BILLING_URL в .env)");
  baseUrl = baseUrl.replace(/\/+$/, "");
  const headers = { Accept: "application/json" };
  if (user) headers.Authorization = "Basic " + Buffer.from(`${user}:${password}`, "utf8").toString("base64");
  if (token) headers["X-API-Token"] = token;

  let lastAt = 0;
  async function throttle() {
    const wait = lastAt + minGapMs - Date.now();
    if (wait > 0) await sleep(wait);
    lastAt = Date.now();
  }

  function buildUrl(path, params = {}) {
    const url = new URL(baseUrl + path);
    for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    return url.toString();
  }

  async function request(path, params, extraHeaders = {}) {
    const url = buildUrl(path, params);
    for (let attempt = 0; ; attempt++) {
      await throttle();
      let res;
      try {
        res = await fetchImpl(url, { headers: { ...headers, ...extraHeaders }, signal: AbortSignal.timeout(timeoutMs) });
      } catch (err) {
        if (attempt < retries) { await sleep(2000 * 2 ** attempt); continue; }
        throw new BillingError(`Нет связи с API: ${err.cause?.code || err.message}`, { url });
      }
      if (RETRYABLE.has(res.status) && attempt < retries) { await sleep(2000 * 2 ** attempt); continue; }
      return { res, url };
    }
  }

  async function errorFrom(res, url) {
    const text = await res.text().catch(() => "");
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch {}
    const code = body?.error?.code;
    const msg = body?.error?.message;
    let hint = "";
    if (res.status === 401) hint = body ? "неверный X-API-Token" : "1С не приняла логин или пароль (Basic)";
    else if (res.status === 403) hint = "IP сервера не в списке разрешённых или нет прав на endpoint";
    else if (res.status === 404) hint = "неверный адрес endpoint (или endpoint ещё не опубликован)";
    else if (res.status === 503) hint = "база недоступна (обновление, регламент)";
    return new BillingError(`HTTP ${res.status}${hint ? ` — ${hint}` : ""}${msg ? `: ${msg}` : ""}`, { status: res.status, code, url });
  }

  async function getJson(path, params) {
    const { res, url } = await request(path, params);
    if (!res.ok) throw await errorFrom(res, url);
    const text = await res.text();
    try { return JSON.parse(text.replace(/^﻿/, "")); } // 1С иногда отдаёт BOM
    catch { throw new BillingError(`Ответ не JSON (${text.slice(0, 120)}…)`, { status: res.status, url }); }
  }

  // Выгрузка всех страниц. Порядок позиций постоянный (раздел 4), поэтому просто идём по page.
  async function getAll(path, { updatedSince, limit = 1000, extra = {} } = {}) {
    const items = [];
    let meta = null;
    for (let page = 1; ; page++) {
      const data = await getJson(path, { page, limit, updated_since: updatedSince, ...extra });
      if (!Array.isArray(data.items)) throw new BillingError(`В ответе ${path} нет массива items`);
      meta ??= { total: data.total, generated_at: data.generated_at, snapshot_at: data.snapshot_at };
      items.push(...data.items);
      if (!data.items.length || items.length >= (data.total ?? Infinity)) break;
      if (page > 1000) throw new BillingError(`Слишком много страниц в ${path}`);
    }
    return { ...meta, items };
  }

  // Фотография: двоичный JPEG. 304 — не менялась, 404 — нет фото.
  async function getImage(itemId, { ifModifiedSince } = {}) {
    const extraHeaders = { Accept: "image/jpeg" };
    if (ifModifiedSince) extraHeaders["If-Modified-Since"] = new Date(ifModifiedSince).toUTCString();
    const { res, url } = await request(`/products/${encodeURIComponent(itemId)}/images`, {}, extraHeaders);
    if (res.status === 304) return { status: 304 };
    if (res.status === 404) { await res.body?.cancel(); return { status: 404 }; }
    if (!res.ok) throw await errorFrom(res, url);
    const buf = Buffer.from(await res.arrayBuffer());
    return { status: 200, buffer: buf, lastModified: res.headers.get("last-modified"), contentType: res.headers.get("content-type") };
  }

  return {
    health: () => getJson("/health"),
    categories: (o) => getAll("/categories", o),
    sets: (o) => getAll("/sets", o),
    products: (o) => getAll("/products", o),
    prices: (o) => getAll("/prices", o),
    stock: (o) => getAll("/stock", o),
    getImage,
    raw: { getJson, request },
  };
}
