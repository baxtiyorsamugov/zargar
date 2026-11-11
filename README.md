# SOFIZAR

Сайт ювелирной компании SOFIZAR.

## Фронтенд

`frontend/` — статический прототип (HTML + CSS + JS без сборки):

- `index.html` — главная
- `cart.html` — корзина: размеры, количество, промокод (демо `SOFIZAR10`), самовывоз или курьер, оформление заказа
- `account.html` — личный кабинет: обзор, заказы со статусами, избранное, бонусы, адреса, профиль (вкладки по `#orders`, `#favorites`, `#bonus`, `#addresses`, `#profile`)
- `assets/css/main.css` — дизайн-токены (палитра Yuksalish, Gilroy) и стили всех страниц
- `assets/js/core.js` — общее: шапка, подвал, переводы UZ/RU/EN, товары, корзина и избранное (localStorage)
- `assets/js/home.js`, `cart.js`, `account.js` — логика страниц
- `assets/fonts/` — Gilroy (файлы не в git, см. README в папке)

Товары, заказы и пользователь сейчас примерные; позже их отдаст API, которое берёт данные из 1С.

## Запуск локально

1. Положите файлы Gilroy в `frontend/assets/fonts/` (см. README там).
2. Windows: дважды щёлкните `start-server.bat`. macOS/Linux: `./start-server.sh`.
3. Откроется http://localhost:8000. Нужен установленный Python 3.
