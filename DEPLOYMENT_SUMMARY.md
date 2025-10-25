# 📦 КРАТКАЯ ИНСТРУКЦИЯ ПО РАЗВЕРТЫВАНИЮ

## 🎯 ЧТО ПОДГОТОВЛЕНО

Проект полностью готов к развертыванию через **GitHub + Yandex Cloud + Kubernetes**.

---

## 🚀 QUICK START (3 способа)

### 1️⃣ Локальная разработка (Docker Compose)

```bash
# Через Makefile
make dev

# Или напрямую
docker-compose up -d
docker-compose exec backend python init_db.py

# Доступ:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000/docs
```

### 2️⃣ Production в Yandex Cloud Kubernetes

```bash
# 1. Настроить Yandex Cloud (один раз)
yc container registry create --name ai-creatives-registry
yc managed-kubernetes cluster create --name ai-creatives-k8s
# ... см. DEPLOYMENT.md для деталей

# 2. Собрать и push образы
export YC_REGISTRY_ID=your_registry_id
make push

# 3. Развернуть
make deploy

# 4. Проверить
make status
```

### 3️⃣ CI/CD через GitHub Actions

```bash
# 1. Добавить secrets в GitHub (Settings → Secrets):
# - YC_REGISTRY_ID
# - YC_SA_JSON_CREDENTIALS
# - YC_K8S_CLUSTER_ID

# 2. Push в main → автоматический деплой
git add .
git commit -m "Deploy to production"
git push origin main

# GitHub Actions автоматически:
# - Запустит тесты
# - Соберет Docker образы
# - Push в Yandex Container Registry
# - Развернет в Kubernetes
# - Проверит health checks
```

---

## 📂 ЧТО СОЗДАНО

### Infrastructure as Code

```
├── Dockerfiles (backend, frontend)
├── docker-compose.yml (локальная разработка)
├── k8s/ (все Kubernetes манифесты)
│   ├── namespace.yaml
│   ├── secrets.yaml (шаблон)
│   ├── postgres.yaml (БД + PVC)
│   ├── backend.yaml (API + HPA)
│   ├── frontend.yaml (UI + HPA)
│   ├── ingress.yaml (ALB)
│   ├── network-policies.yaml (безопасность)
│   └── backup-cronjob.yaml (бэкапы)
├── .github/workflows/
│   ├── deploy.yml (CI/CD pipeline)
│   └── pr-check.yml (PR проверки)
├── scripts/
│   ├── local-dev.sh (быстрый старт локально)
│   └── deploy-k8s.sh (деплой в K8s)
└── Makefile (упрощенные команды)
```

### Возможности инфраструктуры

✅ **Multi-stage Docker builds** - минимальный размер образов  
✅ **Kubernetes deployments** - готовые манифесты  
✅ **Horizontal Pod Autoscaling** - автомасштабирование 2-10 подов  
✅ **Rolling updates** - zero-downtime деплой  
✅ **Health checks** - liveness + readiness probes  
✅ **Network Policies** - изоляция трафика между подами  
✅ **Automated backups** - PostgreSQL бэкапы каждый день  
✅ **CI/CD pipeline** - GitHub Actions  
✅ **Security scanning** - Trivy в CI/CD  
✅ **Rate limiting** - защита от brute-force  
✅ **Structured logging** - JSON логи с ротацией  
✅ **Database migrations** - Alembic  
✅ **JWT in cookies** - защита от XSS  
✅ **Toast notifications** - UX уведомления  

---

## 🛠️ MAKEFILE КОМАНДЫ

Все команды для удобства:

```bash
make help              # Показать все команды
make dev               # Запустить локально (Docker Compose)
make stop              # Остановить контейнеры
make build             # Собрать Docker образы
make push              # Push в Yandex Container Registry
make deploy            # Развернуть в Kubernetes
make status            # Статус подов в K8s
make logs              # Логи (Docker Compose)
make logs-k8s          # Логи из Kubernetes
make test-backend      # Тесты backend
make test-frontend     # Тесты frontend
make lint              # Проверка кода
make init-db           # Инициализация БД
make migrate           # Запуск миграций
make migrate-create    # Создать новую миграцию
make backup-db         # Бэкап PostgreSQL
make restore-db        # Восстановить БД
make shell-backend     # Shell в backend контейнер
make shell-db          # PostgreSQL shell
make security-scan     # Сканирование уязвимостей
make clean             # Очистка Docker ресурсов
```

