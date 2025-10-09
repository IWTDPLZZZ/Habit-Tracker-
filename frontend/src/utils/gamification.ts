import type {
  UserProfile,
  Achievement,
  UserAchievement,
  HabitCompletion,
  Goal,
  GoalProgress
} from '@/types/gamification'
import {
  PREDEFINED_ACHIEVEMENTS,
  POINTS_CONFIG,
  LEVEL_CONFIG
} from '@/types/gamification'

export const getUserProfile = (): UserProfile => {
  const stored = localStorage.getItem('userProfile')
  if (stored) {
    return JSON.parse(stored)
  }
  
  const newProfile: UserProfile = {
    id: '1',
    name: 'Пользователь',
    points: 0,
    level: 1,
    achievements: [],
    totalHabitsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0
  }
  
  localStorage.setItem('userProfile', JSON.stringify(newProfile))
  return newProfile
}

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem('userProfile', JSON.stringify(profile))
}

export const addPoints = (points: number): UserProfile => {
  const profile = getUserProfile()
  
  profile.points += points
  profile.totalHabitsCompleted += 1
  
  const newLevel = Math.floor(profile.points / LEVEL_CONFIG.POINTS_PER_LEVEL) + 1
  if (newLevel > profile.level) {
    profile.level = newLevel
  }
  
  saveUserProfile(profile)
  return profile
}

export const checkAchievementConditions = (
  profile: UserProfile,
  habitId?: string,
  completionTime?: string
): Achievement[] => {
  const newAchievements: Achievement[] = []
  const userAchievementIds = profile.achievements.map(ua => ua.achievementId)
  
  for (const achievement of PREDEFINED_ACHIEVEMENTS) {
    if (userAchievementIds.includes(achievement.id)) {
      continue
    }
    
    if (checkSingleAchievementCondition(achievement, profile, habitId, completionTime)) {
      newAchievements.push(achievement)
    }
  }
  
  return newAchievements
}

const checkSingleAchievementCondition = (
  achievement: Achievement,
  profile: UserProfile,
  habitId?: string,
  completionTime?: string
): boolean => {
  const condition = achievement.condition
  
  switch (condition.type) {
    case 'first_habit':
      return profile.totalHabitsCompleted >= condition.value
      
    case 'streak_days':
      return checkStreakCondition(habitId, condition.value)
      
    case 'total_completions':
      return checkTotalCompletionsCondition(habitId, condition.value)
      
    case 'consecutive_days':
      return checkConsecutiveDaysCondition(habitId, condition.value, completionTime)
      
    case 'category_completion':
      return checkCategoryCompletionCondition(condition.category!, condition.value)
      
    default:
      return false
  }
}

const checkStreakCondition = (habitId?: string, requiredDays: number = 7): boolean => {
  if (!habitId) return false
  
  const completions = getHabitCompletions(habitId)
  if (completions.length < requiredDays) return false
  
  const today = new Date()
  let consecutiveDays = 0
  
  for (let i = 0; i < requiredDays; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)
    const dateStr = checkDate.toISOString().split('T')[0]
    
    if (completions.some(c => c.completedAt.startsWith(dateStr))) {
      consecutiveDays++
    } else {
      break
    }
  }
  
  return consecutiveDays >= requiredDays
}

const checkTotalCompletionsCondition = (habitId?: string, requiredCompletions: number = 10): boolean => {
  if (!habitId) return false
  
  const completions = getHabitCompletions(habitId)
  return completions.length >= requiredCompletions
}

const checkConsecutiveDaysCondition = (
  habitId?: string, 
  requiredDays: number = 10,
  completionTime?: string
): boolean => {
  if (!habitId || !completionTime) return false
  
  const completions = getHabitCompletions(habitId)
  const time = new Date(completionTime)
  const hour = time.getHours()
  
  const isEarlyMorning = hour >= 5 && hour < 8
  const isLateNight = hour >= 22 && hour <= 23
  
  if (!isEarlyMorning && !isLateNight) return false
  
  const timeCompletions = completions.filter(c => {
    const completionHour = new Date(c.completedAt).getHours()
    return (isEarlyMorning && completionHour >= 5 && completionHour < 8) ||
           (isLateNight && completionHour >= 22 && completionHour <= 23)
  })
  
  return timeCompletions.length >= requiredDays
}

