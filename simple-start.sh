#!/bin/bash

# Запуск бэкенда в фоновом режиме
cd /app/backend && python3 main.py &

# Запуск фронтенда с доступом извне контейнера
cd /app/frontend && npm run dev &

# Ждем бесконечно, чтобы контейнер не завершил работу
wait
