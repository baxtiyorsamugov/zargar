// Сквозная проверка этапа 03 на запущенном стеке: товар → корзина → заказ гостем →
// вход по SMS-коду → заказ в кабинете → избранное → фильтры и поиск.
//
// Нужно: запущенные backend (с ConsoleSmsBackend, лог в файл) и frontend, данные seed_demo,
// установленный Playwright (npm i -D playwright && npx playwright install chromium).
//   BASE_URL=http://localhost:3000 DJANGO_LOG=/tmp/dj.log node scripts/e2e-smoke.cjs

const { chromium } = require('playwright');
const fs = require('fs');
const B = process.env.BASE_URL || 'http://localhost:3000';
const DJANGO_LOG = process.env.DJANGO_LOG || '/tmp/dj.log';
// у каждого прогона свой номер, чтобы не упираться в лимит повторной отправки кода
const SUFFIX = String(Date.now()).slice(-2);
const log = (...a) => console.log('✓', ...a);
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  // 403 на /auth/me/ у гостя и 400 на неверный код — ожидаемые ответы, не ошибки
  page.on('console', m => m.type() === 'error' && !m.text().startsWith('Failed to load resource') && errors.push(m.text()));

  // 1. Товар: размер обязателен, затем в корзину
  await page.goto(B + '/ru/product/sz-r-001');
  await page.click('text=В корзину');
  await page.waitForSelector('text=Выберите размер'); log('просит выбрать размер');
  await page.click('button.size:has-text("17")');
  await page.click('text=В корзину');
  await page.waitForSelector('text=Добавлено в корзину');
  await page.click('text=♡ В избранное');
  await page.waitForSelector('text=♥ В избранном');
  // второй товар без размера
  await page.goto(B + '/ru/product/sz-e-002');
  await page.click('text=В корзину');
  await page.waitForSelector('text=Добавлено в корзину');
  const badge = await page.textContent('.actions a[href="/ru/cart"] .count');
  if (badge !== '2') throw new Error('badge ' + badge); log('счётчик корзины = 2');

  // 2. Корзина: количество +1
  await page.goto(B + '/ru/cart');
  await page.waitForSelector('.line');
  await page.locator('.line').first().locator('button[aria-label="+"]').click();
  await page.waitForFunction(() => document.querySelector('.line .qty span').textContent === '2');
  const total = await page.textContent('.cart-total strong'); log('корзина, итого', total);
  

  // 3. Оформление гостем: валидация, затем заказ
  await page.click('text=Оформить заказ');
  await page.waitForSelector('text=Подтвердить заказ');
  await page.click('text=Подтвердить заказ');
  await page.waitForSelector('text=Заполните это поле'); log('валидация формы');
  await page.fill('input[autocomplete="name"]', 'Дилноза');
  await page.fill('input[type="tel"]', `+998 90 555 44 ${SUFFIX}`);
  await page.fill('textarea[autocomplete="street-address"]', 'Ташкент, Чиланзар 5');
  
  await page.click('text=Подтвердить заказ');
  await page.waitForURL(/checkout\/success\?order=SZ-/);
  const num = new URL(page.url()).searchParams.get('order'); log('заказ оформлен', num);
  const after = await page.locator('.actions a[href="/ru/cart"] .count').count();
  if (after) throw new Error('cart not cleared'); log('корзина очищена');

  // 4. Кабинет: вход по SMS-коду, гостевой заказ привязан
  await page.goto(B + '/ru/account');
  await page.fill('input[type="tel"]', `90 555 44 ${SUFFIX}`);
  await page.click('text=Получить код');
  await page.waitForSelector('text=Код из SMS');
  await page.waitForTimeout(500); // лог пишется не мгновенно
  const m = [...fs.readFileSync(DJANGO_LOG, 'utf8').matchAll(new RegExp(`SMS to \\+9989055544${SUFFIX}: .*?(\\d{6})`, 'g'))].pop();
  await page.fill('input[autocomplete="one-time-code"]', '000000' === m[1] ? '111111' : '000000');
  await page.click('button:has-text("Войти")');
  await page.waitForSelector('text=Неверный код'); log('неверный код отклонён');
  await page.fill('input[autocomplete="one-time-code"]', m[1]);
  await page.click('button:has-text("Войти")');
  await page.waitForSelector(`text=${num}`); log('вход по коду, заказ в истории');
  await page.click(`summary:has-text("${num}")`);
  await page.waitForSelector('text=Кольцо «Самарканд» · 17 × 2');
  // профиль (PATCH с CSRF)
  await page.locator('.profile input').first().fill('Дилноза');
  await page.click('text=Сохранить');
  await page.waitForSelector('text=Сохранено'); log('профиль сохранён (CSRF ок)');
  
  await page.reload();
  await page.waitForSelector(`text=${num}`); log('сессия сохраняется после перезагрузки');

  // 5. Оформление залогиненным — поля подставляются
  await page.goto(B + '/ru/product/sz-e-003');
  await page.click('text=В корзину');
  await page.goto(B + '/ru/checkout');
  await page.waitForFunction((p) => document.querySelector('input[type="tel"]').value === p, `+9989055544${SUFFIX}`);
  log('профиль подставлен в checkout');

  // 6. Избранное
  await page.goto(B + '/uz/favorites');
  await page.waitForSelector('text=Samarqand uzugi'); log('избранное (uz)');

  // 7. Выход
  await page.goto(B + '/ru/account');
  await page.click('text=Выйти');
  await page.waitForSelector('text=Получить код'); log('выход');

  // 8. Фильтры и поиск без JS
  await page.goto(B + '/ru/catalog/rings?metal=gold&ordering=-price_from');
  const first = await page.textContent('.card h3');
  const robots = await page.getAttribute('meta[name="robots"]', 'content');
  log('фильтр: первый', first, '| robots:', robots);
  await page.fill('.search input', 'серьги');
  await page.press('.search input', 'Enter');
  await page.waitForURL(/search=/);
  log('поиск:', await page.textContent('h1'), (await page.locator('.card').count()) + ' шт.');
  

  // 9. Мобильная корзина
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mob.goto(B + '/ru/product/sz-r-002');
  await mob.click('button.size >> nth=0');
  await mob.click('text=В корзину');
  await mob.goto(B + '/ru/cart');
  await mob.waitForSelector('.line');
  

  if (errors.length) { console.log('✗ JS errors:', errors); process.exitCode = 1; }
  else log('нет ошибок в консоли');
  await browser.close();
})().catch(e => { console.error('✗', e.message); process.exit(1); });
