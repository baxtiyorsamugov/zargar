#!/usr/bin/env node
// Синхронизация каталога сайта с 1С (Billing).
//   node sync.mjs            — выгрузка из API, запись frontend/data/catalog.json (+ catalog.js) и фото
//   node sync.mjs --mock     — то же на тестовых данных из fixtures/ (без сети)
//   node sync.mjs --no-images
//   node sync.mjs --from <папка> — собрать из страниц, скачанных fetch.ps1 (Windows без Node: curl.exe)
// Объём ~3 тыс. позиций — это 3–4 страницы на endpoint, поэтому каждый раз берём всё целиком:
// проще и надёжнее инкрементальной выгрузки. Запуск — по расписанию раз в 10 минут (остатки обновляются так же).
import { mkdirSync, writeFileSync, readFileSync, existsSync, renameSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { loadConfig, ROOT } from "./lib/config.mjs";
import { createClient } from "./lib/billing.mjs";
import { buildCatalog } from "./lib/transform.mjs";

const argv = process.argv.slice(2);
const args = new Set(argv);
const FROM = args.has("--from") ? argv[argv.indexOf("--from") + 1] : null;
const MOCK = args.has("--mock");
const IMAGES = !args.has("--no-images") && !MOCK && !FROM;
const cfg = loadConfig();
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

function writeAtomic(path, data) {
  writeFileSync(path + ".tmp", data);
  renameSync(path + ".tmp", path);
}

async function loadFromApi() {
  const api = createClient(cfg.catalog, { timeoutMs: cfg.timeoutMs });
  const stockApi = cfg.stock.baseUrl === cfg.catalog.baseUrl ? api : createClient(cfg.stock, { timeoutMs: cfg.timeoutMs });

  const health = await api.health();
  log(`health: ${health.status}, снимок ${health.snapshot_at}, возраст ${health.age_seconds} с`);
  if (health.age_seconds > 30 * 60) log("ВНИМАНИЕ: снимок старше 30 минут — обмен с учётной базой остановился, сообщите команде 1С");

  const categories = await api.categories();
  const sets = await api.sets();
  const products = await api.products();
  const prices = await api.prices();
  const stock = await stockApi.stock();
  for (const [n, r] of Object.entries({ categories, sets, products, prices, stock }))
    log(`${n}: ${r.items.length}${r.total != null && r.total !== r.items.length ? ` из ${r.total} (!)` : ""}`);
  return { api, data: { categories: categories.items, sets: sets.items, products: products.items, prices: prices.items, stock: stock.items, snapshotAt: stock.snapshot_at } };
}

function loadFromDir(dir) {
  const files = readdirSync(dir);
  const read = (f) => JSON.parse(readFileSync(join(dir, f), "utf8").replace(/^\uFEFF/, ""));
  const all = (ep) => files.filter((f) => new RegExp(`^${ep}-\\d+\\.json$`).test(f))
    .sort((a, b) => parseInt(a.split("-")[1]) - parseInt(b.split("-")[1])).flatMap((f) => read(f).items);
  const data = { categories: all("categories"), sets: all("sets"), products: all("products"), prices: all("prices"), stock: all("stock") };
  data.snapshotAt = files.includes("stock-1.json") ? read("stock-1.json").snapshot_at : null;
  for (const [k, v] of Object.entries(data)) if (Array.isArray(v)) log(`${k}: ${v.length}`);
  if (files.includes("health.json")) { const h = read("health.json"); log(`health: снимок ${h.snapshot_at}, возраст ${Math.round(h.age_seconds / 3600)} ч`); }
  return data;
}

function loadFixtures() {
  const f = (n) => JSON.parse(readFileSync(join(ROOT, "fixtures", n + ".json"), "utf8")).items;
  return { categories: f("categories"), sets: f("sets"), products: f("products"), prices: f("prices"), stock: f("stock"), snapshotAt: "2026-11-16T11:24:10+05:00" };
}

// Фото качаем, только если image_updated_at изменился с прошлого раза (раздел 5.7).
async function syncImages(api, catalog, imgDir) {
  mkdirSync(imgDir, { recursive: true });
  const statePath = join(imgDir, "_state.json");
  const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : {};
  let got = 0, same = 0, missing = 0;
  for (const p of catalog.products) {
    if (!p.image_updated_at) continue;
    const file = join(imgDir, `${p.id}.jpg`);
    if (state[p.id] === p.image_updated_at && existsSync(file)) { same++; continue; }
    const r = await api.getImage(p.id, { ifModifiedSince: existsSync(file) ? state[p.id] : undefined });
    if (r.status === 200) { writeAtomic(file, r.buffer); state[p.id] = p.image_updated_at; got++; }
    else if (r.status === 304) { state[p.id] = p.image_updated_at; same++; }
    else { missing++; p.image = null; }
  }
  writeAtomic(statePath, JSON.stringify(state, null, 1));
  log(`фото: скачано ${got}, без изменений ${same}, нет на сервере ${missing}`);
}

try {
  const { api, data } = MOCK ? { data: loadFixtures() } : FROM ? { data: loadFromDir(FROM) } : await loadFromApi();
  const catalog = buildCatalog(data);
  mkdirSync(cfg.outDir, { recursive: true });
  if (IMAGES) await syncImages(api, catalog, join(cfg.outDir, "img"));
  // Ссылаемся только на реально скачанные фото, иначе сайт покажет плейсхолдер категории
  for (const p of catalog.products) if (p.image && !existsSync(join(cfg.outDir, "img", `${p.id}.jpg`))) p.image = null;

  const json = JSON.stringify(catalog, null, 1);
  writeAtomic(join(cfg.outDir, "catalog.json"), json);
  // Для статического фронтенда без сборки: <script src="data/catalog.js"> перед core.js
  writeAtomic(join(cfg.outDir, "catalog.js"), `window.SZ_CATALOG = ${json};\n`);

  log(`каталог: ${catalog.counts.products} товаров (в наличии ${catalog.counts.inStock}), скрыто: снято с сайта ${catalog.counts.hiddenInactive}, без цены ${catalog.counts.hiddenNoPrice}`);
  if (catalog.warnings.length) {
    const byCode = Object.groupBy ? Object.groupBy(catalog.warnings, (w) => w.code) : {};
    log(`предупреждения: ${catalog.warnings.length}`, Object.fromEntries(Object.entries(byCode).map(([k, v]) => [k, v.length])));
  }
  log(`записано в ${cfg.outDir}`);
} catch (err) {
  // Старый catalog.json не трогаем: сайт продолжает показывать последний удачный снимок.
  console.error(`Ошибка синхронизации: ${err.message}${err.url ? `\n  ${err.url.replace(/\?.*/, "")}` : ""}`);
  process.exit(1);
}
