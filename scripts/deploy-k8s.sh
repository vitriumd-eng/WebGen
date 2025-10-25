#!/bin/bash
set -e

# Скрипт для развертывания в Kubernetes

echo "🚀 Развертывание AI Creative Generator в Kubernetes"

# Проверка kubectl
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl не установлен"
    exit 1
fi

# Проверка yc
if ! command -v yc &> /dev/null; then
    echo "❌ yc CLI не установлен"
    exit 1
fi

# Переменные
NAMESPACE="ai-creatives"
REGISTRY_ID=${YC_REGISTRY_ID:-""}

if [ -z "$REGISTRY_ID" ]; then
    echo "❌ Установите переменную YC_REGISTRY_ID"
    exit 1
fi

echo "📦 Registry ID: $REGISTRY_ID"

# Создание namespace
echo "📝 Создание namespace..."
kubectl apply -f k8s/namespace.yaml

# Создание secrets (если еще не созданы)
if ! kubectl get secret ai-creatives-secrets -n $NAMESPACE &> /dev/null; then
    echo "🔐 Создание secrets..."
    
    SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
    POSTGRES_PASSWORD=$(python3 -c "import secrets; print(secrets.token_urlsafe(16))")
    
    kubectl create secret generic ai-creatives-secrets \
      --from-literal=POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
      --from-literal=DATABASE_URL="postgresql://postgres:$POSTGRES_PASSWORD@postgres:5432/ai_creatives" \
      --from-literal=SECRET_KEY="$SECRET_KEY" \
      --from-literal=ALGORITHM="HS256" \
      --from-literal=ACCESS_TOKEN_EXPIRE_MINUTES="30" \
      --from-literal=YUKASSA_SHOP_ID="" \
      --from-literal=YUKASSA_SECRET_KEY="" \
      -n $NAMESPACE
    
    echo "✅ Secrets созданы"
else
    echo "✅ Secrets уже существуют"
fi

# Создание ConfigMap
echo "📝 Создание ConfigMap..."
kubectl apply -f k8s/secrets.yaml

# Замена REGISTRY_ID в манифестах
echo "🔄 Обновление манифестов..."
sed -i.bak "s/REGISTRY_ID/$REGISTRY_ID/g" k8s/backend.yaml
sed -i.bak "s/REGISTRY_ID/$REGISTRY_ID/g" k8s/frontend.yaml

# Развертывание PostgreSQL
echo "💾 Развертывание PostgreSQL..."
kubectl apply -f k8s/postgres.yaml
kubectl wait --for=condition=ready pod -l app=postgres -n $NAMESPACE --timeout=300s

# Инициализация БД
echo "🔧 Инициализация базы данных..."
cat <<EOF | kubectl apply -f -
apiVersion: batch/v1
kind: Job
metadata:
  name: db-init-$(date +%s)
  namespace: $NAMESPACE
spec:
  template:
    spec:
      containers:
      - name: init
        image: cr.yandex/$REGISTRY_ID/ai-creatives-backend:latest
        command: ["python", "init_db.py"]
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: ai-creatives-secrets
              key: DATABASE_URL
      restartPolicy: OnFailure
  backoffLimit: 3
EOF

# Развертывание Backend
echo "⚙️ Развертывание Backend..."
kubectl apply -f k8s/backend.yaml
kubectl rollout status deployment/backend -n $NAMESPACE --timeout=300s

# Развертывание Frontend
echo "🎨 Развертывание Frontend..."
kubectl apply -f k8s/frontend.yaml
kubectl rollout status deployment/frontend -n $NAMESPACE --timeout=300s

# Развертывание Ingress
echo "🌐 Настройка Ingress..."
kubectl apply -f k8s/ingress.yaml

# Развертывание Network Policies
echo "🔒 Применение Network Policies..."
kubectl apply -f k8s/network-policies.yaml

# Настройка автоматических бэкапов
echo "💾 Настройка автоматических бэкапов..."
kubectl apply -f k8s/backup-cronjob.yaml

# Вывод статуса
echo ""
echo "✅ Развертывание завершено!"
echo ""
echo "📊 Статус подов:"
kubectl get pods -n $NAMESPACE
echo ""
echo "🌐 Сервисы:"
kubectl get services -n $NAMESPACE
echo ""
echo "🔗 Ingress:"
kubectl get ingress -n $NAMESPACE
echo ""
echo "📝 Просмотр логов backend:"
echo "   kubectl logs -l app=backend -n $NAMESPACE -f"
echo ""
echo "📝 Просмотр логов frontend:"
echo "   kubectl logs -l app=frontend -n $NAMESPACE -f"
echo ""

# Восстановление оригинальных файлов
mv k8s/backend.yaml.bak k8s/backend.yaml
mv k8s/frontend.yaml.bak k8s/frontend.yaml

