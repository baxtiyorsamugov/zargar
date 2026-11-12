// SOFIZAR — главная страница.
(() => {
  const { t, PRODUCTS, money, productCard, href, $, $$, onChange } = SZ;
  const root = $('main[data-page="home"]'); if (!root) return;

  const CATS = [
    { cat: "rings", img: "category-rings.webp" },
    { cat: "earrings", img: "category-earrings.webp" },
    { cat: "chains", img: "category-necklaces.webp" },
  ];
  const BENEFIT_ICONS = ["i-gem", "i-shield", "i-truck", "i-gift", "i-card"];
  const state = { tab: "new" };

  function renderCats() {
    $("#cats", root).innerHTML = CATS.map((c) => `
      <a class="cat" href="${href("catalog-" + c.cat)}">
        <span class="media-slot"><img src="assets/img/${c.img}" alt="" loading="lazy"></span>
        <span class="cat-label"><span><b>${t("c_" + c.cat)}</b><small>${PRODUCTS.filter((p) => p.cat === c.cat).length} ${t("items")}</small></span>
        <span class="cat-go"><svg class="ico"><use href="#i-arrow"/></svg></span></span>
      </a>`).join("");
  }
  function renderProducts() {
    const list = PRODUCTS.filter((p) => p.tabs.includes(state.tab)).sort((x, y) => y.pop - x.pop).slice(0, 4);
    $("#products", root).innerHTML = list.map((p) => productCard(p)).join("");
    $$("[data-count]", root).forEach((el) => { el.textContent = PRODUCTS.filter((p) => p.tabs.includes(el.dataset.count)).length; });
    $("#tabsMore", root).href = href("catalog-" + state.tab);
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
    const b = e.target.closest(".tab"); if (!b || b.dataset.tab === state.tab) return;
    state.tab = b.dataset.tab;
    $$(".tab", root).forEach((x) => x.setAttribute("aria-selected", x === b));
    renderProducts();
    SZ.fadeSection($("#products", root));
  });

  onChange(render);
})();
