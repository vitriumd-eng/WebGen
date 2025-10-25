# 🚀 РУКОВОДСТВО ПО РАЗВЕРТЫВАНИЮ

Полное руководство по развертыванию AI Creative Generator в Yandex Cloud с использованием Kubernetes.

---

## 📋 ПРЕДВАРИТЕЛЬНЫЕ ТРЕБОВАНИЯ

### 1. Yandex Cloud
- Аккаунт в Yandex Cloud
- Настроенный Managed Kubernetes кластер
- Container Registry
- Service Account с правами

### 2. Локальные инструменты
```bash
# Yandex Cloud CLI
curl https://storage.yandexcloud.net/yandexcloud-yc/install.sh | bash

# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Docker
# Установите согласно документации: https://docs.docker.com/get-docker/
```

### 3. GitHub Secrets
Добавьте в Settings → Secrets → Actions:
- `YC_REGISTRY_ID` - ID Container Registry
- `YC_SA_JSON_CREDENTIALS` - JSON ключ Service Account
- `YC_K8S_CLUSTER_ID` - ID Kubernetes кластера

---

## 🏗️ АРХИТЕКТУРА

```
┌─────────────────────────────────────────┐
│         Yandex Cloud ALB               │
│           (Load Balancer)              │
└─────────────────┬───────────────────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
┌─────▼──────┐         ┌──────▼─────┐
│  Frontend  │         │  Backend   │
│  (Next.js) │◄────────┤  (FastAPI) │
│  Replicas  │         │  Replicas  │
└────────────┘         └──────┬─────┘
                              │
                       ┌──────▼──────┐
                       │  PostgreSQL │
                       │ Persistent  │
                       └─────────────┘
```

---

## 📝 ПОШАГОВОЕ РАЗВЕРТЫВАНИЕ

### ШАГ 1: Подготовка Yandex Cloud

#### 1.1 Создание Container Registry
```bash
yc container registry create --name ai-creatives-registry
export YC_REGISTRY_ID=$(yc container registry get ai-creatives-registry --format json | jq -r .id)
echo "Registry ID: $YC_REGISTRY_ID"
```

#### 1.2 Создание Service Account
```bash
yc iam service-account create --name ai-creatives-deployer

# Назначение ролей
yc resource-manager folder add-access-binding <FOLDER_ID> \
  --role container-registry.images.puller \
  --subject serviceAccount:<SA_ID>

yc resource-manager folder add-access-binding <FOLDER_ID> \
  --role k8s.cluster-api.cluster-admin \
  --subject serviceAccount:<SA_ID>

# Создание ключа
yc iam key create \
  --service-account-name ai-creatives-deployer \
  --output key.json
```

#### 1.3 Создание Kubernetes кластера
```bash
yc managed-kubernetes cluster create \
  --name ai-creatives-k8s \
  --network-name default \
  --zone ru-central1-a \
  --service-account-name ai-creatives-deployer \
  --node-service-account-name ai-creatives-deployer \
  --public-ip

# Создание Node Group
yc managed-kubernetes node-group create \
  --name ai-creatives-nodes \
  --cluster-name ai-creatives-k8s \
  --platform standard-v2 \
  --cores 2 \
  --memory 4 \
  --core-fraction 100 \
  --disk-type network-ssd \
  --disk-size 30 \
  --fixed-size 2 \
  --location zone=ru-central1-a \
  --auto-upgrade
```

#### 1.4 Подключение к кластеру
```bash
yc managed-kubernetes cluster get-credentials ai-creatives-k8s --external
kubectl get nodes
```

---

### ШАГ 2: Подготовка секретов

#### 2.1 Создание секретов в Kubernetes
```bash
# Генерация SECRET_KEY
SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")

# Генерация пароля PostgreSQL
POSTGRES_PASSWORD=$(python -c "import secrets; print(secrets.token_urlsafe(16))")

# Создание namespace
kubectl apply -f k8s/namespace.yaml

# Создание секретов
kubectl create secret generic ai-creatives-secrets \
  --from-literal=POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
  --from-literal=DATABASE_URL="postgresql://postgres:$POSTGRES_PASSWORD@postgres:5432/ai_creatives" \
  --from-literal=SECRET_KEY="$SECRET_KEY" \
  --from-literal=ALGORITHM="HS256" \
  --from-literal=ACCESS_TOKEN_EXPIRE_MINUTES="30" \
  --from-literal=YUKASSA_SHOP_ID="" \
  --from-literal=YUKASSA_SECRET_KEY="" \
  -n ai-creatives

# Создание ConfigMap
kubectl create configmap ai-creatives-config \
  --from-literal=API_URL="http://backend-service:8000" \
  --from-literal=POSTGRES_DB="ai_creatives" \
  --from-literal=POSTGRES_USER="postgres" \
  -n ai-creatives
```

