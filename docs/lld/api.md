# LLD: REST API v1

База: `/api/v1/`. Формат — JSON. Язык ответа — из заголовка `Accept-Language` (`uz`, `ru`, `en`; по умолчанию `ru`).

Из браузера API вызывается по адресу сайта (`https://sofizar.uz/api/v1/…`) — Next.js проксирует запросы на Django (ADR-0010). Авторизация — сессия Django (cookie `sessionid`). Изменяющие запросы залогиненного пользователя требуют заголовок `X-CSRFToken` со значением cookie `csrftoken`.

## Служебное

| Метод | Путь | Ответ |
|---|---|---|
| GET | `/api/health/` | `{"status": "ok", "db": true}`; 503, если БД недоступна |

## Категории и коллекции

| Метод | Путь | Описание |
|---|---|---|
| GET | `/categories/` | Все активные категории, без пагинации. `parent` — slug родителя |
| GET | `/categories/{slug}/` | Одна категория |
| GET | `/collections/` | Все активные коллекции |
| GET | `/collections/{slug}/` | Одна коллекция |

## Товары

### `GET /products/`

Пагинация по 24: `{count, next, previous, results}`.

| Параметр | Пример | Описание |
|---|---|---|
| `category` | `rings` | Категория **вместе с подкатегориями** |
| `collection` | `samarkand` | |
| `metal` | `gold` (можно повторять) | gold / silver / platinum |
| `metal_color` | `white` | yellow / white / red / combined |
| `gender` | `women` | |
| `purity` | `585,750` | список через запятую |
| `stone` | `diamond,sapphire` | slug камня |
| `size` | `16,17` | |
| `price_min`, `price_max` | `1000000` | по минимальной цене варианта |
| `in_stock` | `true` | |
| `is_new` | `true` | |
| `slugs` | `sz-r-001,sz-e-002` | конкретные товары (избранное) |
| `search` | `кольцо` | по названию на всех языках и артикулу |
| `ordering` | `price_from`, `-price_from`, `-created_at` | сортировка |
| `page` | `2` | |

Элемент списка:

```json
{
  "slug": "sz-r-001",
  "sku": "SZ-R-001",
  "name": "Кольцо «Самарканд»",
  "category": "rings",
  "metal": "gold",
  "metal_color": "yellow",
  "purity": 585,
  "is_new": true,
  "price_from": "6800000.00",
  "old_price_from": "7820000.00",
  "in_stock": true,
  "image": {"url": "http://…/media/products/x.jpg", "alt": "…"}
}
```

### `GET /products/{slug}/`

Всё из списка плюс: `category` (объект), `collection`, `gender`, `description`, `care`, `video_url`, `variants[]` (`id, sku, size, weight, price, old_price, in_stock`), `inserts[]` (`stone, count, carat, color, clarity`), `images[]`, `seo_title`, `seo_description`.

Неактивный товар или товар неактивной категории → 404.

## Вход по SMS-коду (ADR-0010)

| Метод | Путь | Тело | Ответ |
|---|---|---|---|
| GET | `/auth/csrf/` | — | ставит cookie `csrftoken` |
| POST | `/auth/otp/request/` | `{phone}` | `{sent, resend_in}`; 429 `{code: too_soon \| too_many, retry_after}`; 400 `{phone: […]}` |
| POST | `/auth/otp/verify/` | `{phone, code}` | профиль + сессия; 400 `{code: invalid_code \| expired \| too_many_attempts}` |
| POST | `/auth/logout/` | — | 204 |
| GET / PATCH | `/auth/me/` | `{first_name, last_name, email}` | профиль; 403 без входа. Телефон не меняется |

Ограничения:
- код — 6 цифр, живёт 5 минут, на один код 5 попыток;
- повторная отправка на номер — не чаще раза в 60 секунд и не больше 5 раз в час;
- запросить код можно не больше 10 раз в час с одного IP.

После входа к пользователю привязываются гостевые заказы с тем же телефоном.

## Корзина (ADR-0009)

### `POST /cart/`

Тело: `{"items": [{"variant_id": 1, "quantity": 2}]}`. Повторы одного `variant_id` складываются. Количество — от 1 до 10, позиций — до 50.

```json
{
  "lines": [
    {
      "variant_id": 1, "quantity": 2, "error": null,
      "product": {"slug": "sz-r-001", "name": "…", "sku": "SZ-R-001-17", "size": "17",
                  "price": "6950000.00", "stock": 4, "image": null},
      "line_total": "13900000.00"
    }
  ],
  "total": "13900000.00",
  "is_valid": true
}
```

`error` позиции: `not_found` (товар снят с продажи), `out_of_stock` (нет в наличии), `not_enough` (меньше, чем в корзине). Позиции с ошибкой в `total` не входят.

## Заказы

### `POST /orders/` — оформление (гость или залогиненный)

```json
{
  "customer_name": "Дилноза",
  "customer_phone": "+998 90 123 45 67",
  "customer_email": "",
  "delivery_method": "courier",
  "address": "Ташкент, …",
  "comment": "",
  "payment_method": "on_receipt",
  "items": [{"variant_id": 1, "quantity": 2}]
}
```

- `delivery_method`: `courier` (адрес обязателен) или `pickup`.
- `payment_method`: `on_receipt`; значение `uzqr` появится на этапе 06.
- **201** `{number, total, status}`.
- **409** `{code: "cart_invalid", cart: {…как /cart/…}}` — наличие изменилось.
- **400** — ошибки полей.
- Цены берутся только из БД. Язык заказа — из `Accept-Language`. Не больше 20 заказов в час с одного IP.
- После сохранения в очередь Celery ставится задача `order_created`: точка подключения 1С, Bitrix24 и уведомлений.

### `GET /orders/`, `GET /orders/{number}/` — мои заказы

Только для залогиненного пользователя и только свои (чужой номер → 404). Поля: `number, created_at, status, status_display, payment_method, payment_status, delivery_method, address, subtotal, delivery_cost, total, items[]` (`product_name, sku, size, price, quantity, line_total`).

## Как фронтенд использует API

- Каталог и карточки товара запрашиваются **с сервера Next.js** (SSR/ISR), ответ кэшируется на 5 минут.
- Корзина, оформление, кабинет и избранное — запросы **из браузера** через `/api` на домене сайта.
- Если API недоступен, страница рендерится пустой, а не падает. Так сборка в CI проходит без бэкенда.
- Фото: фронтенд берёт только путь `/media/...` и отдаёт файл со своего домена (rewrite на Django), через оптимизатор `next/image` (WebP/AVIF).
