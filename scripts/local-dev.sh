#!/bin/bash
set -e

# Скрипт для локальной разработки

echo "🚀 Запуск AI Creative Generator в режиме разработки"

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Проверка Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен."
    exit 1
fi

# Создание .env если не существует
if [ ! -f .env ]; then
    echo "📝 Создание .env файла..."
    cat > .env << EOF
POSTGRES_PASSWORD=$(openssl rand -base64 16)
SECRET_KEY=$(openssl rand -base64 32)
EOF
    echo "✅ .env файл создан"
fi

# Остановка существующих контейнеров
echo "🛑 Остановка существующих контейнеров..."
docker-compose down

# Сборка и запуск
echo "🔨 Сборка и запуск контейнеров..."
docker-compose up -d --build

# Ожидание запуска PostgreSQL
echo "⏳ Ожидание запуска PostgreSQL..."
sleep 10

# Инициализация БД
echo "💾 Инициализация базы данных..."
docker-compose exec backend python init_db.py

echo ""
echo "✅ Приложение запущено!"
echo ""
echo "📍 Доступные URL:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "📊 Просмотр логов:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Остановка:"
echo "   docker-compose down"
echo ""

