(() => {
  const root = document.documentElement;
  const path = location.pathname.replace(/\/index(?:\.html)?$/, "/").replace(/\.html$/, "") || "/";
  const visitKey = "sz-page-seen:" + path;
  root.dataset.pagePending = "";
  try {
    if (sessionStorage.getItem(visitKey)) root.dataset.pageRepeat = "";
  } catch { /* Navigation also works when session storage is unavailable. */ }

  window.szRevealPage = () => {
    clearTimeout(fallback);
    delete root.dataset.pagePending;
    try { sessionStorage.setItem(visitKey, "1"); } catch {}
  };
  // An unavailable resource must not leave the document hidden.
  const fallback = setTimeout(window.szRevealPage, 5000);
})();
