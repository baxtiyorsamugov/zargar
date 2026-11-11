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
  </defs></svg>`;

  /* ---------- Переводы ---------- */
  const T = {
    uz: {
      city: "Toshkent", stores: "Do'konlar", delivery: "Yetkazib berish", payment: "To'lov usullari", warranty: "Kafolat",
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
      city: "Ташкент", stores: "Магазины", delivery: "Доставка", payment: "Способы оплаты", warranty: "Гарантия",
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
      city: "Tashkent", stores: "Stores", delivery: "Delivery", payment: "Payment", warranty: "Warranty",
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
  const PRODUCTS = [
    { id: 1, key: "p1", img: "gold-ring.webp",     w: 6.2, price: 8450000, tabs: ["new", "popular"], sizes: [16, 16.5, 17, 17.5, 18, 18.5] },
    { id: 2, key: "p2", img: "gold-earrings.webp", w: 5.4, price: 7990000, tabs: ["new", "sale"], old: 8890000 },
    { id: 3, key: "p3", img: "gold-necklace.webp", w: 2.1, price: 5480000, tabs: ["new", "popular"], sizes: [42, 45, 50] },
    { id: 4, key: "p4", img: "gold-bracelet.webp", w: 3.6, price: 6230000, tabs: ["new"], sizes: [17, 18, 19] },
  ];
  const byId = (id) => PRODUCTS.find((p) => p.id === +id);

  /* ---------- Хранилище ---------- */
  const store = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const state = {
    lang: store.get("sz-lang", "uz"),
    favs: new Set(store.get("sz-favs", [2, 3])),
    cart: store.get("sz-cart2", [{ id: 1, size: 17, qty: 1 }, { id: 2, qty: 1 }]),
  };
  if (!T[state.lang]) state.lang = "uz";

  const t = (k, ...a) => { const v = T[state.lang][k]; return typeof v === "function" ? v(...a) : v; };
  const money = (n) => Math.round(n).toLocaleString("ru-RU").replace(/\s/g, " ") + " " + t("sum");
  const grams = (n) => n.toFixed(1).replace(".", state.lang === "en" ? "." : ",") + (state.lang === "ru" ? " г" : " g");
  const sizeLabel = (p, s) => (p.id === 3 ? `${s} cm` : s);
  const date = (iso) => { const d = new Date(iso); return state.lang === "en" ? `${t("months")[d.getMonth()]} ${d.getDate()}` : `${d.getDate()} ${t("months")[d.getMonth()]}`; };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Ссылки между страницами ---------- */
  const HOME_ANCHORS = ["new", "categories", "collections", "benefits", "factory", "footer"];
  const ACCOUNT_TABS = ["account", "orders", "favorites", "bonus", "addresses", "profile"];
  const page = document.body.dataset.page;
  function href(r) {
    if (SPA) return "#" + r;
    if (r === "home") return "index.html";
    if (HOME_ANCHORS.includes(r)) return page === "home" ? "#" + r : "index.html#" + r;
    if (r === "cart") return "cart.html";
    if (ACCOUNT_TABS.includes(r)) return r === "account" ? "account.html" : "account.html#" + r;
    return "#" + r;
  }

  /* ---------- Шапка и подвал ---------- */
  function chromeTop() {
    return `
    <div class="topbar"><div class="wrap">
      <span class="city"><svg class="ico"><use href="#i-pin"/></svg><span data-i18n="city"></span></span>
      <nav aria-label="Info">
        <a href="${href("footer")}" data-i18n="stores"></a><a href="${href("benefits")}" data-i18n="delivery"></a>
        <a href="${href("benefits")}" data-i18n="payment"></a><a href="${href("benefits")}" data-i18n="warranty"></a>
        <a href="${href("factory")}" data-i18n="about"></a><a href="${href("footer")}" data-i18n="contact"></a>
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
        <a class="logo" href="${href("home")}" aria-label="SOFIZAR"></a>
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
        <a class="catalog-btn" href="${href("new")}"><svg class="ico"><use href="#i-menu"/></svg><span data-i18n="catalog"></span></a>
        <a href="${href("categories")}" data-i18n="c_rings"></a><a href="${href("categories")}" data-i18n="c_earrings"></a>
        <a href="${href("categories")}" data-i18n="c_bracelets"></a><a href="${href("categories")}" data-i18n="c_chains"></a>
        <a href="${href("categories")}" data-i18n="c_pendants"></a><a href="${href("categories")}" data-i18n="c_sets"></a>
        <a href="${href("new")}" data-i18n="newItems"></a><a class="sale" href="${href("new")}" data-i18n="sales"></a>
      </div></nav>
    </header>`;
  }
  function chromeBottom() {
    return `
    <footer class="footer" id="footer"><div class="wrap">
      <div class="footer-grid">
        <div><span class="logo" aria-label="SOFIZAR"></span><p data-i18n="footerAbout"></p></div>
        <div><h3 data-i18n="catalog"></h3><ul>
          <li><a href="${href("categories")}" data-i18n="c_rings"></a></li><li><a href="${href("categories")}" data-i18n="c_earrings"></a></li>
          <li><a href="${href("categories")}" data-i18n="c_bracelets"></a></li><li><a href="${href("new")}" data-i18n="newItems"></a></li></ul></div>
        <div><h3 data-i18n="account"></h3><ul>
          <li><a href="${href("orders")}" data-i18n="orders"></a></li><li><a href="${href("favorites")}" data-i18n="favs"></a></li>
          <li><a href="${href("bonus")}" data-i18n="bonus"></a></li><li><a href="${href("cart")}" data-i18n="cart"></a></li></ul></div>
        <div><h3 data-i18n="contact"></h3><ul><li>+998 55 500-00-00</li><li>sofizar.uz</li><li data-i18n="city"></li></ul></div>
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

  function cartCount() { return state.cart.reduce((n, l) => n + l.qty, 0); }
  function saveCart() { store.set("sz-cart2", state.cart); syncBadges(true); emit(); }
  function addToCart(id, size) {
    const p = byId(id); const s = size ?? (p.sizes ? p.sizes[Math.floor(p.sizes.length / 2)] : undefined);
    const line = state.cart.find((l) => l.id === p.id && l.size === s);
    line ? line.qty++ : state.cart.push({ id: p.id, size: s, qty: 1 });
    saveCart(); toast(t("addCart"), { label: t("goCart"), href: href("cart") });
  }
  function toggleFav(id) {
    const on = !state.favs.has(+id); on ? state.favs.add(+id) : state.favs.delete(+id);
    store.set("sz-favs", [...state.favs]); syncBadges(on); emit(); toast(t(on ? "addFav" : "delFav"));
    return on;
  }
  function syncBadges(bump) {
    const set = (el, n) => { el.textContent = n; el.hidden = n === 0; if (bump) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); } };
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
    return `
    <article class="product">
      <div class="p-img">
        <img src="assets/img/${p.img}" alt="${esc(t(p.key))}" loading="lazy">
        ${p.old ? `<span class="tag sale">−${Math.round((1 - p.price / p.old) * 100)}%</span>` : opts.noTag ? "" : `<span class="tag">${t("tagNew")}</span>`}
        <button class="fav" data-fav="${p.id}" aria-pressed="${state.favs.has(p.id)}" aria-label="${esc(t("favs"))}: ${esc(t(p.key))}"><svg class="ico"><use href="#i-heart"/></svg></button>
      </div>
      <div class="p-info">
        <span class="p-name">${t(p.key)}</span>
        <span class="p-meta">${t("gold")}, ${grams(p.w)}</span>
        <div class="p-row">
          <span class="p-price">${p.old ? `<s>${money(p.old)}</s>` : ""}${money(p.price)}</span>
          <button class="bag" data-add="${p.id}" aria-label="${esc(t("cart"))}: ${esc(t(p.key))}"><svg class="ico"><use href="#i-bag"/></svg></button>
        </div>
      </div>
    </article>`;
  }
  // Делегирование кликов по сердечку и корзине на любой странице
  document.addEventListener("click", (e) => {
    const fav = e.target.closest("[data-fav]"), add = e.target.closest("[data-add]");
    if (fav) { const on = toggleFav(fav.dataset.fav); $$(`[data-fav="${fav.dataset.fav}"]`).forEach((b) => b.setAttribute("aria-pressed", on)); }
    if (add) { addToCart(add.dataset.add); add.classList.add("added"); setTimeout(() => add.classList.remove("added"), 900); }
  });

  /* ---------- Язык ---------- */
  function applyLang() {
    document.documentElement.lang = state.lang;
    $$("[data-i18n]").forEach((el) => { const v = T[state.lang][el.dataset.i18n]; if (typeof v === "string") el.textContent = v; });
    $$("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$(".lang button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === state.lang));
    emit();
  }

  /* ---------- Маршрутизация в превью (все страницы в одном файле) ---------- */
  function route() {
    const r = (location.hash || "#home").slice(1);
    const pg = r === "cart" ? "cart" : ACCOUNT_TABS.includes(r) ? "account" : "home";
    $$("main[data-page]").forEach((m) => (m.hidden = m.dataset.page !== pg));
    document.body.dataset.page = pg;
    $$(".actions .action").forEach((a) => a.classList.toggle("is-current", a.dataset.nav === (pg === "account" ? (r === "favorites" ? "favorites" : "account") : pg)));
    const target = pg === "home" && r !== "home" && document.getElementById(r);
    if (target) target.scrollIntoView(); else scrollTo(0, 0);
    window.dispatchEvent(new CustomEvent("sz:route", { detail: r }));
  }

  /* ---------- Монтирование ---------- */
  function mount() {
    document.body.insertAdjacentHTML("afterbegin", ICONS);
    $("#chrome-top").outerHTML = chromeTop();
    $("#chrome-bottom").outerHTML = chromeBottom();
    $$("[data-href]").forEach((el) => { el.href = href(el.dataset.href); });
    if (!SPA) { const cur = page === "account" && location.hash === "#favorites" ? "favorites" : page; $$(".actions .action").forEach((a) => a.classList.toggle("is-current", a.dataset.nav === cur)); }

    $(".lang").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      state.lang = b.dataset.lang; store.set("sz-lang", state.lang); applyLang();
    });
    const header = $("#header");
    const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 50);
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); $("#search").focus(); } });
    $("#search").addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      if (document.body.dataset.page !== "home") { sessionStorage.setItem("sz-q", $("#search").value); location.href = href("new"); }
    });
    syncBadges(false);
  }

  window.SZ = { SPA, T, t, PRODUCTS, byId, state, store, money, grams, sizeLabel, date, esc, href, $, $$, toast,
    addToCart, toggleFav, saveCart, cartCount, syncBadges, productCard, onChange: (fn) => listeners.push(fn), applyLang, route };

  mount();
  if (SPA) addEventListener("hashchange", route);
  // страницы подключаются после core.js и вызывают SZ.applyLang() сами (см. SZ.start)
  window.SZ.start = () => { applyLang(); if (SPA) route(); };
})();
