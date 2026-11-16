# SOFIZAR

Сайт ювелирной компании SOFIZAR.

## Фронтенд

`frontend/` — статический прототип (HTML + CSS + JS без сборки):

- `index.html` — главная
- `catalog.html` — каталог: категория, металл, цена, скидки, сортировка, поиск (`#rings`, `#earrings`, `#bracelets`, `#chains`, `#new`, `#sale`)
- `product.html` — карточка товара (`product.html#5`): галерея, металл, размер и таблица размеров, характеристики, похожие
- `about.html` — о заводе: этапы производства, качество
- `info.html` — покупателям: доставка, оплата, гарантия, магазины, вопросы (`#delivery`, `#payment`, `#warranty`, `#stores`, `#faq`)
- `cart.html` — корзина: размеры, количество, промокод (демо `SOFIZAR10`), самовывоз или курьер, оформление заказа
- `account.html` — личный кабинет: обзор, заказы со статусами, избранное, бонусы, адреса, профиль (вкладки по `#orders`, `#favorites`, `#bonus`, `#addresses`, `#profile`)
- `assets/css/main.css` — дизайн-токены (палитра Yuksalish, Manrope) и стили всех страниц
- `assets/js/core.js` — общее: шапка, подвал, переводы UZ/RU/EN, товары, корзина и избранное (localStorage)
- `assets/js/home.js`, `catalog.js`, `product.js`, `cart.js`, `account.js`, `pages.js` — логика страниц
- `assets/fonts/` — Manrope и его лицензия SIL Open Font License 1.1

Товары, заказы и пользователь сейчас примерные; позже их отдаст API, которое берёт данные из 1С.

## Запуск локально

1. Windows: дважды щёлкните `start-server.bat`. macOS/Linux: `./start-server.sh`.
2. Откроется http://localhost:8000. Нужен установленный Python 3.
