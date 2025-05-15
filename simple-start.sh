#!/bin/bash
set -e

# export PYTHONPATH one time
export PYTHONPATH=/app:$PYTHONPATH

# Запускаем backend
uvicorn backend.main:app --host 0.0.0.0 --port 8000 &

# Запускаем frontend (Next.js)
cd /app/frontend
npm install
npm run build
npm start &

# Ждем завершения обоих процессов
wait
