// SOFIZAR — главная страница.
(() => {
  const { t, PRODUCTS, renderProductCards, href, $, $$, onChange } = SZ;
  const root = $('main[data-page="home"]'); if (!root) return;

  const CATS = [
    "rings", "earrings", "bracelets", "chains",
  ];
  const BENEFIT_ICONS = ["i-gem", "i-shield", "i-truck", "i-gift", "i-card"];
  const state = { tab: "new" };
  const seasonAssets = ["spring", "new-year", "march", "birthday"];
  const seasonButtons = $$("[data-season]", root);
  const seasonBanner = $(".season", root);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let seasonPhoto = $("#seasonPhoto", root);
  let season = 0;
  let requestedSeason = season;
  let changingSeason = false;

  const films = $$(".hero-films video", root);
  const filmButtons = $$("[data-film-index]", root);
  const filmArrows = $$("[data-film-step]", root);
  const playButton = $("#heroPlay", root);
  let activeFilm = 0;
  let playing = !reducedMotion.matches;
  let filmInView = false;

  function renderFilmLabels() {
    playButton.setAttribute("aria-label", t(playing ? "pauseFilm" : "playFilm"));
    playButton.classList.toggle("is-paused", !playing);
    filmButtons.forEach((button, index) => {
      button.setAttribute("aria-label", `${t("showFilm")} ${index + 1}`);
      button.setAttribute("aria-pressed", index === activeFilm);
    });
    filmArrows.forEach((button) => {
      button.setAttribute("aria-label", t(button.dataset.filmStep === "-1" ? "prevFilm" : "nextFilm"));
    });
  }

  function updatePlayback() {
    const video = films[activeFilm];
    if (!playing || !filmInView || document.hidden) {
      video.pause();
      return;
    }
    if (!video.hasAttribute("src")) video.src = `assets/video/sofizar-${video.dataset.film}.mp4`;
    video.play().catch((error) => {
      if (error.name === "AbortError" || video !== films[activeFilm]) return;
      playing = false;
      renderFilmLabels();
    });
  }

  function selectFilm(index) {
    if (index === activeFilm) return;
    films[activeFilm].pause();
    activeFilm = index;
    films.forEach((video, i) => video.classList.toggle("is-active", i === index));
    if (films[index].ended) films[index].currentTime = 0;
    renderFilmLabels();
    updatePlayback();
  }

  films.forEach((video, index) => video.addEventListener("ended", () => {
    if (playing && index === activeFilm) selectFilm((index + 1) % films.length);
  }));
  filmButtons.forEach((button, index) => button.addEventListener("click", () => selectFilm(index)));
  filmArrows.forEach((button) => button.addEventListener("click", () => {
    selectFilm((activeFilm + Number(button.dataset.filmStep) + films.length) % films.length);
  }));
  playButton.addEventListener("click", () => {
    playing = !playing;
    renderFilmLabels();
    updatePlayback();
  });
  document.addEventListener("visibilitychange", updatePlayback);
  const filmObserver = new IntersectionObserver(([entry]) => {
    filmInView = entry.isIntersecting;
    updatePlayback();
  });
  filmObserver.observe($(".hero-banner", root));

  function renderSeason() {
    const labels = t("seasons");
    const [, title, description] = labels[season];
    $("#seasonTitle", root).textContent = title;
    $("#seasonText", root).textContent = description;
    $("#seasonCount", root).textContent = `0${season + 1} / 0${seasonAssets.length}`;
    $("#seasonChoices", root).setAttribute("aria-label", t("collections"));
    $("[data-season-step='-1']", root).setAttribute("aria-label", t("prevCollection"));
    $("[data-season-step='1']", root).setAttribute("aria-label", t("nextCollection"));
    seasonButtons.forEach((button, index) => {
      button.textContent = labels[index][0];
      button.setAttribute("aria-pressed", index === season);
    });
  }

  async function changeSeason() {
    if (changingSeason) return;
    changingSeason = true;

    try {
      while (requestedSeason !== season) {
        const next = requestedSeason;
        const photo = new Image();
        photo.alt = seasonPhoto.alt;
        photo.id = seasonPhoto.id;
        photo.src = `assets/img/sofizar/collection-${seasonAssets[next]}.webp`;

        try {
          await photo.decode();
        } catch {
          if (requestedSeason === next) requestedSeason = season;
          continue;
        }
        if (requestedSeason !== next) continue;

        // Keep the previous artwork and copy visible until the new slide can take over.
        let outgoing;
        if (!reducedMotion.matches && seasonBanner.animate) {
          outgoing = seasonBanner.cloneNode(true);
          outgoing.classList.add("season-outgoing");
          outgoing.setAttribute("aria-hidden", "true");
          outgoing.inert = true;
          $$("[id]", outgoing).forEach((element) => element.removeAttribute("id"));
          seasonBanner.append(outgoing);
        }

        seasonPhoto.replaceWith(photo);
        seasonPhoto = photo;
        photo.parentElement.dataset.media = "ready";
        season = next;
        renderSeason();

        if (outgoing) {
          const fade = outgoing.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 420, easing: "ease-in-out", fill: "forwards",
          });
          try {
            await fade.finished;
          } finally {
            outgoing.remove();
          }
        }
      }
    } finally {
      changingSeason = false;
    }
  }

  $("#collections", root).addEventListener("click", (event) => {
    const button = event.target.closest("[data-season], [data-season-step]");
    if (!button) return;
    requestedSeason = button.hasAttribute("data-season") ? Number(button.dataset.season)
      : (requestedSeason + Number(button.dataset.seasonStep) + seasonAssets.length) % seasonAssets.length;
    void changeSeason();
  });

  function renderCats() {
    $("#cats", root).innerHTML = CATS.map((c) => `
      <a class="cat" href="${href("catalog-" + c)}">
        <span class="media-slot"><img src="assets/img/sofizar/category-${c}.webp" alt="" loading="lazy"></span>
        <span class="cat-label"><span><b>${t("c_" + c)}</b><small>${t("ctaCollection")}</small></span>
        <span class="cat-go"><svg class="ico"><use href="#i-arrow"/></svg></span></span>
      </a>`).join("");
  }
  function renderProducts() {
    const list = PRODUCTS.filter((p) => p.tabs.includes(state.tab)).sort((x, y) => y.pop - x.pop).slice(0, 4);
    renderProductCards($("#products", root), list);
    $$("[data-count]", root).forEach((el) => { el.textContent = PRODUCTS.filter((p) => p.tabs.includes(el.dataset.count)).length; });
    $("#tabsMore", root).href = href("catalog-" + state.tab);
  }
  function renderBenefits() {
    $("#benefitList", root).innerHTML = t("b").map(([title, sub], i) => `
      <div class="benefit"><span class="benefit-ico"><svg class="ico"><use href="#${BENEFIT_ICONS[i]}"/></svg></span>
      <span><b>${title}</b><small>${sub}</small></span></div>`).join("");
  }
  let renderedLanguage;
  function render() {
    if (renderedLanguage !== SZ.state.lang) {
      renderFilmLabels(); renderSeason(); renderCats(); renderBenefits();
      renderedLanguage = SZ.state.lang;
    }
    renderProducts();
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
