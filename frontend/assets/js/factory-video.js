// Shared factory player for the home and about pages.
(() => {
  const { t, $, onChange } = SZ;
  const root = document;
  if (!$("#factoryPlayer")) return;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  SZ.extend({
    uz: {
      factoryVideo: "SOFIZAR zavodi haqida video", videoVolume: "Ovoz balandligi",
      videoUnmute: "Ovozni yoqish", videoMute: "Ovozni oʻchirish",
      videoFullscreen: "Toʻliq ekran", videoExitFullscreen: "Toʻliq ekrandan chiqish",
      videoError: "Videoni yuklab boʻlmadi. Qayta urinib koʻring.",
    },
    ru: {
      factoryVideo: "Видео о заводе SOFIZAR", videoVolume: "Громкость",
      videoUnmute: "Включить звук", videoMute: "Выключить звук",
      videoFullscreen: "На весь экран", videoExitFullscreen: "Выйти из полноэкранного режима",
      videoError: "Не удалось загрузить видео. Попробуйте ещё раз.",
    },
    en: {
      factoryVideo: "About the SOFIZAR factory", videoVolume: "Volume",
      videoUnmute: "Unmute", videoMute: "Mute",
      videoFullscreen: "Fullscreen", videoExitFullscreen: "Exit fullscreen",
      videoError: "The video could not load. Please try again.",
    },
  });
  const factoryPlayer = $("#factoryPlayer", root);
  const factoryVideo = $("#factoryVideo", root);
  const factoryPlay = $("#factoryPlay", root);
  const factoryMute = $("#factoryMute", root);
  const factoryVolume = $("#factoryVolume", root);
  const factoryFullscreen = $("#factoryFullscreen", root);
  const factoryTime = $("#factoryTime", root);
  const factoryStatus = $("#factoryStatus", root);
  const factoryDialog = $("#factoryDialog");
  const factorySlot = document.createComment("Factory video position");
  let factoryInView = false;
  let factoryWantsPlay = !reducedMotion.matches;
  factoryVideo.volume = .65;

  function renderFactoryLabels() {
    const muted = factoryVideo.muted || factoryVideo.volume === 0;
    factoryPlayer.dataset.paused = String(factoryVideo.paused);
    factoryPlayer.dataset.muted = String(muted);
    factoryPlayer.setAttribute("aria-label", t("factoryVideo"));
    factoryVideo.setAttribute("aria-label", t("factoryVideo"));
    factoryPlay.setAttribute("aria-label", t(factoryVideo.paused ? "playFilm" : "pauseFilm"));
    factoryMute.setAttribute("aria-label", t(muted ? "videoUnmute" : "videoMute"));
    factoryVolume.setAttribute("aria-label", t("videoVolume"));
    factoryVolume.value = muted ? "0" : String(factoryVideo.volume);
    factoryVolume.style.setProperty("--video-progress", Number(factoryVolume.value) * 100 + "%");
    factoryFullscreen.setAttribute("aria-label", t(document.fullscreenElement === factoryPlayer || factoryDialog.open ? "videoExitFullscreen" : "videoFullscreen"));
    factoryDialog.setAttribute("aria-label", t("factoryVideo"));
    if (!factoryStatus.hidden) factoryStatus.textContent = t("videoError");
  }

  function updateFactoryPlayback() {
    if (!factoryInView || document.hidden || !factoryWantsPlay) {
      factoryVideo.pause();
      return;
    }
    if (!factoryVideo.hasAttribute("src")) factoryVideo.src = factoryVideo.dataset.src;
    factoryVideo.play().catch((error) => {
      if (error.name === "AbortError") return;
      factoryWantsPlay = false;
      renderFactoryLabels();
    });
  }
  factoryPlay.addEventListener("click", () => {
    factoryWantsPlay = factoryVideo.paused;
    if (factoryVideo.error) {
      factoryStatus.hidden = true;
      factoryVideo.load();
    }
    updateFactoryPlayback();
  });
  factoryMute.addEventListener("click", () => {
    const muted = factoryVideo.muted || factoryVideo.volume === 0;
    if (muted && factoryVideo.volume === 0) factoryVideo.volume = .65;
    factoryVideo.muted = !muted;
  });
  factoryVolume.addEventListener("input", () => {
    factoryVideo.volume = Number(factoryVolume.value);
    factoryVideo.muted = factoryVideo.volume === 0;
  });
  const videoTime = (seconds) => {
    const value = Number.isFinite(seconds) ? Math.floor(seconds) : 0;
    return Math.floor(value / 60) + ":" + String(value % 60).padStart(2, "0");
  };
  const updateFactoryTime = () => {
    const duration = factoryVideo.duration;
    factoryTime.textContent = videoTime(factoryVideo.currentTime) +
      (Number.isFinite(duration) ? " / " + videoTime(duration) : "");
  };
  factoryFullscreen.addEventListener("click", async () => {
    if (factoryDialog.open) {
      factoryDialog.close();
      return;
    }
    try {
      if (document.fullscreenElement === factoryPlayer) await document.exitFullscreen();
      else if (factoryPlayer.requestFullscreen) await factoryPlayer.requestFullscreen();
      else if (factoryVideo.webkitEnterFullscreen) factoryVideo.webkitEnterFullscreen();
      else throw new Error("Native fullscreen unavailable");
    } catch {
      // Embedded browsers can decline native fullscreen. Expand inside the window.
      factoryPlayer.before(factorySlot);
      factoryDialog.append(factoryPlayer);
      factoryDialog.showModal();
      renderFactoryLabels();
      updateFactoryPlayback();
    }
  });
  factoryDialog.addEventListener("close", () => {
    factorySlot.replaceWith(factoryPlayer);
    renderFactoryLabels();
    updateFactoryPlayback();
    requestAnimationFrame(() => factoryFullscreen.focus({ preventScroll: true }));
  });
  ["play", "pause", "volumechange"].forEach((event) => factoryVideo.addEventListener(event, renderFactoryLabels));
  ["timeupdate", "loadedmetadata", "durationchange"].forEach((event) => factoryVideo.addEventListener(event, updateFactoryTime));
  factoryVideo.addEventListener("error", () => {
    factoryWantsPlay = false;
    factoryStatus.hidden = false;
    renderFactoryLabels();
  });
  document.addEventListener("fullscreenchange", renderFactoryLabels);
  document.addEventListener("visibilitychange", updateFactoryPlayback);
  const factoryObserver = new IntersectionObserver(([entry]) => {
    factoryInView = entry.isIntersecting;
    updateFactoryPlayback();
  }, { threshold: .15 });
  factoryObserver.observe(factoryPlayer);
  updateFactoryTime();
  onChange(renderFactoryLabels);

})();
