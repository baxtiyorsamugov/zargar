// SOFIZAR — страницы «О заводе» и «Покупателям». Тексты — черновик для согласования с руководством.
(() => {
  const { t, money, extend, onRoute, toast, $, $$, onChange, href } = SZ;

  extend({
    uz: {
      abKicker: "SOFIZAR Jewelry Factory", abTitle: "Har bir buyum ustaning qo'lidan o'tadi",
      abLead: "Biz zargarlik buyumlarini O'zbekistondagi o'z zavodimizda yaratamiz: eskizdan tortib proba tamg'asigacha.",
      abIntroTitle: "Zavoddan vitrinagacha",
      abIntro1: "SOFIZAR — 25 yildan ortiq tajribaga ega zargarlik zavodi. Dizayn, quyish, ishlov berish va nazorat bir joyda bo'lgani uchun har bir bosqichga javob beramiz.",
      abIntro2: "Ishimizda zamonaviy uskunalar va qo'l mehnati birga ishlaydi: mashina aniqlik beradi, usta esa buyumga jon kiritadi.",
      abS1: "Yillik tajriba", abS1s: "zargarlik ishlab chiqarishida", abS2: "Oltin", abS2s: "sariq, oq va qizil", abS3: "Kumush", abS3s: "har kun uchun kolleksiya", abS4: "Sertifikatlangan", abS4s: "har bir buyum",
      abProcess: "Buyum qanday tug'iladi", abProcessNote: "Olti bosqich, har biri nazorat ostida",
      steps6: [["i-pen", "Eskiz va dizayn", "Dizaynerlar g'oyani qog'ozda va kompyuterda chizadi."], ["i-cube", "3D-model", "Model aniq o'lchamlarda tayyorlanadi va mum shaklida bosib chiqariladi."],
        ["i-fire", "Quyish", "Mum shakl orqali metall quyiladi: oltin 585 yoki kumush 925."], ["i-hand", "Qo'lda ishlov", "Usta buyumni tozalaydi, toshlarni o'rnatadi va sayqallaydi."],
        ["i-shield", "Proba va nazorat", "Proba tamg'asi qo'yiladi, vazni va sifati tekshiriladi."], ["i-gift", "Qadoqlash", "Buyum sertifikat bilan qutiga joylanadi va do'konga jo'natiladi."]],
      abQuality: "Sifatga kafolat",
      quality: ["Har bir buyumda proba tamg'asi", "Toshlar uchun sertifikat", "Vazni va tarkibi yorliq va chekda ko'rsatiladi", "Yiliga bir marta bepul tozalash va sayqallash"],
      warrantyMore: "Kafolat shartlari", abCta: "Buyumlarni jonli ko'ring", abCtaText: "Katalogdan tanlang yoki do'konimizga keling — razmerni bepul o'lchab beramiz.",
      infoSub: "Yetkazib berish, to'lov, kafolat va do'konlar haqida",
      deliveryCards: [["i-store", "Do'kondan olib ketish", "Bepul", "Ertaga tayyor. Buyurtma 48 soat saqlanadi."], ["i-truck", "Kuryer, Toshkent", "30 000 so'm", "1–2 kun ichida, qulay vaqtda."]],
      deliveryNote: "Viloyatlarga yetkazib berish tez orada.",
      paymentCards: [["i-cash", "Naqd pul", "Do'konda yoki kuryerga."], ["i-card", "Bank kartasi", "Uzcard, Humo, Visa — do'konda va kuryerda terminal orqali."], ["i-qr", "Onlayn to'lov", "Tez orada: saytda karta yoki QR orqali."]],
      warrantyItems: ["Proba va vazn yorliqda ko'rsatilgandek bo'lishiga kafolat", "Ishlab chiqarish nuqsoni bo'lsa — bepul ta'mirlash yoki almashtirish", "Uzuk razmerini bir yil davomida bepul moslashtirish", "Yiliga bir marta bepul tozalash va sayqallash"],
      storeName: "SOFIZAR, markaziy do'kon", storeAddr: "Toshkent sh. — aniq manzil kelishilmoqda", storeHours: "Har kuni 10:00–20:00", hours: "Ish vaqti",
      openMap: "Xaritada ochish", copyPhone: "Raqamni nusxalash", copied: "Raqam nusxalandi",
      faqs: [["Razmerimni bilmasam nima qilaman?", "Mahsulot sahifasidagi «Razmerni qanday bilish» jadvalidan foydalaning yoki do'konga keling — bepul o'lchab beramiz."],
        ["Buyurtmani qancha vaqt saqlaysiz?", "Do'kondan olib ketish uchun buyurtma 48 soat saqlanadi."],
        ["Saytda onlayn to'lash mumkinmi?", "Hozircha to'lov do'konda yoki kuryerga. Onlayn to'lov tez orada qo'shiladi."],
        ["Bonus ballar qanday ishlaydi?", "Har bir xariddan 1% ball qaytadi. Ballar bilan keyingi buyurtmaning 30% gacha to'lash mumkin."],
        ["Sovg'a qadoqlash bormi?", "Ha, har bir buyurtma bepul sovg'a qutisida beriladi."]],
    },
    ru: {
      abKicker: "SOFIZAR Jewelry Factory", abTitle: "Каждое украшение проходит через руки мастера",
      abLead: "Мы делаем украшения на собственном заводе в Узбекистане: от эскиза до клейма пробы.",
      abIntroTitle: "С завода — на витрину",
      abIntro1: "SOFIZAR — ювелирный завод с опытом более 25 лет. Дизайн, литьё, обработка и контроль — в одних руках, поэтому мы отвечаем за каждый этап.",
      abIntro2: "Современное оборудование работает вместе с ручным трудом: машина даёт точность, мастер — характер.",
      abS1: "Лет опыта", abS1s: "в ювелирном производстве", abS2: "Золото", abS2s: "жёлтое, белое и красное", abS3: "Серебро", abS3s: "коллекция на каждый день", abS4: "Сертифицировано", abS4s: "каждое изделие",
      abProcess: "Как рождается украшение", abProcessNote: "Шесть этапов, каждый под контролем",
      steps6: [["i-pen", "Эскиз и дизайн", "Дизайнеры рисуют идею на бумаге и в компьютере."], ["i-cube", "3D-модель", "Модель строится в точных размерах и печатается из воска."],
        ["i-fire", "Литьё", "По восковой модели отливается металл: золото 585 или серебро 925."], ["i-hand", "Ручная обработка", "Мастер зачищает изделие, закрепляет камни и полирует."],
        ["i-shield", "Проба и контроль", "Ставится клеймо пробы, проверяются вес и качество."], ["i-gift", "Упаковка", "Украшение с сертификатом кладётся в коробку и едет в магазин."]],
      abQuality: "Гарантия качества",
      quality: ["Клеймо пробы на каждом изделии", "Сертификат на камни", "Вес и состав указаны на бирке и в чеке", "Раз в год — бесплатная чистка и полировка"],
      warrantyMore: "Условия гарантии", abCta: "Посмотрите украшения вживую", abCtaText: "Выберите в каталоге или приходите в магазин — бесплатно измерим размер.",
      infoSub: "Доставка, оплата, гарантия и магазины",
      deliveryCards: [["i-store", "Самовывоз из магазина", "Бесплатно", "Готово завтра. Заказ ждёт 48 часов."], ["i-truck", "Курьер по Ташкенту", "30 000 сум", "За 1–2 дня, в удобное время."]],
      deliveryNote: "Доставка в регионы — скоро.",
      paymentCards: [["i-cash", "Наличные", "В магазине или курьеру."], ["i-card", "Банковская карта", "Uzcard, Humo, Visa — через терминал в магазине и у курьера."], ["i-qr", "Онлайн-оплата", "Скоро: картой или по QR прямо на сайте."]],
      warrantyItems: ["Гарантируем пробу и вес, указанные на бирке", "Заводской брак — бесплатный ремонт или замена", "Подгонка размера кольца бесплатно в течение года", "Раз в год — бесплатная чистка и полировка"],
      storeName: "SOFIZAR, центральный магазин", storeAddr: "Ташкент — точный адрес согласуется", storeHours: "Ежедневно 10:00–20:00", hours: "Часы работы",
      openMap: "Открыть на карте", copyPhone: "Скопировать номер", copied: "Номер скопирован",
      faqs: [["Не знаю свой размер — что делать?", "Откройте таблицу «Как узнать размер» на странице товара или приходите в магазин — измерим бесплатно."],
        ["Сколько хранится заказ?", "Заказ на самовывоз ждёт в магазине 48 часов."],
        ["Можно оплатить на сайте?", "Пока оплата в магазине или курьеру. Онлайн-оплата появится скоро."],
        ["Как работают бонусы?", "С каждой покупки возвращаем 1% баллами. Баллами можно оплатить до 30% следующего заказа."],
        ["Есть подарочная упаковка?", "Да, каждый заказ бесплатно упаковываем в подарочную коробку."]],
    },
    en: {
      abKicker: "SOFIZAR Jewelry Factory", abTitle: "Every piece passes through a master's hands",
      abLead: "We make jewelry at our own factory in Uzbekistan, from the first sketch to the hallmark.",
      abIntroTitle: "From factory to showcase",
      abIntro1: "SOFIZAR is a jewelry factory with over 25 years of experience. Design, casting, finishing and quality control happen under one roof, so we answer for every step.",
      abIntro2: "Modern equipment works alongside handcraft: the machine brings precision, the jeweler brings character.",
      abS1: "Years of experience", abS1s: "in jewelry making", abS2: "Gold", abS2s: "yellow, white and rose", abS3: "Silver", abS3s: "an everyday collection", abS4: "Certified", abS4s: "every piece",
      abProcess: "How a piece is made", abProcessNote: "Six steps, each one checked",
      steps6: [["i-pen", "Sketch and design", "Designers draw the idea on paper and on screen."], ["i-cube", "3D model", "The model is built to exact size and printed in wax."],
        ["i-fire", "Casting", "Metal is cast from the wax model: 585 gold or 925 silver."], ["i-hand", "Hand finishing", "A jeweler cleans the piece, sets the stones and polishes it."],
        ["i-shield", "Hallmark and checks", "The hallmark is stamped; weight and quality are checked."], ["i-gift", "Packing", "The piece goes into a box with its certificate and on to the store."]],
      abQuality: "Quality guarantee",
      quality: ["A hallmark on every piece", "Certificates for stones", "Weight and metal shown on the tag and receipt", "Free cleaning and polishing once a year"],
      warrantyMore: "Warranty terms", abCta: "See the pieces in person", abCtaText: "Choose from the catalog or visit our store — we'll measure your size for free.",
      infoSub: "Delivery, payment, warranty and stores",
      deliveryCards: [["i-store", "Store pickup", "Free", "Ready tomorrow. We hold the order for 48 hours."], ["i-truck", "Courier in Tashkent", "30,000 UZS", "Within 1–2 days, at a time that suits you."]],
      deliveryNote: "Delivery to other regions is coming soon.",
      paymentCards: [["i-cash", "Cash", "In store or to the courier."], ["i-card", "Bank card", "Uzcard, Humo, Visa — by terminal in store and with the courier."], ["i-qr", "Online payment", "Coming soon: by card or QR on the website."]],
      warrantyItems: ["Hallmark and weight guaranteed as shown on the tag", "Manufacturing defects — free repair or replacement", "Free ring resizing for one year", "Free cleaning and polishing once a year"],
      storeName: "SOFIZAR flagship store", storeAddr: "Tashkent — exact address to be confirmed", storeHours: "Daily 10:00–20:00", hours: "Opening hours",
      openMap: "Open in maps", copyPhone: "Copy number", copied: "Number copied",
      faqs: [["I don't know my size. What should I do?", "Use the “How to find your size” table on the product page or visit our store for a free sizing."],
        ["How long do you hold an order?", "Pickup orders wait in the store for 48 hours."],
        ["Can I pay online?", "For now, pay in store or to the courier. Online payment is coming soon."],
        ["How do bonus points work?", "Get 1% back in points on every purchase. Points can cover up to 30% of your next order."],
        ["Do you offer gift wrapping?", "Yes, every order comes in a free gift box."]],
    },
  });

  /* ---------- О заводе ---------- */
  const about = $('main[data-page="about"]');
  if (about) onChange(() => {
    $("#process", about).innerHTML = t("steps6").map(([ico, h, p], i) => `
      <li class="step"><span class="step-n">${i + 1}</span><span class="step-ico"><svg class="ico"><use href="#${ico}"/></svg></span><b>${h}</b><p>${p}</p></li>`).join("");
    $("#qualityList", about).innerHTML = t("quality").map((q) => `<li><span class="ck"><svg class="ico"><use href="#i-check"/></svg></span>${q}</li>`).join("");
  });

  /* ---------- Покупателям ---------- */
  const info = $('main[data-page="info"]');
  if (!info) return;
  onChange(() => {
    const card = ([ico, h, s, p]) => `<div class="info-card"><span class="choice-ico"><svg class="ico"><use href="#${ico}"/></svg></span><span><b>${h}</b>${p ? `<em>${s}</em><small>${p}</small>` : `<small>${s}</small>`}</span></div>`;
    $("#deliveryCards", info).innerHTML = t("deliveryCards").map(card).join("");
    $("#paymentCards", info).innerHTML = t("paymentCards").map(([i, h, s]) => card([i, h, s])).join("");
    $("#warrantyList", info).innerHTML = t("warrantyItems").map((q) => `<li><span class="ck"><svg class="ico"><use href="#i-check"/></svg></span>${q}</li>`).join("");
    const open = $$("#faqList details[open]", info).map((d) => d.dataset.i);
    $("#faqList", info).innerHTML = t("faqs").map(([q, a], i) => `<details class="acc" data-i="${i}" ${open.includes(String(i)) || (!open.length && i === 0) ? "open" : ""}><summary>${q}</summary><p>${a}</p></details>`).join("");
  });
  $$("#infoNav a", info).forEach((a) => { a.href = href(a.dataset.sec); });
  const mark = (id) => $$("#infoNav a", info).forEach((a) => a.classList.toggle("is-current", a.dataset.sec === id));
  onRoute((r) => {
    if (SZ.pageOf(r) !== "info") return;
    const id = r === "info" ? "delivery" : r; mark(id);
  });
  // подсветка раздела при прокрутке
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && mark(e.target.id)), { rootMargin: "-40% 0px -55% 0px" });
  $$(".info-sec", info).forEach((s) => io.observe(s));
  $("#copyPhone", info).addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("+998 55 500-00-00"); toast(t("copied")); } catch (e) { toast("+998 55 500-00-00"); }
  });
})();
