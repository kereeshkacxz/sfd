# Используем образ с Node.js и Python
FROM nikolaik/python-nodejs:python3.11-nodejs18

WORKDIR /app

# Копируем файлы зависимостей
COPY backend/requirements.txt ./backend/
COPY frontend/package.json frontend/package-lock.json ./frontend/

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r backend/requirements.txt
RUN cd frontend && npm install

# Копируем исходный код
COPY backend ./backend
COPY frontend ./frontend

# Копируем скрипт запуска
COPY start.sh ./
RUN chmod +x start.sh

# Экспонируем порты (8000 для бэкенда, 3000 для фронтенда)
EXPOSE 8000 3000

# Запускаем оба приложения через скрипт
CMD ["./start.sh"]
