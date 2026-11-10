# SOFIZAR — интернет-магазин ювелирных изделий

Сайт на трёх языках (UZ / RU / EN) с каталогом из 1С, заказами в Bitrix24 и оплатой через UZQR.

| Часть | Стек |
|---|---|
| `backend/` | Python 3.13, Django 5, Django REST Framework, Celery |
| `frontend/` | Next.js (App Router, TypeScript), SSR/ISR для SEO |
| Инфраструктура | PostgreSQL 16, Redis 7, Docker Compose, GitHub Actions |

Архитектура и решения — в [`docs/`](docs/README.md). Процесс работы — в [CONTRIBUTING](CONTRIBUTING.md).

## Быстрый старт

Нужен Docker.

```bash
cp .env.example .env
docker compose up --build
```

| Адрес | Что |
|---|---|
| http://localhost:3000/ru | Сайт |
| http://localhost:8000/admin/ | Админ-панель |
| http://localhost:8000/api/v1/products/ | API каталога |
| http://localhost:8000/api/health/ | Проверка работоспособности |

Создать администратора и тестовые товары:

```bash
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py seed_demo
```

## Проверки перед Pull Request

```bash
# backend
cd backend
ruff check . && ruff format --check .
python manage.py makemigrations --check --dry-run
pytest

# frontend
cd frontend
npm run lint && npm run typecheck && npm run build
```

То же самое запускает CI на каждый push и PR.

Сквозной сценарий покупки в браузере (нужен Playwright): `node scripts/e2e-smoke.cjs` — подробности в начале файла.

## Структура

```
backend/          Django-проект
  config/         настройки, urls, celery
  apps/accounts/  пользователи (вход по телефону)
  apps/catalog/   категории, коллекции, товары, варианты, вставки, фото
  apps/orders/    заказы и позиции
  tests/          pytest
frontend/         Next.js (src/app/[locale]/…, src/lib/api.ts)
docs/             HLD, LLD, ADR, документы для заказчика
.github/          CI, шаблоны Issues и PR
```
