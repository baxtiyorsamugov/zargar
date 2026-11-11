// SOFIZAR — главная. Данные ниже — пример; в продакшене приходят из API, которое берёт их из 1С.
(() => {
  const CATEGORIES = [
    { id: "ring",     name: "Кольца",       icon: "i-ring",     count: 412 },
    { id: "earrings", name: "Серьги",       icon: "i-earrings", count: 286 },
    { id: "pendant",  name: "Подвески",     icon: "i-pendant",  count: 154 },
    { id: "chain",    name: "Цепи",         icon: "i-chain",    count: 98 },
    { id: "bracelet", name: "Браслеты",     icon: "i-bracelet", count: 121 },
    { id: "wedding",  name: "Обручальные",  icon: "i-wedding",  count: 67 },
  ];

  const PRODUCTS = [
    { sku: "SZ-10241", cat: "ring",     name: "Кольцо «Афросиаб»",     metal: "yellow", probe: 585, weight: 3.2, stone: "топаз",        price: 4850000,  stock: 3, isNew: true },
    { sku: "SZ-20117", cat: "earrings", name: "Серьги «Регистан»",      metal: "white",  probe: 585, weight: 4.1, stone: "фианиты",      price: 5390000,  stock: 5, isNew: true },
    { sku: "SZ-30422", cat: "pendant",  name: "Подвеска «Гирих»",       metal: "rose",   probe: 585, weight: 1.8, stone: "бирюза",       price: 2690000,  stock: 2, isNew: false },
    { sku: "SZ-40012", cat: "chain",    name: "Цепь «Бисмарк», 50 см",  metal: "yellow", probe: 585, weight: 7.6, stone: null,           price: 8120000,  stock: 4, isNew: false },
    { sku: "SZ-50308", cat: "bracelet", name: "Браслет «Шахризабз»",    metal: "rose",   probe: 585, weight: 5.4, stone: "фианиты",      price: 6740000,  stock: 1, isNew: true },
    { sku: "SZ-60051", cat: "wedding",  name: "Обручальное кольцо",     metal: "white",  probe: 750, weight: 4.0, stone: null,           price: 7280000,  stock: 6, isNew: false },
    { sku: "SZ-10388", cat: "ring",     name: "Кольцо «Сузане»",        metal: "rose",   probe: 585, weight: 2.7, stone: "аметист",      price: 3980000,  stock: 2, isNew: false },
    { sku: "SZ-20290", cat: "earrings", name: "Серьги-пусеты «Капля»",  metal: "yellow", probe: 750, weight: 2.2, stone: "бриллианты",   price: 12400000, stock: 1, isNew: true },
  ];

  const STORES = [
    { id: "s1", name: "SOFIZAR Чиланзар",    area: "Чиланзарский район", hours: "10:00–21:00" },
    { id: "s2", name: "SOFIZAR Юнусабад",    area: "Юнусабадский район", hours: "10:00–21:00" },
    { id: "s3", name: "SOFIZAR Мирабад",     area: "Мирабадский район",  hours: "10:00–20:00" },
  ];

  const METAL = { yellow: "жёлтое золото", white: "белое золото", rose: "красное золото" };
  const $ = (s, r = document) => r.querySelector(s);
  const money = (n) => n.toLocaleString("ru-RU").replace(/ |,/g, " ") + " сум";
  const weight = (n) => n.toLocaleString("ru-RU", { minimumFractionDigits: 1 }) + " г";
  const iconFor = (cat) => CATEGORIES.find((c) => c.id === cat).icon;

  const state = { metal: "all", cat: null, favs: new Set(), reserved: 0, current: null };
  try { JSON.parse(localStorage.getItem("sz-favs") || "[]").forEach((s) => state.favs.add(s)); } catch (e) {}

  // Категории
  $("#cats").innerHTML = CATEGORIES.map((c) => `
    <button class="cat" data-cat="${c.id}" aria-pressed="false">
      <svg aria-hidden="true"><use href="#${c.icon}"/></svg>
      <b>${c.name}</b><span>${c.count} изделий</span>
    </button>`).join("");

  // Каталог
  const grid = $("#grid");
  grid.innerHTML = PRODUCTS.map((p) => `
    <article class="card" data-sku="${p.sku}" data-metal="${p.metal}" data-cat="${p.cat}">
      <div class="tile" data-metal="${p.metal}">
        ${p.isNew ? '<span class="new">Новинка</span>' : ""}
        <svg class="piece" viewBox="0 0 120 120" aria-hidden="true"><use href="#${iconFor(p.cat)}"/></svg>
        <button class="icon-btn fav" aria-label="В избранное: ${p.name}" aria-pressed="${state.favs.has(p.sku)}">
          <svg viewBox="0 0 24 24"><use href="#i-heart"/></svg>
        </button>
      </div>
      <h3>${p.name}</h3>
      <p class="specs">${METAL[p.metal][0].toUpperCase() + METAL[p.metal].slice(1)} ${p.probe}, ${weight(p.weight)}${p.stone ? ", " + p.stone : ""}</p>
      <div class="card-foot">
        <span class="price">${money(p.price)}</span>
        <span class="stock">${p.stock === 1 ? "Последнее" : `В наличии: ${p.stock}`}</span>
      </div>
      <button class="btn btn-ghost reserve-btn">Забронировать</button>
    </article>`).join("");

  function applyFilters() {
    let shown = 0;
    grid.querySelectorAll(".card").forEach((card) => {
      const ok = (state.metal === "all" || card.dataset.metal === state.metal) && (!state.cat || card.dataset.cat === state.cat);
      card.hidden = !ok; if (ok) shown++;
    });
    $("#empty").hidden = shown > 0;
  }

  $("#filters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip"); if (!chip) return;
    state.metal = chip.dataset.metal;
    $("#filters").querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === chip));
    applyFilters();
  });

  $("#cats").addEventListener("click", (e) => {
    const btn = e.target.closest(".cat"); if (!btn) return;
    state.cat = state.cat === btn.dataset.cat ? null : btn.dataset.cat;
    $("#cats").querySelectorAll(".cat").forEach((c) => {
      const on = c.dataset.cat === state.cat;
      c.setAttribute("aria-pressed", on);
      c.style.borderColor = on ? "var(--gold)" : "";
      c.style.background = on ? "var(--surface)" : "";
    });
    const h = $("#catalog h2");
    h.textContent = state.cat ? CATEGORIES.find((c) => c.id === state.cat).name : "Новинки сезона";
    applyFilters();
    $("#catalog").scrollIntoView({ behavior: "smooth" });
  });

  // Избранное
  const favBadge = $("#favCount");
  const syncFavs = () => {
    favBadge.textContent = state.favs.size; favBadge.hidden = state.favs.size === 0;
    try { localStorage.setItem("sz-favs", JSON.stringify([...state.favs])); } catch (e) {}
  };
  syncFavs();

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card"); if (!card) return;
    const p = PRODUCTS.find((x) => x.sku === card.dataset.sku);
    if (e.target.closest(".fav")) {
      const btn = e.target.closest(".fav");
      const on = !state.favs.has(p.sku);
      on ? state.favs.add(p.sku) : state.favs.delete(p.sku);
      btn.setAttribute("aria-pressed", on);
      syncFavs();
      toast(on ? "Добавлено в избранное" : "Убрано из избранного");
    } else if (e.target.closest(".reserve-btn")) {
      openReserve(p);
    }
  });

  // Магазины
  $("#storeList").innerHTML = STORES.map((s) => `
    <div class="store"><b>${s.name}</b><span>${s.area}</span><span class="open">Ежедневно ${s.hours}</span></div>`).join("");
  $("#rStore").innerHTML = STORES.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");

  // Бронь
  const dlg = $("#reserve"), form = $("#reserveForm");
  const formHTML = form.innerHTML;
  function openReserve(p) {
    state.current = p;
    form.innerHTML = formHTML;
    $("#rStore").innerHTML = STORES.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");
    $("#reserveItem").innerHTML = `
      <div class="tile" data-metal="${p.metal}"><svg viewBox="0 0 120 120" aria-hidden="true"><use href="#${iconFor(p.cat)}"/></svg></div>
      <div><b>${p.name}</b><p class="specs">${money(p.price)}, артикул ${p.sku}</p></div>`;
    $("#reserveCancel").onclick = () => dlg.close();
    dlg.showModal();
    $("#rName").focus();
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#rName"), phone = $("#rPhone");
    const digits = phone.value.replace(/\D/g, "");
    if (!name.value.trim()) { name.focus(); return; }
    if (digits.length !== 12) {
      $("#rPhoneHint").textContent = "Введите номер полностью: +998 и 9 цифр";
      $("#rPhoneHint").style.color = "var(--gold)";
      phone.focus(); return;
    }
    const store = STORES.find((s) => s.id === $("#rStore").value);
    state.reserved++;
    $("#resCount").textContent = state.reserved; $("#resCount").hidden = false;
    form.innerHTML = `
      <div class="done">
        <b>Забронировано</b>
        <p>${state.current.name} ждёт вас в магазине ${store.name} 48 часов. Мы позвоним на ${phone.value.trim()}, чтобы подтвердить.</p>
        <p class="hint">Прототип: заявка никуда не отправляется.</p>
        <button type="button" class="btn btn-primary" id="doneBtn">Готово</button>
      </div>`;
    $("#doneBtn").onclick = () => dlg.close();
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

  // Шапка и меню
  const header = $("#header");
  const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const menuBtn = $("#menuBtn"), nav = $("#nav");
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", (e) => { if (e.target.tagName === "A") { nav.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", false); } });

  // Тост
  let tt;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("is-on");
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove("is-on"), 2000);
  }
})();
