#!/bin/bash

# Конфигурация
REPO_PATH="/app"
REPO_URL="https://github.com/kereeshkacxz/sfd.git"
BRANCH="main"
CHECK_INTERVAL=300  # 5 минут
LOG_FILE="/app/git-update.log"

# Функция для логирования
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Создаем лог-файл
touch "$LOG_FILE"

log "Автоматическое обновление запущено. Отслеживание репозитория $REPO_URL, ветка $BRANCH"
log "Интервал проверки: $CHECK_INTERVAL секунд"

# Переходим в директорию репозитория
cd "$REPO_PATH"

# Сохраняем текущий хэш коммита
CURRENT_HASH=$(git rev-parse HEAD)
log "Текущий хэш коммита: $CURRENT_HASH"

# Функция для перезапуска сервисов
restart_services() {
    log "Установка зависимостей бэкенда..."
    pip install --no-cache-dir -r /app/backend/requirements.txt
    
    log "Установка зависимостей фронтенда..."
    cd /app/frontend && npm install
    
    log "Перезапуск сервисов..."
    # Находим PID процессов
    BACKEND_PID=$(pgrep -f "python3 main.py")
    FRONTEND_PID=$(pgrep -f "npm run dev")
    
    # Останавливаем процессы
    if [ ! -z "$BACKEND_PID" ]; then
        kill -15 $BACKEND_PID && log "Бэкенд остановлен (PID: $BACKEND_PID)"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill -15 $FRONTEND_PID && log "Фронтенд остановлен (PID: $FRONTEND_PID)"
    fi
    
    # Запускаем процессы заново
    cd /app/backend && python3 main.py &
    cd /app/frontend && npm run dev -- --host 0.0.0.0 &
    
    log "Сервисы перезапущены"
}

# Цикл проверки обновлений
while true; do
    # Получаем обновления из удаленного репозитория
    log "Проверка обновлений..."
    git fetch origin "$BRANCH" || { log "Ошибка при выполнении git fetch"; sleep "$CHECK_INTERVAL"; continue; }
    
    # Получаем хэш последнего коммита в удаленном репозитории
    REMOTE_HASH=$(git rev-parse origin/"$BRANCH")
    
    # Если хэши различаются, значит есть обновления
    if [ "$CURRENT_HASH" != "$REMOTE_HASH" ]; then
        log "Обнаружены обновления! Локальный хэш: $CURRENT_HASH, удаленный хэш: $REMOTE_HASH"
        
        # Применяем изменения
        log "Применение изменений..."
        git pull origin "$BRANCH" --force || { log "Ошибка при выполнении git pull"; sleep "$CHECK_INTERVAL"; continue; }        
        # Перезапускаем сервисы
        restart_services
        
        # Обновляем текущий хэш
        CURRENT_HASH="$REMOTE_HASH"
        log "Обновление успешно применено. Новый хэш: $CURRENT_HASH"
    else
        log "Обновлений не обнаружено."
    fi
    
    # Ждем указанный интервал перед следующей проверкой
    log "Следующая проверка через $CHECK_INTERVAL секунд"
    sleep "$CHECK_INTERVAL"
done
