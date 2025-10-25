# 🔐 SECURITY CHECKLIST - AI Creative Generator

## ✅ Чеклист безопасности перед production

### Аутентификация и Авторизация

- [ ] **JWT токены перемещены в httpOnly cookies**
  - Защита от XSS атак
  - Автоматическая отправка с запросами
  - Нет доступа из JavaScript

- [ ] **Сильные пароли обязательны**
  - ✅ Минимум 8 символов
  - ✅ Заглавная буква
  - ✅ Строчная буква
  - ✅ Цифра
  - Дополнительно: специальный символ

- [ ] **Rate limiting включен**
  - Логин: 5 попыток в минуту
  - Регистрация: 3 в час с одного IP
  - API: 100 запросов в минуту

- [ ] **OAuth провайдеры настроены правильно**
  - Проверка подписей от Telegram
  - Валидация токенов от VK, Google, Yandex
  - Защита от CSRF в OAuth flow

### Данные и Валидация

- [ ] **Валидация всех входных данных**
  - ✅ Email format
  - ✅ Username format
  - ✅ Password strength
  - Prompt sanitization (XSS защита)
  - URL validation

- [ ] **SQL Injection защита**
  - ✅ Используется ORM (SQLAlchemy)
  - Нет raw SQL queries
  - Параметризованные запросы

- [ ] **XSS защита**
  - Content Security Policy (CSP)
  - Sanitization пользовательского ввода
  - HTML encoding

- [ ] **CSRF защита**
  - CSRF токены
  - SameSite cookies
  - Origin проверка

### Секреты и Конфигурация

- [ ] **Секреты не в коде**
  - ✅ .env файлы в .gitignore
  - ✅ .env.example без секретов
  - Использование secrets manager в production

- [ ] **SECRET_KEY сложный**
  - Минимум 32 символа
  - Случайная генерация
  - Уникальный для production

- [ ] **DATABASE_URL защищен**
  - Не в логах
  - Не в error messages
  - Используется переменная окружения

### Сеть и Транспорт

- [ ] **HTTPS включен**
  - SSL сертификат настроен
  - HTTP redirect на HTTPS
  - HSTS headers

- [ ] **CORS настроен правильно**
  - Только доверенные origins
  - Credentials: true только для своих доменов
  - Не использовать wildcard (*) в production

- [ ] **Security headers**
  ```python
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Strict-Transport-Security: max-age=31536000
  Content-Security-Policy: default-src 'self'
  ```

### База Данных

- [ ] **PostgreSQL secured**
  - Не слушает на 0.0.0.0
  - Firewall настроен
  - Только локальные/VPN подключения
  - Сильный пароль

- [ ] **Connection pool правильно настроен**
  - Лимиты подключений
  - Timeout настройки
  - Pool pre-ping включен

- [ ] **Бэкапы настроены**
  - Автоматические ежедневные бэкапы
  - Тестирование восстановления
  - Encrypted backup storage

### Логирование и Мониторинг

- [ ] **Логирование настроено**
  - Все важные события логируются
  - Rotation logs (не растут бесконечно)
  - НЕ логировать пароли и токены

- [ ] **Мониторинг ошибок**
  - Sentry или аналог
  - Алерты на критические ошибки
  - Dashboard для метрик

- [ ] **Audit logging**
  - Логировать изменения в админке
  - Логировать доступ к sensitive data
  - Логировать failed login attempts

### API и Endpoints

- [ ] **Rate limiting на всех endpoints**
  ```
  /api/auth/login: 5/min
  /api/auth/register: 3/hour
  /api/generation/create: 60/hour
  /api/admin/*: 100/min
  ```

- [ ] **Input size limits**
  - Max request body: 10MB
  - Max prompt length: 5000 chars
  - Max URL length: 2000 chars

- [ ] **Timeout защита**
  - Request timeout: 30s
  - Database query timeout: 10s
  - AI generation timeout: 60s

### OAuth и Внешние Сервисы

- [ ] **Telegram Bot Token защищен**
  - В environment variables
  - Webhook с HTTPS
  - Проверка signature

- [ ] **VK App настроен**
  - Correct redirect URIs
  - API key в .env
  - Валидация токенов

- [ ] **Google OAuth**
  - Client ID и Secret защищены
  - Правильные redirect URIs
  - Проверка токена на backend

- [ ] **ЮKassa настроена**
  - Webhook signature проверка
  - HTTPS для webhooks
  - Idempotency keys

### Платежи

