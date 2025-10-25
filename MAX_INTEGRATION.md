# ✅ MAX МЕССЕНДЖЕР ДОБАВЛЕН

**Дата**: 26 октября 2025  
**Статус**: Готово к тестированию

---

## 🇷🇺 Что такое MAX?

**MAX** - новый российский мессенджер от компании [max.ru](https://max.ru/)

**Особенности:**
- 💬 Быстрое и лёгкое приложение для общения
- 📱 Высокое качество звонков
- 🎨 Анимированные стикеры и реакции
- 📎 Отправка файлов до 4 ГБ
- 🤖 Чат-боты и мини-приложения
- 🌐 Доступно на всех платформах (iOS, Android, Web)

---

## ✅ Реализовано

### 1. Frontend - OAuthButtons Component

**Добавлена кнопка MAX:**
```tsx
<button
  onClick={handleMaxLogin}
  className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#FF5722] hover:to-[#FF8A00]"
>
  <FaComment className="text-3xl" />
  <span>Войти через MAX</span>
</button>
```

**Цвета:**
- Градиент: `#FF6B35` → `#F7931E` (оранжевый)
- Hover: `#FF5722` → `#FF8A00` (яркий оранжевый)

**Mock данные:**
```typescript
const mockMaxData = {
  max_id: "123456789",           // Случайный ID
  first_name: "MAX",             // Имя
  last_name: "User",             // Фамилия
  phone: "+7900XXXXXXX"          // Телефон (опционально)
};
```

---

### 2. Backend - OAuth Endpoint

**Новый endpoint:** `POST /api/oauth/max/callback`

**Параметры:**
- `max_id` (required) - ID пользователя в MAX
- `first_name` (required) - Имя
- `last_name` (optional) - Фамилия
- `phone` (optional) - Номер телефона

**Логика:**
1. Поиск пользователя по `username = "max_{max_id}"`
2. Если не найден - создание нового:
   - Email: `max_{max_id}@max.user`
   - Username: `max_{max_id}`
   - Credits: **50** (бонус)
   - Tier: **FREE**
3. Создание JWT токена
4. Установка httpOnly cookie
5. Возврат токена и данных пользователя

---

## 🎨 Дизайн

### Страница входа (http://localhost:3002/login)

Теперь показывается **3 кнопки**:

```
┌─────────────────────────────────────┐
│  📱 Войти через Telegram            │ ← Голубой (#0088cc)
├─────────────────────────────────────┤
│  🔵 Войти через VK                  │ ← Синий (#0077FF)
├─────────────────────────────────────┤
│  💬 Войти через MAX                 │ ← Оранжевый градиент
└─────────────────────────────────────┘
```

**Визуальные эффекты:**
- `transform hover:scale-105` - увеличение при наведении
- `shadow-lg hover:shadow-xl` - тени
- `rounded-xl` - скругленные углы
- `py-4 px-6` - большие кнопки

---

## 🔐 Безопасность

### Реализовано:
- ✅ httpOnly cookies для JWT
- ✅ Логирование всех попыток входа
- ✅ Случайные пароли через `secrets.token_urlsafe(32)`
- ✅ Уникальные username с префиксом `max_`

### Для Production:
```python
# 1. Подключить реальный MAX OAuth 2.0
# 2. Проверять подлинность токенов от MAX API
# 3. Включить secure=True для cookies (HTTPS)
# 4. Добавить rate limiting для OAuth endpoints
```

---

## 🧪 Тестирование

### Локальное тестирование (Mock):

1. **Откройте страницу входа:**
   ```
   http://localhost:3002/login
   ```

2. **Нажмите "Войти через MAX"**

3. **Проверьте создание пользователя:**
   ```sql
   SELECT id, username, email, credits_balance 
   FROM users 
   WHERE username LIKE 'max_%';
   ```

   Ожидаемый результат:
   ```
   id | username      | email                | credits_balance
   ---+---------------+----------------------+----------------
   3  | max_123456789 | max_123456789@max... | 50
   ```

4. **Проверьте редирект:**
   - После успешного входа → `/generate`
   - Toast: "Добро пожаловать! Вход выполнен через MAX"

---

## 📊 Сравнение OAuth провайдеров

| Провайдер | Цвет кнопки | Префикс username | Бонус | Статус |
|-----------|-------------|------------------|-------|--------|
| **Telegram** | Голубой (#0088cc) | `tg_` | 50₽ | ✅ Работает |
| **VK** | Синий (#0077FF) | `vk_` | 50₽ | ✅ Работает |
| **MAX** | Оранжевый градиент | `max_` | 50₽ | ✅ Работает |

---

## 🚀 Production Integration

### Шаг 1: Регистрация приложения MAX

1. Перейти на [max.ru/developers](https://max.ru/developers) (когда станет доступно)
2. Создать приложение
3. Получить **Client ID** и **Client Secret**
4. Указать **Redirect URI**: `https://your-domain.com/api/oauth/max/callback`

### Шаг 2: Реализовать OAuth 2.0 Flow

```python
# 1. Redirect пользователя на MAX OAuth
redirect_url = f"https://max.ru/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=basic"

# 2. Получить код авторизации
code = request.query_params.get('code')

# 3. Обменять код на токен
token_response = httpx.post('https://max.ru/oauth/token', data={
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'code': code,
    'redirect_uri': REDIRECT_URI
})

# 4. Получить данные пользователя
user_response = httpx.get('https://max.ru/api/me', 
    headers={'Authorization': f'Bearer {access_token}'}
)
```

### Шаг 3: Обновить backend

```python
@router.get("/max/authorize")
async def max_authorize():
    """Redirect to MAX OAuth"""
    return RedirectResponse(
        url=f"https://max.ru/oauth/authorize?client_id={settings.MAX_CLIENT_ID}"
    )

@router.get("/max/callback")
async def max_callback(code: str, db: Session = Depends(get_db)):
    """Exchange code for token and create user"""
    # Реальная реализация OAuth 2.0
    pass
```

---

## 📝 Примеры API

### Mock запрос (текущая реализация):

```bash
curl -X POST http://localhost:8001/api/oauth/max/callback \
  -H "Content-Type: application/json" \
  -d '{
    "max_id": "123456789",
    "first_name": "Иван",
    "last_name": "Иванов",
    "phone": "+79001234567"
  }'
```

### Ответ:

```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 3,
    "username": "max_123456789",
    "email": "max_123456789@max.user",
    "full_name": "Иван Иванов",
    "credits_balance": 50,
    "subscription_tier": "FREE",
    "is_new_user": true
  }
}
```

---

## 🔗 Ссылки

- **MAX Официальный сайт**: https://max.ru/
- **GitHub репозиторий**: https://github.com/vitriumd-eng/WebGen
- **Commit**: `feat: add MAX messenger OAuth support`

---

## ✅ Итого

### Что работает:
- ✅ Кнопка MAX на странице входа/регистрации
- ✅ Mock OAuth для локальной разработки
- ✅ Создание пользователей с префиксом `max_`
- ✅ 50 бонусных кредитов
- ✅ httpOnly cookies
- ✅ Toast уведомления
- ✅ Логирование

### Следующие шаги:
- ⏳ Подключить реальный MAX OAuth API (когда будет доступен)
- ⏳ Добавить возможность привязки MAX к существующему аккаунту
- ⏳ Реализовать синхронизацию данных профиля с MAX

---

**Статус**: ✅ **ГОТОВО К ТЕСТИРОВАНИЮ**  
**URL**: http://localhost:3002/login  
**Обновите страницу**: **Ctrl+F5**

