// Keep the first frame hidden until typography and page controls are ready.
document.documentElement.dataset.pagePending = "";
window.szRevealPage = () => {
  delete document.documentElement.dataset.pagePending;
};
// Keep the document accessible if a script or font fails to load.
setTimeout(window.szRevealPage, 5000);
