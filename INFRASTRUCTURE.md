# 🏗️ ИНФРАСТРУКТУРА ПРОЕКТА

## 📁 СТРУКТУРА ФАЙЛОВ РАЗВЕРТЫВАНИЯ

```
webgen/
├── backend/
│   ├── Dockerfile              # Образ для backend
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile              # Образ для frontend
│   └── .dockerignore
├── k8s/                        # Kubernetes манифесты
│   ├── namespace.yaml          # Namespace для изоляции
│   ├── secrets.yaml            # Секреты (шаблон)
│   ├── postgres.yaml           # PostgreSQL deployment + PVC
│   ├── backend.yaml            # Backend deployment + service + HPA
│   ├── frontend.yaml           # Frontend deployment + service + HPA
│   ├── ingress.yaml            # ALB Ingress для маршрутизации
│   ├── network-policies.yaml   # Политики безопасности сети
│   └── backup-cronjob.yaml     # Автоматические бэкапы БД
├── .github/
│   └── workflows/
│       ├── deploy.yml          # CI/CD pipeline для production
│       └── pr-check.yml        # Проверки для Pull Requests
├── scripts/
│   ├── local-dev.sh            # Запуск локально
│   └── deploy-k8s.sh           # Развертывание в K8s
├── docker-compose.yml          # Локальная разработка
├── Makefile                    # Упрощенные команды
├── .env.example                # Пример конфигурации
├── DEPLOYMENT.md               # Полное руководство
└── INFRASTRUCTURE.md           # Этот файл
```

---

## 🎯 ОСНОВНЫЕ КОМПОНЕНТЫ

### 1. **Docker Образы**

#### Backend (FastAPI)
- **Base Image**: `python:3.11-slim`
- **Multi-stage build**: Минимизация размера
- **Unprivileged user**: Безопасность
- **Healthcheck**: `/health` endpoint
- **Workers**: 4 uvicorn workers

#### Frontend (Next.js)
- **Base Image**: `node:18-alpine`
- **Standalone output**: Оптимизация
- **Static exports**: `.next/static`
- **Build args**: Конфигурация API_URL

### 2. **Kubernetes Resources**

#### Namespace: `ai-creatives`
Изолирует все ресурсы проекта.

#### Secrets
- `ai-creatives-secrets`: Чувствительные данные
  - PostgreSQL пароль
  - JWT SECRET_KEY
  - ЮKassa credentials

#### ConfigMaps
- `ai-creatives-config`: Конфигурация приложения
  - API URLs
  - Database settings

#### Deployments

**PostgreSQL**:
- Replicas: 1 (StatefulSet-подобное поведение)
- Storage: 10Gi PVC (`yc-network-hdd`)
- Resources: 256Mi-512Mi RAM, 250m-500m CPU
- Probes: liveness + readiness

**Backend**:
- Replicas: 2-10 (HPA на основе CPU/Memory)
- Strategy: RollingUpdate (0 downtime)
- Resources: 256Mi-512Mi RAM, 250m-1000m CPU
- Probes: HTTP health checks

**Frontend**:
- Replicas: 2-5 (HPA)
- Strategy: RollingUpdate
- Resources: 128Mi-256Mi RAM, 100m-500m CPU
- Probes: HTTP checks

#### Services
- `postgres`: ClusterIP (5432)
- `backend-service`: ClusterIP (8000)
- `frontend-service`: ClusterIP (3000)

#### Ingress (Yandex ALB)
- **Frontend**: `/`
- **Backend API**: `/api`, `/docs`, `/health`
- **TLS**: Let's Encrypt
- **Rate Limiting**: 100 RPS
- **CORS**: Настроен

#### Network Policies
Ограничивают трафик между подами:
- Backend → PostgreSQL (только 5432)
- Frontend → Backend (только 8000)
- Ingress → Frontend/Backend
- DNS разрешен для всех

#### HPA (Horizontal Pod Autoscaler)
Автоматическое масштабирование:
- Backend: CPU 70%, Memory 80%
- Frontend: CPU 70%

#### CronJob (Backups)
Автоматические бэкапы PostgreSQL:
- Расписание: 3:00 UTC ежедневно
- Хранение: 30 дней
- Storage: 20Gi PVC

---

## 🔄 CI/CD WORKFLOW

### GitHub Actions Pipeline

```
┌─────────────────┐
│   Push to main  │
└────────┬────────┘
         │
    ┌────▼────┐
    │  Tests  │ (pytest, npm test)
    └────┬────┘
         │
    ┌────▼────────────┐
    │  Build Images   │ (Docker multi-stage)
    │  Push to YC CR  │ (Yandex Container Registry)
    └────┬────────────┘
         │
    ┌────▼──────────┐
    │ Deploy to K8s │ (kubectl set image)
    │ Rolling Update│ (0 downtime)
    └────┬──────────┘
         │
    ┌────▼────────┐
    │  Verify     │ (kubectl rollout status)
    └─────────────┘
```

