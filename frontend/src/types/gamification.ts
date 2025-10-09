export interface UserProfile {
  id: string
  name: string
  points: number
  level: number
  achievements: UserAchievement[]
  totalHabitsCompleted: number
  currentStreak: number
  longestStreak: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: AchievementCondition
  points: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  category: 'streak' | 'milestone' | 'special' | 'social'
}

export interface AchievementCondition {
  type: 'first_habit' | 'streak_days' | 'total_completions' | 'consecutive_days' | 'category_completion'
  value: number
  habitId?: string
  category?: string
}

export interface UserAchievement {
  id: string
  achievementId: string
  userId: string
  earnedAt: string
  progress?: number
  maxProgress?: number
}

export interface ToastNotification {
  id: string
  type: 'achievement' | 'points' | 'level_up'
  title: string
  message: string
  icon?: string
  points?: number
  achievement?: Achievement
}

export interface HabitCompletion {
  habitId: string
  completedAt: string
  points: number
}

export interface Goal {
  id: string
  title: string
  description: string
  targetDate: string
  createdAt: string
  habitIds: string[]
  completed: boolean
  category?: string
}

export interface GoalProgress {
  goalId: string
  totalHabits: number
  completedHabits: number
  averageProgress: number
  daysRemaining: number
}

export const PREDEFINED_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_habit',
    title: 'Новичок',
    description: 'Выполните свою первую привычку',
    icon: '🌟',
    condition: { type: 'first_habit', value: 1 },
    points: 50,
    rarity: 'common',
    category: 'milestone'
  },
  {
    id: 'streak_7',
    title: 'Железная воля',
    description: 'Выполняйте привычку 7 дней подряд',
    icon: '💪',
    condition: { type: 'streak_days', value: 7 },
    points: 100,
    rarity: 'rare',
    category: 'streak'
  },
  {
    id: 'streak_30',
    title: 'Марафонец',
    description: 'Выполняйте привычку 30 дней подряд',
    icon: '🏃‍♂️',
    condition: { type: 'streak_days', value: 30 },
    points: 500,
    rarity: 'epic',
    category: 'streak'
  },
  {
    id: 'completions_10',
    title: 'Постоянство',
    description: 'Выполните привычку 10 раз',
    icon: '🎯',
    condition: { type: 'total_completions', value: 10 },
    points: 150,
    rarity: 'common',
    category: 'milestone'
  },
  {
    id: 'completions_50',
    title: 'Мастер привычек',
    description: 'Выполните привычку 50 раз',
    icon: '👑',
    condition: { type: 'total_completions', value: 50 },
    points: 750,
    rarity: 'epic',
    category: 'milestone'
  },
  {
    id: 'completions_100',
    title: 'Легенда',
    description: 'Выполните привычку 100 раз',
    icon: '🏆',
    condition: { type: 'total_completions', value: 100 },
    points: 1500,
    rarity: 'legendary',
    category: 'milestone'
  },
  {
    id: 'health_master',
    title: 'Мастер здоровья',
    description: 'Создайте 5 привычек в категории здоровья',
    icon: '💚',
    condition: { type: 'category_completion', value: 5, category: 'health' },
    points: 300,
    rarity: 'rare',
    category: 'special'
  },
  {
    id: 'productivity_guru',
    title: 'Гуру продуктивности',
    description: 'Создайте 5 привычек в категории продуктивности',
    icon: '⚡',
    condition: { type: 'category_completion', value: 5, category: 'productivity' },
    points: 300,
    rarity: 'rare',
    category: 'special'
  },
  {
    id: 'early_bird',
    title: 'Ранняя пташка',
    description: 'Выполните привычку до 8:00 утра 10 раз',
    icon: '🐦',
    condition: { type: 'consecutive_days', value: 10 },
    points: 200,
    rarity: 'rare',
    category: 'special'
  },
  {
    id: 'night_owl',
    title: 'Ночная сова',
    description: 'Выполните привычку после 22:00 10 раз',
    icon: '🦉',
    condition: { type: 'consecutive_days', value: 10 },
    points: 200,
    rarity: 'rare',
    category: 'special'
  }
]

export const POINTS_CONFIG = {
  HABIT_COMPLETION: 10,
  LEVEL_UP_MULTIPLIER: 1.5,
  STREAK_BONUS: 5,
  DAILY_BONUS: 25
}

export const LEVEL_CONFIG = {
  POINTS_PER_LEVEL: 1000,
  MAX_LEVEL: 100
}