---

## 🔐 СЕКРЕТЫ И КОНФИГУРАЦИЯ

### .env для локальной разработки

```bash
cp env.template .env
# Отредактируйте .env

# Генерация SECRET_KEY:
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Kubernetes Secrets

```bash
# Создаются автоматически через скрипт deploy-k8s.sh
# Или вручную:
kubectl create secret generic ai-creatives-secrets \
  --from-literal=POSTGRES_PASSWORD="your_password" \
  --from-literal=SECRET_KEY="your_secret_key" \
  -n ai-creatives
```

### GitHub Secrets (для CI/CD)

В Settings → Secrets → Actions добавьте:

```
YC_REGISTRY_ID=crpXXXXXXXXXXXXXXXXX
YC_SA_JSON_CREDENTIALS={содержимое key.json файла}
YC_K8S_CLUSTER_ID=catXXXXXXXXXXXXXXXXX
```

---

## 📊 АРХИТЕКТУРА PRODUCTION

```
Internet
    │
    ▼
┌─────────────────────┐
│  Yandex Cloud ALB   │ ← Ingress Controller
│   (Load Balancer)   │ ← TLS/SSL (Let's Encrypt)
│   (Rate Limiting)   │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
┌───▼───┐     ┌───▼───┐
│Frontend│     │Backend│
│2-5 pods│◄────│2-10pods│
│(Next.js)│     │(FastAPI)│
└────────┘     └───┬───┘
                   │
            ┌──────▼──────┐
            │  PostgreSQL │
            │  1 replica  │
            │  (+ backup) │
            └─────────────┘
```

**Особенности:**
- **Frontend**: Stateless, легко масштабируется
- **Backend**: Stateless + HPA (CPU 70%, Memory 80%)
- **PostgreSQL**: Stateful с PersistentVolume (10Gi)
- **Backups**: CronJob каждый день в 3:00 UTC
- **Network Policies**: Ограничение трафика между подами
- **Monitoring**: Ready для Prometheus/Grafana

---

## ⚙️ НАСТРОЙКА YANDEX CLOUD (Первый раз)

### 1. Container Registry

```bash
yc container registry create --name ai-creatives-registry
export YC_REGISTRY_ID=$(yc container registry list --format json | jq -r '.[0].id')
echo $YC_REGISTRY_ID
```

### 2. Service Account

```bash
yc iam service-account create --name ai-creatives-deployer

# Назначить права
yc resource-manager folder add-access-binding <FOLDER_ID> \
  --role container-registry.images.puller \
  --subject serviceAccount:<SA_ID>

yc resource-manager folder add-access-binding <FOLDER_ID> \
  --role k8s.cluster-api.cluster-admin \
  --subject serviceAccount:<SA_ID>

# Создать ключ
yc iam key create \
  --service-account-name ai-creatives-deployer \
  --output key.json
```

### 3. Kubernetes Cluster

```bash
yc managed-kubernetes cluster create \
  --name ai-creatives-k8s \
  --network-name default \
  --zone ru-central1-a \
  --service-account-name ai-creatives-deployer \
  --node-service-account-name ai-creatives-deployer \
  --public-ip

# Node Group
yc managed-kubernetes node-group create \
  --name ai-creatives-nodes \
  --cluster-name ai-creatives-k8s \
  --platform standard-v2 \
  --cores 2 \
  --memory 4 \
  --disk-size 30 \
  --fixed-size 2
```

### 4. Подключение

```bash
yc managed-kubernetes cluster get-credentials ai-creatives-k8s --external
kubectl get nodes
```

---

## 🔄 CI/CD WORKFLOW

### Что происходит при `git push origin main`:

1. **Tests** → pytest (backend) + eslint (frontend)
2. **Build** → Docker multi-stage builds
3. **Scan** → Trivy security scan
4. **Push** → Yandex Container Registry
5. **Deploy** → kubectl rolling update
6. **Verify** → Health checks + rollout status
7. **Notify** → (опционально - Slack/Telegram)

### Ветки:

- `develop` → автодеплой в staging namespace
- `main` → автодеплой в production namespace
- Pull Requests → только тесты и линтеры

---

## 📈 МОНИТОРИНГ И ЛОГИ

### Просмотр логов

```bash
# Docker Compose
make logs

# Kubernetes
make logs-k8s
# или
kubectl logs -l app=backend -n ai-creatives -f
kubectl logs -l app=frontend -n ai-creatives -f
```

### Health Checks

```bash
# Backend
curl http://localhost:8000/health

# Frontend
curl http://localhost:3000

# В Kubernetes
kubectl exec -it <pod> -n ai-creatives -- curl localhost:8000/health
```

### Metrics (через kubectl)

```bash
kubectl top nodes
kubectl top pods -n ai-creatives
kubectl get hpa -n ai-creatives
```

---

## 🐛 TROUBLESHOOTING

### Проблема: ImagePullBackOff

```bash
yc container registry configure-docker
docker login cr.yandex
```

### Проблема: CrashLoopBackOff

```bash
kubectl logs <pod> -n ai-creatives --previous
kubectl describe pod <pod> -n ai-creatives
```

### Проблема: Pending pods

```bash
kubectl describe nodes
kubectl get events -n ai-creatives --sort-by='.lastTimestamp'
```

### Откат деплоя

```bash
kubectl rollout undo deployment/backend -n ai-creatives
kubectl rollout history deployment/backend -n ai-creatives
```

---

## 🔒 PRODUCTION CHECKLIST

Перед запуском в продакшн:

- [ ] Заменить все `CHANGE_ME` в `k8s/secrets.yaml`
- [ ] Настроить реальные OAuth приложения (Telegram, VK, Google, Yandex)
- [ ] Интегрировать настоящую ЮKassa
- [ ] Настроить реальные AI API (вместо mock)
- [ ] Обновить домен в `k8s/ingress.yaml`
- [ ] Настроить DNS A-запись на Ingress IP
- [ ] Настроить SSL/TLS через cert-manager
- [ ] Включить автоматические бэкапы PostgreSQL
- [ ] Настроить мониторинг (Prometheus/Grafana)
- [ ] Настроить алерты (Slack/Telegram)
- [ ] Проверить логирование
- [ ] Протестировать rate limiting
- [ ] Провести load testing
- [ ] Настроить CDN для статики (опционально)

---

## 📚 ДОПОЛНИТЕЛЬНАЯ ДОКУМЕНТАЦИЯ

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Полное руководство по развертыванию
- **[INFRASTRUCTURE.md](./INFRASTRUCTURE.md)** - Описание инфраструктуры
- **[README.md](./README.md)** - Общая информация о проекте
- **[AUDIT_REPORT.md](./AUDIT_REPORT.md)** - Отчет по аудиту кода
- **[CHANGES_APPLIED.md](./CHANGES_APPLIED.md)** - История изменений

---

## 💡 ПОЛЕЗНЫЕ КОМАНДЫ

### Масштабирование

```bash
# Увеличить количество подов
kubectl scale deployment/backend --replicas=5 -n ai-creatives

# Обновить HPA лимиты
kubectl edit hpa backend-hpa -n ai-creatives
```

### Обновление образов

```bash
# После push новых образов
kubectl rollout restart deployment/backend -n ai-creatives
kubectl rollout restart deployment/frontend -n ai-creatives
```

### Бэкапы

```bash
# Создать бэкап вручную
make backup-db

# Восстановить из бэкапа
make restore-db FILE=backups/backup-20241025.sql.gz
```

### База данных

```bash
# Подключиться к PostgreSQL
make shell-db

# Создать миграцию
make migrate-create

# Применить миграции
make migrate
```

---

## 🎉 ВСЁ ГОТОВО!

Проект полностью подготовлен к развертыванию. Выберите один из способов выше и начинайте!

**Быстрый старт:**
```bash
make dev  # Локально
# или
make deploy  # Production
```

---

**Вопросы?** См. [DEPLOYMENT.md](./DEPLOYMENT.md) для детальных инструкций.