- [ ] **Payment security**
  - Webhook signature validation
  - Idempotency для платежей
  - Логирование всех транзакций
  - Проверка сумм на backend

- [ ] **Credits не могут быть < 0**
  - Database constraint
  - Backend validation
  - Transaction isolation

### Файлы и Загрузка

- [ ] **File upload защищен** (если будет)
  - Проверка типа файла
  - Проверка размера
  - Virus scanning
  - Не исполняемые пермишены

### Infrastructure

- [ ] **Docker containers secured**
  - Non-root user
  - Minimal base images
  - No secrets in images
  - Scan for vulnerabilities

- [ ] **Environment separation**
  - Dev, Staging, Production
  - Разные SECRET_KEY
  - Разные database credentials

- [ ] **Backup и Recovery**
  - Автоматические бэкапы
  - Tested recovery process
  - Off-site storage

### Compliance

- [ ] **GDPR соответствие** (если EU users)
  - User data export
  - Right to be forgotten
  - Privacy policy
  - Cookie consent

- [ ] **Пользовательское соглашение**
  - Terms of Service
  - Privacy Policy
  - Refund policy

### Тестирование Безопасности

- [ ] **Penetration testing проведен**
  - OWASP Top 10 проверены
  - SQL injection tests
  - XSS tests
  - CSRF tests
  - Authentication bypass tests

- [ ] **Dependency scanning**
  ```bash
  # Python
  pip install safety
  safety check
  
  # Node
  npm audit
  ```

- [ ] **Security headers проверены**
  - https://securityheaders.com/
  - https://observatory.mozilla.org/

### Incident Response

- [ ] **Incident response plan готов**
  - Кто отвечает за security
  - Контакты команды
  - Процедура при breach

- [ ] **Алерты настроены**
  - Failed login attempts > 10
  - Admin actions
  - Unusual activity
  - API rate limit exceeded

---

## 🔴 КРИТИЧЕСКИЕ (СДЕЛАТЬ ПЕРЕД ЗАПУСКОМ)

1. [ ] .gitignore создан
2. [ ] Все .env файлы добавлены в .gitignore
3. [ ] SECRET_KEY изменен на сложный
4. [ ] PostgreSQL password сложный
5. [ ] HTTPS включен (в production)
6. [ ] Rate limiting включен
7. [ ] Валидация паролей включена

---

## 🟡 ВАЖНЫЕ (СДЕЛАТЬ В ТЕЧЕНИЕ НЕДЕЛИ)

1. [ ] JWT в httpOnly cookies
2. [ ] OAuth провайдеры реально настроены
3. [ ] Логирование работает
4. [ ] Мониторинг настроен (Sentry)
5. [ ] Security headers добавлены
6. [ ] Бэкапы БД настроены

---

## 🟢 ЖЕЛАТЕЛЬНЫЕ (В ТЕЧЕНИЕ МЕСЯЦА)

1. [ ] Penetration testing
2. [ ] Audit logging
3. [ ] WAF (Web Application Firewall)
4. [ ] Bug bounty program
5. [ ] Security training для команды

---

## 🛠️ ИНСТРУМЕНТЫ ДЛЯ ПРОВЕРКИ

### Backend Security
```bash
# Python dependencies check
pip install safety
safety check

# Bandit - security linter
pip install bandit
bandit -r backend/

# OWASP ZAP
docker run -v $(pwd):/zap/wrk/:rw -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:8000
```

### Frontend Security
```bash
# npm audit
cd frontend
npm audit

# Retire.js
npm install -g retire
retire --js --jsrepo ./

# ESLint security plugin
npm install --save-dev eslint-plugin-security
```

### Infrastructure
```bash
# Docker security scan
docker scan myimage:tag

# Trivy
trivy image myimage:tag
```

---

## 📚 РЕСУРСЫ

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [Next.js Security](https://nextjs.org/docs/pages/building-your-application/configuring/content-security-policy)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

---

## ✅ FINAL CHECK

Перед production deploy:
```bash
# 1. Проверить все TODO в коде
grep -r "TODO" backend/ frontend/

# 2. Проверить все .env файлы в .gitignore
git ls-files | grep -E '\.env$'
# Должно быть пусто!

# 3. Проверить SECRET_KEY не дефолтный
grep -r "your-secret-key" backend/
# Должно быть пусто!

# 4. Проверить security headers
curl -I https://yourdomain.com | grep -E 'X-|Content-Security'

# 5. SSL проверка
openssl s_client -connect yourdomain.com:443 -tls1_2
```

**Если все пункты выполнены - можно запускать в production! 🚀**

