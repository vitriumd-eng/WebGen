# Multi-stage build для оптимизации размера образа
FROM python:3.11-slim as builder

WORKDIR /app

# Установка зависимостей для компиляции
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Копируем requirements и устанавливаем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Production stage
FROM python:3.11-slim

WORKDIR /app

# Установка runtime зависимостей
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Создаем непривилегированного пользователя ДО копирования пакетов
RUN useradd -m -u 1000 appuser && \
    mkdir -p /home/appuser/.local && \
    chown -R appuser:appuser /home/appuser

# Копируем установленные пакеты из builder
COPY --from=builder /root/.local /home/appuser/.local

# Копируем код приложения
COPY --chown=appuser:appuser . .

# Создаем директорию для логов
RUN mkdir -p /app/logs && \
    chown -R appuser:appuser /app/logs

USER appuser

# Добавляем ~/.local/bin в PATH
ENV PATH=/home/appuser/.local/bin:$PATH
ENV PYTHONPATH=/app

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Expose port
EXPOSE 8000

# Запуск приложения
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

