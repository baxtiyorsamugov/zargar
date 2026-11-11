// SOFIZAR — корзина. Оформление сохраняет заказ в браузере (демо); позже — POST в API → 1С/Битрикс.
(() => {
  const { t, PRODUCTS, byId, state, store, money, grams, sizeLabel, spec, href, esc, $, $$, toast, saveCart, cartCount, productCard, onChange } = SZ;
  const root = $('main[data-page="cart"]'); if (!root) return;

  const COURIER_FEE = 30000;
  const PROMOS = { SOFIZAR10: 0.10 };
  const local = { promo: null, receive: "pickup" };

  function totals() {
    let full = 0, price = 0;
    state.cart.forEach((l) => { const p = byId(l.id); full += (p.old || p.price) * l.qty; price += p.price * l.qty; });
    const promoOff = local.promo ? price * PROMOS[local.promo] : 0;
    const delivery = local.receive === "courier" ? COURIER_FEE : 0;
    const total = price - promoOff + delivery;
    return { full, discount: full - price + promoOff, delivery, total, bonus: Math.round((price - promoOff) * 0.01) };
  }

  function lineHTML(l, i) {
    const p = byId(l.id);
    const sizes = p.sizes ? `
      <label class="mini-field"><span>${t("size")}</span>
        <select data-size="${i}">${p.sizes.map((s) => `<option value="${s}" ${s === l.size ? "selected" : ""}>${sizeLabel(p, s)}</option>`).join("")}</select>
      </label>` : "";
    return `
    <li class="cart-line">
      <a class="cl-img metal-${p.metal}" href="${href("product-" + p.id)}"><img src="assets/img/${p.img}" alt="${esc(t(p.key))}"></a>
      <div class="cl-info">
        <a class="cl-name" href="${href("product-" + p.id)}">${t(p.key)}</a>
        <span class="p-meta">${spec(p)}</span>
        <div class="cl-controls">
          ${sizes}
          <div class="stepper" role="group" aria-label="${esc(t("qty"))}">
            <button data-dec="${i}" aria-label="−" ${l.qty === 1 ? "disabled" : ""}><svg class="ico"><use href="#i-minus"/></svg></button>
            <output aria-live="polite">${l.qty}</output>
            <button data-inc="${i}" aria-label="+"><svg class="ico"><use href="#i-plus"/></svg></button>
          </div>
        </div>
      </div>
      <div class="cl-side">
        <span class="cl-price">${p.old ? `<s>${money(p.old * l.qty)}</s>` : ""}<b>${money(p.price * l.qty)}</b></span>
        <div class="cl-actions">
          <button class="icon-text" data-fav="${p.id}" aria-pressed="${state.favs.has(p.id)}"><svg class="ico"><use href="#i-heart"/></svg><span>${t("toFav")}</span></button>
          <button class="icon-text" data-remove="${i}"><svg class="ico"><use href="#i-trash"/></svg><span>${t("remove")}</span></button>
        </div>
      </div>
    </li>`;
  }

  function render() {
    const n = cartCount(), empty = n === 0, s = totals();
    $("#cartFull", root).hidden = empty;
    $("#cartEmpty", root).hidden = !empty;
    $("#cartSub", root).textContent = empty ? t("cartEmptySub") : t("cartSub", n, money(s.total));
    if (empty) return;

    $("#cartLines", root).innerHTML = state.cart.map(lineHTML).join("");
    $$("[data-href]", root).forEach((el) => { el.href = SZ.href(el.dataset.href); });
    $("#sumItemsLabel", root).textContent = `${t("subtotal")} (${n})`;
    $("#sumItems", root).textContent = money(s.full);
    $("#sumDiscRow", root).hidden = s.discount === 0;
    $("#sumDisc", root).textContent = "−" + money(s.discount);
    $("#sumDel", root).textContent = s.delivery ? money(s.delivery) : t("free");
    $("#sumDel", root).classList.toggle("free", !s.delivery);
    $("#sumTotal", root).textContent = money(s.total);
    $("#bonusEarn", root).textContent = t("bonusEarn", s.bonus.toLocaleString("ru-RU").replace(/\s/g, " "));

    const inCart = new Set(state.cart.map((l) => l.id));
    const recs = PRODUCTS.filter((p) => !inCart.has(p.id)).sort((a, b) => b.pop - a.pop);
    $(".recs", root).hidden = recs.length === 0;
    $("#recs", root).innerHTML = recs.slice(0, 3).map((p) => productCard(p, { noTag: true })).join("");
  }

  // Количество, размер, удаление
  root.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]"), rm = e.target.closest("[data-remove]");
    if (inc) { state.cart[+inc.dataset.inc].qty++; saveCart(); }
    if (dec) { const l = state.cart[+dec.dataset.dec]; if (l.qty > 1) { l.qty--; saveCart(); } }
    if (rm) {
      const i = +rm.dataset.remove, [line] = state.cart.splice(i, 1);
      saveCart();
      toast(t("removed"), { label: t("undo"), fn: () => { state.cart.splice(i, 0, line); saveCart(); } });
    }
  });
  root.addEventListener("change", (e) => {
    const sel = e.target.closest("[data-size]"); if (!sel) return;
    const i = +sel.dataset.size, l = state.cart[i], size = +sel.value;
    const twin = state.cart.findIndex((x, j) => j !== i && x.id === l.id && x.size === size);
    if (twin >= 0) { state.cart[twin].qty += l.qty; state.cart.splice(i, 1); } else l.size = size;
    saveCart();
  });

  // Способ получения
  $("#receive", root).addEventListener("change", (e) => {
    local.receive = e.target.value;
    $("#storeField", root).hidden = local.receive !== "pickup";
    $("#addrField", root).hidden = local.receive !== "courier";
    render();
  });

  // Промокод
  $("#promoForm", root).addEventListener("submit", (e) => {
    e.preventDefault();
    const code = $("#promoInput", root).value.trim().toUpperCase(), msg = $("#promoMsg", root);
    msg.hidden = false;
    if (PROMOS[code]) { local.promo = code; msg.textContent = t("promoOk"); msg.className = "promo-msg ok"; }
    else { local.promo = null; msg.textContent = t("promoBad"); msg.className = "promo-msg bad"; }
    render();
  });

  // Оформление
  const dlg = $("#checkout", root);
  $("#checkoutBtn", root).addEventListener("click", () => {
    $("#coStep", root).hidden = false; $("#coDone", root).hidden = true;
    $("#coSummary", root).textContent = `${t("cartSub", cartCount(), money(totals().total))}. ${t(local.receive === "pickup" ? "pickup" : "courier")}.`;
    dlg.showModal();
  });
  $("#coCancel", root).addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  $("#coForm", root).addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#coName", root), phone = $("#coPhone", root);
    const nameHint = $("#coNameHint", root), phoneHint = $("#coPhoneHint", root);
    nameHint.hidden = !!name.value.trim(); nameHint.textContent = t("coNameErr"); nameHint.classList.add("err");
    const okPhone = phone.value.replace(/\D/g, "").length === 12;
    phoneHint.textContent = okPhone ? t("coPhoneHint") : t("coPhoneErr"); phoneHint.classList.toggle("err", !okPhone);
    if (!name.value.trim()) return name.focus();
    if (!okPhone) return phone.focus();

    const orders = store.get("sz-orders", []);
    const id = "SZ-" + (24118 + orders.length);
    const s = totals();
    orders.unshift({ id, date: new Date().toISOString(), status: "new", receive: local.receive, items: state.cart.map((l) => ({ ...l })), total: s.total });
    store.set("sz-orders", orders);
    const bonus = store.get("sz-bonus-extra", []); bonus.unshift({ id, pts: s.bonus, date: new Date().toISOString() }); store.set("sz-bonus-extra", bonus);
    state.cart.splice(0); local.promo = null;
    $("#coStep", root).hidden = true; $("#coDone", root).hidden = false;
    $("#coDoneText", root).textContent = t("doneText", id);
    $$("[data-href]", dlg).forEach((el) => { el.href = SZ.href(el.dataset.href); el.onclick = () => dlg.close(); });
    saveCart();
  });

  onChange(render);
})();
