// SOFIZAR — карточка товара: галерея, металл, размер, характеристики, похожие товары.
(() => {
  const { t, PRODUCTS, byId, state, money, grams, sizeLabel, spec, href, esc, extend, onRoute, productCard, addToCart, removeOneFromCart, $, $$, onChange } = SZ;
  const root = $('main[data-page="product"]'); if (!root) return;

  extend({
    uz: { addToCart: "Savatga qo'shish", inCartAdded: "Savatga qo'shildi", sizeGuide: "Razmerni qanday bilish", pickSize: "Razmerni tanlang",
      sizeRing: "Uzuk razmeri", sizeLen: "Uzunligi", sku: "Artikul", perkPickup: "Do'kondan olib ketish — bepul, ertaga",
      perkCourier: "Toshkent bo'ylab kuryer — 1–2 kun", perkCert: "Proba tamg'asi va sertifikat bilan", bonusFor: (n) => `Xarid uchun +${n} bonus ball`,
      descTitle: "Tavsif", specTitle: "Xususiyatlar", careTitle: "Parvarish", related: "O'xshash mahsulotlar", gotIt: "Tushunarli",
      careText: "Atir, krem va hovuz suvidan saqlang. Yumshoq mato bilan arting va alohida qutida saqlang. Yiliga bir marta do'konimizda bepul tozalab beramiz.",
      spCat: "Toifa", spMetal: "Metall", spProbe: "Proba", spWeight: "Vazni", spSizes: "Razmerlar", spMaker: "Ishlab chiqaruvchi", maker: "SOFIZAR zavodi, O'zbekiston",
      ringGuide: "Razmer — uzukning ichki diametri millimetrda. O'zingizdagi uzukning ichini o'lchang yoki do'konda bepul o'lchab beramiz.",
      lenGuide: "Zanjir va bilaguzuk uzunligi santimetrda. Bilagingizni ip bilan o'lchab, 1–2 sm qo'shing.",
      thSize: "Razmer", thDiam: "Diametr, mm", thLen: "Uzunlik", thFits: "Kimga mos", fitS: "Ingichka barmoq / bilak", fitM: "O'rtacha", fitL: "Keng",
      d_p1: "Ikki silliq halqa bir-biriga o'ralgan: kundalik taqish uchun yetarlicha yengil, kechki libos uchun yetarlicha ko'zga tashlanadi. Yuzasi oynadek sayqallangan.",
      d_p2: "Tomchi shaklidagi halqa sirg'alar. Ichi bo'sh quyilgan, shuning uchun hajmli ko'rinsa ham quloqni og'irlashtirmaydi. Ingliz qulf.",
      d_p3: "Nozik zanjirda silliq tomchi taqinchoq. Uzunlikni tanlash mumkin, qulf karabin turida.",
      d_p4: "To'g'ri to'rtburchak bo'g'inli zanjir bilaguzuk. Boshqa bilaguzuklar bilan birga taqishga mos." },
    ru: { addToCart: "В корзину", inCartAdded: "Добавлено в корзину", sizeGuide: "Как узнать размер", pickSize: "Выберите размер",
      sizeRing: "Размер кольца", sizeLen: "Длина", sku: "Артикул", perkPickup: "Самовывоз из магазина — бесплатно, завтра",
      perkCourier: "Курьер по Ташкенту — 1–2 дня", perkCert: "С клеймом пробы и сертификатом", bonusFor: (n) => `+${n} бонусных баллов за покупку`,
      descTitle: "Описание", specTitle: "Характеристики", careTitle: "Уход", related: "Похожие украшения", gotIt: "Понятно",
      careText: "Берегите от духов, кремов и воды в бассейне. Протирайте мягкой тканью и храните в отдельной коробочке. Раз в год бесплатно почистим в нашем магазине.",
      spCat: "Категория", spMetal: "Металл", spProbe: "Проба", spWeight: "Вес", spSizes: "Размеры", spMaker: "Производитель", maker: "Завод SOFIZAR, Узбекистан",
      ringGuide: "Размер — это внутренний диаметр кольца в миллиметрах. Измерьте своё кольцо изнутри или приходите в магазин — измерим бесплатно.",
      lenGuide: "Длина цепи и браслета — в сантиметрах. Измерьте запястье ниткой и прибавьте 1–2 см.",
      thSize: "Размер", thDiam: "Диаметр, мм", thLen: "Длина", thFits: "Кому подойдёт", fitS: "Тонкий палец / запястье", fitM: "Средний", fitL: "Широкий",
      d_p1: "Два гладких кольца, обвивающих друг друга: достаточно лёгкое на каждый день и заметное к вечернему образу. Зеркальная полировка.",
      d_p2: "Серьги-кольца в форме капли. Полые внутри, поэтому выглядят объёмно, но не тянут мочку. Английский замок.",
      d_p3: "Гладкая подвеска-капля на тонкой цепочке. Можно выбрать длину, замок — карабин.",
      d_p4: "Браслет-цепь с прямоугольными звеньями. Хорошо сочетается с другими браслетами." },
    en: { addToCart: "Add to bag", inCartAdded: "Added to bag", sizeGuide: "How to find your size", pickSize: "Choose a size",
      sizeRing: "Ring size", sizeLen: "Length", sku: "SKU", perkPickup: "Store pickup — free, ready tomorrow",
      perkCourier: "Courier in Tashkent — 1–2 days", perkCert: "Hallmarked and certified", bonusFor: (n) => `+${n} bonus points with this purchase`,
      descTitle: "Description", specTitle: "Details", careTitle: "Care", related: "You may also like", gotIt: "Got it",
      careText: "Keep away from perfume, lotion and pool water. Wipe with a soft cloth and store in a separate box. We clean it for free once a year in our store.",
      spCat: "Category", spMetal: "Metal", spProbe: "Hallmark", spWeight: "Weight", spSizes: "Sizes", spMaker: "Maker", maker: "SOFIZAR factory, Uzbekistan",
      ringGuide: "Size is the inner diameter of the ring in millimetres. Measure a ring you own or visit our store for a free sizing.",
      lenGuide: "Chain and bracelet length is in centimetres. Measure your wrist with a thread and add 1–2 cm.",
      thSize: "Size", thDiam: "Diameter, mm", thLen: "Length", thFits: "Fits", fitS: "Slim finger / wrist", fitM: "Average", fitL: "Wide",
      d_p1: "Two smooth bands wrapped around each other: light enough for every day, bold enough for evening. Mirror polish.",
      d_p2: "Drop-shaped hoop earrings. Hollow inside, so they look bold without weighing on the earlobe. Hinged lock.",
      d_p3: "A smooth drop pendant on a fine chain. Choose your length; lobster clasp.",
      d_p4: "Paperclip chain bracelet with rectangular links. Easy to stack with other bracelets." },
  });

  const local = { id: 1, size: null, img: 0 };
  const cur = () => byId(local.id) || PRODUCTS[0];
  const addButton = $("#pdAdd", root);
  const removeButton = $("#pdRemove", root);

  function render() {
    const p = cur(), siblings = PRODUCTS.filter((x) => x.key === p.key);
    const quantity = SZ.cartCount(p.id);
    const count = $(".product-cart-count", addButton);
    addButton.classList.toggle("added", state.addedProducts.has(p.id));
    count.hidden = quantity === 0;
    count.textContent = quantity;
    addButton.setAttribute("aria-label", t("addToCart") + (quantity ? " · " + t("cart") + ": " + quantity : ""));
    removeButton.hidden = quantity === 0;
    removeButton.setAttribute("aria-label", t("removeOne") + ": " + t(p.key));
    document.title = `${t(p.key)} — SOFIZAR`;
    $("#pCrumbs", root).innerHTML = [[href("home"), t("home") || "Home"], [href("catalog"), t("catalog")], [href("catalog-" + p.cat), t("c_" + p.cat)]]
      .map(([h, l]) => `<a href="${h}">${l}</a><svg class="ico"><use href="#i-chev"/></svg>`).join("") + `<span>${t(p.key)}</span>`;

    // галерея: фото на белом + фото на модели
    const imgs = [p.img, p.life];
    $("#gMain", root).innerHTML = `<div class="g-frame ${local.img === 0 ? "metal-" + p.metal : ""} ${local.img ? "is-life" : ""}"><span class="media-slot"><img src="assets/img/${imgs[local.img]}" alt="${esc(t(p.key))}"></span></div>`
      + (p.old ? `<span class="tag sale">−${Math.round((1 - p.price / p.old) * 100)}%</span>` : p.tabs.includes("new") ? `<span class="tag">${t("tagNew")}</span>` : "");
    $("#gThumbs", root).innerHTML = imgs.map((src, i) => `<button class="g-thumb ${i === 0 ? "metal-" + p.metal : ""}" role="tab" aria-selected="${local.img === i}" data-img="${i}"><span class="media-slot"><img src="assets/img/${src}" alt=""></span></button>`).join("");

    $("#pdTags", root).innerHTML = `<span class="pill pill-ready">${t("m_" + p.metal)} ${p.probe}</span>`;
    $("#pdName", root).textContent = t(p.key);
    $("#pdSku", root).textContent = `${t("sku")}: ${p.sku}`;
    $("#pdPrice", root).innerHTML = `<b>${money(p.price)}</b>${p.old ? `<s>${money(p.old)}</s><span class="save">−${money(p.old - p.price)}</span>` : ""}`;

    $("#pdMetalName", root).textContent = `${t("m_" + p.metal)} ${p.probe}`;
    $("#pdMetals", root).innerHTML = siblings.map((s) => `<a class="mswatch metal-${s.metal} ${s.id === p.id ? "is-on" : ""}" href="${href("product-" + s.id)}" aria-label="${t("m_" + s.metal)} ${s.probe}" aria-current="${s.id === p.id}">
      <span class="media-slot"><img src="assets/img/${s.img}" alt=""></span><small>${money(s.price).replace(/ .*$/, "")}</small></a>`).join("");

    const hasSizes = !!p.sizes;
    $("#pdSizeBlock", root).hidden = !hasSizes;
    if (hasSizes) {
      $("#pdSizeLabel", root).textContent = p.unit ? t("sizeLen") : t("sizeRing");
      $("#pdSizes", root).innerHTML = p.sizes.map((s) => `<button class="size-chip" role="radio" aria-checked="${local.size === s}" data-size="${s}">${sizeLabel(p, s)}</button>`).join("");
    }
    const fav = $("#pdFav", root); fav.dataset.fav = p.id; fav.setAttribute("aria-pressed", state.favs.has(p.id));
    $("#pdBonus", root).textContent = t("bonusFor", Math.round(p.price * 0.01).toLocaleString("ru-RU").replace(/\s/g, " "));

    $("#pdDesc", root).textContent = t("d_" + p.key);
    const rows = [[t("spCat"), t("c_" + p.cat)], [t("spMetal"), t("m_" + p.metal)], [t("spProbe"), p.probe], [t("spWeight"), "≈ " + grams(p.w)],
      ...(hasSizes ? [[t("spSizes"), p.sizes.map((s) => sizeLabel(p, s)).join(", ")]] : []), [t("sku"), p.sku], [t("spMaker"), t("maker")]];
    $("#pdSpec", root).innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");

    const rel = PRODUCTS.filter((x) => x.id !== p.id && (x.metal === p.metal || x.key === p.key)).sort((a, b) => (b.metal === p.metal) - (a.metal === p.metal) || b.pop - a.pop).slice(0, 4);
    $("#pdRelated", root).innerHTML = rel.map((x) => productCard(x, { noTag: true })).join("");
    $("#relMore", root).href = href("catalog-" + p.cat);
  }

  onRoute((r) => {
    if (!r.startsWith("product-")) return;
    const id = +r.slice(8);
    if (id !== local.id) { local.size = null; local.img = 0; }
    local.id = byId(id) ? id : 1;
    $("#pdSizeErr", root).hidden = true;
    render();
  });

  root.addEventListener("click", (e) => {
    const th = e.target.closest("[data-img]"), sz = e.target.closest(".size-chip");
    if (th) { local.img = +th.dataset.img; render(); }
    if (sz) { local.size = +sz.dataset.size; $("#pdSizeErr", root).hidden = true; render(); }
  });
  addButton.addEventListener("click", () => {
    const p = cur();
    if (p.sizes && local.size == null) {
      const err = $("#pdSizeErr", root); err.textContent = t("pickSize"); err.hidden = false;
      $("#pdSizes .size-chip", root)?.focus(); return;
    }
    addToCart(p.id, local.size ?? undefined);
  });
  removeButton.addEventListener("click", () => {
    const restoreFocus = document.activeElement === removeButton;
    removeOneFromCart(cur().id, local.size);
    if (restoreFocus && removeButton.hidden) addButton.focus({ preventScroll: true });
  });

  // Таблица размеров
  const dlg = $("#sizeGuide", root);
  $("#sizeGuideBtn", root).addEventListener("click", () => {
    const p = cur();
    $("#sgText", root).textContent = p.unit ? t("lenGuide") : t("ringGuide");
    const fit = (i, n) => t(i < n / 3 ? "fitS" : i < (2 * n) / 3 ? "fitM" : "fitL");
    $("#sgTable", root).innerHTML = `<thead><tr><th>${t("thSize")}</th><th>${p.unit ? t("thLen") : t("thDiam")}</th><th>${t("thFits")}</th></tr></thead><tbody>`
      + p.sizes.map((s, i) => `<tr><td>${sizeLabel(p, s)}</td><td>${p.unit ? sizeLabel(p, s) : String(s.toFixed(1)).replace(".", state.lang === "en" ? "." : ",")}</td><td>${fit(i, p.sizes.length)}</td></tr>`).join("") + "</tbody>";
    dlg.showModal();
  });
  $("#sgClose", root).addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

  onChange(render);
})();
