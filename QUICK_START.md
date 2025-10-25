# 🚀 Быстрый старт

## Порты приложения

- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432 (внутри Docker: 5433:5432)

---

## 🐳 Запуск через Docker (Рекомендуется)

```bash
docker-compose up --build
```

Затем откройте:
- Frontend: http://localhost:3002
- API Docs: http://localhost:8000/docs

---

## 💻 Запуск без Docker

### 1. Backend (Terminal 1)

```bash
cd backend

# Установить зависимости
pip install -r requirements.txt

# Применить миграции
alembic upgrade head

# Инициализировать БД (только первый раз)
python init_db.py

# Запустить сервер
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend (Terminal 2)

```bash
cd frontend

# Установить зависимости
npm install

# Запустить dev-сервер на порту 3002
npm run dev
```

Frontend запустится на: **http://localhost:3002**

---

## 👤 Тестовые аккаунты

| Роль | Username | Password |
|------|----------|----------|
| **Администратор** | `admin` | `admin123` |
| **Пользователь** | `testuser` | `test123` |

---

## 🎯 Ключевые страницы

| Страница | URL |
|----------|-----|
| Главная | http://localhost:3002 |
| Генерация креативов | http://localhost:3002/generate |
| **Калькулятор Маржинальности** ⭐ | http://localhost:3002/admin/pricing |
| Админ-панель | http://localhost:3002/admin |
| Личный кабинет | http://localhost:3002/profile |
| Библиотека Top-50 | http://localhost:3002/library |
| Тарифы | http://localhost:3002/pricing |

---

## ⚠️ Если порт занят

### Frontend (порт 3002):

**Проверить, что занимает порт:**
```bash
# Windows
netstat -ano | findstr :3002

# Linux/Mac
lsof -i :3002
```

**Изменить порт:**
```bash
# В frontend/package.json
"dev": "next dev -p 3003"  # Используйте другой порт
```

### Backend (порт 8000):

```bash
# Запустить на другом порту
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload

# Не забудьте обновить NEXT_PUBLIC_API_URL в .env:
# NEXT_PUBLIC_API_URL=http://localhost:8001
```

---

## 🔧 Переменные окружения

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ai_creatives
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📊 Новые функции (v2.0)

### ⭐ Калькулятор Маржинальности
http://localhost:3002/admin/pricing

**Функционал:**
- Таблица маржинальности для всех типов генерации
- Управление курсом USD/RUB
- Управление AI-движками (себестоимость и наценка)
- Автоматический пересчет цен

### ⭐ Новые типы генерации

1. **Векторный Креатив (120₽)**
   - Масштабируемая векторная графика (SVG)
   - Логотипы и иконки через Recraft.ai

2. **Брендовый Сет (200₽)**
   - 3 креатива в едином брендовом стиле
   - Fusion-цепочка: Recraft.ai + Brand Colors

---

## 🐛 Troubleshooting

### Backend не запускается:

```bash
# Проверить PostgreSQL
docker ps | grep postgres

# Пересоздать БД
docker-compose down -v
docker-compose up -d postgres
cd backend && python init_db.py
```

### Frontend ошибки при сборке:

```bash
# Очистить кэш
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### Ошибка подключения к API:

```bash
# Проверить, что backend запущен
curl http://localhost:8000/health

# Проверить CORS в backend/main.py:
# allow_origins=["http://localhost:3002"]
```

---

## 📚 Полная документация

- **`IMPLEMENTATION_SUMMARY.md`** - Краткая документация по v2.0
- **`MIDDLEMAN_MODEL_IMPLEMENTATION.md`** - Техническая документация (500+ строк)
- **`README.md`** - Общая информация о проекте

---

## 🆘 Нужна помощь?

1. Проверьте логи:
   ```bash
   # Backend
   cd backend && tail -f logs/app.log
   
   # Docker
   docker-compose logs -f backend
   docker-compose logs -f frontend
   ```

2. Проверьте статус сервисов:
   ```bash
   docker-compose ps
   ```

3. Перезапустите всё:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

---

**Версия:** 2.0  
**Дата:** 25 января 2025  
**Frontend Port:** 3002  
**Backend Port:** 8000

