# Makefile для упрощения команд

.PHONY: help dev stop build push deploy clean logs test

# Переменные
REGISTRY_ID ?= $(YC_REGISTRY_ID)
BACKEND_IMAGE = cr.yandex/$(REGISTRY_ID)/ai-creatives-backend
FRONTEND_IMAGE = cr.yandex/$(REGISTRY_ID)/ai-creatives-frontend
VERSION ?= latest

help: ## Показать справку
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Запустить в режиме разработки (Docker Compose)
	@chmod +x scripts/local-dev.sh
	@./scripts/local-dev.sh

stop: ## Остановить контейнеры
	docker-compose down

build: ## Собрать Docker образы
	@echo "🔨 Сборка backend..."
	docker build -t $(BACKEND_IMAGE):$(VERSION) ./backend
	@echo "🔨 Сборка frontend..."
	docker build -t $(FRONTEND_IMAGE):$(VERSION) ./frontend
	@echo "✅ Сборка завершена"

push: build ## Собрать и отправить в Yandex Container Registry
	@echo "📤 Push backend..."
	docker push $(BACKEND_IMAGE):$(VERSION)
	@echo "📤 Push frontend..."
	docker push $(FRONTEND_IMAGE):$(VERSION)
	@echo "✅ Push завершен"

deploy: ## Развернуть в Kubernetes
	@chmod +x scripts/deploy-k8s.sh
	@./scripts/deploy-k8s.sh

clean: ## Очистить Docker ресурсы
	docker-compose down -v
	docker system prune -f

logs: ## Показать логи (Docker Compose)
	docker-compose logs -f

logs-k8s: ## Показать логи из Kubernetes
	kubectl logs -l app=backend -n ai-creatives --tail=100 -f

test-backend: ## Запустить тесты backend
	cd backend && pytest tests/ -v

test-frontend: ## Запустить тесты frontend
	cd frontend && npm test

lint: ## Проверить код линтером
	cd backend && black . && flake8 .
	cd frontend && npm run lint

init-db: ## Инициализировать БД (Docker Compose)
	docker-compose exec backend python init_db.py

migrate: ## Запустить миграции (Docker Compose)
	docker-compose exec backend alembic upgrade head

migrate-create: ## Создать новую миграцию
	@read -p "Введите название миграции: " name; \
	docker-compose exec backend alembic revision --autogenerate -m "$$name"

backup-db: ## Создать бэкап БД
	@mkdir -p backups
	docker-compose exec postgres pg_dump -U postgres ai_creatives | gzip > backups/backup-$$(date +%Y%m%d-%H%M%S).sql.gz
	@echo "✅ Бэкап создан в директории backups/"

restore-db: ## Восстановить БД из бэкапа (укажите файл: make restore-db FILE=backup.sql.gz)
	@if [ -z "$(FILE)" ]; then \
		echo "❌ Укажите файл: make restore-db FILE=backup.sql.gz"; \
		exit 1; \
	fi
	gunzip -c $(FILE) | docker-compose exec -T postgres psql -U postgres ai_creatives
	@echo "✅ БД восстановлена"

status: ## Показать статус подов в Kubernetes
	kubectl get all -n ai-creatives

shell-backend: ## Зайти в shell backend контейнера
	docker-compose exec backend /bin/bash

shell-db: ## Зайти в PostgreSQL
	docker-compose exec postgres psql -U postgres ai_creatives

security-scan: ## Сканировать образы на уязвимости
	@echo "🔍 Сканирование backend..."
	docker scout cves $(BACKEND_IMAGE):$(VERSION)
	@echo "🔍 Сканирование frontend..."
	docker scout cves $(FRONTEND_IMAGE):$(VERSION)

