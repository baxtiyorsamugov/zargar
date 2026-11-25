(() => {
  const root = document.documentElement;
  const pagePath = (pathname) => pathname.replace(/\/index(?:\.html)?$/, "/").replace(/\.html$/, "").replace(/\/+$/, "") || "/";
  const path = pagePath(location.pathname);
  const routeKey = () => path + (/\/catalog$/.test(path) ? location.hash : "");
  const initialKey = routeKey();
  const visited = new Set();
  const isReload = globalThis.performance?.getEntriesByType?.("navigation")?.[0]?.type === "reload";
  const wasVisited = (key) => {
    if (visited.has(key)) return true;
    try { return sessionStorage.getItem("sz-page-seen:" + key) === "1"; } catch { return false; }
  };
  const remember = (key) => {
    visited.add(key);
    try { sessionStorage.setItem("sz-page-seen:" + key, "1"); } catch {}
  };
  root.dataset.pagePending = "";
  if (isReload) root.dataset.pageReload = "";
  else if (wasVisited(initialKey)) root.dataset.pageRepeat = "";

  window.szNavigation = {
    samePage: (pathname) => pagePath(pathname) === path,
    visit: () => {
      const key = routeKey();
      const firstVisit = !wasVisited(key);
      remember(key);
      return firstVisit;
    },
  };

  window.szRevealPage = () => {
    clearTimeout(fallback);
    delete root.dataset.pagePending;
    remember(initialKey);
  };
  // An unavailable resource must not leave the document hidden.
  const fallback = setTimeout(window.szRevealPage, 5000);
})();
