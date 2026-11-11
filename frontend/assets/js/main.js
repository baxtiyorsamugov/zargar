// SOFIZAR — главная. Товары ниже — пример; в продакшене приходят из API, которое берёт их из 1С.
(() => {
  const T = {
    uz: {
      city: "Toshkent", stores: "Do'konlar", delivery: "Yetkazib berish", payment: "To'lov usullari", warranty: "Kafolat",
      about: "Biz haqimizda", contact: "Aloqa", searchLabel: "Qidiruv", searchPh: "Uzuk, sirg'a, zanjir...",
      login: "Kirish", favs: "Sevimlilar", cart: "Savat", catalog: "Katalog",
      c_rings: "Uzuklar", c_earrings: "Sirg'alar", c_bracelets: "Bilaguzuklar", c_chains: "Zanjirlar",
      c_pendants: "Taqinchoqlar", c_sets: "To'plamlar", c_gifts: "Sovg'alar",
      newItems: "Yangi mahsulotlar", sales: "Aksiyalar", kicker: "Yangi kolleksiya 2026",
      heroTitle: "Sifat, zamonaviy ijroda namoyon",
      heroSub: "Oltin 585 va kumush 925 dan zargarlik buyumlari. Har biri o'z zavodimizda yaratilgan.",
      ctaCollection: "Kolleksiyani ko'rish", ctaStore: "Do'konni topish",
      tabNew: "Yangi", tabPopular: "Ommabop", tabSale: "Chegirmalar",
      collections: "Kolleksiyalar", viewAll: "Barchasini ko'rish",
      factory: "Bizning zavod",
      factoryText: "25 yildan ortiq tajriba, zamonaviy texnologiyalar va zargarlik san'atiga e'tibor. Har bir buyum ishlab chiqarishdan tortib vitrinagacha nazoratdan o'tadi.",
      statYears: "yillik tajriba", statProbe: "oltin va kumush proba", statCert: "sertifikatlangan", aboutFactory: "Zavod haqida",
      info: "Ma'lumot", footerAbout: "Jewelry Factory, O'zbekiston. Oltin va kumushdan zargarlik buyumlari.",
      demo: "Rahbariyat uchun namoyish. Narxlar va mahsulotlar namunaviy.",
      p1: "Brilliantli uzuk", p2: "Fianitli sirg'alar", p3: "Zanjirli bilaguzuk", p4: "Brilliantli taqinchoq", p5: "Safirli uzuk",
      gold: "Oltin 585", items: "ta", tagNew: "Yangi", tagSale: "Chegirma", sum: "so'm",
      addFav: "Sevimlilarga qo'shildi", delFav: "Sevimlilardan olib tashlandi", addCart: "Savatga qo'shildi",
      empty: "Hech narsa topilmadi. Boshqa so'z bilan qidirib ko'ring.",
      b: [["O'z ishlab chiqarishimiz", "Sifat kafolati"], ["Oltin 585 va kumush 925", "Barcha mahsulotlar sertifikatlangan"],
          ["Yetkazib berish", "O'zbekiston bo'ylab"], ["Sovg'a qadoqlash", "Har bir buyurtma uchun"], ["Qulay to'lov", "Naqd va karta orqali"]],
    },
    ru: {
      city: "Ташкент", stores: "Магазины", delivery: "Доставка", payment: "Способы оплаты", warranty: "Гарантия",
      about: "О нас", contact: "Контакты", searchLabel: "Поиск", searchPh: "Кольцо, серьги, цепь...",
      login: "Войти", favs: "Избранное", cart: "Корзина", catalog: "Каталог",
      c_rings: "Кольца", c_earrings: "Серьги", c_bracelets: "Браслеты", c_chains: "Цепи",
      c_pendants: "Подвески", c_sets: "Комплекты", c_gifts: "Подарки",
      newItems: "Новинки", sales: "Акции", kicker: "Новая коллекция 2026",
      heroTitle: "Качество в современном исполнении",
      heroSub: "Украшения из золота 585 и серебра 925. Каждое создано на нашем собственном заводе.",
      ctaCollection: "Смотреть коллекцию", ctaStore: "Найти магазин",
      tabNew: "Новые", tabPopular: "Популярные", tabSale: "Скидки",
      collections: "Коллекции", viewAll: "Смотреть все",
      factory: "Наш завод",
      factoryText: "Более 25 лет опыта, современные технологии и внимание к ювелирному мастерству. Каждое изделие проходит контроль от производства до витрины.",
      statYears: "лет опыта", statProbe: "проба золота и серебра", statCert: "сертифицировано", aboutFactory: "О заводе",
      info: "Информация", footerAbout: "Jewelry Factory, Узбекистан. Украшения из золота и серебра.",
      demo: "Демонстрация для руководства. Цены и товары примерные.",
      p1: "Кольцо с бриллиантом", p2: "Серьги с фианитами", p3: "Браслет-цепочка", p4: "Подвеска с бриллиантом", p5: "Кольцо с сапфиром",
      gold: "Золото 585", items: "шт.", tagNew: "Новинка", tagSale: "Скидка", sum: "сум",
      addFav: "Добавлено в избранное", delFav: "Убрано из избранного", addCart: "Добавлено в корзину",
      empty: "Ничего не нашлось. Попробуйте другое слово.",
      b: [["Собственное производство", "Гарантия качества"], ["Золото 585 и серебро 925", "Все изделия сертифицированы"],
          ["Доставка", "По всему Узбекистану"], ["Подарочная упаковка", "К каждому заказу"], ["Удобная оплата", "Наличными и картой"]],
    },
    en: {
      city: "Tashkent", stores: "Stores", delivery: "Delivery", payment: "Payment", warranty: "Warranty",
      about: "About us", contact: "Contact", searchLabel: "Search", searchPh: "Ring, earrings, chain...",
      login: "Sign in", favs: "Favorites", cart: "Bag", catalog: "Catalog",
      c_rings: "Rings", c_earrings: "Earrings", c_bracelets: "Bracelets", c_chains: "Chains",
      c_pendants: "Pendants", c_sets: "Sets", c_gifts: "Gifts",
      newItems: "New arrivals", sales: "Offers", kicker: "New collection 2026",
      heroTitle: "Quality in a modern form",
      heroSub: "Jewelry in 585 gold and 925 silver. Every piece is made at our own factory.",
      ctaCollection: "Explore the collection", ctaStore: "Find a store",
      tabNew: "New", tabPopular: "Popular", tabSale: "On sale",
      collections: "Collections", viewAll: "View all",
      factory: "Our factory",
      factoryText: "Over 25 years of experience, modern technology and care for the jeweler's craft. Every piece is checked from production to the showcase.",
      statYears: "years of experience", statProbe: "gold and silver hallmark", statCert: "certified", aboutFactory: "About the factory",
      info: "Information", footerAbout: "Jewelry Factory, Uzbekistan. Gold and silver jewelry.",
      demo: "Demo for management. Prices and products are examples.",
      p1: "Diamond ring", p2: "Cubic zirconia earrings", p3: "Chain bracelet", p4: "Diamond pendant", p5: "Sapphire ring",
      gold: "585 gold", items: "items", tagNew: "New", tagSale: "Sale", sum: "UZS",
      addFav: "Added to favorites", delFav: "Removed from favorites", addCart: "Added to bag",
      empty: "Nothing found. Try another word.",
      b: [["Own production", "Quality guarantee"], ["585 gold and 925 silver", "Every piece is certified"],
          ["Delivery", "Across Uzbekistan"], ["Gift wrapping", "With every order"], ["Easy payment", "Cash or card"]],
    },
  };

  const CATS = [
    { key: "c_rings", img: "rings", n: 412 }, { key: "c_earrings", img: "earrings", n: 286 },
    { key: "c_bracelets", img: "bracelets", n: 121 }, { key: "c_chains", img: "chains", n: 98 },
    { key: "c_pendants", img: "pendants", n: 154 }, { key: "c_sets", img: "sets", n: 47 },
    { key: "c_gifts", img: "gifts", n: 63 },
  ];
  const PRODUCTS = [
    { id: 1, key: "p1", w: 3.4, price: 8450000, tabs: ["new", "popular"] },
    { id: 2, key: "p2", w: 2.8, price: 6230000, tabs: ["new", "sale"], old: 6950000 },
    { id: 3, key: "p3", w: 4.6, price: 7990000, tabs: ["new", "popular"] },
    { id: 4, key: "p4", w: 1.9, price: 5480000, tabs: ["new", "sale"], old: 6100000 },
    { id: 5, key: "p5", w: 3.1, price: 6950000, tabs: ["new", "popular"] },
  ];
  const BENEFIT_ICONS = ["i-gem", "i-shield", "i-truck", "i-gift", "i-card"];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
                  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

  const state = { lang: store.get("sz-lang", "uz"), tab: "new", q: "", favs: new Set(store.get("sz-favs", [])), cart: store.get("sz-cart", 0) };
  if (!T[state.lang]) state.lang = "uz";
  const t = (k) => T[state.lang][k];
  const money = (n) => n.toLocaleString("ru-RU").replace(/\s/g, " ") + " " + t("sum");
  const grams = (n) => n.toFixed(1).replace(".", state.lang === "en" ? "." : ",") + (state.lang === "ru" ? " г" : " g");

  function renderCats() {
    $("#cats").innerHTML = CATS.map((c) => `
      <a class="cat" href="#new">
        <span class="cat-img"><img src="assets/img/cat-${c.img}.jpg" alt="" loading="lazy"></span>
        <span>${t(c.key)}<small>${c.n} ${t("items")}</small></span>
      </a>`).join("");
  }

  function renderProducts() {
    const q = state.q.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => p.tabs.includes(state.tab) && (!q || t(p.key).toLowerCase().includes(q)));
    $("#products").innerHTML = list.length ? list.map((p) => `
      <article class="product">
        <div class="p-img">
          <img src="assets/img/product-${p.id}.jpg" alt="${t(p.key)}" loading="lazy">
          ${p.old ? `<span class="tag sale">−${Math.round((1 - p.price / p.old) * 100)}%</span>` : `<span class="tag">${t("tagNew")}</span>`}
          <button class="fav" data-id="${p.id}" aria-pressed="${state.favs.has(p.id)}" aria-label="${t("favs")}: ${t(p.key)}"><svg class="ico"><use href="#i-heart"/></svg></button>
        </div>
        <div class="p-info">
          <span class="p-name">${t(p.key)}</span>
          <span class="p-meta">${t("gold")}, ${grams(p.w)}</span>
          <div class="p-row">
            <span class="p-price">${p.old ? `<s>${money(p.old)}</s>` : ""}${money(p.price)}</span>
            <button class="bag" data-id="${p.id}" aria-label="${t("cart")}: ${t(p.key)}"><svg class="ico"><use href="#i-bag"/></svg></button>
          </div>
        </div>
      </article>`).join("") : `<p style="grid-column:1/-1;color:var(--ink-soft);padding:32px 0">${t("empty")}</p>`;
    $$("[data-count]").forEach((el) => { el.textContent = PRODUCTS.filter((p) => p.tabs.includes(el.dataset.count)).length; });
  }

  function renderBenefits() {
    $("#benefitList").innerHTML = t("b").map(([title, sub], i) => `
      <div class="benefit"><span class="benefit-ico"><svg class="ico"><use href="#${BENEFIT_ICONS[i]}"/></svg></span>
      <span><b>${title}</b><small>${sub}</small></span></div>`).join("");
  }

  function badge(el, n, bump) {
    el.textContent = n; el.hidden = n === 0;
    if (bump) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
  }

  function applyLang() {
    document.documentElement.lang = state.lang;
    $$("[data-i18n]").forEach((el) => { const v = t(el.dataset.i18n); if (typeof v === "string") el.textContent = v; });
    $$("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$(".lang button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === state.lang));
    $(".hero-badge .price").textContent = money(PRODUCTS[0].price);
    renderCats(); renderProducts(); renderBenefits();
  }

  // События
  $(".lang").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    state.lang = b.dataset.lang; store.set("sz-lang", state.lang); applyLang();
  });

  $("#tabs").addEventListener("click", (e) => {
    const b = e.target.closest(".tab"); if (!b) return;
    state.tab = b.dataset.tab;
    $$(".tab").forEach((x) => x.setAttribute("aria-selected", x === b));
    renderProducts();
  });

  const search = $("#search");
  search.addEventListener("input", () => {
    state.q = search.value;
    if (state.q && state.tab !== "new") { state.tab = "new"; $$(".tab").forEach((x) => x.setAttribute("aria-selected", x.dataset.tab === "new")); }
    renderProducts();
  });
  search.addEventListener("keydown", (e) => { if (e.key === "Enter") $("#new").scrollIntoView({ behavior: "smooth" }); });
  addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); search.focus(); } });

  $("#products").addEventListener("click", (e) => {
    const fav = e.target.closest(".fav"), bag = e.target.closest(".bag");
    if (fav) {
      const id = +fav.dataset.id, on = !state.favs.has(id);
      on ? state.favs.add(id) : state.favs.delete(id);
      fav.setAttribute("aria-pressed", on);
      store.set("sz-favs", [...state.favs]); badge($("#favCount"), state.favs.size, on);
      toast(t(on ? "addFav" : "delFav"));
    } else if (bag) {
      state.cart++; store.set("sz-cart", state.cart); badge($("#cartCount"), state.cart, true);
      bag.classList.add("added"); setTimeout(() => bag.classList.remove("added"), 900);
      toast(t("addCart"));
    }
  });

  const header = $("#header");
  const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 50);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  let tt;
  function toast(msg) {
    const el = $("#toast"); $("span", el).textContent = msg; el.classList.add("is-on");
    clearTimeout(tt); tt = setTimeout(() => el.classList.remove("is-on"), 1800);
  }

  applyLang();
  badge($("#favCount"), state.favs.size); badge($("#cartCount"), state.cart);
})();
