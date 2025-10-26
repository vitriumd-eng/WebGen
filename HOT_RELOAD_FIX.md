# 🔥 Решение проблемы Hot Reload в Next.js

## Проблема

Hot Reload не работает в Next.js на Windows — изменения в файлах не отображаются автоматически.

---

## ✅ Исправления (уже применены)

### 1. Обновлен `next.config.js`

Добавлены настройки webpack для Windows:

```javascript
webpack: (config, { dev, isServer }) => {
  if (dev && !isServer) {
    config.watchOptions = {
      poll: 1000, // Проверять изменения каждую секунду
      aggregateTimeout: 300, // Задержка перед перезагрузкой
    }
  }
  return config
}
```

Это включает **polling mode** для отслеживания изменений файлов.

---

## 🚀 Как перезапустить с очисткой кэша

### Вариант 1: PowerShell скрипт (Рекомендуется)

```powershell
cd frontend
.\restart-dev.ps1
```

Скрипт автоматически:
- ✅ Останавливает процесс на порту 3002
- ✅ Удаляет `.next`
- ✅ Очищает `node_modules/.cache`
- ✅ Очищает npm cache
- ✅ Запускает `npm run dev`

### Вариант 2: Ручная очистка

```bash
cd frontend

# Остановить dev server (Ctrl+C)

# Удалить кэш
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules/.cache
npm cache clean --force

# Перезапустить
npm run dev
```

### Вариант 3: Через package.json

```bash
cd frontend
npm run clean
npm run dev
```

*(скрипт `clean` нужно добавить в package.json)*

---

## 🔍 Проверка, что Hot Reload работает

1. Откройте **http://localhost:3002**
2. Откройте `frontend/app/page.tsx`
3. Измените любой текст в Hero Section
4. Сохраните файл (Ctrl+S)
5. **Страница должна обновиться автоматически через 1-2 секунды**

### Что должно появиться в консоли:

```
✓ Compiled in 1.2s (456 modules)
○ Compiling /page ...
✓ Compiled /page in 823ms
```

---

## 🛠️ Дополнительные решения

### Если Hot Reload всё ещё не работает:

#### 1. Увеличить время polling

В `next.config.js`:

```javascript
watchOptions: {
  poll: 3000, // Увеличить до 3 секунд
  aggregateTimeout: 500,
}
```

#### 2. Проверить антивирус

Некоторые антивирусы блокируют file watching. Добавьте папку проекта в исключения.

#### 3. Использовать WSL2

Для лучшей производительности на Windows:

```bash
# В WSL2
cd /mnt/d/webgen/frontend
npm run dev
```

#### 4. Отключить турбо-режим

В `next.config.js`:

```javascript
swcMinify: false,
```

#### 5. Перезапустить VS Code

Иногда помогает перезапуск редактора:
```
Ctrl+Shift+P → Developer: Reload Window
```

---

## 📋 Checklist устранения проблем

- [ ] Остановлен старый dev server (Ctrl+C)
- [ ] Удалена папка `.next`
- [ ] Очищен npm cache
- [ ] Обновлен `next.config.js` с watchOptions
- [ ] Перезапущен dev server
- [ ] Проверен порт 3002 (должен быть свободен)
- [ ] Открыт браузер в режиме инкогнито (без расширений)
- [ ] Отключен кэш браузера (F12 → Network → Disable cache)

---

## 🔄 Альтернатива: Manual Refresh

Если Hot Reload всё равно не работает:

1. Сохраните изменения (Ctrl+S)
2. Обновите страницу вручную (F5)
3. Изменения должны отобразиться

---

## 🐛 Отладка

### Проверить, работает ли webpack watcher:

В консоли dev server должны появляться сообщения:

```
event - compiled client and server successfully in 1.2s (456 modules)
wait  - compiling /page (client and server)...
event - compiled successfully in 823ms (456 modules)
```

Если таких сообщений нет — watcher не работает.

### Проверить процессы на порту:

```powershell
Get-NetTCPConnection -LocalPort 3002 | Select-Object State, OwningProcess
```

### Проверить логи Next.js:

```bash
npm run dev -- --inspect
```

---

## 📞 Если ничего не помогло

### Радикальное решение:

```bash
cd frontend

# Полная переустановка
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force package-lock.json

# Заново установить
npm install

# Запустить
npm run dev
```

---

## ✅ Итог

**Текущая конфигурация:**
- ✅ `next.config.js` - добавлен polling mode
- ✅ `restart-dev.ps1` - скрипт для быстрого перезапуска
- ✅ Порт 3002 (вместо 3000)

**Запуск:**
```powershell
cd frontend
.\restart-dev.ps1
```

**Проверка:**
- Откройте http://localhost:3002
- Измените текст в `app/page.tsx`
- Сохраните (Ctrl+S)
- Страница обновится через 1-2 секунды

---

**Дата:** 25 января 2025  
**Статус:** ✅ Исправления применены

