const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:8000');

export interface Habit {
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

export interface HabitCreate {
  name: string;
  description: string;
  icon: string;
  color: string;
  bg_color: string;
}

export interface HabitCompletion {
  habit_id: number;
  completed: boolean;
  date: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async healthcheck(): Promise<{ status: string }> {
    return this.request('/healthcheck');
  }

  async getHabits(): Promise<Habit[]> {
    return this.request('/habits');
  }

  async getHabit(id: number): Promise<Habit> {
    return this.request(`/habits/${id}`);
  }

  async createHabit(habit: HabitCreate): Promise<Habit> {
    return this.request('/habits', {
      method: 'POST',
      body: JSON.stringify(habit),
    });
  }

  async updateHabit(id: number, updates: Partial<HabitCreate>): Promise<Habit> {
    return this.request(`/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteHabit(id: number): Promise<{ message: string }> {
    return this.request(`/habits/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleHabitCompletion(completion: HabitCompletion): Promise<{ message: string; habit: Habit }> {
    return this.request(`/habits/${completion.habit_id}/complete`, {
      method: 'POST',
      body: JSON.stringify(completion),
    });
  }

  async getHabitCompletions(id: number): Promise<{ completions: any[] }> {
    return this.request(`/habits/${id}/completions`);
  }
}

export const apiClient = new ApiClient(API_URL);

