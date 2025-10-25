# 🚀 ИНСТРУКЦИЯ ПО ЗАГРУЗКЕ В GITHUB

## Шаг 1: Создайте репозиторий на GitHub

1. Перейдите на https://github.com/new
2. Название: `webgen` (или `AI-Creative-Generator`)
3. Описание: `AI-powered creative generation platform`
4. Private/Public: выберите по желанию
5. НЕ добавляйте README, .gitignore, license (уже есть в проекте)
6. Нажмите "Create repository"

## Шаг 2: Инициализируйте Git (если еще не сделано)

```bash
cd d:/webgen
git init
git add .
git commit -m "Initial commit: AI Creative Generator with full infrastructure"
```

## Шаг 3: Подключите удаленный репозиторий

Замените `YOUR_USERNAME` на ваш GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/webgen.git
```

Или с SSH (если настроен):

```bash
git remote add origin git@github.com:YOUR_USERNAME/webgen.git
```

## Шаг 4: Push в GitHub

```bash
git branch -M main
git push -u origin main
```

## Шаг 5: Настройте GitHub Secrets (для CI/CD)

После push перейдите в:  
Settings → Secrets and variables → Actions → New repository secret

Добавьте:
- `YC_REGISTRY_ID` - ID вашего Container Registry в Yandex Cloud
- `YC_SA_JSON_CREDENTIALS` - JSON содержимое ключа Service Account
- `YC_K8S_CLUSTER_ID` - ID вашего Kubernetes кластера

---

## ✅ Что уже готово в проекте:

- ✅ `.gitignore` - защита sensitive данных
- ✅ `.github/workflows/` - CI/CD pipelines
- ✅ `README.md` - полная документация
- ✅ `DEPLOYMENT.md` - руководство по развертыванию
- ✅ Docker configuration - контейнеризация
- ✅ Kubernetes manifests - оркестрация
- ✅ Makefile - упрощенные команды

---

## 📝 Рекомендации

### Добавьте темы (topics) к репозиторию:

`fastapi`, `nextjs`, `kubernetes`, `docker`, `ai`, `saas`, `yandex-cloud`, `typescript`, `python`, `postgresql`

### Включите GitHub Actions:

После первого push перейдите в:  
Actions → I understand my workflows → Enable workflows

### Защитите main branch:

Settings → Branches → Add branch protection rule:
- Branch name: `main`
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging

---

## 🔄 Регулярные операции

### Проверить статус:
```bash
git status
```

### Добавить изменения:
```bash
git add .
git commit -m "Описание изменений"
git push
```

### Создать новую ветку:
```bash
git checkout -b feature/new-feature
# Внести изменения
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
# Создайте Pull Request на GitHub
```

---

## 🎯 После успешного push

1. ✅ Проверьте, что все файлы загрузились
2. ✅ Настройте GitHub Secrets (если планируете использовать CI/CD)
3. ✅ Добавьте description и topics к репозиторию
4. ✅ Включите GitHub Actions (если нужно)
5. ✅ Настройте branch protection (рекомендуется)

---

**Готово!** Ваш проект теперь на GitHub! 🎉

