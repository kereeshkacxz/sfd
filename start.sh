#!/bin/bash

# Запускаем скрипт автообновления в фоне
./update-and-restart.sh &

# Запуск бэкенда в фоновом режиме
cd /app/backend && python3 main.py &

# Запуск фронтенда с доступом извне контейнера
cd /app/frontend && npm run dev -- --host 0.0.0.0 &

# Ждем бесконечно, чтобы контейнер не завершил работу
wait
