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
      videoSeek: "Videoni oʻtkazish", videoBack: "10 soniya orqaga", videoForward: "10 soniya oldinga",
      videoError: "Videoni yuklab boʻlmadi. Qayta urinib koʻring.",
    },
    ru: {
      factoryVideo: "Видео о заводе SOFIZAR", videoVolume: "Громкость",
      videoUnmute: "Включить звук", videoMute: "Выключить звук",
      videoFullscreen: "На весь экран", videoExitFullscreen: "Выйти из полноэкранного режима",
      videoSeek: "Позиция воспроизведения", videoBack: "Назад на 10 секунд", videoForward: "Вперёд на 10 секунд",
      videoError: "Не удалось загрузить видео. Попробуйте ещё раз.",
    },
    en: {
      factoryVideo: "About the SOFIZAR factory", videoVolume: "Volume",
      videoUnmute: "Unmute", videoMute: "Mute",
      videoFullscreen: "Fullscreen", videoExitFullscreen: "Exit fullscreen",
      videoSeek: "Playback position", videoBack: "Back 10 seconds", videoForward: "Forward 10 seconds",
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
  const factorySeek = $("#factorySeek", root);
  const factoryBack = $("#factoryBack", root);
  const factoryForward = $("#factoryForward", root);
  const factoryStatus = $("#factoryStatus", root);
  const factoryDialog = $("#factoryDialog");
  const factorySlot = document.createComment("Factory video position");
  let factoryInView = false;
  let factoryWantsPlay = !reducedMotion.matches;
  let scrubbing = false;
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
    factorySeek.setAttribute("aria-label", t("videoSeek"));
    [[factoryBack, "videoBack"], [factoryForward, "videoForward"]].forEach(([button, key]) => {
      button.setAttribute("aria-label", t(key));
      button.title = t(key);
    });
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
    const ready = Number.isFinite(duration) && duration > 0;
    const current = scrubbing ? Number(factorySeek.value) : factoryVideo.currentTime;
    const time = videoTime(current) + (ready ? " / " + videoTime(duration) : "");
    factoryTime.textContent = time;
    factorySeek.disabled = factoryBack.disabled = factoryForward.disabled = !ready;
    factorySeek.max = ready ? String(duration) : "0";
    if (!scrubbing) factorySeek.value = String(current);
    factorySeek.style.setProperty("--video-progress", (ready ? current / duration * 100 : 0) + "%");
    factorySeek.setAttribute("aria-valuetext", time);
  };
  function seekFactory(seconds) {
    if (!Number.isFinite(factoryVideo.duration) || factoryVideo.duration <= 0) return;
    factoryVideo.currentTime = Math.max(0, Math.min(factoryVideo.duration, seconds));
    updateFactoryTime();
  }
  factoryBack.addEventListener("click", () => seekFactory(factoryVideo.currentTime - 10));
  factoryForward.addEventListener("click", () => seekFactory(factoryVideo.currentTime + 10));
  factorySeek.addEventListener("pointerdown", () => { scrubbing = true; });
  factorySeek.addEventListener("input", () => seekFactory(Number(factorySeek.value)));
  const finishScrubbing = () => { scrubbing = false; updateFactoryTime(); };
  ["change", "pointerup", "pointercancel", "blur"].forEach((event) => factorySeek.addEventListener(event, finishScrubbing));
  factoryPlayer.addEventListener("keydown", (event) => {
    if (event.target !== factoryPlayer || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    seekFactory(factoryVideo.currentTime + (event.key === "ArrowLeft" ? -10 : 10));
  });
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
