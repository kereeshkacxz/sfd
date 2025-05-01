FROM nikolaik/python-nodejs:python3.11-nodejs18

WORKDIR /app

# Установка git и очистка кеша
RUN apt-get update && apt-get install -y git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Настройка git
RUN git config --global pull.rebase false && \
    git config --global pull.ff only

# Клонируем репозиторий
RUN git clone https://github.com/kereeshkacxz/sfd.git /app

# Устанавливаем зависимости Python
RUN pip install fastapi jwt python-dotenv python-multipart apscheduler uvicorn

# Устанавливаем зависимости Node.js
RUN cd /app/frontend && npm install

# Копируем скрипты запуска (если они отличаются от тех, что в репозитории)
# Если скрипты уже есть в репозитории, эти строки не нужны
# COPY start.sh /app/
# COPY update-and-restart.sh /app/
# COPY simple-start.sh /app/

# Даем права на выполнение
RUN chmod +x /app/start.sh /app/update-and-restart.sh /app/simple-start.sh

# Проверяем, что файлы существуют
RUN ls -la /app/start.sh

EXPOSE 8000 3000

# Запускаем скрипт (убедитесь, что он использует правильные пути)
CMD ["./start.sh"]