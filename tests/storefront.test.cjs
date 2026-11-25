const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { runInNewContext } = require("node:vm");

const frontend = join(__dirname, "..", "frontend");
const boot = readFileSync(join(frontend, "assets/js/boot.js"), "utf8");

function openPage(pathname, storage = new Map()) {
  const timers = new Map();
  const root = { dataset: {} };
  const context = {
    document: { documentElement: root },
    location: { pathname },
    sessionStorage: {
      getItem: key => storage.get(key),
      setItem: (key, value) => storage.set(key, value),
    },
    window: {},
    setTimeout: (callback, delay) => { timers.set(1, { callback, delay }); return 1; },
    clearTimeout: id => timers.delete(id),
  };
  runInNewContext(boot, context);
  return { root, timers, reveal: context.window.szRevealPage };
}

test("first visit waits for initialization and records the completed page", () => {
  const storage = new Map();
  const page = openPage("/catalog.html", storage);
  assert.equal(page.root.dataset.pagePending, "");
  assert.equal(page.root.dataset.pageRepeat, undefined);
  assert.equal(storage.size, 0);
  page.reveal();
  assert.equal(page.root.dataset.pagePending, undefined);
  assert.equal(page.timers.size, 0);
  assert.equal(storage.get("sz-page-seen:/catalog"), "1");
});

test("reload and return skip arrival effects, while another page remains a first visit", () => {
  const storage = new Map();
  openPage("/catalog.html", storage).reveal();
  assert.equal(openPage("/catalog.html", storage).root.dataset.pageRepeat, "");
  assert.equal(openPage("/catalog", storage).root.dataset.pageRepeat, "");
  assert.equal(openPage("/about.html", storage).root.dataset.pageRepeat, undefined);
});

test("home URL aliases share the same completed visit", () => {
  const storage = new Map();
  openPage("/index.html", storage).reveal();
  assert.equal(openPage("/", storage).root.dataset.pageRepeat, "");
  assert.equal(openPage("/index", storage).root.dataset.pageRepeat, "");
});

test("blocked storage does not prevent revealing the document", () => {
  const storage = {
    get() { throw new Error("Storage blocked"); },
    set() { throw new Error("Storage blocked"); },
  };
  const page = openPage("/catalog.html", storage);
  assert.doesNotThrow(page.reveal);
  assert.equal(page.root.dataset.pagePending, undefined);
});

test("resource failure fallback releases a pending document", () => {
  const page = openPage("/catalog.html");
  const fallback = page.timers.get(1);
  assert.equal(fallback.delay, 5000);
  fallback.callback();
  assert.equal(page.root.dataset.pagePending, undefined);
});

test("compact browser catalog retains every field from the source snapshot", () => {
  const context = { window: {} };
  const script = readFileSync(join(frontend, "data/catalog.js"), "utf8");
  const snapshot = JSON.parse(readFileSync(join(frontend, "data/catalog.json"), "utf8"));
  runInNewContext(script, context);
  assert.deepEqual(JSON.parse(JSON.stringify(context.window.SZ_CATALOG)), snapshot);
  assert.ok(Buffer.byteLength(script) < Buffer.byteLength(JSON.stringify(snapshot, null, 1)));
});
