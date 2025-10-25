# 🎨 AI-Генератор Креативов для Таргетологов

> **Профессиональная SaaS-платформа** с гибридной моделью монетизации (Подписка + Кредиты) для создания рекламных креативов с помощью AI.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11-blue.svg)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/next.js-14-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.104-green.svg)](https://fastapi.tiangolo.com/)

---

## 📋 СОДЕРЖАНИЕ

- [Возможности](#-возможности)
- [Технологии](#-технологии)
- [Быстрый старт](#-быстрый-старт)
- [Развертывание](#-развертывание)
- [Структура проекта](#-структура-проекта)
- [API Документация](#-api-документация)
- [Монетизация](#-монетизация)
- [Roadmap](#-roadmap)

---

## ✨ ВОЗМОЖНОСТИ

### 🎯 Для Таргетологов

- **5 типов AI-генерации контента**:
  - 🖼️ Статические изображения (10₽)
  - 🎬 Анимированные изображения (15₽)
  - 🎥 Видео-морфинг (30₽)
  - 📸 Контекстные фото (20₽)
  - 🧠 AI-оценка креативов (5₽)

- **Библиотека Top-50 креативов**:
  - Бесплатный просмотр превью
  - Детали/промпт за 5₽
  - Регулярное обновление

- **Скидки для подписчиков**:
  - 15% на все кредитные пакеты
  - Приоритетная генерация
  - Расширенная статистика

### 🔐 Система авторизации

- Регистрация/вход через:
  - ✅ Telegram
  - ✅ ВКонтакте  
  - ✅ Google
  - ✅ Yandex
  - ✅ Email/пароль

- Личный кабинет:
  - История транзакций
  - Статистика генераций
  - Управление подпиской
  - Баланс кредитов

### ⚡ Для администраторов

- **CRM-система**: Управление пользователями и подписками
- **Биллинг-дашборд**: Анализ выручки и метрик
- **Ценообразование**: Гибкая настройка тарифов и цен
- **AI Fusion**: Конструктор комбинированных генераций
- **Модерация**: Контроль качества Top-50 креативов

---

## 🛠️ ТЕХНОЛОГИИ

### Backend
- **FastAPI** - современный Python веб-фреймворк
- **PostgreSQL** - надежная реляционная БД
- **SQLAlchemy** - ORM для работы с БД
- **Alembic** - миграции базы данных
- **JWT** - аутентификация (httpOnly cookies)
- **SlowAPI** - rate limiting
- **Pydantic** - валидация данных

### Frontend
- **Next.js 14** - React фреймворк с SSR
- **TypeScript** - типизированный JavaScript
- **Tailwind CSS** - utility-first CSS
- **Axios** - HTTP клиент
- **Context API** - управление состоянием

### DevOps
- **Docker** - контейнеризация
- **Kubernetes** - оркестрация контейнеров
- **Yandex Cloud** - облачная инфраструктура
- **GitHub Actions** - CI/CD pipeline
- **Prometheus** (planned) - мониторинг
- **Grafana** (planned) - визуализация метрик

---

## 🚀 БЫСТРЫЙ СТАРТ

### Предварительные требования

- Docker & Docker Compose
- Python 3.11+
- Node.js 18+
- Make (опционально)

### 1. Клонирование репозитория

```bash
git clone https://github.com/yourusername/ai-creatives-generator.git
cd ai-creatives-generator
```

### 2. Конфигурация

```bash
# Скопировать пример
cp env.template .env

# Отредактировать .env
# Сгенерировать SECRET_KEY:
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3. Запуск через Docker Compose

```bash
# С использованием Make
make dev

# Или напрямую
docker-compose up -d
docker-compose exec backend python init_db.py
```

### 4. Доступ к приложению

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Admin Panel**: http://localhost:3000/admin

**Тестовый админ**:
- Email: `admin@example.com`
- Password: `admin123`

---

## 📦 РАЗВЕРТЫВАНИЕ

### Локальная разработка

```bash
# Запуск всех сервисов
make dev

# Просмотр логов
make logs

# Остановка
make stop

# Очистка
make clean
```

### Production в Kubernetes

Полное руководство: [DEPLOYMENT.md](./DEPLOYMENT.md)

```bash
# 1. Настроить Yandex Cloud
yc container registry create --name ai-creatives-registry
yc managed-kubernetes cluster create --name ai-creatives-k8s

# 2. Собрать и push образы
export YC_REGISTRY_ID=your_registry_id
make push

# 3. Развернуть в Kubernetes
make deploy

# 4. Проверить статус
make status
```

### CI/CD через GitHub Actions

1. Добавить secrets в GitHub:
   - `YC_REGISTRY_ID`
   - `YC_SA_JSON_CREDENTIALS`
   - `YC_K8S_CLUSTER_ID`

2. Push в `main` → автоматический деплой

---

## 📁 СТРУКТУРА ПРОЕКТА

```
webgen/
├── backend/                    # FastAPI приложение
│   ├── routers/               # API endpoints
│   │   ├── auth.py           # Аутентификация
│   │   ├── oauth.py          # OAuth провайдеры
│   │   ├── generation.py     # AI генерация
│   │   ├── library.py        # Top-50 креативов
│   │   ├── payments.py       # Подписки и пакеты
│   │   ├── bundles.py        # Креативные бандлы
│   │   └── admin.py          # Админ панель
│   ├── models.py             # SQLAlchemy модели
│   ├── schemas.py            # Pydantic схемы
│   ├── auth.py               # JWT логика
│   ├── database.py           # Подключение к БД
│   ├── config.py             # Конфигурация
│   ├── logging_config.py     # Логирование
│   ├── ai_mock.py            # AI стабы
│   ├── payment_mock.py       # ЮKassa стаб
│   ├── main.py               # Входная точка
│   ├── init_db.py            # Инициализация БД
│   ├── Dockerfile            # Docker образ
│   ├── requirements.txt      # Python зависимости
│   └── alembic/              # Миграции БД
│
├── frontend/                  # Next.js приложение
│   ├── app/                  # Next.js 14 App Router
│   │   ├── page.tsx          # Главная страница
│   │   ├── login/            # Вход
│   │   ├── register/         # Регистрация
│   │   ├── profile/          # Личный кабинет
│   │   ├── generate/         # Генерация
│   │   ├── library/          # Библиотека
│   │   ├── pricing/          # Тарифы
│   │   ├── admin/            # Админ панель
│   │   └── layout.tsx        # Root layout
│   ├── components/           # React компоненты
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── OAuthButtons.tsx
│   ├── context/              # React Context
│   │   └── AuthContext.tsx
│   ├── lib/                  # Утилиты
│   │   ├── api.ts            # API client
│   │   └── types.ts          # TypeScript типы
│   ├── Dockerfile            # Docker образ
│   ├── package.json          # Node зависимости
│   └── tailwind.config.js    # Tailwind конфиг
│
├── k8s/                       # Kubernetes манифесты
│   ├── namespace.yaml
│   ├── secrets.yaml
│   ├── postgres.yaml
│   ├── backend.yaml
│   ├── frontend.yaml
│   ├── ingress.yaml
│   ├── network-policies.yaml
│   └── backup-cronjob.yaml
│
├── .github/workflows/         # CI/CD
│   ├── deploy.yml            # Production deploy
│   └── pr-check.yml          # PR checks
│
├── scripts/                   # Утилиты
│   ├── local-dev.sh          # Локальная разработка
│   └── deploy-k8s.sh         # Деплой в K8s
│
├── docker-compose.yml         # Локальная разработка
├── Makefile                   # Упрощенные команды
├── .gitignore                # Git исключения
├── README.md                 # Этот файл
├── DEPLOYMENT.md             # Руководство по деплою
└── INFRASTRUCTURE.md         # Описание инфраструктуры
```

---

## 📚 API ДОКУМЕНТАЦИЯ

### Swagger UI
После запуска: http://localhost:8000/docs

### Основные endpoints

#### Аутентификация
```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

#### OAuth
```http
GET /api/oauth/telegram
GET /api/oauth/vk
GET /api/oauth/google
GET /api/oauth/yandex
```

#### Генерация
```http
GET  /api/generation/types
POST /api/generation/create
GET  /api/generation/history
```

#### Библиотека
```http
GET  /api/library/creatives
POST /api/library/unlock/{id}
```

#### Платежи
```http
GET  /api/payments/plans
POST /api/payments/subscribe
GET  /api/payments/packages
POST /api/payments/buy-credits
```

#### Бандлы
```http
GET  /api/bundles
POST /api/bundles/purchase
```

#### Админ
```http
GET  /api/admin/stats
GET  /api/admin/users
POST /api/admin/pricing/update
GET  /api/admin/analytics
```

---

## 💰 МОНЕТИЗАЦИЯ

### Модель: Подписка + Кредиты

**1 Кредит = 1₽**

### Тарифные планы

| План | Цена | Период | Скидка на кредиты |
|------|------|--------|-------------------|
| **Старт** | 990₽ | месяц | 15% |
| **Профи** | 2990₽ | месяц | 15% |
| **Команда** | 9990₽ | месяц | 15% |

### Пакеты кредитов

| Кредиты | Цена | Цена с подпиской |
|---------|------|------------------|
| 100 | 100₽ | 85₽ (15% скидка) |
| 500 | 500₽ | 425₽ |
| 1000 | 1000₽ | 850₽ |
| 5000 | 5000₽ | 4250₽ |

### Стоимость генераций

- 🖼️ Статическое изображение: **10₽**
- 🎬 Анимированное изображение: **15₽**
- 🎥 Видео-морфинг: **30₽**
- 📸 Контекстное фото: **20₽**
- 🧠 AI-оценка: **5₽**

### Креативные бандлы

| Бандл | Состав | Цена | Со скидкой |
|-------|--------|------|------------|
| **Старт Кампании** | 3 статика + 2 анимации | 60₽ | 51₽ |
| **Максимум Теста** | 5 статика + 3 анимации + 2 фото | 135₽ | 115₽ |
| **Премиум** | Все типы | 170₽ | 145₽ |

---

## 🗺️ ROADMAP

### ✅ Phase 1 - MVP (Завершено)
- [x] Backend API (FastAPI)
- [x] Frontend (Next.js)
- [x] Аутентификация (JWT + OAuth)
- [x] Базовая генерация (stubs)
- [x] Подписки и кредиты
- [x] Личный кабинет
- [x] Админ панель
- [x] Docker контейнеризация
- [x] Kubernetes манифесты
- [x] CI/CD pipeline
- [x] Rate limiting
- [x] Логирование
- [x] Database migrations (Alembic)

### 🚧 Phase 2 - Production Ready (В работе)
- [ ] Toast notifications
- [ ] Real AI integration (Midjourney/DALL-E/Stable Diffusion)
- [ ] Real ЮKassa integration
- [ ] Email notifications
- [ ] Prometheus + Grafana
- [ ] Centralized logging (Loki)
- [ ] SSL/TLS (Let's Encrypt)
- [ ] Redis для кэша
- [ ] PostgreSQL replication

### 📋 Phase 3 - Scale (Планируется)
- [ ] Webhook для real-time уведомлений
- [ ] WebSocket для live preview генерации
- [ ] AI модели on-premise
- [ ] Multi-region deployment
- [ ] CDN для статики
- [ ] S3-совместимое хранилище (Yandex Object Storage)
- [ ] Advanced analytics
- [ ] A/B testing framework
- [ ] Referral program

### 🎯 Phase 4 - Enterprise (Будущее)
- [ ] White-label решение
- [ ] API для интеграций
- [ ] Корпоративные тарифы
- [ ] SLA гарантии
- [ ] Dedicated инстансы
- [ ] Custom AI модели

---

## 🔒 БЕЗОПАСНОСТЬ

- ✅ JWT tokens в httpOnly cookies
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting (login: 5/min, register: 3/hour, generation: 60/hour)
- ✅ Input validation (Pydantic)
- ✅ SQL injection protection (SQLAlchemy ORM)
- ✅ CORS configured
- ✅ Network policies в Kubernetes
- ✅ Secrets management
- ✅ Security scanning в CI/CD

---

## 🧪 ТЕСТИРОВАНИЕ

```bash
# Backend тесты
make test-backend

# Frontend тесты
make test-frontend

# Линтеры
make lint

# Security scan
make security-scan
```

---

## 📊 МОНИТОРИНГ

### Healthchecks
- Backend: http://localhost:8000/health
- Frontend: http://localhost:3000

### Логи
```bash
# Docker Compose
make logs

# Kubernetes
make logs-k8s
kubectl logs -l app=backend -n ai-creatives -f
```

### Метрики (planned)
- Request duration
- Error rates
- Active users
- Generation queue size

---

## 🤝 CONTRIBUTING

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 LICENSE

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 AUTHORS

- **Vitrium** - *Initial work*

---

## 🙏 ACKNOWLEDGMENTS

- FastAPI documentation
- Next.js documentation
- Yandex Cloud documentation
- Kubernetes documentation

---

## 📞 SUPPORT

**Документация**:
- [Руководство по развертыванию](DEPLOYMENT.md)
- [Описание инфраструктуры](INFRASTRUCTURE.md)
- [Отчет по аудиту](AUDIT_REPORT.md)
- [Список изменений](CHANGES_APPLIED.md)

**Полезные команды**:
```bash
make help  # Список всех доступных команд
```

---

<div align="center">

**⭐ Если проект полезен, поставьте звезду! ⭐**

Made with ❤️ using FastAPI and Next.js

</div>
