// SOFIZAR — личный кабинет. Пользователь и заказы — пример; позже — из API (1С/Битрикс).
(() => {
  const { t, PRODUCTS, byId, state, store, money, sizeLabel, date, esc, href, $, $$, toast, productCard, onChange, applyLang } = SZ;
  const root = $('main[data-page="account"]'); if (!root) return;

  const SEED_ORDERS = [
    { id: "SZ-24117", date: "2026-11-09T15:20:00", status: "ready", receive: "pickup", items: [{ id: 2, qty: 1 }], total: 7990000 },
    { id: "SZ-23980", date: "2026-10-28T11:05:00", status: "done", receive: "courier", items: [{ id: 1, size: 17, qty: 1 }, { id: 4, size: 18, qty: 1 }], total: 14710000 },
    { id: "SZ-23512", date: "2026-10-02T18:40:00", status: "done", receive: "pickup", items: [{ id: 3, size: 45, qty: 1 }], total: 5480000 },
  ];
  const SEED_LEDGER = [
    { kind: "earn", id: "SZ-23980", pts: 147100, date: "2026-10-28" },
    { kind: "spend", id: "SZ-23512", pts: -100000, date: "2026-10-02" },
    { kind: "earn", id: "SZ-23512", pts: 54800, date: "2026-10-02" },
    { kind: "bday", pts: 100000, date: "2026-05-14" },
  ];
  const BASE_POINTS = 201900, GOLD_AT = 500000;
  const ACTIVE = ["new", "prep", "ready", "way"];
  const STEP = { new: 0, prep: 1, ready: 2, way: 2, done: 3 };

  const local = { tab: "account", otab: "active", open: null, addingAddr: false };
  const profile = Object.assign({ first: "Dilnoza", last: "Karimova", phone: "+998 90 123 45 67", email: "dilnoza@example.com", bday: "1994-05-14", sms: true, tg: false }, store.get("sz-profile", {}));
  let addresses = store.get("sz-addr", null) || [{ titleKey: "home", text: "Toshkent, Chilonzor tumani, Bunyodkor ko'chasi 12, 45-xonadon", main: true }];

  const orders = () => [...store.get("sz-orders", []), ...SEED_ORDERS];
  const ledger = () => [...store.get("sz-bonus-extra", []).map((b) => ({ kind: "earn", id: b.id, pts: b.pts, date: b.date })), ...SEED_LEDGER];
  const points = () => BASE_POINTS + store.get("sz-bonus-extra", []).reduce((s, b) => s + b.pts, 0);
  const num = (n) => n.toLocaleString("ru-RU").replace(/\s/g, " ");
  const pill = (st) => `<span class="pill pill-${st}">${t("st_" + st)}</span>`;

  /* ---------- Заказы ---------- */
  function orderHTML(o) {
    const d = new Date(o.date), open = local.open === o.id;
    const count = o.items.reduce((n, l) => n + l.qty, 0);
    const thumbs = o.items.slice(0, 3).map((l) => `<span class="metal-${byId(l.id).metal}"><span class="media-slot"><img src="assets/img/${byId(l.id).img}" alt=""></span></span>`).join("");
    const step = STEP[o.status];
    return `
    <li class="order ${open ? "is-open" : ""} ${ACTIVE.includes(o.status) ? "is-active" : ""}">
      <button class="order-row" data-open="${o.id}" aria-expanded="${open}">
        <span class="o-when"><b>${date(o.date)}</b><small>${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}</small></span>
        <span class="o-main"><b>${t("order")} ${o.id}</b><small>${t("pieces", count)}, ${t(o.receive === "pickup" ? "pickup" : "courier").toLowerCase()}</small></span>
        <span class="o-thumbs">${thumbs}</span>
        <span class="o-total">${money(o.total)}</span>
        ${pill(o.status)}
        <svg class="ico o-chev"><use href="#i-chev"/></svg>
      </button>
      ${open ? `
      <div class="order-detail">
        <ol class="steps">${t("steps").map((s, i) => `<li class="${i < step ? "done" : i === step ? "now" : ""}"><span class="dot">${i < step || (i === step && o.status === "done") ? '<svg class="ico"><use href="#i-check"/></svg>' : i + 1}</span>${s}</li>`).join("")}</ol>
        <div class="od-items"><small>${t("orderItems")}</small>
          ${o.items.map((l) => { const p = byId(l.id); return `<div class="od-item"><a class="metal-${p.metal}" href="${href("product-" + p.id)}"><span class="media-slot"><img src="assets/img/${p.img}" alt=""></span></a><span><b>${t(p.key)}</b><small>${l.size ? `${t("size")} ${sizeLabel(p, l.size)}, ` : ""}${l.qty} ${t("items")}</small></span><span class="od-price">${money(p.price * l.qty)}</span></div>`; }).join("")}
        </div>
        <button class="btn btn-light btn-sm" data-repeat="${o.id}"><svg class="ico"><use href="#i-bag"/></svg><span>${t("repeat")}</span></button>
      </div>` : ""}
    </li>`;
  }
  function renderOrders() {
    const all = orders(), act = all.filter((o) => ACTIVE.includes(o.status)), hist = all.filter((o) => !ACTIVE.includes(o.status));
    const list = local.otab === "active" ? act : hist;
    $("#oActiveN", root).textContent = act.length; $("#oHistN", root).textContent = hist.length;
    $("#orderList", root).innerHTML = list.length ? list.map(orderHTML).join("") : `<li class="muted-empty">${t("noOrders")}</li>`;
    $("#recentOrders", root).innerHTML = all.slice(0, 3).map(orderHTML).join("");
    $("#nOrders", root).textContent = act.length || ""; $("#stActive", root).textContent = act.length;
  }
  root.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]"), r = e.target.closest("[data-repeat]"), ot = e.target.closest("[data-otab]");
    if (o) { local.open = local.open === o.dataset.open ? null : o.dataset.open; renderOrders(); }
    if (r) { orders().find((x) => x.id === r.dataset.repeat).items.forEach((l) => { for (let i = 0; i < l.qty; i++) SZ.addToCart(l.id, l.size); }); }
    if (ot) { local.otab = ot.dataset.otab; $$("[data-otab]", root).forEach((b) => b.setAttribute("aria-selected", b === ot)); renderOrders(); }
  });

  /* ---------- Избранное ---------- */
  function renderFavs() {
    const favs = PRODUCTS.filter((p) => state.favs.has(p.id));
    $("#favList", root).innerHTML = favs.length ? favs.map((p) => productCard(p, { noTag: true })).join("")
      : `<p class="muted-empty">${t("favEmpty")}</p>`;
    $("#nFavs", root).textContent = favs.length || ""; $("#stFavs", root).textContent = favs.length;
  }

  /* ---------- Бонусы ---------- */
  function renderBonus() {
    const pts = points(), gold = pts >= GOLD_AT;
    $("#stBonus", root).textContent = num(pts);
    $("#bonusBig", root).textContent = num(pts);
    $("#bonusLevel", root).textContent = t(gold ? "lvlGold" : "lvlSilver");
    $("#levelChip span", root).textContent = `${t("level")}: ${t(gold ? "lvlGold" : "lvlSilver")}`;
    $("#bonusBar", root).style.width = Math.min(100, (pts / GOLD_AT) * 100) + "%";
    $("#bonusNext", root).textContent = gold ? "" : t("toNext", num(GOLD_AT - pts));
    $("#ledger", root).innerHTML = ledger().map((l) => `
      <li><span class="lg-ico ${l.pts < 0 ? "minus" : ""}"><svg class="ico"><use href="#${l.kind === "bday" ? "i-gift" : l.pts < 0 ? "i-tag" : "i-star"}"/></svg></span>
      <span><b>${l.kind === "bday" ? t("birthday") : l.pts < 0 ? t("spentOn", l.id) : t("earnFor", l.id)}</b><small>${date(l.date)}</small></span>
      <b class="lg-pts ${l.pts < 0 ? "minus" : ""}">${l.pts > 0 ? "+" : "−"}${num(Math.abs(l.pts))}</b></li>`).join("");
  }

  /* ---------- Адреса ---------- */
  const addrTitle = (a) => a.titleKey === "home" ? ({ uz: "Uy", ru: "Дом", en: "Home" })[state.lang] : a.title;
  function renderAddr() {
    $("#addrList", root).innerHTML = addresses.map((a, i) => `
      <div class="addr ${a.main ? "is-main" : ""}">
        <span class="addr-ico"><svg class="ico"><use href="#i-map"/></svg></span>
        <span class="addr-text"><b>${esc(addrTitle(a))}</b>${a.main ? `<span class="pill pill-ready">${t("mainAddr")}</span>` : ""}<small>${esc(a.text)}</small></span>
        <button class="icon-btn" data-del-addr="${i}" aria-label="${t("remove")}"><svg class="ico"><use href="#i-trash"/></svg></button>
      </div>`).join("");
  }
  $("#addAddrBtn", root).addEventListener("click", () => { const f = $("#addrForm", root); f.hidden = !f.hidden; if (!f.hidden) $("#aTitle", root).focus(); });
  $("#addrForm", root).addEventListener("submit", (e) => {
    e.preventDefault();
    const title = $("#aTitle", root).value.trim(), text = $("#aText", root).value.trim();
    if (!text) return $("#aText", root).focus();
    addresses.push({ title: title || t("address"), text, main: addresses.length === 0 });
    store.set("sz-addr", addresses); e.target.reset(); e.target.hidden = true; renderAddr(); toast(t("saved"));
  });
  $("#addrList", root).addEventListener("click", (e) => {
    const d = e.target.closest("[data-del-addr]"); if (!d) return;
    const [gone] = addresses.splice(+d.dataset.delAddr, 1);
    if (gone.main && addresses[0]) addresses[0].main = true;
    store.set("sz-addr", addresses); renderAddr();
  });

  /* ---------- Профиль ---------- */
  function fillProfile() {
    $("#pFirst", root).value = profile.first; $("#pLast", root).value = profile.last; $("#pPhone", root).value = profile.phone;
    $("#pEmail", root).value = profile.email; $("#pBday", root).value = profile.bday; $("#pLang", root).value = state.lang;
    $("#pSms", root).checked = profile.sms; $("#pTg", root).checked = profile.tg;
  }
  $("#profileForm", root).addEventListener("submit", (e) => {
    e.preventDefault();
    Object.assign(profile, { first: $("#pFirst", root).value.trim() || profile.first, last: $("#pLast", root).value.trim(), phone: $("#pPhone", root).value.trim(),
      email: $("#pEmail", root).value.trim(), bday: $("#pBday", root).value, sms: $("#pSms", root).checked, tg: $("#pTg", root).checked });
    store.set("sz-profile", profile);
    const lang = $("#pLang", root).value;
    if (lang !== state.lang) { state.lang = lang; store.set("sz-lang", lang); applyLang(); } else renderHead();
    toast(t("saved"));
  });
  $("#logout", root).addEventListener("click", () => toast(t("logoutDemo")));

  /* ---------- Вкладки кабинета ---------- */
  function renderHead() {
    $("#hello", root).textContent = t("hello", profile.first);
    $("#accName", root).textContent = `${profile.first} ${profile.last}`.trim();
    $("#accPhone", root).textContent = profile.phone;
    $("#avatar", root).textContent = (profile.first[0] || "") + (profile.last[0] || "");
  }
  function showTab(tab) {
    local.tab = ["account", "orders", "favorites", "bonus", "addresses", "profile"].includes(tab) ? tab : "account";
    $$(".acc-pane", root).forEach((p) => (p.hidden = p.dataset.pane !== local.tab));
    $$("#accMenu a", root).forEach((a) => a.classList.toggle("is-current", a.dataset.tab === local.tab));
    if (document.body.dataset.page === "account") $$(".actions .action").forEach((a) => a.classList.toggle("is-current", a.dataset.nav === (local.tab === "favorites" ? "favorites" : "account")));
  }
  $$("#accMenu a", root).forEach((a) => { a.href = href(a.dataset.tab); });
  $$("[data-href]", root).forEach((a) => { a.href = href(a.dataset.href); });
  if (SZ.SPA) addEventListener("sz:route", (e) => showTab(e.detail));
  else { addEventListener("hashchange", () => showTab(location.hash.slice(1))); showTab(location.hash.slice(1)); }

  function render() { renderHead(); renderOrders(); renderFavs(); renderBonus(); renderAddr(); $("#pLang", root).value = state.lang; }
  fillProfile();
  onChange(render);
})();
