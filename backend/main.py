from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
import uvicorn

app = FastAPI(title="Habit Tracker API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class HabitBase(BaseModel):
    name: str
    description: str
    icon: str
    color: str
    bg_color: str

class HabitCreate(HabitBase):
    pass

class Habit(HabitBase):
    id: int
    completed_days: int
    streak: int
    last_completed: Optional[date] = None
    created_at: datetime

class HabitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class HabitCompletion(BaseModel):
    habit_id: int
    completed: bool
    date: date

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: int
    email: str
    created_at: datetime

# In-memory storage (in production, use a database)
habits_db = []
users_db = []
habit_completions_db = []

# Helper functions
def get_habit_by_id(habit_id: int) -> Optional[dict]:
    for habit in habits_db:
        if habit["id"] == habit_id:
            return habit
    return None

def get_user_by_email(email: str) -> Optional[dict]:
    for user in users_db:
        if user["email"] == email:
            return user
    return None

def get_habit_completion(habit_id: int, completion_date: date) -> Optional[dict]:
    for completion in habit_completions_db:
        if completion["habit_id"] == habit_id and completion["date"] == completion_date:
            return completion
    return None

# API Endpoints
@app.get("/healthcheck")
def healthcheck() -> dict:
    return {"status": "ok"}

@app.get("/")
def root() -> dict:
    return {"message": "Habit Tracker API"}

# User endpoints
@app.post("/auth/register", response_model=User)
def register_user(user: UserCreate):
    # Check if user already exists
    if get_user_by_email(user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user = {
        "id": len(users_db) + 1,
        "email": user.email,
        "password": user.password,  # In production, hash this password
        "created_at": datetime.now()
    }
    users_db.append(new_user)
    
    return User(**{k: v for k, v in new_user.items() if k != "password"})

@app.post("/auth/login", response_model=User)
def login_user(user: UserLogin):
    # Find user
    db_user = get_user_by_email(user.email)
    if not db_user or db_user["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return User(**{k: v for k, v in db_user.items() if k != "password"})

# Habit endpoints
@app.get("/habits", response_model=List[Habit])
def get_habits():
    return [Habit(**habit) for habit in habits_db]

@app.post("/habits", response_model=Habit)
def create_habit(habit: HabitCreate):
    new_habit = {
        "id": len(habits_db) + 1,
        **habit.dict(),
        "completed_days": 0,
        "streak": 0,
        "last_completed": None,
        "created_at": datetime.now()
    }
    habits_db.append(new_habit)
    return Habit(**new_habit)

@app.get("/habits/{habit_id}", response_model=Habit)
def get_habit(habit_id: int):
    habit = get_habit_by_id(habit_id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return Habit(**habit)

@app.put("/habits/{habit_id}", response_model=Habit)
def update_habit(habit_id: int, habit_update: HabitUpdate):
    habit = get_habit_by_id(habit_id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    # Update fields
    for field, value in habit_update.dict(exclude_unset=True).items():
        habit[field] = value
    
    return Habit(**habit)

@app.delete("/habits/{habit_id}")
def delete_habit(habit_id: int):
    habit = get_habit_by_id(habit_id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    habits_db.remove(habit)
    # Also remove all completions for this habit
    global habit_completions_db
    habit_completions_db = [c for c in habit_completions_db if c["habit_id"] != habit_id]
    
    return {"message": "Habit deleted successfully"}

# Habit completion endpoints
@app.post("/habits/{habit_id}/complete")
def toggle_habit_completion(habit_id: int, completion: HabitCompletion):
    habit = get_habit_by_id(habit_id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    existing_completion = get_habit_completion(habit_id, completion.date)
    
    if completion.completed:
        if not existing_completion:
            # Add completion
            habit_completions_db.append({
                "habit_id": habit_id,
                "date": completion.date,
                "completed_at": datetime.now()
            })
            # Update habit stats
            habit["completed_days"] += 1
            habit["last_completed"] = completion.date
            
            # Update streak
            yesterday = date.fromordinal(completion.date.toordinal() - 1)
            yesterday_completion = get_habit_completion(habit_id, yesterday)
            if yesterday_completion:
                habit["streak"] += 1
            else:
                habit["streak"] = 1
    else:
        if existing_completion:
            # Remove completion
            habit_completions_db.remove(existing_completion)
            # Update habit stats
            habit["completed_days"] = max(0, habit["completed_days"] - 1)
            if habit["last_completed"] == completion.date:
                habit["last_completed"] = None
            habit["streak"] = max(0, habit["streak"] - 1)
    
    return {"message": "Habit completion updated", "habit": Habit(**habit)}

@app.get("/habits/{habit_id}/completions")
def get_habit_completions(habit_id: int):
    habit = get_habit_by_id(habit_id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    completions = [c for c in habit_completions_db if c["habit_id"] == habit_id]
    return {"completions": completions}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

