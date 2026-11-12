// SOFIZAR — общий модуль для всех страниц: шапка, подвал, переводы, товары, корзина, избранное.
// Данные товаров и заказов — пример; в продакшене придут из API, которое берёт их из 1С.
(() => {
  const SPA = !!window.SZ_SPA; // превью-сборка: все страницы в одном файле, переходы по #

  /* ---------- Иконки ---------- */
  const ICONS = `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></symbol>
    <symbol id="i-phone" viewBox="0 0 24 24"><path d="M5 4h3.5l1.6 4.2-2.2 1.4a11 11 0 0 0 6.5 6.5l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z"/></symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></symbol>
    <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20.5c1.2-3.8 4.3-5.5 8-5.5s6.8 1.7 8 5.5"/></symbol>
    <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"/></symbol>
    <symbol id="i-bag" viewBox="0 0 24 24"><path d="M5 8.5h14l-1.2 11.5H6.2L5 8.5Z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
    <symbol id="i-back" viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
    <symbol id="i-gem" viewBox="0 0 24 24"><path d="M6.5 4h11L21 9l-9 11L3 9l3.5-5Z"/><path d="M3 9h18M9 4l3 16 3-16"/></symbol>
    <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3 19 6v5.5c0 4.4-3 7.8-7 9.5-4-1.7-7-5.1-7-9.5V6l7-3Z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/></symbol>
    <symbol id="i-truck" viewBox="0 0 24 24"><path d="M3 6h11v10H3zM14 9.5h4l3 3.5V16h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/></symbol>
    <symbol id="i-store" viewBox="0 0 24 24"><path d="M4 9.5 5.5 4h13L20 9.5M4 9.5h16M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M5.5 12v8h13v-8M10 20v-5h4v5"/></symbol>
    <symbol id="i-gift" viewBox="0 0 24 24"><path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13"/><path d="M12 7c-1.5-3.5-5.5-3.5-5 0M12 7c1.5-3.5 5.5-3.5 5 0"/></symbol>
    <symbol id="i-card" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h3"/></symbol>
    <symbol id="i-trash" viewBox="0 0 24 24"><path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5M14 11v5"/></symbol>
    <symbol id="i-minus" viewBox="0 0 24 24"><path d="M6 12h12"/></symbol>
    <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 6v12M6 12h12"/></symbol>
    <symbol id="i-home" viewBox="0 0 24 24"><path d="M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4z"/></symbol>
    <symbol id="i-box" viewBox="0 0 24 24"><path d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5z"/><path d="M4 7.5 12 11l8-3.5M12 11v9"/></symbol>
    <symbol id="i-star" viewBox="0 0 24 24"><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></symbol>
    <symbol id="i-map" viewBox="0 0 24 24"><path d="M9 4.5 3.5 6.5v13L9 17.5l6 2 5.5-2v-13L15 6.5z"/><path d="M9 4.5v13M15 6.5v13"/></symbol>
    <symbol id="i-settings" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/></symbol>
    <symbol id="i-logout" viewBox="0 0 24 24"><path d="M14 4.5H6v15h8M10.5 12H20M16.5 8.5 20 12l-3.5 3.5"/></symbol>
    <symbol id="i-tag" viewBox="0 0 24 24"><path d="M3.5 12.5V4.5h8l9 9-8 8z"/><circle cx="8" cy="9" r="1.5"/></symbol>
    <symbol id="i-chev" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></symbol>
    <symbol id="i-filter" viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4"/></symbol>
    <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
    <symbol id="i-ruler" viewBox="0 0 24 24"><path d="M3.5 15.5 15.5 3.5l5 5-12 12z"/><path d="m7 12 2 2M10 9l2 2M13 6l2 2"/></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></symbol>
    <symbol id="i-cash" viewBox="0 0 24 24"><rect x="3" y="6.5" width="18" height="11" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6.5 9.5v5M17.5 9.5v5"/></symbol>
    <symbol id="i-qr" viewBox="0 0 24 24"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2M14 18h2v2h4v-4"/></symbol>
    <symbol id="i-spark" viewBox="0 0 24 24"><path d="M12 3.5 13.8 10l6.7 2-6.7 2L12 20.5 10.2 14l-6.7-2 6.7-2z"/></symbol>
    <symbol id="i-pen" viewBox="0 0 24 24"><path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="m14 7 3 3"/></symbol>
    <symbol id="i-cube" viewBox="0 0 24 24"><path d="M12 3.5 20 8v8l-8 4.5L4 16V8z"/><path d="M4 8l8 4.5L20 8M12 12.5v8"/></symbol>
    <symbol id="i-fire" viewBox="0 0 24 24"><path d="M12 21c-4 0-6.5-2.6-6.5-6 0-4 3.5-5.5 4-10 3 1.5 4.5 4 4.5 6 1-1 1.5-2 1.5-3 2 1.5 3 4.2 3 6.8 0 3.6-2.5 6.2-6.5 6.2Z"/></symbol>
    <symbol id="i-hand" viewBox="0 0 24 24"><path d="M8 12V6.5a1.5 1.5 0 0 1 3 0V11M11 10V5a1.5 1.5 0 0 1 3 0v6M14 10.5V7a1.5 1.5 0 0 1 3 0v6.5c0 4-2.5 7-6.5 7-2.5 0-4-1.2-5.5-3.5L3.5 13a1.6 1.6 0 0 1 2.6-1.8L8 13.5"/></symbol>
  </defs></svg>`;

  /* ---------- Переводы ---------- */
  const T = {
    uz: {
      chooseRegion: "Hududni tanlang", stores: "Do'konlar", delivery: "Yetkazib berish", payment: "To'lov usullari", warranty: "Kafolat",
      about: "Biz haqimizda", contact: "Aloqa", searchLabel: "Qidiruv", searchPh: "Uzuk, sirg'a, zanjir...",
      account: "Kabinet", favs: "Sevimlilar", cart: "Savat", catalog: "Katalog", home: "Bosh sahifa",
      c_rings: "Uzuklar", c_earrings: "Sirg'alar", c_bracelets: "Bilaguzuklar", c_chains: "Zanjirlar",
      c_pendants: "Taqinchoqlar", c_sets: "To'plamlar", c_gifts: "Sovg'alar",
      newItems: "Yangi mahsulotlar", sales: "Aksiyalar", info: "Ma'lumot",
      footerAbout: "Jewelry Factory, O'zbekiston. Oltin va kumushdan zargarlik buyumlari.",
      demo: "Rahbariyat uchun namoyish. Narxlar, mahsulotlar va buyurtmalar namunaviy.",
      p1: "Burama uzuk", p2: "Tomchi sirg'alar", p3: "Tomchi marjonli zanjir", p4: "Zanjir bilaguzuk",
      gold: "Oltin 585", items: "ta", sum: "so'm", size: "Razmer",
      addFav: "Sevimlilarga qo'shildi", delFav: "Sevimlilardan olib tashlandi", addCart: "Savatga qo'shildi", goCart: "Savatga o'tish",
      m_yellow: "Sariq oltin", m_white: "Oq oltin", m_rose: "Qizil oltin", m_silver: "Kumush",
      fMetal: "Metall", forBuyers: "Xaridorlarga", faq: "Savol-javob", aboutNav: "Zavod haqida", newShort: "Yangi", pending: "",
      months: ["yanvar","fevral","mart","aprel","may","iyun","iyul","avgust","sentabr","oktabr","noyabr","dekabr"],
      // главная
      kicker: "Yangi kolleksiya 2026", heroTitle: "Sifat, zamonaviy ijroda namoyon",
      heroSub: "Oltin 585 va kumush 925 dan zargarlik buyumlari. Har biri o'z zavodimizda yaratilgan.",
      ctaCollection: "Kolleksiyani ko'rish", ctaStore: "Do'konni topish", popularCats: "Mashhur kategoriyalar",
      tabNew: "Yangi", tabPopular: "Ommabop", tabSale: "Chegirmalar", tagNew: "Yangi",
      collections: "Kolleksiyalar", viewAll: "Barchasini ko'rish", collTitle: "Oltin uyg'unlik",
      collText: "Har kuni taqish uchun yumshoq shakllar: uzuklar, bilaguzuklar va zanjirlar bitta uslubda.",
      factory: "Bizning zavod",
      factoryText: "25 yildan ortiq tajriba, zamonaviy texnologiyalar va zargarlik san'atiga e'tibor. Har bir buyum ishlab chiqarishdan tortib vitrinagacha nazoratdan o'tadi.",
      statYears: "yillik tajriba", statProbe: "oltin va kumush proba", statCert: "sertifikatlangan", aboutFactory: "Zavod haqida",
      empty: "Hech narsa topilmadi. Boshqa so'z bilan qidirib ko'ring.",
      b: [["O'z ishlab chiqarishimiz", "Sifat kafolati"], ["Oltin 585 va kumush 925", "Barcha mahsulotlar sertifikatlangan"],
          ["Yetkazib berish", "O'zbekiston bo'ylab"], ["Sovg'a qadoqlash", "Har bir buyurtma uchun"], ["Qulay to'lov", "Naqd va karta orqali"]],
      // корзина
      cartTitle: "Savat", cartSub: (n, s) => `${n} ta mahsulot, ${s}`, cartEmptySub: "Savatingiz hozircha bo'sh",
      continueShop: "Xaridni davom ettirish", toFav: "Sevimlilarga", remove: "O'chirish", removed: "Savatdan olib tashlandi", undo: "Qaytarish",
      removeOne: "Savatdan bir dona olib tashlash",
      qty: "Soni", receive: "Qabul qilish usuli", pickup: "Do'kondan olib ketish", pickupNote: "Bepul, ertaga tayyor",
      courier: "Kuryer orqali", courierNote: "Toshkent bo'ylab, 1–2 kun", pickStore: "Do'kon", storeMain: "SOFIZAR, Toshkent markaziy do'koni",
      address: "Manzil", addressPh: "Ko'cha, uy, xonadon",
      summary: "Buyurtma", subtotal: "Mahsulotlar", discount: "Chegirma", deliveryCost: "Yetkazib berish", free: "Bepul", total: "Jami",
      promo: "Promokod", promoPh: "Masalan, SOFIZAR10", apply: "Qo'llash", promoOk: "Promokod qo'llandi: −10%", promoBad: "Bunday promokod yo'q. Tekshirib qayta kiriting.",
      checkout: "Buyurtma berish", payNote: "To'lov do'konda yoki kuryerga: naqd yoki karta orqali. Onlayn to'lov tez orada.",
      bonusEarn: (n) => `Bu buyurtma uchun +${n} bonus ball`,
      emptyTitle: "Savat bo'sh", emptyText: "Yoqqan buyumni savatga qo'shing, u shu yerda paydo bo'ladi.", toCatalog: "Katalogga o'tish",
      recommend: "Sizga yoqishi mumkin",
      coTitle: "Buyurtmani tasdiqlash", coName: "Ismingiz", coPhone: "Telefon", coPhoneHint: "Buyurtmani tasdiqlash uchun qo'ng'iroq qilamiz",
      coPhoneErr: "Raqamni to'liq kiriting: +998 va 9 ta raqam", coNameErr: "Ismingizni kiriting", coComment: "Izoh", coCommentPh: "Masalan, sovg'a qadoqlash kerak",
      cancel: "Bekor qilish", confirm: "Tasdiqlash", doneTitle: "Buyurtma qabul qilindi", doneText: (id) => `Buyurtma raqami ${id}. Menejer 15 daqiqa ichida qo'ng'iroq qiladi.`,
      toOrders: "Buyurtmalarimga o'tish", demoNote: "Namoyish: buyurtma faqat shu brauzerda saqlanadi.",
      // кабинет
      hello: (n) => `Salom, ${n}!`, accSub: "Buyurtmalar, bonuslar va shaxsiy ma'lumotlar bir joyda",
      overview: "Umumiy", orders: "Buyurtmalar", bonus: "Bonuslar", addresses: "Manzillar", profile: "Profil", logout: "Chiqish",
      activeOrders: "Faol buyurtmalar", activeOrdersSub: "tayyorlanmoqda yoki yo'lda", bonusPts: "Bonus ballar", bonusPtsSub: "1 ball = 1 so'm",
      favCount: "Sevimlilar", favCountSub: "saqlangan buyumlar", recentOrders: "Oxirgi buyurtmalar", allOrders: "Barcha buyurtmalar",
      tabActive: "Faol", tabHistory: "Tarix", order: "Buyurtma", pieces: (n) => `${n} ta mahsulot`,
      st_new: "Qabul qilindi", st_prep: "Tayyorlanmoqda", st_ready: "Do'konda kutmoqda", st_way: "Yo'lda", st_done: "Topshirildi", st_cancel: "Bekor qilindi",
      steps: ["Qabul qilindi", "Tayyorlanmoqda", "Tayyor", "Topshirildi"],
      repeat: "Qayta buyurtma", orderItems: "Tarkibi", noOrders: "Faol buyurtmalar yo'q. Yangi mahsulotlarni ko'rib chiqing.",
      favEmpty: "Sevimlilar ro'yxati bo'sh. Mahsulot kartochkasidagi yurakchani bosing.",
      level: "Daraja", lvlSilver: "Kumush", lvlGold: "Oltin", toNext: (n) => `Oltin darajagacha ${n} ball`,
      bonusHint: "Har bir xariddan 1% ball qaytadi. Ballar bilan keyingi buyurtmaning 30% gacha to'lash mumkin.",
      bonusHistory: "Ballar tarixi", earnFor: (id) => `${id} buyurtmasi uchun`, spentOn: (id) => `${id} buyurtmasida ishlatildi`, birthday: "Tug'ilgan kun sovg'asi",
      addAddress: "Manzil qo'shish", addrTitle: "Nomi", addrTitlePh: "Uy, ish...", save: "Saqlash", saved: "Saqlandi", mainAddr: "Asosiy",
      firstName: "Ism", lastName: "Familiya", email: "Email", bday: "Tug'ilgan sana", lang: "Til", notify: "Xabarnomalar",
      notifySms: "Buyurtma holati haqida SMS", notifyTg: "Telegram orqali yangi kolleksiyalar", saveProfile: "O'zgarishlarni saqlash",
      logoutDemo: "Namoyish rejimida chiqish o'chirilgan",
    },
    ru: {
      chooseRegion: "Выберите регион", stores: "Магазины", delivery: "Доставка", payment: "Способы оплаты", warranty: "Гарантия",
      about: "О нас", contact: "Контакты", searchLabel: "Поиск", searchPh: "Кольцо, серьги, цепь...",
      account: "Кабинет", favs: "Избранное", cart: "Корзина", catalog: "Каталог", home: "Главная",
      c_rings: "Кольца", c_earrings: "Серьги", c_bracelets: "Браслеты", c_chains: "Цепи",
      c_pendants: "Подвески", c_sets: "Комплекты", c_gifts: "Подарки",
      newItems: "Новинки", sales: "Акции", info: "Информация",
      footerAbout: "Jewelry Factory, Узбекистан. Украшения из золота и серебра.",
      demo: "Демонстрация для руководства. Цены, товары и заказы примерные.",
      p1: "Кольцо-переплетение", p2: "Серьги-капли", p3: "Цепь с подвеской-каплей", p4: "Браслет-цепь",
      gold: "Золото 585", items: "шт.", sum: "сум", size: "Размер",
      addFav: "Добавлено в избранное", delFav: "Убрано из избранного", addCart: "Добавлено в корзину", goCart: "Перейти в корзину",
      m_yellow: "Жёлтое золото", m_white: "Белое золото", m_rose: "Красное золото", m_silver: "Серебро",
      fMetal: "Металл", forBuyers: "Покупателям", faq: "Вопросы и ответы", aboutNav: "О заводе", newShort: "Новинки", pending: "",
      months: ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"],
      kicker: "Новая коллекция 2026", heroTitle: "Качество в современном исполнении",
      heroSub: "Украшения из золота 585 и серебра 925. Каждое создано на нашем собственном заводе.",
      ctaCollection: "Смотреть коллекцию", ctaStore: "Найти магазин", popularCats: "Популярные категории",
      tabNew: "Новые", tabPopular: "Популярные", tabSale: "Скидки", tagNew: "Новинка",
      collections: "Коллекции", viewAll: "Смотреть все", collTitle: "Золотая гармония",
      collText: "Мягкие формы на каждый день: кольца, браслеты и цепи в одном стиле.",
      factory: "Наш завод",
      factoryText: "Более 25 лет опыта, современные технологии и внимание к ювелирному мастерству. Каждое изделие проходит контроль от производства до витрины.",
      statYears: "лет опыта", statProbe: "проба золота и серебра", statCert: "сертифицировано", aboutFactory: "О заводе",
      empty: "Ничего не нашлось. Попробуйте другое слово.",
      b: [["Собственное производство", "Гарантия качества"], ["Золото 585 и серебро 925", "Все изделия сертифицированы"],
          ["Доставка", "По всему Узбекистану"], ["Подарочная упаковка", "К каждому заказу"], ["Удобная оплата", "Наличными и картой"]],
      cartTitle: "Корзина", cartSub: (n, s) => `${n} шт. на ${s}`, cartEmptySub: "В корзине пока ничего нет",
      continueShop: "Продолжить покупки", toFav: "В избранное", remove: "Удалить", removed: "Убрано из корзины", undo: "Вернуть",
      removeOne: "Убрать одну штуку из корзины",
      qty: "Количество", receive: "Способ получения", pickup: "Самовывоз из магазина", pickupNote: "Бесплатно, будет готово завтра",
      courier: "Курьером", courierNote: "По Ташкенту, 1–2 дня", pickStore: "Магазин", storeMain: "SOFIZAR, центральный магазин в Ташкенте",
      address: "Адрес", addressPh: "Улица, дом, квартира",
      summary: "Ваш заказ", subtotal: "Товары", discount: "Скидка", deliveryCost: "Доставка", free: "Бесплатно", total: "Итого",
      promo: "Промокод", promoPh: "Например, SOFIZAR10", apply: "Применить", promoOk: "Промокод применён: −10%", promoBad: "Такого промокода нет. Проверьте и введите снова.",
      checkout: "Оформить заказ", payNote: "Оплата в магазине или курьеру: наличными или картой. Онлайн-оплата появится позже.",
      bonusEarn: (n) => `+${n} бонусных баллов за этот заказ`,
      emptyTitle: "Корзина пуста", emptyText: "Добавьте понравившееся украшение, и оно появится здесь.", toCatalog: "Перейти в каталог",
      recommend: "Вам может понравиться",
      coTitle: "Подтверждение заказа", coName: "Ваше имя", coPhone: "Телефон", coPhoneHint: "Позвоним, чтобы подтвердить заказ",
      coPhoneErr: "Введите номер полностью: +998 и 9 цифр", coNameErr: "Введите имя", coComment: "Комментарий", coCommentPh: "Например, нужна подарочная упаковка",
      cancel: "Отмена", confirm: "Подтвердить", doneTitle: "Заказ принят", doneText: (id) => `Номер заказа ${id}. Менеджер позвонит в течение 15 минут.`,
      toOrders: "К моим заказам", demoNote: "Демо: заказ сохраняется только в этом браузере.",
      hello: (n) => `Здравствуйте, ${n}!`, accSub: "Заказы, бонусы и личные данные в одном месте",
      overview: "Обзор", orders: "Заказы", bonus: "Бонусы", addresses: "Адреса", profile: "Профиль", logout: "Выйти",
      activeOrders: "Активные заказы", activeOrdersSub: "собираются или в пути", bonusPts: "Бонусные баллы", bonusPtsSub: "1 балл = 1 сум",
      favCount: "Избранное", favCountSub: "сохранённых украшений", recentOrders: "Последние заказы", allOrders: "Все заказы",
      tabActive: "Активные", tabHistory: "История", order: "Заказ", pieces: (n) => `${n} шт.`,
      st_new: "Принят", st_prep: "Собирается", st_ready: "Ждёт в магазине", st_way: "В пути", st_done: "Получен", st_cancel: "Отменён",
      steps: ["Принят", "Собирается", "Готов", "Получен"],
      repeat: "Повторить заказ", orderItems: "Состав", noOrders: "Активных заказов нет. Загляните в новинки.",
      favEmpty: "В избранном пока пусто. Нажмите на сердечко на карточке товара.",
      level: "Уровень", lvlSilver: "Серебряный", lvlGold: "Золотой", toNext: (n) => `До золотого уровня ${n} баллов`,
      bonusHint: "С каждой покупки возвращаем 1% баллами. Баллами можно оплатить до 30% следующего заказа.",
      bonusHistory: "История баллов", earnFor: (id) => `За заказ ${id}`, spentOn: (id) => `Списано в заказе ${id}`, birthday: "Подарок ко дню рождения",
      addAddress: "Добавить адрес", addrTitle: "Название", addrTitlePh: "Дом, работа...", save: "Сохранить", saved: "Сохранено", mainAddr: "Основной",
      firstName: "Имя", lastName: "Фамилия", email: "Email", bday: "Дата рождения", lang: "Язык", notify: "Уведомления",
      notifySms: "SMS о статусе заказа", notifyTg: "Новые коллекции в Telegram", saveProfile: "Сохранить изменения",
      logoutDemo: "В демо-режиме выход отключён",
    },
    en: {
      chooseRegion: "Choose a region", stores: "Stores", delivery: "Delivery", payment: "Payment", warranty: "Warranty",
      about: "About us", contact: "Contact", searchLabel: "Search", searchPh: "Ring, earrings, chain...",
      account: "Account", favs: "Favorites", cart: "Bag", catalog: "Catalog", home: "Home",
      c_rings: "Rings", c_earrings: "Earrings", c_bracelets: "Bracelets", c_chains: "Chains",
      c_pendants: "Pendants", c_sets: "Sets", c_gifts: "Gifts",
      newItems: "New arrivals", sales: "Offers", info: "Information",
      footerAbout: "Jewelry Factory, Uzbekistan. Gold and silver jewelry.",
      demo: "Demo for management. Prices, products and orders are examples.",
      p1: "Twist ring", p2: "Drop hoop earrings", p3: "Drop pendant necklace", p4: "Chain bracelet",
      gold: "585 gold", items: "items", sum: "UZS", size: "Size",
      addFav: "Added to favorites", delFav: "Removed from favorites", addCart: "Added to bag", goCart: "Go to bag",
      m_yellow: "Yellow gold", m_white: "White gold", m_rose: "Rose gold", m_silver: "Silver",
      fMetal: "Metal", forBuyers: "Customer info", faq: "FAQ", aboutNav: "About the factory", newShort: "New in", pending: "",
      months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
      kicker: "New collection 2026", heroTitle: "Quality in a modern form",
      heroSub: "Jewelry in 585 gold and 925 silver. Every piece is made at our own factory.",
      ctaCollection: "Explore the collection", ctaStore: "Find a store", popularCats: "Popular categories",
      tabNew: "New", tabPopular: "Popular", tabSale: "On sale", tagNew: "New",
      collections: "Collections", viewAll: "View all", collTitle: "Golden harmony",
      collText: "Soft shapes for every day: rings, bracelets and chains in one style.",
      factory: "Our factory",
      factoryText: "Over 25 years of experience, modern technology and care for the jeweler's craft. Every piece is checked from production to the showcase.",
      statYears: "years of experience", statProbe: "gold and silver hallmark", statCert: "certified", aboutFactory: "About the factory",
      empty: "Nothing found. Try another word.",
      b: [["Own production", "Quality guarantee"], ["585 gold and 925 silver", "Every piece is certified"],
          ["Delivery", "Across Uzbekistan"], ["Gift wrapping", "With every order"], ["Easy payment", "Cash or card"]],
      cartTitle: "Bag", cartSub: (n, s) => `${n} items, ${s}`, cartEmptySub: "Your bag is empty for now",
      continueShop: "Continue shopping", toFav: "Save to favorites", remove: "Remove", removed: "Removed from bag", undo: "Undo",
      removeOne: "Remove one from bag",
      qty: "Quantity", receive: "How to receive", pickup: "Pick up in store", pickupNote: "Free, ready tomorrow",
      courier: "Courier", courierNote: "Within Tashkent, 1–2 days", pickStore: "Store", storeMain: "SOFIZAR flagship store, Tashkent",
      address: "Address", addressPh: "Street, building, apartment",
      summary: "Your order", subtotal: "Items", discount: "Discount", deliveryCost: "Delivery", free: "Free", total: "Total",
      promo: "Promo code", promoPh: "For example, SOFIZAR10", apply: "Apply", promoOk: "Promo code applied: −10%", promoBad: "This promo code doesn't exist. Check it and try again.",
      checkout: "Place order", payNote: "Pay in store or to the courier, in cash or by card. Online payment is coming soon.",
      bonusEarn: (n) => `+${n} bonus points for this order`,
      emptyTitle: "Your bag is empty", emptyText: "Add a piece you like and it will show up here.", toCatalog: "Go to catalog",
      recommend: "You may also like",
      coTitle: "Confirm your order", coName: "Your name", coPhone: "Phone", coPhoneHint: "We'll call to confirm the order",
      coPhoneErr: "Enter the full number: +998 and 9 digits", coNameErr: "Enter your name", coComment: "Comment", coCommentPh: "For example, gift wrapping needed",
      cancel: "Cancel", confirm: "Confirm", doneTitle: "Order placed", doneText: (id) => `Order number ${id}. A manager will call you within 15 minutes.`,
      toOrders: "Go to my orders", demoNote: "Demo: the order is saved in this browser only.",
      hello: (n) => `Hello, ${n}!`, accSub: "Orders, bonuses and personal details in one place",
      overview: "Overview", orders: "Orders", bonus: "Bonuses", addresses: "Addresses", profile: "Profile", logout: "Sign out",
      activeOrders: "Active orders", activeOrdersSub: "being prepared or on the way", bonusPts: "Bonus points", bonusPtsSub: "1 point = 1 UZS",
      favCount: "Favorites", favCountSub: "saved pieces", recentOrders: "Recent orders", allOrders: "All orders",
      tabActive: "Active", tabHistory: "History", order: "Order", pieces: (n) => `${n} items`,
      st_new: "Received", st_prep: "Preparing", st_ready: "Ready in store", st_way: "On the way", st_done: "Collected", st_cancel: "Cancelled",
      steps: ["Received", "Preparing", "Ready", "Collected"],
      repeat: "Order again", orderItems: "Items", noOrders: "No active orders. Take a look at new arrivals.",
      favEmpty: "Your favorites list is empty. Tap the heart on a product card.",
      level: "Level", lvlSilver: "Silver", lvlGold: "Gold", toNext: (n) => `${n} points to Gold level`,
      bonusHint: "Get 1% back in points on every purchase. Points can cover up to 30% of your next order.",
      bonusHistory: "Points history", earnFor: (id) => `For order ${id}`, spentOn: (id) => `Spent on order ${id}`, birthday: "Birthday gift",
      addAddress: "Add address", addrTitle: "Label", addrTitlePh: "Home, work...", save: "Save", saved: "Saved", mainAddr: "Main",
      firstName: "First name", lastName: "Last name", email: "Email", bday: "Date of birth", lang: "Language", notify: "Notifications",
      notifySms: "SMS about order status", notifyTg: "New collections on Telegram", saveProfile: "Save changes",
      logoutDemo: "Sign out is disabled in demo mode",
    },
  };

  /* ---------- Товары (пример, позже — из 1С) ---------- */
  // model: p1 кольцо, p2 серьги, p3 цепь с подвеской, p4 браслет. Один дизайн в разных металлах — отдельные артикулы.
  const MODELS = {
    p1: { cat: "rings", img: "gold-ring.webp", life: "category-rings.webp", sizes: [16, 16.5, 17, 17.5, 18, 18.5, 19] },
    p2: { cat: "earrings", img: "gold-earrings.webp", life: "category-earrings.webp" },
    p3: { cat: "chains", img: "gold-necklace.webp", life: "category-necklaces.webp", sizes: [40, 45, 50], unit: "cm" },
    p4: { cat: "bracelets", img: "gold-bracelet.webp", life: "campaign-hands.webp", sizes: [16, 17, 18, 19], unit: "cm" },
  };
  const P = (id, key, metal, w, price, extra = {}) => ({ id, key, metal, probe: metal === "silver" ? 925 : 585, w, price, tabs: [], ...MODELS[key], ...extra });
  const PRODUCTS = [
    P(1, "p1", "yellow", 6.2, 8450000, { tabs: ["new", "popular"], pop: 98 }),
    P(2, "p2", "yellow", 5.4, 7990000, { tabs: ["new", "sale"], old: 8890000, pop: 91 }),
    P(3, "p3", "yellow", 2.1, 5480000, { tabs: ["new", "popular"], pop: 88 }),
    P(4, "p4", "yellow", 3.6, 6230000, { tabs: ["new"], pop: 70 }),
    P(5, "p1", "white", 6.0, 8690000, { tabs: ["popular"], pop: 84 }),
    P(6, "p1", "rose", 6.1, 8450000, { tabs: ["new"], pop: 66 }),
    P(7, "p2", "white", 5.5, 8190000, { tabs: ["popular"], pop: 80 }),
    P(8, "p2", "rose", 5.3, 7590000, { tabs: ["sale"], old: 8450000, pop: 62 }),
    P(9, "p3", "rose", 2.1, 5290000, { tabs: ["sale"], old: 5880000, pop: 58 }),
    P(10, "p4", "white", 3.7, 6490000, { pop: 55 }),
    P(11, "p1", "silver", 5.8, 790000, { tabs: ["new", "popular"], pop: 93 }),
    P(12, "p2", "silver", 5.1, 690000, { tabs: ["popular"], pop: 86 }),
    P(13, "p3", "silver", 2.0, 450000, { tabs: ["sale"], old: 520000, pop: 74 }),
    P(14, "p4", "silver", 3.4, 560000, { tabs: ["new"], pop: 60 }),
  ];
  PRODUCTS.forEach((p) => { p.sku = `SZ-${({ rings: "R", earrings: "E", chains: "N", bracelets: "B" })[p.cat]}${String(p.id).padStart(4, "0")}`; });
  const CATS = ["rings", "earrings", "bracelets", "chains"];
  const METALS = ["yellow", "white", "rose", "silver"];
  const byId = (id) => PRODUCTS.find((p) => p.id === +id);

  /* ---------- Регионы Узбекистана (ISO 3166-2) ---------- */
  const REGIONS = {
    TK: { uz: "Toshkent shahri", ru: "Город Ташкент", en: "Tashkent city" },
    AN: { uz: "Andijon viloyati", ru: "Андижанская область", en: "Andijan region" },
    BU: { uz: "Buxoro viloyati", ru: "Бухарская область", en: "Bukhara region" },
    JI: { uz: "Jizzax viloyati", ru: "Джизакская область", en: "Jizzakh region" },
    QA: { uz: "Qashqadaryo viloyati", ru: "Кашкадарьинская область", en: "Kashkadarya region" },
    NW: { uz: "Navoiy viloyati", ru: "Навоийская область", en: "Navoi region" },
    NG: { uz: "Namangan viloyati", ru: "Наманганская область", en: "Namangan region" },
    QR: { uz: "Qoraqalpogʻiston Respublikasi", ru: "Республика Каракалпакстан", en: "Republic of Karakalpakstan" },
    SA: { uz: "Samarqand viloyati", ru: "Самаркандская область", en: "Samarkand region" },
    SI: { uz: "Sirdaryo viloyati", ru: "Сырдарьинская область", en: "Syrdarya region" },
    SU: { uz: "Surxondaryo viloyati", ru: "Сурхандарьинская область", en: "Surkhandarya region" },
    TO: { uz: "Toshkent viloyati", ru: "Ташкентская область", en: "Tashkent region" },
    FA: { uz: "Fargʻona viloyati", ru: "Ферганская область", en: "Fergana region" },
    XO: { uz: "Xorazm viloyati", ru: "Хорезмская область", en: "Khorezm region" },
  };
  const isRegion = (code) => typeof code === "string" && Object.hasOwn(REGIONS, code);

  /* ---------- Хранилище ---------- */
  const store = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const state = {
    lang: store.get("sz-lang", "uz"),
    region: store.get("sz-region", ""),
    favs: new Set(store.get("sz-favs", [2, 3])),
    cart: store.get("sz-cart2", [{ id: 1, size: 17, qty: 1 }, { id: 2, qty: 1 }]),
  };
  state.addedProducts = new Set([...store.get("sz-added-products", []), ...state.cart.map((line) => line.id)]);
  if (!T[state.lang]) state.lang = "uz";

  const t = (k, ...a) => { const v = T[state.lang][k]; return typeof v === "function" ? v(...a) : v; };
  const money = (n) => Math.round(n).toLocaleString("ru-RU").replace(/\s/g, " ") + " " + t("sum");
  const grams = (n) => n.toFixed(1).replace(".", state.lang === "en" ? "." : ",") + (state.lang === "ru" ? " г" : " g");
  const sizeLabel = (p, s) => (p.unit ? `${s} ${state.lang === "ru" ? "см" : "cm"}` : String(s).replace(".", state.lang === "en" ? "." : ","));
  const spec = (p) => `${t("m_" + p.metal)} ${p.probe}, ${grams(p.w)}`;
  const catName = (c) => t("c_" + c);
  const date = (iso) => { const d = new Date(iso); return state.lang === "en" ? `${t("months")[d.getMonth()]} ${d.getDate()}` : `${d.getDate()} ${t("months")[d.getMonth()]}`; };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Ссылки между страницами ----------
     Маршрут — короткое имя: home, new, cart, orders, catalog, catalog-rings, product-5, about, delivery...
     На сайте это обычные страницы (catalog.html#rings, product.html#5), в превью — #имя в одном файле. */
  const HOME_ANCHORS = ["new", "categories", "collections", "benefits", "factory", "footer"];
  const ACCOUNT_TABS = ["account", "orders", "favorites", "bonus", "addresses", "profile"];
  const INFO = ["info", "delivery", "payment", "warranty", "stores", "faq"];
  const page = document.body.dataset.page;
  const pageOf = (r) => r === "cart" ? "cart" : ACCOUNT_TABS.includes(r) ? "account" : r.startsWith("catalog") ? "catalog"
    : r.startsWith("product-") ? "product" : r === "about" ? "about" : INFO.includes(r) ? "info" : "home";
  function href(r) {
    if (SPA) return "#" + r;
    switch (pageOf(r)) {
      case "cart": return "cart.html";
      case "account": return r === "account" ? "account.html" : "account.html#" + r;
      case "catalog": return r === "catalog" ? "catalog.html" : "catalog.html#" + r.slice(8);
      case "product": return "product.html#" + r.slice(8);
      case "about": return "about.html";
      case "info": return r === "info" ? "info.html" : "info.html#" + r;
      default: return r === "home" ? "index.html" : page === "home" ? "#" + r : "index.html#" + r;
    }
  }
  function currentRoute() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (SPA) return h || "home";
    if (page === "catalog") return h ? "catalog-" + h : "catalog";
    if (page === "product") return "product-" + (h || "1");
    if (page === "account") return h || "account";
    if (page === "info") return h || "info";
    return h || page;
  }
  const sectionFades = new WeakMap();
  function fadeSection(element, duration = 420) {
    if (!element?.animate || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    sectionFades.get(element)?.cancel();
    sectionFades.set(element, element.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration, easing: "ease-out" }
    ));
  }

  const routeFns = [];
  function onRoute(fn) { routeFns.push(fn); }
  function runRoute() { const r = currentRoute(); routeFns.forEach((fn) => fn(r)); markNav(r); }
  function markNav(r) {
    const pg = pageOf(r);
    $$(".actions .action").forEach((a) => a.classList.toggle("is-current", a.dataset.nav === (pg === "account" ? (r === "favorites" ? "favorites" : "account") : pg)));
    $$("[data-route]").forEach((a) => a.classList.toggle("is-current", a.dataset.route === r || (a.dataset.route === "catalog" && r === "catalog")));
  }
  const extend = (dict) => Object.keys(dict).forEach((l) => Object.assign(T[l], dict[l]));

  /* ---------- Шапка и подвал ---------- */
  function chromeTop() {
    return `
    <div class="topbar"><div class="wrap">
      <label class="region-control">
        <svg class="ico" aria-hidden="true"><use href="#i-pin"/></svg>
        <select id="regionSelect"></select>
      </label>
      <nav aria-label="Info">
        <a href="${href("stores")}" data-i18n="stores"></a><a href="${href("delivery")}" data-i18n="delivery"></a>
        <a href="${href("payment")}" data-i18n="payment"></a><a href="${href("warranty")}" data-i18n="warranty"></a>
        <a href="${href("about")}" data-i18n="about"></a><a href="${href("faq")}" data-i18n="faq"></a>
      </nav>
      <div class="topbar-end">
        <span class="phone"><svg class="ico"><use href="#i-phone"/></svg><span>+998 55 500-00-00</span></span>
        <div class="lang" role="group" aria-label="Til / Язык / Language">
          <button data-lang="uz">UZ</button><button data-lang="ru">RU</button><button data-lang="en">EN</button>
        </div>
      </div>
    </div></div>
    <header class="header" id="header">
      <div class="wrap header-row">
        <a class="logo" href="${href("home")}" aria-label="SOFIZAR"><span class="media-slot"><img src="assets/img/logo-horizontal.svg" alt=""></span></a>
        <label class="search">
          <svg class="ico"><use href="#i-search"/></svg><span class="sr" data-i18n="searchLabel"></span>
          <input id="search" type="search" data-i18n-ph="searchPh" autocomplete="off"><span class="kbd">Ctrl K</span>
        </label>
        <nav class="actions">
          <a class="action" data-nav="account" href="${href("account")}"><svg class="ico"><use href="#i-user"/></svg><span data-i18n="account"></span></a>
          <a class="action" data-nav="favorites" href="${href("favorites")}"><svg class="ico"><use href="#i-heart"/></svg><span data-i18n="favs"></span><span class="count" data-badge="favs" hidden></span></a>
          <a class="action" data-nav="cart" href="${href("cart")}"><svg class="ico"><use href="#i-bag"/></svg><span data-i18n="cart"></span><span class="count" data-badge="cart" hidden></span></a>
        </nav>
      </div>
      <nav class="catnav" aria-label="Catalog"><div class="wrap">
        <a class="catalog-btn" data-route="catalog" href="${href("catalog")}"><svg class="ico"><use href="#i-menu"/></svg><span data-i18n="catalog"></span></a>
        ${CATS.map((c) => `<a data-route="catalog-${c}" href="${href("catalog-" + c)}" data-i18n="c_${c}"></a>`).join("")}
        <a data-route="catalog-new" href="${href("catalog-new")}" data-i18n="newShort"></a>
        <a data-route="about" href="${href("about")}" data-i18n="aboutNav"></a>
        <a class="sale" data-route="catalog-sale" href="${href("catalog-sale")}" data-i18n="sales"></a>
      </div></nav>
    </header>`;
  }
  function chromeBottom() {
    return `
    <footer class="footer" id="footer"><div class="wrap">
      <div class="footer-grid">
        <div><span class="logo" role="img" aria-label="SOFIZAR"><span class="media-slot"><img src="assets/img/logo-horizontal.svg" alt=""></span></span><p data-i18n="footerAbout"></p></div>
        <div><h3 data-i18n="catalog"></h3><ul>
          ${CATS.map((c) => `<li><a href="${href("catalog-" + c)}" data-i18n="c_${c}"></a></li>`).join("")}
          <li><a href="${href("catalog-sale")}" data-i18n="sales"></a></li></ul></div>
        <div><h3 data-i18n="forBuyers"></h3><ul>
          <li><a href="${href("about")}" data-i18n="aboutNav"></a></li><li><a href="${href("delivery")}" data-i18n="delivery"></a></li>
          <li><a href="${href("payment")}" data-i18n="payment"></a></li><li><a href="${href("warranty")}" data-i18n="warranty"></a></li>
          <li><a href="${href("faq")}" data-i18n="faq"></a></li></ul></div>
        <div><h3 data-i18n="account"></h3><ul>
          <li><a href="${href("orders")}" data-i18n="orders"></a></li><li><a href="${href("favorites")}" data-i18n="favs"></a></li>
          <li><a href="${href("bonus")}" data-i18n="bonus"></a></li><li><a href="${href("cart")}" data-i18n="cart"></a></li></ul></div>
        <div><h3 data-i18n="contact"></h3><ul><li>+998 55 500-00-00</li><li>sofizar.uz</li><li><a href="${href("stores")}" data-i18n="stores"></a></li></ul></div>
      </div>
      <div class="fineprint"><span>© 2026 SOFIZAR</span><span data-i18n="demo"></span></div>
    </div></footer>
    <div class="toast" id="toast" role="status" aria-live="polite"><svg class="ico"><use href="#i-check"/></svg><span class="toast-msg"></span><a class="toast-act" hidden></a></div>`;
  }

  /* ---------- Общие действия ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const listeners = [];
  const emit = () => listeners.forEach((fn) => fn());

  function cartCount(productId) {
    return state.cart.reduce((total, line) => total + (productId == null || line.id === productId ? line.qty : 0), 0);
  }
  function saveCart() {
    store.set("sz-cart2", state.cart);
    store.set("sz-added-products", [...state.addedProducts]);
    syncBadges("cart");
    emit();
  }
  const defaultSize = (product) => product.sizes?.[Math.floor(product.sizes.length / 2)];

  function addToCart(id, size) {
    const p = byId(id); const s = size ?? defaultSize(p);
    const line = state.cart.find((l) => l.id === p.id && l.size === s);
    line ? line.qty++ : state.cart.push({ id: p.id, size: s, qty: 1 });
    state.addedProducts.add(p.id);
    saveCart(); toast(t("addCart"), { label: t("goCart"), href: href("cart") });
  }
  function removeOneFromCart(id, selectedSize) {
    const product = byId(id);
    const size = selectedSize ?? defaultSize(product);
    let index = state.cart.findIndex((line) => line.id === product.id && line.size === size);
    if (index < 0) index = state.cart.findLastIndex((line) => line.id === product.id);
    if (index < 0) return;

    const line = state.cart[index];
    if (line.qty > 1) line.qty--;
    else state.cart.splice(index, 1);
    saveCart();
  }
  function toggleFav(id) {
    const on = !state.favs.has(+id); on ? state.favs.add(+id) : state.favs.delete(+id);
    store.set("sz-favs", [...state.favs]); syncBadges("favs"); emit(); toast(t(on ? "addFav" : "delFav"));
    return on;
  }
  function syncBadges(bumpBadge) {
    const set = (el, n) => {
      el.textContent = n;
      el.hidden = n === 0;
      if (el.dataset.badge === bumpBadge) {
        const icon = $(".ico", el.parentElement);
        el.classList.remove("bump");
        icon.classList.remove("bump");
        const target = n > 0 ? el : icon;
        void target.getBoundingClientRect();
        target.classList.add("bump");
      }
    };
    $$('[data-badge="favs"]').forEach((el) => set(el, state.favs.size));
    $$('[data-badge="cart"]').forEach((el) => set(el, cartCount()));
  }

  let tt;
  function toast(msg, action) {
    const el = $("#toast"); if (!el) return;
    $(".toast-msg", el).textContent = msg;
    const a = $(".toast-act", el);
    a.hidden = !action; if (action) { a.textContent = action.label; action.href ? (a.href = action.href, a.onclick = null) : (a.removeAttribute("href"), a.onclick = (e) => { e.preventDefault(); action.fn(); el.classList.remove("is-on"); }); a.setAttribute("role", "button"); a.tabIndex = 0; }
    el.classList.add("is-on"); clearTimeout(tt); tt = setTimeout(() => el.classList.remove("is-on"), action ? 4000 : 1800);
  }

  // Карточка товара — общая для главной, корзины (рекомендации) и избранного
  function productCard(p, opts = {}) {
    const quantity = cartCount(p.id);
    const added = state.addedProducts.has(p.id);
    return `
    <article class="product">
      <div class="p-img">
        <a class="p-link metal-${p.metal}" href="${href("product-" + p.id)}" tabindex="-1" aria-hidden="true"><span class="media-slot"><img src="assets/img/${p.img}" alt="" loading="lazy"></span></a>
        ${p.old ? `<span class="tag sale">−${Math.round((1 - p.price / p.old) * 100)}%</span>` : opts.noTag ? "" : `<span class="tag">${t("tagNew")}</span>`}
        <button class="fav" data-fav="${p.id}" aria-pressed="${state.favs.has(p.id)}" aria-label="${esc(t("favs"))}: ${esc(t(p.key))}"><svg class="ico"><use href="#i-heart"/></svg></button>
      </div>
      <div class="p-info">
        <a class="p-name" href="${href("product-" + p.id)}">${t(p.key)}</a>
        <span class="p-meta">${spec(p)}</span>
        <div class="p-row">
          <span class="p-price">${p.old ? `<s>${money(p.old)}</s>` : ""}${money(p.price)}</span>
          <div class="p-cart-actions">
            ${quantity ? `<button type="button" class="bag-minus" data-remove-one="${p.id}" aria-label="${esc(t("removeOne"))}: ${esc(t(p.key))}">−</button>` : ""}
            <button type="button" class="bag${added ? " added" : ""}" data-add="${p.id}" aria-label="${esc(t("cart"))}: ${esc(t(p.key))}${quantity ? " ×" + quantity : ""}">
              <svg class="ico" aria-hidden="true"><use href="#i-bag"/></svg>${quantity ? '<span class="product-cart-count" aria-hidden="true">' + quantity + '</span>' : ""}
            </button>
          </div>
        </div>
      </div>
    </article>`;
  }
  // Делегирование кликов по сердечку и корзине на любой странице
  document.addEventListener("click", (e) => {
    const fav = e.target.closest("[data-fav]");
    if (fav) { const on = toggleFav(fav.dataset.fav); $$(`[data-fav="${fav.dataset.fav}"]`).forEach((b) => b.setAttribute("aria-pressed", on)); }

    const cartButton = e.target.closest("[data-add], [data-remove-one]");
    if (!cartButton) return;
    const { add, removeOne } = cartButton.dataset;
    const id = add ?? removeOne;
    const page = cartButton.closest("main") ?? document;
    const restoreFocus = document.activeElement === cartButton;
    if (add) addToCart(id);
    else removeOneFromCart(id);

    if (restoreFocus) {
      const minus = removeOne && $(`[data-remove-one="${id}"]`, page);
      (minus || $(`[data-add="${id}"]`, page))?.focus({ preventScroll: true });
    }
  });

  /* ---------- Выбор региона ---------- */
  const regionSessionKey = "sz-region-ip";

  function renderRegion() {
    const select = $("#regionSelect");
    const prompt = t("chooseRegion");
    select.setAttribute("aria-label", prompt);
    const placeholder = new Option(prompt, "");
    placeholder.disabled = true;
    select.replaceChildren(placeholder, ...Object.entries(REGIONS).map(
      ([code, names]) => new Option(names[state.lang], code)
    ));
    select.value = isRegion(state.region) ? state.region : "";
  }

  async function detectRegion() {
    if (isRegion(state.region)) return;
    try {
      const cached = sessionStorage.getItem(regionSessionKey);
      if (cached !== null) {
        if (isRegion(cached)) {
          state.region = cached;
          renderRegion();
        }
        return;
      }
    } catch {
      // Storage may be unavailable in private or restricted contexts.
    }

    const select = $("#regionSelect");
    select.dataset.regionPending = "";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    let detected = "";
    try {
      const response = await fetch("https://ipwho.is/?fields=success,country_code,region_code", {
        credentials: "omit", referrerPolicy: "no-referrer", signal: controller.signal,
      });
      if (response.ok) {
        const data = await response.json();
        const code = String(data.region_code ?? "").trim().toUpperCase().replace(/^UZ-/, "");
        if (data.success && data.country_code === "UZ" && isRegion(code)) detected = code;
      }
    } catch {
      // The selector remains available when the IP lookup fails.
    } finally {
      clearTimeout(timeout);
      delete select.dataset.regionPending;
    }

    try { sessionStorage.setItem(regionSessionKey, detected); } catch {}
    const manual = store.get("sz-region", "");
    if (isRegion(manual) || (!isRegion(state.region) && detected)) {
      state.region = isRegion(manual) ? manual : detected;
      renderRegion();
    }
  }

  /* ---------- Язык ---------- */
  function applyLang() {
    document.documentElement.lang = state.lang;
    renderRegion();
    $$("[data-i18n]").forEach((el) => { const v = T[state.lang][el.dataset.i18n]; if (typeof v === "string") el.textContent = v; });
    $$("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$(".lang button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === state.lang));
    emit();
  }

  /* ---------- Маршрутизация в превью (все страницы в одном файле) ---------- */
  function route() {
    const r = currentRoute(), pg = pageOf(r);
    $$("main[data-page]").forEach((m) => (m.hidden = m.dataset.page !== pg));
    document.body.dataset.page = pg;
    window.dispatchEvent(new CustomEvent("sz:route", { detail: r }));
    runRoute();
    const target = (pg === "home" || pg === "info") && r !== "home" && r !== "info" && document.getElementById(r);
    if (target) target.scrollIntoView(); else scrollTo(0, 0);
  }

  /* ---------- Подвижное выделение в переключателях ---------- */
  const selectionGroups = [
    [".lang", 'button[aria-pressed="true"]'],
    [".tabs, .g-thumbs", '[aria-selected="true"]'],
    [".acc-menu, .info-nav, .catnav .wrap, .actions", ".is-current"],
    [".metal-swatches", '[aria-current="true"]'],
    [".size-chips", '[aria-checked="true"]'],
    ["#fCat", "label:has(input:checked)"],
    ["#fPricePresets", ".is-on"],
  ];

  function mountSelectionHighlights() {
    if (!window.ResizeObserver || !window.MutationObserver) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

    for (const [groups, activeSelector] of selectionGroups) {
      $$(groups).forEach((group) => {
        let previous;
        let frame = 0;

        function sync() {
          frame = 0;
          const active = group.querySelector(activeSelector);
          if (!active?.offsetWidth || !group.clientWidth) {
            delete group.dataset.selection;
            previous = undefined;
            return;
          }

          const x = active.offsetLeft;
          const y = active.offsetTop;
          group.style.setProperty("--selection-x", x + "px");
          group.style.setProperty("--selection-y", y + "px");
          group.style.setProperty("--selection-width", active.offsetWidth + "px");
          group.style.setProperty("--selection-height", active.offsetHeight + "px");
          group.dataset.selection = previous ? "moving" : "instant";

          // Bring a newly selected item into view within a scrolling strip.
          if (active !== previous && group.scrollWidth > group.clientWidth &&
              /auto|scroll/.test(getComputedStyle(group).overflowX)) {
            const right = x + active.offsetWidth;
            const left = group.scrollLeft;
            const padding = parseFloat(getComputedStyle(group).paddingInlineStart) || 0;
            if (x < left || right > left + group.clientWidth) {
              const target = x < left ? x - padding : right - group.clientWidth + padding;
              group.scrollTo({ left: target, behavior: previous && !reducedMotion.matches ? "smooth" : "instant" });
            }
          }

          previous = active;
        }

        function schedule() {
          if (!frame) frame = requestAnimationFrame(sync);
        }

        const sizes = new ResizeObserver(schedule);
        function observeSizes() {
          sizes.disconnect();
          sizes.observe(group);
          for (const item of group.children) sizes.observe(item);
        }

        const changes = new MutationObserver((records) => {
          if (records.some((record) => record.type === "childList" && record.target === group)) observeSizes();
          schedule();
        });
        changes.observe(group, {
          subtree: true, childList: true, attributes: true,
          attributeFilter: ["class", "aria-pressed", "aria-selected", "aria-current", "aria-checked"],
        });
        group.addEventListener("change", schedule);
        observeSizes();
        sync();
      });
    }
  }

  /* ---------- Фокус и выпадающие списки ---------- */
  function trackTabFocus() {
    const root = document.documentElement;
    const clear = () => delete root.dataset.tabFocus;
    addEventListener("keydown", (event) => {
      if (event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey) {
        root.dataset.tabFocus = "";
      } else if (event.key === "Alt" || event.altKey) {
        clear();
      }
    }, true);
    addEventListener("pointerdown", clear, true);
    addEventListener("blur", clear);
  }

  function mountDropdowns() {
    const controls = new WeakMap();
    const list = document.createElement("div");
    list.id = "select-options";
    list.className = "select-options";
    list.setAttribute("role", "listbox");
    list.hidden = true;
    if (list.showPopover) list.setAttribute("popover", "manual");
    const optionList = document.createElement("div");
    optionList.className = "select-option-list";
    list.append(optionList);
    document.body.append(list);

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let opened;
    let closing;
    let motion;
    let cursor = -1;
    let typed = "";
    let lastKey = 0;

    async function animate(element, keyframes, duration) {
      if (reducedMotion.matches || !element.animate) return true;
      const animation = element.animate(keyframes, { duration, easing: "cubic-bezier(.2,.7,.2,1)" });
      motion = animation;
      try {
        await animation.finished;
        return true;
      } catch {
        return false;
      } finally {
        if (motion === animation) motion = null;
      }
    }

    function hideList(button) {
      button.setAttribute("aria-expanded", "false");
      button.removeAttribute("aria-activedescendant");
      if (!list.hidden && list.hidePopover) list.hidePopover();
      list.hidden = true;
    }

    function finishClose() {
      if (!closing) return;
      motion?.cancel();
      const { button } = closing;
      hideList(button);
      delete button.dataset.selectWide;
      delete button.dataset.selectMotion;
      closing = null;
    }

    async function close(immediate = false) {
      if (!opened) {
        if (immediate) finishClose();
        return;
      }

      const control = opened;
      const { select, button } = control;
      const startHeight = list.getBoundingClientRect().height;
      const slot = button.parentElement;
      const startWidth = slot.getBoundingClientRect().width;
      opened = null;
      closing = control;
      motion?.cancel();
      list.inert = true;
      if (immediate) return finishClose();

      if (!list.hidden && !await animate(list, [
        { height: startHeight + "px" },
        { height: "0px" },
      ], 170)) return;
      if (closing !== control) return;
      hideList(button);

      if (select.id === "regionSelect") {
        delete button.dataset.selectWide;
        if (!await animate(slot, [
          { width: startWidth + "px" },
          { width: slot.getBoundingClientRect().width + "px" },
        ], 180)) return;
      }
      if (closing === control) finishClose();
    }

    function position() {
      const control = opened || closing;
      if (!control || list.hidden) return;
      if (!control.button.isConnected || !control.button.offsetWidth) return close(true);
      const rect = control.button.getBoundingClientRect();
      const room = document.documentElement.clientHeight - rect.bottom - 8;
      if (rect.bottom <= 0 || room < 24) return close(true);
      list.style.left = rect.left + "px";
      list.style.top = (rect.bottom - 1) + "px";
      list.style.width = rect.width + "px";
      list.style.setProperty("--select-max-height", Math.min(room, 320) + "px");
    }

    function highlight(index) {
      const items = [...optionList.children];
      cursor = index;
      items.forEach((item, i) => item.classList.toggle("is-highlighted", i === index));
      const item = items[index];
      if (!item) {
        opened.button.removeAttribute("aria-activedescendant");
        return;
      }
      opened.button.setAttribute("aria-activedescendant", item.id);
      const top = item.offsetTop;
      if (top < optionList.scrollTop) optionList.scrollTop = top;
      if (top + item.offsetHeight > optionList.scrollTop + optionList.clientHeight) {
        optionList.scrollTop = top + item.offsetHeight - optionList.clientHeight;
      }
    }

    const availableOptions = (select) => [...select.options].filter(
      (option) => !option.selected && !option.disabled && !option.hidden
    );

    function renderOptions(options) {
      optionList.replaceChildren(...options.map((option, index) => {
        const item = document.createElement("div");
        item.id = list.id + "-" + index;
        item.setAttribute("role", "option");
        item.dataset.value = option.value;
        item.textContent = option.text;
        return item;
      }));
    }

    async function open(control) {
      if (opened === control) return;
      close(true);
      const { select, button } = control;
      const options = availableOptions(select);
      if (!options.length) return;
      if (innerHeight - button.getBoundingClientRect().bottom < 125) {
        button.scrollIntoView({ block: "center", behavior: "instant" });
      }
      renderOptions(options);
      opened = control;
      cursor = -1;
      typed = "";
      button.dataset.selectMotion = "";
      if (select.id === "regionSelect") {
        const slot = button.parentElement;
        const startWidth = slot.getBoundingClientRect().width;
        button.dataset.selectWide = "";
        const wideWidth = slot.getBoundingClientRect().width;
        if (!await animate(slot, [
          { width: startWidth + "px" },
          { width: wideWidth + "px" },
        ], 190)) return;
      }
      if (opened !== control) return;

      list.hidden = false;
      list.inert = false;
      list.setAttribute("aria-label", button.getAttribute("aria-label"));
      button.setAttribute("aria-expanded", "true");
      if (list.showPopover) list.showPopover();
      optionList.scrollTop = 0;
      position();
      if (opened !== control) return;
      if (cursor >= 0) highlight(cursor);
      const height = list.getBoundingClientRect().height;
      animate(list, [{ height: "0px" }, { height: height + "px" }], 250);
    }

    function choose(value) {
      const { select, button } = opened;
      const previousFocus = document.activeElement === button;
      const replacement = select.hasAttribute("data-size") ? '[data-size="' + select.dataset.size + '"]' : "";
      close();
      select.value = value;
      select.dispatchEvent(new Event("input", { bubbles: true }));
      select.dispatchEvent(new Event("change", { bubbles: true }));
      sync();
      if (previousFocus && !button.isConnected && replacement) {
        controls.get($(replacement))?.button.focus({ preventScroll: true });
      }
    }

    function handleKey(event, control) {
      const { key } = event;
      if (opened !== control && !["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) return;
      if (key === "Tab") { close(); return; }
      if (key === "Escape") { event.preventDefault(); close(); return; }
      if (key === "Enter" || key === " ") {
        event.preventDefault();
        if (cursor >= 0) choose(optionList.children[cursor].dataset.value);
        else close();
        return;
      }
      if (["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) {
        event.preventDefault();
        open(control);
        if (opened !== control) return;
        const last = optionList.children.length - 1;
        if (key === "Home" || (key === "ArrowDown" && cursor < 0)) highlight(0);
        else if (key === "End" || (key === "ArrowUp" && cursor < 0)) highlight(last);
        else highlight(Math.max(0, Math.min(last, cursor + (key === "ArrowDown" ? 1 : -1))));
      } else if (key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
        const now = performance.now();
        typed = (now - lastKey < 600 ? typed : "") + key.toLocaleLowerCase();
        lastKey = now;
        const index = [...optionList.children].findIndex((item) => item.textContent.toLocaleLowerCase().startsWith(typed));
        if (index >= 0) highlight(index);
      }
    }

    function enhance(select) {
      const label = select.labels?.[0];
      const labelText = label?.contains(select) ? label.querySelector(":scope > span") : label;
      const wrap = document.createElement("span");
      wrap.className = "select-control";
      const button = document.createElement("button");
      button.type = "button";
      button.className = "select-trigger";
      button.setAttribute("role", "combobox");
      button.setAttribute("aria-controls", list.id);
      button.setAttribute("aria-expanded", "false");
      button.innerHTML = '<span class="select-value"></span><svg class="ico" aria-hidden="true"><use href="#i-chev"/></svg>';
      select.before(wrap);
      wrap.append(button, select);
      select.hidden = true;
      const control = { select, button, labelText, valueText: button.firstElementChild };
      button.addEventListener("click", () => opened === control ? close() : open(control));
      button.addEventListener("keydown", (event) => handleKey(event, control));
      controls.set(select, control);
      return control;
    }

    function sync() {
      if (opened && !opened.button.isConnected || closing && !closing.button.isConnected) close(true);
      $$("select:not([multiple])").forEach((select) => {
        const { button, labelText, valueText } = controls.get(select) || enhance(select);
        const text = select.selectedOptions[0]?.text ?? "";
        const label = select.getAttribute("aria-label") || labelText?.textContent.trim();
        const options = availableOptions(select);
        if (valueText.textContent !== text) {
          valueText.textContent = text;
          if (opened?.select === select) {
            const highlighted = optionList.children[cursor]?.dataset.value;
            renderOptions(options);
            highlight(options.findIndex((option) => option.value === highlighted));
          }
        }
        const accessibleName = label && label !== text ? label + ": " + text : text;
        if (button.getAttribute("aria-label") !== accessibleName) button.setAttribute("aria-label", accessibleName);
        const disabled = select.matches(":disabled") || options.length === 0;
        if (button.disabled !== disabled) button.disabled = disabled;
      });
    }

    list.addEventListener("pointerdown", (event) => {
      if (event.target.closest('[role="option"]')) event.preventDefault();
    });
    list.addEventListener("click", (event) => {
      const option = event.target.closest("[data-value]");
      if (option && opened) choose(option.dataset.value);
    });
    document.addEventListener("pointerdown", (event) => {
      if (opened && !opened.button.contains(event.target) && !list.contains(event.target)) close();
    }, true);
    document.addEventListener("focusin", (event) => {
      if (opened && event.target !== opened.button) close();
    });
    document.addEventListener("change", sync);
    addEventListener("resize", position);
    addEventListener("scroll", (event) => { if (event.target !== optionList) position(); }, true);
    new MutationObserver(sync).observe(document.body, {
      subtree: true, childList: true, attributes: true,
      attributeFilter: ["disabled", "selected", "aria-label"],
    });
    sync();
  }

  /* ---------- Плейсхолдеры изображений ---------- */
  function mountMediaLoading() {
    const selector = ".media-slot > img";

    function markPending(image) {
      if (!image.complete) image.parentElement.dataset.media = "pending";
    }

    async function reveal(event) {
      const image = event.target;
      if (!image.matches?.(selector) || image.parentElement.dataset.media !== "pending") return;
      if (event.type === "load" && image.decode) {
        try { await image.decode(); } catch { /* A failed decode must release the placeholder. */ }
      }
      if (image.isConnected) image.parentElement.dataset.media = "ready";
    }

    document.addEventListener("load", reveal, true);
    document.addEventListener("error", reveal, true);
    $$(selector).forEach(markPending);
    new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches(selector)) markPending(node);
          $$(selector, node).forEach(markPending);
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* ---------- Аккордеоны ---------- */
  function mountAccordions() {
    const transitions = new WeakMap();
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

    function reveal(details) {
      const gap = 12;
      const rect = details.getBoundingClientRect();
      const headerBottom = Math.max(0, $("#header").getBoundingClientRect().bottom);
      const clipped = rect.bottom - innerHeight + gap;
      const roomAbove = rect.top - headerBottom - gap;
      // Keep the start of long content below the sticky header.
      const offset = Math.min(clipped, roomAbove);
      if (clipped > 0 && offset > 0) {
        scrollBy({ top: offset, behavior: reducedMotion.matches ? "instant" : "smooth" });
      }
    }

    document.addEventListener("click", (event) => {
      const summary = event.target.closest("details.acc > summary");
      if (!summary || event.defaultPrevented) return;
      event.preventDefault();

      const details = summary.parentElement;
      const previous = transitions.get(details);
      const opening = !(previous?.opening ?? details.open);
      const startHeight = details.getBoundingClientRect().height;
      previous?.animation.cancel();

      if (reducedMotion.matches || !details.animate) {
        transitions.delete(details);
        delete details.dataset.accordionAnimating;
        details.open = opening;
        if (opening) reveal(details);
        return;
      }

      // Measure the destination layout without using the scaled summary's height.
      details.open = opening;
      const endHeight = details.getBoundingClientRect().height;
      details.open = true;
      details.dataset.accordionAnimating = opening ? "opening" : "closing";
      const animation = details.animate(
        [{ height: startHeight + "px" }, { height: endHeight + "px" }],
        { duration: 290, easing: "cubic-bezier(.2,.7,.2,1)", fill: "both" }
      );
      transitions.set(details, { animation, opening });
      animation.onfinish = () => {
        details.open = opening;
        animation.cancel();
        transitions.delete(details);
        delete details.dataset.accordionAnimating;
        if (opening && details.isConnected) reveal(details);
      };
    });
  }

  /* ---------- Монтирование ---------- */
  function mount() {
    document.body.insertAdjacentHTML("afterbegin", ICONS);
    $("#chrome-top").outerHTML = chromeTop();
    $("#chrome-bottom").outerHTML = chromeBottom();
    $(".catalog-btn").addEventListener("click", (event) => {
      if (document.body.dataset.page === "catalog" && event.button === 0 &&
          !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        if (currentRoute() !== "catalog") location.hash = SPA ? "catalog" : "";
      }
    });
    $$("[data-href]").forEach((el) => { el.href = href(el.dataset.href); });

    $("#regionSelect").addEventListener("change", (event) => {
      const code = event.target.value;
      if (!isRegion(code)) return;
      state.region = code;
      delete event.target.dataset.regionPending;
      store.set("sz-region", code);
    });
    detectRegion();

    $(".lang").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      state.lang = b.dataset.lang; store.set("sz-lang", state.lang); applyLang();
    });
    const header = $("#header");
    const updateHeaderHeight = () => document.documentElement.style.setProperty("--header-height", header.offsetHeight + "px");
    updateHeaderHeight();
    if (window.ResizeObserver) new ResizeObserver(updateHeaderHeight).observe(header);
    else addEventListener("resize", updateHeaderHeight);

    const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 50);
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); $("#search").focus(); } });
    $("#search").addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      if (document.body.dataset.page !== "catalog") { sessionStorage.setItem("sz-q", $("#search").value); location.href = href("catalog"); }
    });
    syncBadges();
  }

  window.SZ = { SPA, T, t, PRODUCTS, MODELS, CATS, METALS, byId, state, store, money, grams, sizeLabel, spec, catName, date, esc, href, pageOf, onRoute, extend, $, $$, toast, fadeSection,
    addToCart, removeOneFromCart, toggleFav, saveCart, cartCount, syncBadges, productCard, onChange: (fn) => listeners.push(fn), applyLang, route };

  mount();
  addEventListener("hashchange", SPA ? route : runRoute);
  addEventListener("pageshow", (event) => {
    if (event.persisted) fadeSection(document.body, 520);
  });
  // страницы подключаются после core.js и вызывают SZ.applyLang() сами (см. SZ.start)
  window.SZ.start = () => {
    applyLang();
    SPA ? route() : runRoute();
    trackTabFocus();
    mountDropdowns();
    mountSelectionHighlights();
    mountMediaLoading();
    mountAccordions();
  };
})();
