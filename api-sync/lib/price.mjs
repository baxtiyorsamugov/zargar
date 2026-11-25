// цена товара = price_per_gram × avg_weight, округление до 2 знаков, половина вверх (как в 1С).
// Считаем в целых числах, чтобы не ловить ошибки float (0.1 + 0.2).

// "2.915" → { int: 2915n, scale: 3 }
function toScaled(value) {
  const s = typeof value === "number" ? numberToPlain(value) : String(value).trim().replace(",", ".");
  const m = /^(-?)(\d+)(?:\.(\d+))?$/.exec(s);
  if (!m) throw new TypeError(`Не число: ${value}`);
  const frac = m[3] || "";
  return { int: BigInt(m[1] + m[2] + frac), scale: frac.length };
}

function numberToPlain(n) {
  if (!Number.isFinite(n)) throw new TypeError(`Не число: ${n}`);
  // toString без экспоненты для обычных цен и весов; уберём хвост float через toPrecision(15)
  const s = Number(n.toPrecision(15)).toString();
  if (!/e/i.test(s)) return s;
  return n.toFixed(10).replace(/0+$/, "").replace(/\.$/, "");
}

/** Возвращает цену в тийинах (целое: сумы × 100). */
export function itemPriceTiyin(pricePerGram, avgWeight) {
  const a = toScaled(pricePerGram);
  const b = toScaled(avgWeight);
  const prod = a.int * b.int; // масштаб a.scale + b.scale
  const scale = a.scale + b.scale;
  if (scale <= 2) return Number(prod * 10n ** BigInt(2 - scale));
  const div = 10n ** BigInt(scale - 2);
  const neg = prod < 0n;
  const abs = neg ? -prod : prod;
  let q = abs / div;
  if ((abs % div) * 2n >= div) q += 1n; // половина вверх
  return Number(neg ? -q : q);
}

/** Цена в сумах числом с 2 знаками: 2769250.00 → 2769250 */
export function itemPrice(pricePerGram, avgWeight) {
  return itemPriceTiyin(pricePerGram, avgWeight) / 100;
}
