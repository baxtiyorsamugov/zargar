// SOFIZAR — главная страница.
(() => {
  const { t, PRODUCTS, money, productCard, $, $$, onChange } = SZ;
  const root = $('main[data-page="home"]'); if (!root) return;

  const CATS = [
    { key: "c_rings", img: "category-rings.webp", n: 412 },
    { key: "c_earrings", img: "category-earrings.webp", n: 286 },
    { key: "c_chains", img: "category-necklaces.webp", n: 252 },
  ];
  const BENEFIT_ICONS = ["i-gem", "i-shield", "i-truck", "i-gift", "i-card"];
  const state = { tab: "new", q: "" };

  function renderCats() {
    $("#cats", root).innerHTML = CATS.map((c) => `
      <a class="cat" href="#new">
        <img src="assets/img/${c.img}" alt="" loading="lazy">
        <span class="cat-label"><span><b>${t(c.key)}</b><small>${c.n} ${t("items")}</small></span>
        <span class="cat-go"><svg class="ico"><use href="#i-arrow"/></svg></span></span>
      </a>`).join("");
  }
  function renderProducts() {
    const q = state.q.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => p.tabs.includes(state.tab) && (!q || t(p.key).toLowerCase().includes(q)));
    $("#products", root).innerHTML = list.length ? list.map((p) => productCard(p)).join("")
      : `<p class="muted-empty">${t("empty")}</p>`;
    $$("[data-count]", root).forEach((el) => { el.textContent = PRODUCTS.filter((p) => p.tabs.includes(el.dataset.count)).length; });
  }
  function renderBenefits() {
    $("#benefitList", root).innerHTML = t("b").map(([title, sub], i) => `
      <div class="benefit"><span class="benefit-ico"><svg class="ico"><use href="#${BENEFIT_ICONS[i]}"/></svg></span>
      <span><b>${title}</b><small>${sub}</small></span></div>`).join("");
  }
  function render() {
    $(".hero-badge .price", root).textContent = money(PRODUCTS[0].price);
    renderCats(); renderProducts(); renderBenefits();
  }

  $("#tabs", root).addEventListener("click", (e) => {
    const b = e.target.closest(".tab"); if (!b) return;
    state.tab = b.dataset.tab;
    $$(".tab", root).forEach((x) => x.setAttribute("aria-selected", x === b));
    renderProducts();
  });

  function setQuery(q) {
    state.q = q;
    if (q && state.tab !== "new") { state.tab = "new"; $$(".tab", root).forEach((x) => x.setAttribute("aria-selected", x.dataset.tab === "new")); }
    renderProducts();
  }
  const search = $("#search");
  search.addEventListener("input", () => { if (document.body.dataset.page === "home") setQuery(search.value); });
  search.addEventListener("keydown", (e) => { if (e.key === "Enter" && document.body.dataset.page === "home") $("#new").scrollIntoView({ behavior: "smooth" }); });
  const pickQuery = () => { const q = sessionStorage.getItem("sz-q"); if (q != null) { sessionStorage.removeItem("sz-q"); search.value = q; setQuery(q); } };
  addEventListener("sz:route", pickQuery);
  pickQuery();

  onChange(render);
})();
