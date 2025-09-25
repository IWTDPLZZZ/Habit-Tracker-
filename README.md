# Habit Tracker

Full-stack starter: FastAPI backend, React + Vite + Tailwind frontend, Dockerized.

## Run with Docker

```bash
docker compose up --build
```

Backend: http://localhost:8000/healthcheck

Frontend: http://localhost:3000

## Local dev

Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Frontend

```bash
cd frontend
npm install
npm run dev
```


