import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { itemPrice, itemPriceTiyin } from "../lib/price.mjs";
import { buildCatalog, sizeFromSku, cleanName, catFromType } from "../lib/transform.mjs";
import { createClient } from "../lib/billing.mjs";

const FIX = join(dirname(fileURLToPath(import.meta.url)), "..", "fixtures");
const fx = (n) => JSON.parse(readFileSync(join(FIX, n + ".json"), "utf8")).items;

test("цена: пример из документа 950 000 × 2.915 = 2 769 250.00", () => {
  assert.equal(itemPrice(950000.0, 2.915), 2769250);
  assert.equal(itemPrice("950000.00", "2.915"), 2769250);
});

test("цена: округление до тийина, половина вверх", () => {
  assert.equal(itemPriceTiyin(18500.5, 2.4), 4440120);      // 44401.2
  assert.equal(itemPriceTiyin(1.005, 1), 101);              // 1.005 → 1.01 (float дал бы 1.00)
  assert.equal(itemPriceTiyin(0.1, 0.05), 1);               // 0.005 → 0.01
  assert.equal(itemPriceTiyin(0.1, 0.04), 0);               // 0.004 → 0.00
  assert.equal(itemPriceTiyin(1215000, 4.333), 526459500);  // 5 264 595.00
});

test("sku → размер", () => {
  assert.equal(sizeFromSku("11100082-19.5", "11100082"), "19.5");
  assert.equal(sizeFromSku("SZ-R-01245-17.0", "SZ-R-01245"), "17.0");
  assert.equal(sizeFromSku("SZ-E-01245", "SZ-E-01245"), null);
});

test("каталог из моков", () => {
  const c = buildCatalog({ categories: fx("categories"), sets: fx("sets"), products: fx("products"), prices: fx("prices"), stock: fx("stock") });
  const byArt = Object.fromEntries(c.products.map((p) => [p.article, p]));

  assert.equal(byArt["SZ-R-00001"], undefined, "is_active=false скрыт");
  assert.equal(byArt["SZ-R-00002"], undefined, "price_per_gram=0 скрыт");
  assert.equal(c.counts.hiddenInactive, 1);
  assert.equal(c.counts.hiddenNoPrice, 1);

  const ring = byArt["SZ-R-01245"];
  assert.equal(ring.price, 2769250);
  assert.equal(ring.metal, "white");
  assert.equal(ring.cat, "rings");
  assert.deepEqual(ring.sizes.map((s) => [s.value, s.stock]), [["16.5", 1], ["17.0", 2], ["17.5", 0], ["18.0", 1]]);
  assert.equal(ring.stock, 4);
  assert.ok(ring.set_id);

  assert.equal(byArt["SZ-E-01245"].sizes, null, "серьги без размера");
  assert.equal(byArt["SZ-E-01245"].stock, 3);
  assert.equal(byArt["SZ-N-01245"].image, null, "нет фото");
  assert.equal(byArt["11100082"].metal, "rose", "Красный → rose");
  assert.equal(byArt["SZ-S-00911"].metal, "silver", "925 → silver");
  assert.equal(byArt["SZ-B-00310"].inStock, false, "товар без остатка остаётся в каталоге");

  const codes = c.warnings.map((w) => w.code).sort();
  assert.deepEqual(codes, ["UNKNOWN_COLOR", "UNKNOWN_PRODUCT_TYPE"], "брошь: неизвестный тип и цвет");
});

test("клиент: Basic + X-API-Token, пагинация, различение 401", async () => {
  const calls = [];
  const pages = { 1: [{ id: 1 }, { id: 2 }], 2: [{ id: 3 }] };
  const fakeFetch = async (url, { headers }) => {
    calls.push({ url, headers });
    const u = new URL(url);
    if (u.pathname.endsWith("/bad-token")) return new Response(JSON.stringify({ error: { code: "UNAUTHORIZED", message: "token" } }), { status: 401 });
    if (u.pathname.endsWith("/bad-basic")) return new Response("", { status: 401 });
    const page = Number(u.searchParams.get("page"));
    return new Response(JSON.stringify({ page, limit: 2, total: 3, snapshot_at: "x", items: pages[page] || [] }), { status: 200 });
  };
  const api = createClient({ baseUrl: "http://h/v1/", user: "u", password: "p", token: "t" }, { minGapMs: 0, retries: 0, fetchImpl: fakeFetch });
  const r = await api.categories({ limit: 2 });
  assert.equal(r.items.length, 3);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].headers.Authorization, "Basic " + Buffer.from("u:p").toString("base64"));
  assert.equal(calls[0].headers["X-API-Token"], "t");
  assert.match(calls[0].url, /^http:\/\/h\/v1\/categories\?page=1&limit=2$/);
  await assert.rejects(api.raw.getJson("/bad-token"), /X-API-Token/);
  await assert.rejects(api.raw.getJson("/bad-basic"), /логин или пароль/);
});

test("реальные значения 1С: названия и типы", () => {
  assert.equal(cleanName("181001926 Кольцо (585,5)", "181001926"), "Кольцо");
  assert.equal(cleanName("Кольцо из белого золота", "SZ-1"), "Кольцо из белого золота");
  for (const [t, c] of [["Кольцо", "rings"], ["Кольцо обручальное", "rings"], ["Серьги", "earrings"], ["Подвеска", "chains"],
    ["Цепь руное плетение", "chains"], ["Браслет с размерами", "bracelets"], ["Браслет цеп. с размерами", "bracelets"], ["Брошь", null]])
    assert.equal(catFromType(t), c, t);
});