#### 2.2 Проверка секретов
```bash
kubectl get secrets -n ai-creatives
kubectl get configmap -n ai-creatives
```

---

### ШАГ 3: Локальная сборка и тестирование

#### 3.1 Тестирование с Docker Compose
```bash
# Создайте .env файл
cat > .env << EOF
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
SECRET_KEY=$SECRET_KEY
EOF

# Запуск
docker-compose up -d

# Проверка
curl http://localhost:8000/health
curl http://localhost:3000

# Остановка
docker-compose down
```

---

### ШАГ 4: Сборка и push образов

#### 4.1 Настройка Docker для Yandex Container Registry
```bash
yc container registry configure-docker
```

#### 4.2 Сборка backend
```bash
cd backend
docker build -t cr.yandex/$YC_REGISTRY_ID/ai-creatives-backend:latest .
docker push cr.yandex/$YC_REGISTRY_ID/ai-creatives-backend:latest
```

#### 4.3 Сборка frontend
```bash
cd frontend
docker build \
  --build-arg API_URL=https://yourdomain.com/api \
  -t cr.yandex/$YC_REGISTRY_ID/ai-creatives-frontend:latest .
docker push cr.yandex/$YC_REGISTRY_ID/ai-creatives-frontend:latest
```

---

### ШАГ 5: Развертывание в Kubernetes

#### 5.1 Обновление манифестов
```bash
# Замените REGISTRY_ID в файлах
sed -i "s/REGISTRY_ID/$YC_REGISTRY_ID/g" k8s/backend.yaml
sed -i "s/REGISTRY_ID/$YC_REGISTRY_ID/g" k8s/frontend.yaml
```

#### 5.2 Развертывание PostgreSQL
```bash
kubectl apply -f k8s/postgres.yaml
kubectl wait --for=condition=ready pod -l app=postgres -n ai-creatives --timeout=300s
```

#### 5.3 Инициализация БД
```bash
# Создаем Job для миграций
cat <<EOF | kubectl apply -f -
apiVersion: batch/v1
kind: Job
metadata:
  name: db-init
  namespace: ai-creatives
spec:
  template:
    spec:
      containers:
      - name: init
        image: cr.yandex/$YC_REGISTRY_ID/ai-creatives-backend:latest
        command: ["python", "init_db.py"]
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: ai-creatives-secrets
              key: DATABASE_URL
      restartPolicy: OnFailure
EOF

# Ждем завершения
kubectl wait --for=condition=complete job/db-init -n ai-creatives --timeout=300s
kubectl logs job/db-init -n ai-creatives
```

#### 5.4 Развертывание Backend
```bash
kubectl apply -f k8s/backend.yaml
kubectl rollout status deployment/backend -n ai-creatives
```

#### 5.5 Развертывание Frontend
```bash
kubectl apply -f k8s/frontend.yaml
kubectl rollout status deployment/frontend -n ai-creatives
```

#### 5.6 Настройка Ingress
```bash
# Обновите домен и subnet IDs в k8s/ingress.yaml
kubectl apply -f k8s/ingress.yaml
```

---

### ШАГ 6: Проверка развертывания

```bash
# Проверка подов
kubectl get pods -n ai-creatives

# Проверка сервисов
kubectl get services -n ai-creatives

# Проверка ingress
kubectl get ingress -n ai-creatives

# Логи backend
kubectl logs -l app=backend -n ai-creatives --tail=50 -f

# Логи frontend
kubectl logs -l app=frontend -n ai-creatives --tail=50 -f

# Проверка health
POD=$(kubectl get pod -l app=backend -n ai-creatives -o jsonpath="{.items[0].metadata.name}")
kubectl exec -it $POD -n ai-creatives -- curl localhost:8000/health
```

---

### ШАГ 7: Настройка DNS

#### 7.1 Получение IP адреса
```bash
kubectl get ingress ai-creatives-ingress -n ai-creatives -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

#### 7.2 Настройка DNS записи
Добавьте A-запись в вашем DNS провайдере:
```
yourdomain.com -> <INGRESS_IP>
```

---

### ШАГ 8: Настройка SSL/TLS (Let's Encrypt)

#### 8.1 Установка cert-manager
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

#### 8.2 Создание ClusterIssuer
```bash
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: yc-alb
EOF
```

#### 8.3 Обновление Ingress для HTTPS
Раскомментируйте TLS секцию в `k8s/ingress.yaml` и примените:
```bash
kubectl apply -f k8s/ingress.yaml
```

---

## 🔄 CI/CD С GITHUB ACTIONS

### Настройка автоматического развертывания

#### 1. Добавьте GitHub Secrets
```
YC_REGISTRY_ID=<your_registry_id>
YC_SA_JSON_CREDENTIALS=<содержимое_key.json>
YC_K8S_CLUSTER_ID=<your_cluster_id>
```

#### 2. Workflow запускается автоматически при push в main

#### 3. Мониторинг деплоя
- Actions → Deploy → Смотреть логи

---

## 📊 МОНИТОРИНГ

### Просмотр логов
```bash
# Все поды
kubectl logs -l app=backend -n ai-creatives --tail=100 -f