const checkCategoryCompletionCondition = (category: string, requiredCount: number = 5): boolean => {
  const habits = JSON.parse(localStorage.getItem('habits') || '[]')
  const categoryHabits = habits.filter((habit: any) => 
    habit.category === category || 
    (category === 'health' && ['exercise', 'water', 'sleep', 'fitness'].some(keyword => 
      habit.name.toLowerCase().includes(keyword)
    )) ||
    (category === 'productivity' && ['work', 'study', 'read', 'plan'].some(keyword => 
      habit.name.toLowerCase().includes(keyword)
    ))
  )
  
  return categoryHabits.length >= requiredCount
}

const getHabitCompletions = (habitId: string): HabitCompletion[] => {
  const stored = localStorage.getItem(`habitCompletions_${habitId}`)
  return stored ? JSON.parse(stored) : []
}

export const addHabitCompletion = (habitId: string, points: number = POINTS_CONFIG.HABIT_COMPLETION): HabitCompletion => {
  const completion: HabitCompletion = {
    habitId,
    completedAt: new Date().toISOString(),
    points
  }
  
  const completions = getHabitCompletions(habitId)
  completions.push(completion)
  localStorage.setItem(`habitCompletions_${habitId}`, JSON.stringify(completions))
  
  return completion
}

export const getAllHabitCompletions = (habitId: string): HabitCompletion[] => {
  return getHabitCompletions(habitId)
}

export const addAchievement = (achievement: Achievement): UserAchievement => {
  const profile = getUserProfile()
  const userAchievement: UserAchievement = {
    id: Date.now().toString(),
    achievementId: achievement.id,
    userId: profile.id,
    earnedAt: new Date().toISOString()
  }
  
  profile.achievements.push(userAchievement)
  profile.points += achievement.points
  
  const newLevel = Math.floor(profile.points / LEVEL_CONFIG.POINTS_PER_LEVEL) + 1
  if (newLevel > profile.level) {
    profile.level = newLevel
  }
  
  saveUserProfile(profile)
  return userAchievement
}

export const getUserAchievements = (): UserAchievement[] => {
  const profile = getUserProfile()
  return profile.achievements
}

export const getAchievementById = (id: string): Achievement | undefined => {
  return PREDEFINED_ACHIEVEMENTS.find(a => a.id === id)
}

export const isAchievementEarned = (achievementId: string): boolean => {
  const profile = getUserProfile()
  return profile.achievements.some(ua => ua.achievementId === achievementId)
}

export const getAchievementProgress = (achievement: Achievement): { current: number; max: number; percentage: number } => {
  const condition = achievement.condition
  
  switch (condition.type) {
    case 'first_habit':
      return {
        current: Math.min(getUserProfile().totalHabitsCompleted, condition.value),
        max: condition.value,
        percentage: Math.min((getUserProfile().totalHabitsCompleted / condition.value) * 100, 100)
      }
      
    case 'total_completions':
      const completions = condition.habitId ? getHabitCompletions(condition.habitId).length : 0
      return {
        current: Math.min(completions, condition.value),
        max: condition.value,
        percentage: Math.min((completions / condition.value) * 100, 100)
      }
      
    case 'streak_days':
      const streakCompletions = condition.habitId ? getHabitCompletions(condition.habitId) : []
      const currentStreak = calculateCurrentStreak(streakCompletions)
      return {
        current: Math.min(currentStreak, condition.value),
        max: condition.value,
        percentage: Math.min((currentStreak / condition.value) * 100, 100)
      }
      
    default:
      return { current: 0, max: 1, percentage: 0 }
  }
}

