# Используем образ с Node.js и Python
FROM nikolaik/python-nodejs:python3.11-nodejs18

WORKDIR /app

# Установка git (для скрипта автообновления)
RUN apt-get update && apt-get install -y git && apt-get clean

# Клонируем репозиторий
RUN git clone https://github.com/kereeshkacxz/sfd.git /app

# В секции обновления git репозитория:
RUN git config --global pull.rebase false
RUN git config --global pull.ff only
    
# Устанавливаем зависимости
RUN pip install fastapi
RUN pip install jwt
RUN pip install dotenv
RUN pip install python-multipart
RUN pip install apscheduler
RUN pip install uvicorn
RUN cd /app/frontend && npm install

# Копируем скрипты запуска
COPY start.sh /app/
COPY update-and-restart.sh /app/
COPY simple-start.sh /app/

RUN chmod +x /app/start.sh /app/update-and-restart.sh /app/simple-start.sh

# Экспонируем порты (8000 для бэкенда, 3000 для фронтенда)
EXPOSE 8000 3000

# Запускаем оба приложения через скрипт
CMD ["./start.sh"]
