# Скрипт для перезапуска Next.js dev server с очисткой кэша

Write-Host "🧹 Очистка кэша Next.js..." -ForegroundColor Yellow

# Остановить процессы на порту 3002
$processes = Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($processes) {
    Write-Host "⚠️  Останавливаем процесс на порту 3002..." -ForegroundColor Yellow
    foreach ($proc in $processes) {
        Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

# Удалить .next и node_modules/.cache
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ Удалена папка .next" -ForegroundColor Green
}

if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache"
    Write-Host "✅ Очищен кэш node_modules" -ForegroundColor Green
}

# Очистить кэш npm
npm cache clean --force
Write-Host "✅ Очищен npm cache" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 Запуск dev server на порту 3002..." -ForegroundColor Cyan
Write-Host ""

# Запустить dev server
npm run dev

