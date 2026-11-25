#!/usr/bin/env node
// Диагностика API: один запрос на каждый endpoint, сырые ответы — в api-samples/,
// сверка полей с документом v1.2. Запускать один раз после получения доступа:  node probe.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadConfig, ROOT } from "./lib/config.mjs";
import { createClient } from "./lib/billing.mjs";

const SPEC = {
  "/categories": ["id", "name", "updated_at"],
  "/sets": ["id", "name", "item_ids", "updated_at"],
  "/products": ["item_id", "article", "name", "category_id", "price_group_id", "price_group", "product_type", "color", "fineness", "avg_weight", "size_min", "size_max", "is_new", "is_bestseller", "image_updated_at", "is_active", "updated_at"],
  "/prices": ["id", "name", "price_per_gram", "currency", "updated_at"],
  "/stock": ["item_id", "size_id", "sku", "quantity", "updated_at"],
};
const ENVELOPE = ["page", "limit", "total", "generated_at", "snapshot_at", "items"];

const cfg = loadConfig();
const outDir = join(ROOT, "..", "..", "api-samples");
mkdirSync(outDir, { recursive: true });
const report = [];
const line = (s) => { console.log(s); report.push(s); };

async function probe(label, client, path, params) {
  const { res, url } = await client.raw.request(path, params);
  const ct = res.headers.get("content-type") || "";
  const body = ct.includes("image") ? Buffer.from(await res.arrayBuffer()) : await res.text();
  const file = join(outDir, (label + path).replace(/[^\w.-]+/g, "_").replace(/^_|_$/g, "") + (ct.includes("image") ? ".jpg" : ".json"));
  writeFileSync(file, body);
  line(`\n## ${label} ${path} → HTTP ${res.status} (${ct || "без Content-Type"}, ${body.length} байт)`);
  if (!res.ok || ct.includes("image")) { if (!res.ok) line(`  тело: ${String(body).slice(0, 300)}`); return null; }
  let data;
  try { data = JSON.parse(String(body).replace(/^﻿/, "")); } catch { line("  ❌ ответ не JSON"); return null; }
  if (SPEC[path]) {
    const envMissing = ENVELOPE.filter((k) => !(k in data));
    if (envMissing.length) line(`  ❌ нет полей конверта: ${envMissing.join(", ")}`);
    const items = Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : [];
    line(`  total=${data.total ?? "—"}, items на странице=${items.length}, snapshot_at=${data.snapshot_at ?? "—"}`);
    if (items[0]) {
      const keys = Object.keys(items[0]);
      const missing = SPEC[path].filter((k) => !keys.includes(k));
      const extra = keys.filter((k) => !SPEC[path].includes(k));
      line(missing.length ? `  ❌ нет полей: ${missing.join(", ")}` : "  ✅ все поля по документу на месте");
      if (extra.length) line(`  ℹ️ лишние поля: ${extra.join(", ")}`);
    }
  }
  return data;
}

const api = createClient(cfg.catalog, { timeoutMs: cfg.timeoutMs });
line(`# Проверка API ${new Date().toISOString()}\nкаталог: ${cfg.catalog.baseUrl}\nостатки: ${cfg.stock.baseUrl}`);
try {
  await probe("catalog", api, "/health");
  for (const p of ["/categories", "/sets", "/prices"]) await probe("catalog", api, p, { limit: 5 });
  const products = await probe("catalog", api, "/products", { limit: 5 });
  await probe("catalog", api, "/stock", { limit: 5 });
  await probe("catalog", api, "/stock", { limit: 5, only_positive: true });
  await probe("catalog", api, "/collections", { limit: 5 });
  const withPhoto = products?.items?.find((p) => p.image_updated_at) || products?.items?.[0];
  if (withPhoto) await probe("catalog", api, `/products/${withPhoto.item_id}/images`);

  if (cfg.stock.baseUrl !== cfg.catalog.baseUrl) {
    const st = createClient(cfg.stock, { timeoutMs: cfg.timeoutMs });
    for (const p of ["/health", "/stock", "/products"]) await probe("stockapi", st, p, { limit: 5 });
  }
} catch (err) {
  line(`\n❌ ${err.message}`);
}
writeFileSync(join(outDir, "REPORT.md"), report.join("\n") + "\n");
console.log(`\nСырые ответы и REPORT.md — в ${outDir}`);
