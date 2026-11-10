# LLD: REST API v1

База: `/api/v1/`. Формат — JSON. Язык ответа — из заголовка `Accept-Language` (`uz`, `ru`, `en`; по умолчанию `ru`).

Сейчас только чтение каталога; корзина, заказы и авторизация добавятся на этапе 03.

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

## Как фронтенд использует API

- Запросы идут **с сервера Next.js** (SSR/ISR), ответ кэшируется на 5 минут.
- Если API недоступен, страница рендерится пустой, а не падает. Так сборка в CI проходит без бэкенда.
- Фото: фронтенд берёт только путь `/media/...` и отдаёт файл со своего домена (rewrite на Django), через оптимизатор `next/image` (WebP/AVIF).
