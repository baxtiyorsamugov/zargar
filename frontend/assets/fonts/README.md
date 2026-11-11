# Шрифт Gilroy

Gilroy — коммерческий шрифт (автор Radomir Tinkov), его нельзя брать с бесплатных сайтов и хранить в публичном репозитории без лицензии.

Что сделать:
1. Купить веб-лицензию (например, на myfonts.com) на начертания Regular, Medium, SemiBold, Bold, ExtraBold.
2. Положить файлы сюда с такими именами:
   - `Gilroy-Regular.woff2` (400)
   - `Gilroy-Medium.woff2` (500)
   - `Gilroy-SemiBold.woff2` (600)
   - `Gilroy-Bold.woff2` (700)
   - `Gilroy-ExtraBold.woff2` (800)
3. Если репозиторий публичный — добавить `*.woff2` в `.gitignore` и класть шрифты при сборке Docker-образа из приватного хранилища.

Пока файлов нет, сайт показывает Manrope (Google Fonts) — он ближе всего к Gilroy по рисунку, поэтому вёрстка не «поедет», когда шрифт появится.
