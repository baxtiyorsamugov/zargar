#!/usr/bin/env bash
# Однократная настройка GitHub: метки и milestones (этапы дорожной карты).
# Нужен GitHub CLI: https://cli.github.com  →  gh auth login
# Запуск из корня репозитория: bash scripts/setup-github.sh
set -euo pipefail
REPO="${REPO:-baxtiyorsamugov/zargar}"

label() { gh label create "$1" --repo "$REPO" --color "$2" --description "$3" --force; }
label task           1f6a7c "Задача"
label bug            d73a4a "Баг"
label adr            5319e7 "Архитектурное решение"
label backend        0e8a16 "Django / API"
label frontend       1d76db "Next.js"
label infra          bfdadc "Docker, CI, сервер"
label 1c             fbca04 "Интеграция с 1С"
label bitrix         c5def5 "Интеграция с Bitrix24"
label uzqr           f9d0c4 "Оплата UZQR"
label seo            bb9057 "SEO и производительность"
label docs           0075ca "Документация"
label priority:high  b60205 "Делать в первую очередь"
label blocked        000000 "Ждём заказчика или внешнюю сторону"

milestone() {
  gh api "repos/$REPO/milestones" -f title="$1" -f description="$2" >/dev/null 2>&1 \
    && echo "milestone: $1" || echo "milestone уже есть: $1"
}
milestone "01 Старт и сбор материалов" "Брифинг, логотип/фото/тексты, 10–20 тестовых карточек, доступы к 1С и Bitrix24"
milestone "02 UI/UX дизайн" "Каталог, карточка, корзина, checkout, ЛК, адаптив"
milestone "03 Разработка" "Вёрстка UZ/RU/EN, каталог, фильтры, поиск, избранное, ЛК, админка"
milestone "04 Интеграция с 1С" "Товары, цены, остатки, фото по артикулу, заказы обратно в 1С"
milestone "05 Bitrix CRM" "Клиенты и сделки из заказов, синхронизация статусов"
milestone "06 Оплата и уведомления" "UZQR, SMS / Telegram"
milestone "07 Тест и запуск" "Тестирование, SEO, скорость, рабочий домен"
milestone "08 Поддержка" "3 месяца гарантийной поддержки"

echo "Готово. Доску создайте в GitHub → Projects → New project → Board:"
echo "колонки Backlog, To Do, In Progress, Review, Done."
