# Habit Tracker 🎯

[![GitHub](https://img.shields.io/badge/GitHub-IWTDPLZZZ%2FHabit--Tracker--blue?style=flat-square&logo=github)](https://github.com/IWTDPLZZZ/Habit-Tracker-)

Веб-приложение для формирования, отслеживания и анализа привычек пользователя с интегрированным AI-ассистентом и системой достижений.

## 🔍 Общее описание

- **Следи за своими полезными и вредными привычками**
- **Просматривай статистику и прогресс**
- **Получай достижения и бейджи**
- **Используй AI-помощника (Coach) для составления планов**
- **Удобный интерфейс с анимациями и отзывчивым дизайном**

## 🧰 Технологический стек

| Слой | Технологии |
|------|------------|
| **Backend** | Python, FastAPI, PostgreSQL, Docker |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, Framer Motion |
| **AI / Аналитика** | Вызовы к OpenAI (или другому LLM) |
| **Инфраструктура** | Docker Compose, REST API, CORS |

## 📁 Структура проекта

```
habit-tracker/
├── backend/
│   ├── main.py              # Основной файл FastAPI
│   ├── requirements.txt     # Python зависимости
│   ├── Dockerfile          # Контейнеризация backend
│   └── __pycache__/        # Кэш Python
├── frontend/
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   │   ├── auth/       # Компоненты аутентификации
│   │   │   ├── ui/         # Базовые UI компоненты
│   │   │   ├── AchievementCard.tsx
│   │   │   ├── AchievementsPage.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── GoalCard.tsx
│   │   │   ├── GoalForm.tsx
│   │   │   ├── GoalsPage.tsx
│   │   │   ├── GoalsSection.tsx
│   │   │   ├── HabitCoach.tsx
│   │   │   ├── HabitForm.tsx
│   │   │   ├── HabitsPage.tsx
│   │   │   └── LandingPage.tsx
│   │   ├── api/
│   │   │   └── client.ts   # API клиент
│   │   ├── contexts/       # React контексты
│   │   ├── lib/
│   │   │   └── utils.ts    # Утилиты
│   │   ├── types/
│   │   │   └── gamification.ts
│   │   ├── utils/
│   │   │   └── gamification.ts
│   │   ├── App.tsx         # Главный компонент
│   │   ├── main.tsx        # Точка входа
│   │   └── index.css       # Глобальные стили
│   ├── public/             # Статические файлы
│   ├── dist/               # Собранное приложение
│   ├── package.json        # Зависимости
│   ├── vite.config.ts      # Конфигурация Vite
│   ├── tailwind.config.js  # Конфигурация Tailwind
│   ├── tsconfig.json       # Конфигурация TypeScript
│   └── Dockerfile          # Контейнеризация frontend
├── docker-compose.yml      # Оркестрация контейнеров
├── package.json            # Корневые скрипты
└── START.md                # Документация запуска
```

## 📦 Как запустить проект

### 1. Клонировать репозиторий
```bash
git clone https://github.com/IWTDPLZZZ/Habit-Tracker-.git
cd Habit-Tracker-
```

### 2. Запустить через Docker
```bash
docker-compose up --build
```

- **Frontend** будет доступен по http://localhost:3000
- **Backend** — по http://localhost:8000

### 3. Запуск локально (без Docker)

#### Backend
```bash
cd backend  
pip install -r requirements.txt  
uvicorn main:app --reload  
```

#### Frontend
```bash
cd frontend  
npm install  
npm run dev
```

## 🛠 Основные функциональные модули

- **Habits** — создание, редактирование, удаление, отметка выполнения
- **Statistics / Progress** — визуализация прогресса
- **Achievements** — система бейджей и наград
- **AI Coach** — генерация планов привычек, рекомендации
- **Goals** — постановка и отслеживание целей
- **Auth** — регистрация, вход, безопасность

## 📑 API Endpoints

- `GET /healthcheck` — проверка состояния
- `GET /habits` — получить все привычки
- `POST /habits` — создать привычку
- `PUT /habits/{id}` — обновить привычку
- `DELETE /habits/{id}` — удалить привычку
- `POST /habits/{id}/complete` — отметка выполнения
- `GET /habits/{id}/completions` — история выполнений

## 🎮 Геймификация и мотивация

- **Баллы** за выполнение привычек
- **Бейджи**: "Новичок", "Железная воля" и др.
- **Прогресс-бар**, достижения, уровни мотивации
- **Стрики** привычек
- **Система достижений** с визуальными наградами

## 🧩 Особенности архитектуры

- **Клиент-серверное разделение**
- **REST API + JSON**
- **Контейнеризация с Docker**
- **Типизация на фронтенде (TypeScript)**
- **Анимации и плавное взаимодействие (Framer Motion)**
- **Подход "модульной" архитектуры**
- **CORS** для межсайтовых запросов

## ⚙️ Планы развития

- **Мобильная адаптация** или приложение
- **Расширенный AI-анализ** (прогнозы, предупреждения срывов)
- **Расшаривание целей / привычек** между пользователями
- **Интеграция с внешними сервисами** (календари, шагомеры)
- **Интеграция с PostgreSQL** для персистентности данных
- **Система аутентификации** пользователей

## 👤 Автор

**IWTDPLZZZ** 📍 GitHub: [https://github.com/IWTDPLZZZ](https://github.com/IWTDPLZZZ)

---

## 🚀 Быстрый старт

### Доступные команды

```bash
# Запуск в Docker
npm run dev

# Сборка контейнеров
npm run build

# Остановка сервисов
npm run stop

# Просмотр логов
npm run logs

# Очистка Docker
npm run clean

# Локальная разработка
npm run backend:dev    # Backend на порту 8000
npm run frontend:dev   # Frontend на порту 5173
```

### Структура данных

#### Привычка (Habit)
```typescript
interface Habit {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  bg_color: string;
  completed_days: number;
  streak: number;
  last_completed: string | null;
  created_at: string;
}
```

#### Создание привычки
```typescript
interface HabitCreate {
  name: string;
  description: string;
  icon: string;
  color: string;
  bg_color: string;
}
```

#### Отметка выполнения
```typescript
interface HabitCompletion {
  habit_id: number;
  completed: boolean;
  date: string;
}
```

## 🔧 Разработка

### Backend (FastAPI)
- **Порт**: 8000
- **Автоперезагрузка**: включена
- **CORS**: настроен для frontend
- **Документация API**: http://localhost:8000/docs
- **Swagger UI**: http://localhost:8000/docs

### Frontend (React + Vite)
- **Порт**: 3000 (production) / 5173 (development)
- **Hot Reload**: включен
- **TypeScript**: строгая типизация
- **Tailwind CSS**: утилитарные стили
- **Framer Motion**: анимации

### Docker
- **Сеть**: habit-tracker-network
- **Автоперезапуск**: unless-stopped
- **Зависимости**: frontend зависит от backend

## 📊 Мониторинг

- **Health Check**: `GET /healthcheck`
- **Логи**: `docker-compose logs -f`
- **Статус контейнеров**: `docker-compose ps`

## 🎯 Roadmap

- [ ] Интеграция с PostgreSQL
- [ ] Система аутентификации
- [ ] AI-ассистент с OpenAI
- [ ] Мобильная версия
- [ ] Социальные функции
- [ ] Экспорт данных
- [ ] Расширенная аналитика
- [ ] Уведомления и напоминания

## 📊 Статистика проекта

- **Языки**: TypeScript (94.4%), CSS (2.3%), Python (2.1%), Other (1.2%)
- **Коммиты**: 10 commits
- **Ветка**: main
- **Статус**: Активная разработка

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта! Если у вас есть идеи или предложения:

1. Создайте **Issue** для обсуждения новой функциональности
2. Сделайте **Fork** репозитория
3. Создайте новую ветку для ваших изменений
4. Отправьте **Pull Request** с описанием изменений

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. Подробности в файле [LICENSE](LICENSE).

## 🔗 Полезные ссылки

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Docker Documentation](https://docs.docker.com/)

---

**Сделано с ❤️ для формирования полезных привычек!**
