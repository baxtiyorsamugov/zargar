@echo off
chcp 65001 >nul
title SOFIZAR — локальный сервер
cd /d "%~dp0frontend"

set PORT=8000
echo.
echo   SOFIZAR: сайт запущен на http://localhost:%PORT%
echo   Чтобы остановить сервер, закройте это окно или нажмите Ctrl+C.
echo.

start "" "http://localhost:%PORT%"

where py >nul 2>nul && (py -m http.server %PORT% & goto :eof)
where python >nul 2>nul && (python -m http.server %PORT% & goto :eof)

echo   Python не найден. Установите его с https://www.python.org/downloads/
echo   (при установке отметьте "Add python.exe to PATH") и запустите этот файл снова.
pause
