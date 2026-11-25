// Настройки берутся из .env рядом с этой папкой (api-sync/.env) или из переменных окружения.
// Пароли и токены в код и во frontend не попадают.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const raw of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (!(key in process.env)) process.env[key] = val;
  }
}

export function loadConfig() {
  loadEnvFile(join(ROOT, ".env"));
  const e = process.env;
  const catalog = {
    baseUrl: (e.BILLING_URL || "").replace(/\/+$/, ""),
    user: e.BILLING_USER || "",
    password: e.BILLING_PASSWORD || "",
    token: e.BILLING_TOKEN || "",
  };
  // Остатки могут жить на другой публикации (stockapi). Если не задано — тот же адрес, что и каталог.
  const stock = {
    baseUrl: (e.STOCK_URL || catalog.baseUrl).replace(/\/+$/, ""),
    user: e.STOCK_USER || catalog.user,
    password: e.STOCK_PASSWORD || catalog.password,
    token: e.STOCK_TOKEN ?? catalog.token,
  };
  return {
    catalog,
    stock,
    outDir: e.OUT_DIR || join(ROOT, "..", "frontend", "data"),
    timeoutMs: Number(e.TIMEOUT_MS || 35000),
  };
}