const calculateCurrentStreak = (completions: HabitCompletion[]): number => {
  if (completions.length === 0) return 0
  
  const sortedCompletions = completions.sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )
  
  let streak = 0
  const today = new Date()
  
  for (let i = 0; i < sortedCompletions.length; i++) {
    const completionDate = new Date(sortedCompletions[i].completedAt)
    const expectedDate = new Date(today)
    expectedDate.setDate(expectedDate.getDate() - i)
    
    if (completionDate.toDateString() === expectedDate.toDateString()) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

export const getNextLevelInfo = (): { currentLevel: number; nextLevel: number; pointsToNext: number; progress: number } => {
  const profile = getUserProfile()
  const currentLevel = profile.level
  const nextLevel = currentLevel + 1
  const pointsInCurrentLevel = profile.points % LEVEL_CONFIG.POINTS_PER_LEVEL
  const pointsToNext = LEVEL_CONFIG.POINTS_PER_LEVEL - pointsInCurrentLevel
  const progress = (pointsInCurrentLevel / LEVEL_CONFIG.POINTS_PER_LEVEL) * 100
  
  return {
    currentLevel,
    nextLevel,
    pointsToNext,
    progress
  }
}


export const getGoals = (): Goal[] => {
  const stored = localStorage.getItem('goals')
  return stored ? JSON.parse(stored) : []
}

export const saveGoals = (goals: Goal[]): void => {
  localStorage.setItem('goals', JSON.stringify(goals))
}

export const createGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'completed'>): Goal => {
  const goal: Goal = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    completed: false,
    ...goalData
  }
  
  const goals = getGoals()
  goals.push(goal)
  saveGoals(goals)
  
  return goal
}

export const updateGoal = (goalId: string, updates: Partial<Goal>): Goal | null => {
  const goals = getGoals()
  const goalIndex = goals.findIndex(g => g.id === goalId)
  
  if (goalIndex === -1) return null
  
  goals[goalIndex] = { ...goals[goalIndex], ...updates }
  saveGoals(goals)
  
  return goals[goalIndex]
}

export const deleteGoal = (goalId: string): boolean => {
  const goals = getGoals()
  const filteredGoals = goals.filter(g => g.id !== goalId)
  
  if (filteredGoals.length === goals.length) return false
  
  saveGoals(filteredGoals)
  return true
}

export const getGoalById = (goalId: string): Goal | null => {
  const goals = getGoals()
  return goals.find(g => g.id === goalId) || null
}

export const addHabitToGoal = (goalId: string, habitId: string): boolean => {
  const goal = getGoalById(goalId)
  if (!goal) return false
  
  if (goal.habitIds.includes(habitId)) return false
  
  goal.habitIds.push(habitId)
  updateGoal(goalId, { habitIds: goal.habitIds })
  
  return true
}

export const removeHabitFromGoal = (goalId: string, habitId: string): boolean => {
  const goal = getGoalById(goalId)
  if (!goal) return false
  
  const updatedHabitIds = goal.habitIds.filter(id => id !== habitId)
  updateGoal(goalId, { habitIds: updatedHabitIds })
  
  return true
}

export const getGoalProgress = (goalId: string): GoalProgress | null => {
  const goal = getGoalById(goalId)
  if (!goal) return null
  
  const habits = JSON.parse(localStorage.getItem('habits') || '[]')
  const goalHabits = habits.filter((habit: any) => goal.habitIds.includes(habit.id))
  
  if (goalHabits.length === 0) {
    return {
      goalId,
      totalHabits: 0,
      completedHabits: 0,
      averageProgress: 0,
      daysRemaining: Math.max(0, Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    }
  }
  
  const completedHabits = goalHabits.filter((habit: any) => habit.completed).length
  const averageProgress = (completedHabits / goalHabits.length) * 100
  
  const daysRemaining = Math.max(0, Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
  
  return {
    goalId,
    totalHabits: goalHabits.length,
    completedHabits,
    averageProgress,
    daysRemaining
  }
}

export const getUnassignedHabits = (): any[] => {
  const habits = JSON.parse(localStorage.getItem('habits') || '[]')
  const goals = getGoals()
  const assignedHabitIds = new Set(goals.flatMap(g => g.habitIds))
  
  return habits.filter((habit: any) => !assignedHabitIds.has(habit.id))
}

export const getAvailableHabitsForGoal = (goalId: string): any[] => {
  const goal = getGoalById(goalId)
  if (!goal) return []
  
  const habits = JSON.parse(localStorage.getItem('habits') || '[]')
  return habits.filter((habit: any) => !goal.habitIds.includes(habit.id))
}
