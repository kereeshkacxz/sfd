#!/bin/bash

# Запускаем бэкенд (FastAPI) в фоновом режиме
cd /app
export PYTHONPATH=/app:$PYTHONPATH
uvicorn backend.main:app --host 0.0.0.0 --port 8000 &

# Ждём секунду, чтобы бэкенд успел запуститься
sleep 1

# Запускаем фронтенд (Next.js)
cd /app/frontend
npm start