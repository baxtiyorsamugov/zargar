// ADR-0004: язык в URL — /uz /ru /en
export const locales = ["uz", "ru", "en"] as const;
export type Locale = (typeof locales)[number];

// Язык по умолчанию — уточняется у заказчика (открытый вопрос в HLD)
export const defaultLocale: Locale = "ru";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeNames: Record<Locale, string> = {
  uz: "O'zbekcha",
  ru: "Русский",
  en: "English",
};
