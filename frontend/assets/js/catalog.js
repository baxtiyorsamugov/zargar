// SOFIZAR — каталог: фильтры, сортировка, поиск. Данные — SZ.PRODUCTS (позже — API каталога из 1С).
(() => {
  const { t, PRODUCTS, CATS, METALS, money, productCard, href, esc, extend, onRoute, $, $$, onChange } = SZ;
  const root = $('main[data-page="catalog"]'); if (!root) return;

  extend({
    uz: { filters: "Filtrlar", reset: "Tozalash", fCategory: "Toifa", fMetal: "Metall", fPrice: "Narx, so'm", from: "dan", to: "gacha",
      fOffers: "Takliflar", onlySale: "Faqat chegirmadagilar", onlyNew: "Faqat yangi", all: "Hammasi",
      showN: (n) => `${n} ta mahsulotni ko'rsatish`, found: (n) => `${n} ta mahsulot`, sortBy: "Saralash:",
      sortPop: "Ommabop", sortNew: "Avval yangilari", sortAsc: "Avval arzonlari", sortDesc: "Avval qimmatlari",
      noResults: "Hech narsa topilmadi", noResultsText: "Filtrlarni o'zgartiring yoki tozalang.", resetFilters: "Filtrlarni tozalash",
      pr1: "1 mln gacha", pr2: "1–6 mln", pr3: "6 mln dan", catalogSub: "Oltin 585 va kumush 925, o'z zavodimizda ishlab chiqarilgan",
      newTitle: "Yangi mahsulotlar", saleTitle: "Aksiyalar", popTitle: "Ommabop", searchTitle: (q) => `«${q}» bo'yicha qidiruv`, home: "Bosh sahifa",
      priceChip: (a, b) => `${a || 0} – ${b || "∞"}` },
    ru: { filters: "Фильтры", reset: "Сбросить", fCategory: "Категория", fMetal: "Металл", fPrice: "Цена, сум", from: "от", to: "до",
      fOffers: "Предложения", onlySale: "Только со скидкой", onlyNew: "Только новинки", all: "Все",
      showN: (n) => `Показать ${n} шт.`, found: (n) => `${n} шт.`, sortBy: "Сортировка:",
      sortPop: "Популярные", sortNew: "Сначала новые", sortAsc: "Сначала дешевле", sortDesc: "Сначала дороже",
      noResults: "Ничего не нашлось", noResultsText: "Измените или сбросьте фильтры.", resetFilters: "Сбросить фильтры",
      pr1: "до 1 млн", pr2: "1–6 млн", pr3: "от 6 млн", catalogSub: "Золото 585 и серебро 925, сделано на нашем заводе",
      newTitle: "Новинки", saleTitle: "Акции", popTitle: "Популярное", searchTitle: (q) => `Поиск: «${q}»`, home: "Главная",
      priceChip: (a, b) => `${a || 0} – ${b || "∞"}` },
    en: { filters: "Filters", reset: "Reset", fCategory: "Category", fMetal: "Metal", fPrice: "Price, UZS", from: "from", to: "to",
      fOffers: "Offers", onlySale: "On sale only", onlyNew: "New only", all: "All",
      showN: (n) => `Show ${n} items`, found: (n) => `${n} items`, sortBy: "Sort:",
      sortPop: "Popular", sortNew: "Newest first", sortAsc: "Price: low to high", sortDesc: "Price: high to low",
      noResults: "Nothing found", noResultsText: "Change or reset the filters.", resetFilters: "Reset filters",
      pr1: "Under 1M", pr2: "1–6M", pr3: "6M and up", catalogSub: "585 gold and 925 silver, made at our own factory",
      newTitle: "New arrivals", saleTitle: "Offers", popTitle: "Popular", searchTitle: (q) => `Search: “${q}”`, home: "Home",
      priceChip: (a, b) => `${a || 0} – ${b || "∞"}` },
  });

  const SWATCH = { yellow: "#E2B85C", white: "#E3E6E8", rose: "#E2A58C", silver: "#C3C9CD" };
  const PRESETS = [["pr1", 0, 1000000], ["pr2", 1000000, 6000000], ["pr3", 6000000, 0]];
  const f = { cat: null, metals: new Set(), min: 0, max: 0, sale: false, isNew: false, sort: "pop", q: "", mode: null };
  const num = (s) => +String(s).replace(/\D/g, "") || 0;
  const fmt = (n) => n ? n.toLocaleString("ru-RU").replace(/\s/g, " ") : "";

  function match(p, skip) {
    if (skip !== "cat" && f.cat && p.cat !== f.cat) return false;
    if (skip !== "metal" && f.metals.size && !f.metals.has(p.metal)) return false;
    if (f.min && p.price < f.min) return false;
    if (f.max && p.price > f.max) return false;
    if (f.sale && !p.old) return false;
    if (f.isNew && !p.tabs.includes("new")) return false;
    if (f.mode === "popular" && !p.tabs.includes("popular")) return false;
    if (f.q) { const q = f.q.toLowerCase(); if (![t(p.key), t("c_" + p.cat), t("m_" + p.metal), p.sku].some((s) => s.toLowerCase().includes(q))) return false; }
    return true;
  }
  function sorted(list) {
    const by = { pop: (a, b) => b.pop - a.pop, asc: (a, b) => a.price - b.price, desc: (a, b) => b.price - a.price,
      new: (a, b) => (b.tabs.includes("new") - a.tabs.includes("new")) || b.id - a.id };
    return list.slice().sort(by[f.sort]);
  }
  const activeCount = () => (f.cat ? 1 : 0) + f.metals.size + (f.min || f.max ? 1 : 0) + (f.sale ? 1 : 0) + (f.isNew ? 1 : 0) + (f.q ? 1 : 0);

  function render() {
    const list = sorted(PRODUCTS.filter((p) => match(p)));
    // заголовок
    const title = f.q ? t("searchTitle", f.q) : f.cat ? t("c_" + f.cat) : f.sale ? t("saleTitle") : f.isNew ? t("newTitle") : f.mode === "popular" ? t("popTitle") : t("catalog");
    $("#catTitle", root).textContent = title;
    $("#catSub", root).textContent = t("catalogSub");
    $("#catCrumbs", root).innerHTML = `<a href="${href("home")}">${t("home")}</a><svg class="ico"><use href="#i-chev"/></svg>`
      + (f.cat ? `<a href="${href("catalog")}">${t("catalog")}</a><svg class="ico"><use href="#i-chev"/></svg><span>${t("c_" + f.cat)}</span>` : `<span>${t("catalog")}</span>`);

    // фильтры
    $("#fCat", root).innerHTML = [null, ...CATS].map((c) => {
      const n = PRODUCTS.filter((p) => (!c || p.cat === c) && match(p, "cat")).length;
      return `<label class="f-opt"><input type="radio" name="fcat" value="${c || ""}" ${f.cat === c ? "checked" : ""}><span class="f-radio"></span><span>${c ? t("c_" + c) : t("all")}</span><small>${n}</small></label>`;
    }).join("");
    $("#fMetal", root).innerHTML = METALS.map((m) => {
      const n = PRODUCTS.filter((p) => p.metal === m && match(p, "metal")).length;
      return `<label class="f-opt"><input type="checkbox" value="${m}" ${f.metals.has(m) ? "checked" : ""}><span class="f-check"><svg class="ico"><use href="#i-check"/></svg></span><span class="swatch" style="--sw:${SWATCH[m]}"></span><span>${t("m_" + m)} ${m === "silver" ? 925 : 585}</span><small>${n}</small></label>`;
    }).join("");
    $("#fPricePresets", root).innerHTML = PRESETS.map(([k, a, b]) => `<button class="chip-btn ${f.min === a && f.max === b ? "is-on" : ""}" data-min="${a}" data-max="${b}">${t(k)}</button>`).join("");
    if (document.activeElement !== $("#fMin", root)) $("#fMin", root).value = fmt(f.min);
    if (document.activeElement !== $("#fMax", root)) $("#fMax", root).value = fmt(f.max);
    $("#fSale", root).checked = f.sale; $("#fNew", root).checked = f.isNew;
    $("#sortSel", root).value = f.sort;
    const n = activeCount();
    $("#fCount", root).textContent = n || ""; $("#fReset", root).hidden = !n;
    $("#fApply", root).textContent = t("showN", list.length);
    $("#resultN", root).textContent = t("found", list.length);

    // активные фильтры
    const chips = [];
    if (f.q) chips.push(["q", `«${esc(f.q)}»`]);
    if (f.cat) chips.push(["cat", t("c_" + f.cat)]);
    f.metals.forEach((m) => chips.push(["metal:" + m, t("m_" + m)]));
    if (f.min || f.max) chips.push(["price", t("priceChip", fmt(f.min), fmt(f.max))]);
    if (f.sale) chips.push(["sale", t("onlySale")]);
    if (f.isNew) chips.push(["new", t("onlyNew")]);
    $("#activeChips", root).innerHTML = chips.map(([k, l]) => `<button class="active-chip" data-unset="${k}">${l}<svg class="ico"><use href="#i-close"/></svg></button>`).join("")
      + (chips.length > 1 ? `<button class="btn-text" data-unset="all">${t("resetFilters")}</button>` : "");
    $("#activeChips", root).hidden = !chips.length;

    // сетка
    $("#catGrid", root).innerHTML = list.map((p) => productCard(p, { noTag: !p.tabs.includes("new") })).join("");
    $("#catGrid", root).hidden = !list.length;
    $("#catEmpty", root).hidden = !!list.length;
  }

  function resetAll(keepQ) { Object.assign(f, { cat: null, min: 0, max: 0, sale: false, isNew: false, mode: null, q: keepQ ? f.q : "" }); f.metals.clear(); }
  function syncHash() {
    const r = f.cat ? "catalog-" + f.cat : "catalog";
    try {
      history.replaceState(null, "", href(r));
      catalogRoute = r;
    } catch (e) {}
    $$("[data-route]").forEach((a) => a.classList.toggle("is-current", a.dataset.route === r));
  }

  // Маршрут: catalog, catalog-rings, catalog-new, catalog-sale, catalog-popular
  let catalogRoute;
  onRoute((r) => {
    if (!r.startsWith("catalog")) return;
    const key = r.slice(8);
    resetAll();
    if (CATS.includes(key)) f.cat = key;
    if (key === "sale") f.sale = true;
    if (key === "new") { f.isNew = true; f.sort = "new"; }
    if (key === "popular") { f.mode = "popular"; f.sort = "pop"; }
    const q = sessionStorage.getItem("sz-q");
    if (q != null) { sessionStorage.removeItem("sz-q"); f.q = q.trim(); $("#search").value = f.q; }
    render();
    if (catalogRoute !== undefined && catalogRoute !== r) SZ.fadeSection(root);
    catalogRoute = r;
  });

  function fadeResults() {
    const grid = $("#catGrid", root);
    SZ.fadeSection(grid.hidden ? $("#catEmpty", root) : grid);
  }

  // События фильтров
  root.addEventListener("change", (e) => {
    const el = e.target;
    if (el.name === "fcat") { f.cat = el.value || null; syncHash(); }
    else if (el.closest("#fMetal")) el.checked ? f.metals.add(el.value) : f.metals.delete(el.value);
    else if (el.id === "fSale") f.sale = el.checked;
    else if (el.id === "fNew") f.isNew = el.checked;
    else if (el.id === "sortSel") f.sort = el.value;
    else return;
    render();
    if (el.name === "fcat") fadeResults();
  });
  ["fMin", "fMax"].forEach((id) => $("#" + id, root).addEventListener("input", (e) => {
    const v = num(e.target.value); e.target.value = fmt(v);
    id === "fMin" ? (f.min = v) : (f.max = v); render();
  }));
  root.addEventListener("click", (e) => {
    const pr = e.target.closest("[data-min]"), un = e.target.closest("[data-unset]");
    if (pr) { const a = +pr.dataset.min, b = +pr.dataset.max; const same = f.min === a && f.max === b; f.min = same ? 0 : a; f.max = same ? 0 : b; render(); }
    if (un) {
      const k = un.dataset.unset;
      if (k === "all") resetAll(); else if (k === "q") { f.q = ""; $("#search").value = ""; } else if (k === "cat") { f.cat = null; syncHash(); }
      else if (k.startsWith("metal:")) f.metals.delete(k.slice(6)); else if (k === "price") { f.min = f.max = 0; }
      else if (k === "sale") f.sale = false; else if (k === "new") f.isNew = false;
      render();
      if (k === "cat") fadeResults();
    }
  });
  const resetBtn = () => { resetAll(); $("#search").value = ""; syncHash(); render(); };
  $("#fReset", root).addEventListener("click", resetBtn);
  $("#emptyReset", root).addEventListener("click", resetBtn);

  // Поиск в шапке фильтрует каталог на лету
  const search = $("#search");
  search.addEventListener("input", () => { if (document.body.dataset.page === "catalog") { f.q = search.value.trim(); render(); } });

  // Мобильная панель фильтров
  const panel = $("#filters", root), back = $("#fBackdrop", root);
  const openF = (on) => { panel.classList.toggle("is-open", on); back.hidden = !on; document.body.classList.toggle("no-scroll", on); if (on) $("#fClose", root).focus(); };
  $("#fOpen", root).addEventListener("click", () => openF(true));
  $("#fClose", root).addEventListener("click", () => openF(false));
  $("#fApply", root).addEventListener("click", () => openF(false));
  back.addEventListener("click", () => openF(false));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && panel.classList.contains("is-open")) openF(false); });

  onChange(render);
})();