### Environments
- **develop**: Автодеплой в staging namespace
- **main**: Автодеплой в production namespace

### Secrets в GitHub
- `YC_REGISTRY_ID`
- `YC_SA_JSON_CREDENTIALS`
- `YC_K8S_CLUSTER_ID`

---

## 🚀 БЫСТРЫЙ СТАРТ

### Локальная разработка
```bash
make dev
# или
./scripts/local-dev.sh
```

### Сборка образов
```bash
make build
```

### Push в Registry
```bash
export YC_REGISTRY_ID=your_id
make push
```

### Развертывание в K8s
```bash
export YC_REGISTRY_ID=your_id
make deploy
# или
./scripts/deploy-k8s.sh
```

---

## 📊 МОНИТОРИНГ

### Prometheus Metrics (TODO)
Добавить в будущем:
- Request duration
- Error rates
- Database connections
- Queue sizes

### Logging
- **Backend**: JSON structured logs
- **Frontend**: Console + server logs
- **Aggregation**: Можно интегрировать Loki/ELK

### Alerts (TODO)
- Pod crashes
- High memory/CPU
- Database connection errors
- Response time > 1s

---

## 🔐 БЕЗОПАСНОСТЬ

### Secrets Management
- Kubernetes Secrets (base64)
- Можно интегрировать: Yandex Lockbox / HashiCorp Vault

### Network Security
- Network Policies: Ограничение трафика
- Ingress HTTPS: TLS 1.2+
- Rate Limiting: DoS защита

### Container Security
- Non-root users
- Read-only filesystems (where possible)
- Security scanning: Trivy в CI/CD

### RBAC (TODO)
Настроить Role-Based Access Control для K8s.

---

## 💾 BACKUP & DISASTER RECOVERY

### Automated Backups
- **Frequency**: Ежедневно 3:00 UTC
- **Retention**: 30 дней
- **Location**: PVC (20Gi)
- **Format**: SQL dump (gzipped)

### Manual Backup
```bash
make backup-db
```

### Restore
```bash
make restore-db FILE=backups/backup-20241025.sql.gz
```

### Database Migration
```bash
# Создать миграцию
make migrate-create

# Применить миграции
make migrate
```

---

## 📈 МАСШТАБИРОВАНИЕ

### Вертикальное
Увеличить `resources.limits` в манифестах:
```yaml
resources:
  limits:
    memory: "1Gi"
    cpu: "2000m"
```

### Горизонтальное
Настроить HPA:
```bash
kubectl scale deployment/backend --replicas=10 -n ai-creatives
```
Или изменить `maxReplicas` в HPA манифесте.

### Database Scaling
- **Vertical**: Увеличить PVC size
- **Horizontal**: PostgreSQL replication (TODO)

---

## 🔧 TROUBLESHOOTING

### Команды диагностики
```bash
# Статус
make status

# Логи
make logs-k8s

# Shell в контейнер
kubectl exec -it <pod> -n ai-creatives -- /bin/bash

# События
kubectl get events -n ai-creatives --sort-by='.lastTimestamp'

# Описание пода
kubectl describe pod <pod> -n ai-creatives
```

### Типичные проблемы

**ImagePullBackOff**:
```bash
# Проверить доступ к Registry
yc container registry configure-docker
docker login cr.yandex
```

**CrashLoopBackOff**:
```bash
# Проверить логи
kubectl logs <pod> -n ai-creatives --previous
```

**Pending pods**:
```bash
# Проверить ресурсы
kubectl describe nodes
kubectl top nodes
```

---

## 🎯 ROADMAP

### Планы развития инфраструктуры:

#### Phase 1 (Текущее)
- ✅ Docker контейнеризация
- ✅ Kubernetes манифесты
- ✅ CI/CD через GitHub Actions
- ✅ Автоматические бэкапы
- ✅ Network Policies

#### Phase 2 (Ближайшее)
- ⬜ Prometheus + Grafana
- ⬜ Centralized logging (Loki)
- ⬜ Cert-manager для SSL
- ⬜ PostgreSQL replication
- ⬜ Redis для кэширования

#### Phase 3 (Будущее)
- ⬜ Service Mesh (Istio/Linkerd)
- ⬜ GitOps (ArgoCD)
- ⬜ Blue-Green deployments
- ⬜ Canary releases
- ⬜ Multi-region setup

---

## 📞 ПОДДЕРЖКА

**Полезные ссылки:**
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Yandex Cloud K8s](https://cloud.yandex.ru/docs/managed-kubernetes/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Next.js Production](https://nextjs.org/docs/deployment)

**Makefile команды:**
```bash
make help  # Список всех команд
```

---

**Последнее обновление**: 2025-10-25

