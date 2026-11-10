import type { Locale } from "./config";

const ru = {
  meta: {
    title: "SOFIZAR — ювелирные изделия",
    description:
      "Золотые и серебряные украшения SOFIZAR: кольца, серьги, подвески и браслеты собственного производства. Доставка по Узбекистану.",
  },
  nav: { catalog: "Каталог", collections: "Коллекции", about: "О компании", contacts: "Контакты" },
  home: {
    heroTitle: "Украшения, которые остаются в семье",
    heroText: "Золото и бриллианты собственного производства в Ташкенте.",
    heroCta: "Смотреть каталог",
    newTitle: "Новинки",
    categoriesTitle: "Категории",
  },
  catalog: { title: "Каталог", empty: "Товары скоро появятся", all: "Все" },
  product: {
    from: "от",
    inStock: "В наличии",
    outOfStock: "Нет в наличии",
    size: "Размер",
    metal: "Металл",
    purity: "Проба",
    weight: "Вес",
    inserts: "Вставки",
    addToCart: "В корзину",
    care: "Уход",
    gram: "г",
  },
  metal: { gold: "Золото", silver: "Серебро", platinum: "Платина" } as Record<string, string>,
  currency: "сум",
  footer: { rights: "Все права защищены" },
  notFound: { title: "Страница не найдена", back: "На главную" },
};

export type Dictionary = typeof ru;

const uz: Dictionary = {
  meta: {
    title: "SOFIZAR — zargarlik buyumlari",
    description:
      "SOFIZAR oltin va kumush taqinchoqlari: o'z ishlab chiqarishimizdagi uzuklar, sirg'alar, kulonlar va bilaguzuklar. O'zbekiston bo'ylab yetkazib berish.",
  },
  nav: { catalog: "Katalog", collections: "Kolleksiyalar", about: "Kompaniya haqida", contacts: "Aloqa" },
  home: {
    heroTitle: "Oilada qoladigan taqinchoqlar",
    heroText: "Toshkentda o'zimiz ishlab chiqargan oltin va olmoslar.",
    heroCta: "Katalogni ko'rish",
    newTitle: "Yangi mahsulotlar",
    categoriesTitle: "Kategoriyalar",
  },
  catalog: { title: "Katalog", empty: "Mahsulotlar tez orada paydo bo'ladi", all: "Barchasi" },
  product: {
    from: "dan",
    inStock: "Mavjud",
    outOfStock: "Mavjud emas",
    size: "O'lcham",
    metal: "Metall",
    purity: "Proba",
    weight: "Og'irligi",
    inserts: "Toshlar",
    addToCart: "Savatga",
    care: "Parvarish",
    gram: "g",
  },
  metal: { gold: "Oltin", silver: "Kumush", platinum: "Platina" },
  currency: "so'm",
  footer: { rights: "Barcha huquqlar himoyalangan" },
  notFound: { title: "Sahifa topilmadi", back: "Bosh sahifaga" },
};

const en: Dictionary = {
  meta: {
    title: "SOFIZAR — fine jewelry",
    description:
      "SOFIZAR gold and silver jewelry: rings, earrings, pendants and bracelets from our own workshop. Delivery across Uzbekistan.",
  },
  nav: { catalog: "Catalog", collections: "Collections", about: "About", contacts: "Contacts" },
  home: {
    heroTitle: "Jewelry that stays in the family",
    heroText: "Gold and diamonds crafted in our own Tashkent workshop.",
    heroCta: "Browse catalog",
    newTitle: "New arrivals",
    categoriesTitle: "Categories",
  },
  catalog: { title: "Catalog", empty: "Products coming soon", all: "All" },
  product: {
    from: "from",
    inStock: "In stock",
    outOfStock: "Out of stock",
    size: "Size",
    metal: "Metal",
    purity: "Purity",
    weight: "Weight",
    inserts: "Stones",
    addToCart: "Add to cart",
    care: "Care",
    gram: "g",
  },
  metal: { gold: "Gold", silver: "Silver", platinum: "Platinum" },
  currency: "UZS",
  footer: { rights: "All rights reserved" },
  notFound: { title: "Page not found", back: "Back to home" },
};

const dictionaries: Record<Locale, Dictionary> = { uz, ru, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
