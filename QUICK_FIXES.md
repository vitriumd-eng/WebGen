# 🚀 КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ - БЫСТРЫЙ ГАЙД

## ✅ ЧТО УЖЕ ИСПРАВЛЕНО

### 1. ✅ Создан .gitignore
Файл `.gitignore` создан в корне проекта для защиты секретов.

### 2. ✅ Добавлена валидация пароля и username
**Файл:** `backend/schemas.py`

Теперь при регистрации проверяется:
- Длина пароля >= 8 символов
- Наличие заглавной буквы
- Наличие строчной буквы
- Наличие цифры
- Username: 3-20 символов, только буквы, цифры, подчеркивание
- Запрещенные username: admin, root, system, api

---

## 🔴 ЧТО НУЖНО ИСПРАВИТЬ ВРУЧНУЮ

### 1. Создать .env файлы (НЕ КОММИТИТЬ!)

#### Backend (.env)
```bash
cd backend
cat > .env << 'EOF'
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ai_creatives
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
YUKASSA_SHOP_ID=
YUKASSA_SECRET_KEY=
EOF
```

**⚠️ ВАЖНО:** Измените `your_password` и `SECRET_KEY` на реальные!

Генерация SECRET_KEY:
```python
import secrets
print(secrets.token_urlsafe(32))
```

#### Frontend (.env.local)
```bash
cd frontend
echo "API_URL=http://localhost:8000" > .env.local
```

---

### 2. Установить зависимости для rate limiting

```bash
cd backend
pip install slowapi
```

Добавить в `requirements.txt`:
```
slowapi==0.1.9
```

---

### 3. Добавить rate limiting в main.py

```python
# backend/main.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# После создания app
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
```

Затем в роутерах:
```python
# backend/routers/auth.py
from slowapi import Limiter
from fastapi import Request

@router.post("/login")
@limiter.limit("5/minute")
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), ...):
    ...
```

---

### 4. Настроить PostgreSQL

#### Установка PostgreSQL:

**Windows:**
```bash
# Скачать с https://www.postgresql.org/download/windows/
# Или через Chocolatey:
choco install postgresql
```

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Создать базу данных:
```bash
# Войти в PostgreSQL
psql -U postgres

# Создать БД
CREATE DATABASE ai_creatives;

# Создать пользователя (опционально)
CREATE USER aiuser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ai_creatives TO aiuser;

# Выйти
\q
```

Обновить DATABASE_URL в `.env`:
```
DATABASE_URL=postgresql://aiuser:your_password@localhost:5432/ai_creatives
```

---

### 5. Настроить Alembic для миграций

```bash
cd backend
pip install alembic
alembic init alembic
```

Отредактировать `alembic/env.py`:
```python
from config import settings
from models import Base

# Заменить
target_metadata = Base.metadata
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
```

Создать первую миграцию:
```bash
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

Удалить из `main.py`:
```python
# УДАЛИТЬ:
Base.metadata.create_all(bind=engine)
```

---

### 6. Переместить JWT в cookies (опционально, сложно)

Это требует изменений на backend и frontend.

**Backend:**
```python
# backend/routers/auth.py
from fastapi import Response

@router.post("/login")
def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), ...):
    # ... создание токена ...
    
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=True,  # Только для HTTPS
        samesite="strict",
        max_age=1800  # 30 минут
    )
    
    return {"message": "Login successful"}
```

**Frontend:**
```typescript
// lib/api.ts
// Удалить interceptor с localStorage
// Добавить:
api.defaults.withCredentials = true;
```

---

### 7. Добавить логирование

Создать `backend/logging_config.py`:
```python
import logging
from logging.handlers import RotatingFileHandler
import os

def setup_logging():
    os.makedirs('logs', exist_ok=True)
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            RotatingFileHandler(
                'logs/app.log',
                maxBytes=10485760,  # 10MB
                backupCount=5
            ),
            logging.StreamHandler()
        ]
    )

# В main.py:
from logging_config import setup_logging
setup_logging()
```

---

### 8. Добавить health check для БД

```python
# backend/main.py
from sqlalchemy import text

@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "database": "disconnected",
                "error": str(e)
            }
        )
```

---

### 9. Создать Docker контейнеры (опционально)

**backend/Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**frontend/Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: ai_creatives
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/ai_creatives
      SECRET_KEY: your-secret-key
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      API_URL: http://backend:8000
    depends_on:
      - backend

volumes:
  postgres_data:
```

Запуск:
```bash
docker-compose up -d
```

---

### 10. Добавить error notifications на frontend

```bash
cd frontend
npm install react-hot-toast
```

В `app/layout.tsx`:
```typescript
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <Toaster position="top-right" />
        <AuthProvider>
          ...
        </AuthProvider>
      </body>
    </html>
  );
}
```

В `context/AuthContext.tsx`:
```typescript
import toast from 'react-hot-toast';

catch (error) {
  toast.error('Ошибка входа. Проверьте данные.');
}
```

---

## 📝 ЧЕКЛИСТ ПЕРЕД ЗАПУСКОМ

- [ ] Создан `.gitignore`
- [ ] Создан `.env` в backend (НЕ КОММИТИТЬ!)
- [ ] Создан `.env.local` в frontend
- [ ] PostgreSQL установлен и запущен
- [ ] База данных создана
- [ ] Alembic настроен и миграции применены
- [ ] Зависимости установлены (`pip install -r requirements.txt`)
- [ ] Frontend зависимости установлены (`npm install`)
- [ ] Валидация паролей работает
- [ ] Backend запускается без ошибок
- [ ] Frontend запускается без ошибок

---

## 🚀 ЗАПУСК ПРОЕКТА

### Terminal 1: Backend
```bash
cd backend
python init_db.py  # Только первый раз!
uvicorn main:app --reload
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

Откройте: http://localhost:3000

---

## 🔐 ТЕСТОВЫЕ ДАННЫЕ

После `python init_db.py`:

**Админ:**
- Username: `admin`
- Password: `admin123`

**Пользователь:**
- Username: `testuser`
- Password: `test123`

---

## ❗ ВАЖНО

1. **НИКОГДА** не коммитьте `.env` файлы
2. Измените `SECRET_KEY` в production
3. Используйте HTTPS в production
4. Настройте firewall для БД
5. Регулярно обновляйте зависимости

---

## 📞 ПОДДЕРЖКА

Если что-то не работает:
1. Проверьте логи backend: `tail -f logs/app.log`
2. Проверьте консоль frontend
3. Проверьте, что PostgreSQL запущен: `psql -U postgres -c "SELECT 1"`
4. Проверьте переменные окружения: `echo $DATABASE_URL`

**Удачи! 🚀**

