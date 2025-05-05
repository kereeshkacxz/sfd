# Используем образ с Python и Node.js
FROM nikolaik/python-nodejs:python3.12-nodejs18

WORKDIR /app

# Копируем локальные файлы в контейнер
COPY . /app/

# Устанавливаем зависимости Python
RUN pip install --no-cache-dir -r requirements.txt

# Устанавливаем зависимости Node.js и собираем фронтенд
RUN cd frontend && npm install && npx update-browserslist-db@latest && npm run build

# Даём права на выполнение скриптов
RUN chmod +x /app/start.sh /app/update-and-restart.sh /app/simple-start.sh

# Устанавливаем PYTHONPATH
ENV PYTHONPATH=/app

# Открываем порты для бэкенда и фронтенда
EXPOSE 8000 3000

# Запускаем скрипт
CMD ["./simple-start.sh"]