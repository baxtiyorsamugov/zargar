# ADR-0006: GitHub Actions для CI

- **Статус:** Принято
- **Дата:** 2026-11-10

## Контекст

Код хранится на GitHub. Нужно автоматически проверять каждый push и Pull Request, чтобы в `main` не попадал сломанный код.

## Решение

GitHub Actions, workflow `.github/workflows/ci.yml`:

- **backend:** ruff (линтер и форматирование), проверка миграций, pytest на PostgreSQL;
- **frontend:** ESLint, TypeScript, `next build`;
- **docker:** сборка образов.

Ветка `main` защищена: слияние только через PR с зелёным CI.

## Альтернативы

| Вариант | Плюсы | Минусы |
|---|---|---|
| GitLab CI | Мощный | Код не на GitLab |
| Jenkins | Гибкий | Нужен свой сервер и поддержка |
| **GitHub Actions** ✅ | Встроен в GitHub, бесплатен для проекта | — |

## Последствия

- Позже в тот же инструмент добавляется CD: автодеплой `dev` → staging, `main` → production.
