# AI Creative Generator - Backend

Backend API для платформы генерации креативов с использованием AI.

## Технологический стек

- **FastAPI** - современный веб-фреймворк
- **SQLAlchemy** - ORM для работы с PostgreSQL
- **PostgreSQL** - основная база данных
- **JWT** - аутентификация пользователей
- **Pydantic** - валидация данных

## Установка и запуск

### 1. Установка зависимостей

```bash
pip install -r requirements.txt
```

### 2. Настройка базы данных

Создайте файл `.env` на основе `.env.example`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ai_creatives
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Инициализация базы данных

```bash
python init_db.py
```

Это создаст таблицы и заполнит БД тестовыми данными:
- Админ: `username=admin, password=admin123`
- Тестовый пользователь: `username=testuser, password=test123`

### 4. Запуск сервера

```bash
uvicorn main:app --reload
```

API будет доступно по адресу: http://localhost:8000

Документация API (Swagger): http://localhost:8000/docs

## Структура проекта

```
backend/
├── main.py                 # Основное приложение FastAPI
├── config.py              # Конфигурация и настройки
├── database.py            # Подключение к БД
├── models.py              # SQLAlchemy модели
├── schemas.py             # Pydantic схемы
├── auth.py                # Аутентификация и авторизация
├── payment_mock.py        # Заглушка для платежной системы
├── ai_mock.py             # Заглушки для AI-генерации
├── init_db.py             # Скрипт инициализации БД
├── routers/
│   ├── auth.py           # Роуты аутентификации
│   ├── payments.py       # Роуты платежей
│   ├── generation.py     # Роуты генерации контента
│   ├── library.py        # Роуты библиотеки креативов
│   └── admin.py          # Админ-панель API
└── requirements.txt       # Python зависимости
```

## Основные endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Информация о текущем пользователе

### Генерация контента
- `POST /api/generation/create` - Создать генерацию
- `GET /api/generation/my-generations` - История генераций
- `GET /api/generation/pricing/list` - Прайс-лист

### Платежи
- `POST /api/payments/create` - Создать платеж
- `POST /api/payments/webhook` - Webhook для подтверждения оплаты
- `GET /api/payments/subscription-plans` - Тарифные планы

### Библиотека
- `GET /api/library/top-creatives` - Топ-50 креативов
- `POST /api/library/{id}/unlock` - Разблокировать детали

### Админ-панель
- `GET /api/admin/dashboard` - Статистика
- `GET /api/admin/users` - Список пользователей
- `PATCH /api/admin/users/{id}/credits` - Изменить кредиты

## Модель монетизации

### Тарифы
- **Free**: 0₽, 50 тестовых кредитов
- **Starter**: 2,990₽, 1,500 кредитов
- **Pro**: 6,990₽, 4,000 кредитов
- **Agency**: 14,990₽, 10,000 кредитов

### Стоимость генерации
- Статичное изображение: 100 кредитов
- Анимированное изображение: 250 кредитов
- Видео-морфинг: 400 кредитов (требуется подписка)
- Контекстный креатив: 150 кредитов (требуется подписка)
- AI-скоринг: 20 кредитов (требуется подписка)

## Mock-системы

### Payment Mock (ЮKassa)
Заглушка платежной системы для разработки. В продакшене заменяется на настоящую интеграцию с ЮKassa.

### AI Mock
Заглушки для AI-генерации контента. Возвращают mock-данные с имитацией задержки обработки.

## Безопасность

- JWT токены для аутентификации
- Хеширование паролей с bcrypt
- CORS настроен для frontend
- Проверка прав доступа на уровне endpoints

