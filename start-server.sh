#!/usr/bin/env sh
# SOFIZAR — локальный сервер для macOS и Linux
cd "$(dirname "$0")/frontend" || exit 1
PORT="${PORT:-8000}"
echo "SOFIZAR: сайт запущен на http://localhost:$PORT (остановить: Ctrl+C)"
( sleep 1; command -v open >/dev/null && open "http://localhost:$PORT" || xdg-open "http://localhost:$PORT" ) >/dev/null 2>&1 &
exec python3 -m http.server "$PORT"
