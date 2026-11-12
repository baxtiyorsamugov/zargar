/** Та же проверка, что normalize_phone() на сервере: 9 цифр или 998 + 9 цифр. */
export function isUzPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  return /^(998)?\d{9}$/.test(digits);
}