# Конкретный под
kubectl logs <pod-name> -n ai-creatives -f
```

### Metrics
```bash
# Использование ресурсов
kubectl top nodes
kubectl top pods -n ai-creatives

# HPA статус
kubectl get hpa -n ai-creatives
```

---

## 🔧 ОБНОВЛЕНИЕ ПРИЛОЖЕНИЯ

### Вручную
```bash
# Обновить backend
kubectl set image deployment/backend backend=cr.yandex/$YC_REGISTRY_ID/ai-creatives-backend:v2.0.0 -n ai-creatives

# Откат изменений
kubectl rollout undo deployment/backend -n ai-creatives

# История
kubectl rollout history deployment/backend -n ai-creatives
```

### Через CI/CD
```bash
git add .
git commit -m "Update feature"
git push origin main
# GitHub Actions автоматически задеплоит
```

---

## 🐛 TROUBLESHOOTING

### Проблемы с подами
```bash
# Описание пода
kubectl describe pod <pod-name> -n ai-creatives

# События
kubectl get events -n ai-creatives --sort-by='.lastTimestamp'

# Перезапуск deployment
kubectl rollout restart deployment/backend -n ai-creatives
```

### Проблемы с БД
```bash
# Подключение к PostgreSQL
kubectl exec -it <postgres-pod> -n ai-creatives -- psql -U postgres -d ai_creatives

# Проверка подключения
kubectl run -it --rm debug --image=postgres:14-alpine --restart=Never -n ai-creatives -- psql postgresql://postgres:<password>@postgres:5432/ai_creatives
```

### Проблемы с сетью
```bash
# Проверка DNS
kubectl run -it --rm debug --image=busybox --restart=Never -n ai-creatives -- nslookup backend-service

# Проверка доступности
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -n ai-creatives -- curl backend-service:8000/health
```

---

## 📈 МАСШТАБИРОВАНИЕ

### Вертикальное (увеличение ресурсов)
Отредактируйте `resources` в манифестах и примените:
```bash
kubectl apply -f k8s/backend.yaml
```

### Горизонтальное (больше подов)
HPA настроен автоматически, или вручную:
```bash
kubectl scale deployment/backend --replicas=5 -n ai-creatives
```

---

## 🔐 БЕЗОПАСНОСТЬ

### Обновление секретов
```bash
kubectl delete secret ai-creatives-secrets -n ai-creatives
# Создайте новый secret (см. Шаг 2.1)
kubectl rollout restart deployment/backend deployment/frontend -n ai-creatives
```

### Network Policies
```bash
# Ограничение доступа между подами
kubectl apply -f k8s/network-policies.yaml
```

---

## 💾 БЭКАПЫ

### Бэкап PostgreSQL
```bash
# Создание бэкапа
kubectl exec <postgres-pod> -n ai-creatives -- pg_dump -U postgres ai_creatives > backup.sql

# Восстановление
kubectl exec -i <postgres-pod> -n ai-creatives -- psql -U postgres ai_creatives < backup.sql
```

### Автоматические бэкапы
Настройте CronJob для регулярных бэкапов (создайте `k8s/backup-cronjob.yaml`)

---

## 📞 ПОДДЕРЖКА

**Полезные команды:**
```bash
# Полная информация о кластере
kubectl cluster-info

# Все ресурсы в namespace
kubectl get all -n ai-creatives

# Удаление всех ресурсов (ОСТОРОЖНО!)
kubectl delete namespace ai-creatives
```

---

## ✅ ЧЕКЛИСТ ЗАПУСКА В PRODUCTION

- [ ] Secrets настроены и secure
- [ ] SSL/TLS сертификаты установлены
- [ ] Бэкапы PostgreSQL настроены
- [ ] Мониторинг настроен
- [ ] Alerts настроены
- [ ] DNS настроен
- [ ] Rate limiting проверен
- [ ] Health checks работают
- [ ] Логи собираются
- [ ] Документация обновлена

---

**Готово! Ваше приложение развернуто в production! 🎉**

