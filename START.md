# Запуск проекта Habit Tracker

## Запуск через Docker Compose (рекомендуется)

```bash
# Сборка образов
docker-compose build

# Запуск проекта
docker-compose up

# Запуск в фоновом режиме
docker-compose up -d

# Остановка
docker-compose down

# Просмотр логов
docker-compose logs -f

# Очистка
docker-compose down -v --remove-orphans && docker system prune -f
```

## Запуск через npm скрипты

```bash
# Установка зависимостей
npm run frontend:install
npm run backend:install

# Запуск в режиме разработки
npm run dev

# Остановка
npm run stop

# Просмотр логов
npm run logs

# Очистка
npm run clean
```

## Запуск отдельных сервисов

### Backend (Python/FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend (React/Vite)
```bash
cd frontend
npm install
npm run dev
```

## Доступ к приложению

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API документация: http://localhost:8000/docs
