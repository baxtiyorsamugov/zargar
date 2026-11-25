// Сборка каталога для сайта из ответов /categories, /sets, /products, /prices, /stock.
import { itemPrice } from "./price.mjs";

// Тексты 1С → коды сайта (core.js: CATS, METALS). Реальные значения product_type (выгрузка 25.11.2026):
// «Кольцо», «Серьги», «Подвеска», «Цепь», «Цепь руное плетение», «Браслет с размерами», «Браслет цеп. с размерами».
// Сопоставляем по началу слова, чтобы новые варианты («Кольцо обручальное») не ломали сборку.
export const PRODUCT_TYPE_RULES = [
  [/^(кольц|печатк)/, "rings"],
  [/^(серьг|пусет|конго)/, "earrings"],
  [/^браслет/, "bracelets"],
  [/^(цеп|колье|подвеск|кулон|ожерель)/, "chains"],
];
export const catFromType = (t) => PRODUCT_TYPE_RULES.find(([re]) => re.test(norm(t)))?.[1] || null;
export const COLOR_TO_METAL = {
  "желтый": "yellow", "жёлтый": "yellow",
  "белый": "white",
  "красный": "rose", "розовый": "rose",
};

// «181001926 Кольцо (585,5)» → «Кольцо». Артикул и проба на сайте показываются отдельно.
export function cleanName(name, article) {
  let n = String(name || "").trim();
  if (article && n.startsWith(article)) n = n.slice(article.length).trim();
  n = n.replace(/\s*\([\d.,\s]+\)\s*$/, "").trim();
  return n || String(name || "").trim();
}

const norm = (s) => String(s ?? "").trim().toLowerCase();

// sku = артикул + "-" + размер через точку: "SZ-R-01245-17.0". Без размера — только артикул.
export function sizeFromSku(sku, article) {
  if (!sku || !article || sku === article) return null;
  if (!sku.startsWith(article + "-")) return null;
  const v = sku.slice(article.length + 1);
  return /^\d+(\.\d+)?$/.test(v) ? v : null;
}

export function buildCatalog({ categories = [], sets = [], products = [], prices = [], stock = [], snapshotAt = null }) {
  const warnings = [];
  const warn = (code, detail) => warnings.push({ code, ...detail });

  const catById = new Map(categories.map((c) => [c.id, c]));
  const priceById = new Map(prices.map((p) => [p.id, p]));
  const setByItem = new Map();
  for (const s of sets) for (const id of s.item_ids || []) {
    if (setByItem.has(id)) warn("ITEM_IN_TWO_SETS", { item_id: id, sets: [setByItem.get(id).id, s.id] });
    else setByItem.set(id, s);
  }
  const stockByItem = new Map();
  for (const row of stock) {
    if (!stockByItem.has(row.item_id)) stockByItem.set(row.item_id, []);
    stockByItem.get(row.item_id).push(row);
  }

  const out = [];
  const hidden = { inactive: 0, noPrice: 0, noWeight: 0 };
  for (const p of products) {
    if (!p.is_active) { hidden.inactive++; continue; }
    const group = priceById.get(p.price_group_id);
    if (!group) { warn("NO_PRICE_GROUP", { item_id: p.item_id, article: p.article, price_group_id: p.price_group_id }); hidden.noPrice++; continue; }
    if (!(Number(group.price_per_gram) > 0)) { hidden.noPrice++; continue; } // 0 — цена не задана, продавать нельзя
    if (!(Number(p.avg_weight) > 0)) { warn("ZERO_WEIGHT", { item_id: p.item_id, article: p.article }); hidden.noWeight++; continue; } // цена = 0

    const cat = catFromType(p.product_type);
    if (!cat) warn("UNKNOWN_PRODUCT_TYPE", { item_id: p.item_id, product_type: p.product_type });
    let metal = Number(p.fineness) === 925 ? "silver" : COLOR_TO_METAL[norm(p.color)] || null;
    if (!metal) warn("UNKNOWN_COLOR", { item_id: p.item_id, color: p.color });

    const rows = stockByItem.get(p.item_id) || [];
    const sized = rows.filter((r) => r.size_id);
    const sizes = sized
      .map((r) => ({ size_id: r.size_id, sku: r.sku, value: sizeFromSku(r.sku, p.article), stock: Number(r.quantity) || 0 }))
      .filter((s) => {
        if (s.value === null) warn("BAD_SKU", { item_id: p.item_id, sku: s.sku, article: p.article });
        return s.value !== null;
      })
      .sort((a, b) => Number(a.value) - Number(b.value));
    const noSizeStock = rows.filter((r) => !r.size_id).reduce((n, r) => n + (Number(r.quantity) || 0), 0);
    const totalStock = sizes.reduce((n, s) => n + s.stock, 0) + noSizeStock;

    out.push({
      id: p.item_id,
      article: p.article,
      name: cleanName(p.name, p.article),
      name_1c: p.name,
      cat,
      category_id: p.category_id ?? null,
      category: catById.get(p.category_id)?.name ?? null,
      product_type: p.product_type,
      metal,
      color: p.color || "",
      probe: Number(p.fineness),
      w: Number(p.avg_weight),
      price_group_id: p.price_group_id,
      price_per_gram: Number(group.price_per_gram),
      price: itemPrice(group.price_per_gram, p.avg_weight),
      currency: "UZS",
      sizes: sizes.length ? sizes : null,
      stock: totalStock,
      inStock: totalStock > 0,
      set_id: setByItem.get(p.item_id)?.id ?? null,
      isNew: !!p.is_new,
      isBestseller: !!p.is_bestseller,
      image: p.image_updated_at ? `data/img/${p.item_id}.jpg` : null,
      image_updated_at: p.image_updated_at ?? null,
      updated_at: p.updated_at,
    });
  }

  const ids = new Set(out.map((p) => p.id));
  const outSets = sets
    .map((s) => ({ id: s.id, name: s.name, item_ids: (s.item_ids || []).filter((id) => ids.has(id)) }))
    .filter((s) => s.item_ids.length > 1);

  return {
    generated_at: new Date().toISOString(),
    snapshot_at: snapshotAt,
    counts: { products: out.length, hiddenInactive: hidden.inactive, hiddenNoPrice: hidden.noPrice, hiddenNoWeight: hidden.noWeight, inStock: out.filter((p) => p.inStock).length },
    categories: categories.map((c) => ({ id: c.id, name: c.name })),
    sets: outSets,
    products: out,
    warnings,
  };
}
