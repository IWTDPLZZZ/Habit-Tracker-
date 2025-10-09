import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Check, X, Target, Calendar, Minus, User, Lightbulb, Heart, Activity, Sun, Moon, Menu, ThumbsUp, Clock, ToggleLeft, ToggleRight, Trophy, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import HabitForm from './HabitForm'
import GoalsSection from './GoalsSection'
import { ToastContainer } from '@/components/ui/toast'
import { 
  addPoints, 
  checkAchievementConditions, 
  addAchievement, 
  getUserProfile,
  addHabitCompletion 
} from '@/utils/gamification'
import type { ToastNotification } from '@/types/gamification'

interface Habit {
  id: string
  name: string
  description: string
  streak: number
  completed: boolean
  createdAt: string
  habitType?: 'good' | 'bad'
  frequency: 'daily' | 'weekly' | 'scheduled'
  reminder: string
  notifications: boolean
}

const HabitsPage = () => {
  const [habits, setHabits] = useState<Habit[]>([])
  const [userProfile, setUserProfile] = useState(getUserProfile())
  const [notifications, setNotifications] = useState<ToastNotification[]>([])
  const [activeTab, setActiveTab] = useState<'habits' | 'goals'>('habits')
  
  useEffect(() => {
    const storedHabits = localStorage.getItem('habits')
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits))
    } else {
      const defaultHabits: Habit[] = [
        {
          id: '1',
          name: 'Drink Water',
          description: 'Drink 8 glasses of water daily',
          streak: 5,
          completed: false,
          createdAt: '2024-01-01',
          habitType: 'good',
          frequency: 'daily',
          reminder: '09:00',
          notifications: true
        },
        {
          id: '2',
          name: 'Exercise',
          description: '30 minutes of physical activity',
          streak: 12,
          completed: true,
          createdAt: '2024-01-01',
          habitType: 'good',
          frequency: 'daily',
          reminder: '18:00',
          notifications: true
        },
        {
          id: '3',
          name: 'Read',
          description: 'Read for 20 minutes',
          streak: 8,
          completed: false,
          createdAt: '2024-01-01',
          habitType: 'good',
          frequency: 'daily',
          reminder: '20:00',
          notifications: true
        }
      ]
      setHabits(defaultHabits)
      localStorage.setItem('habits', JSON.stringify(defaultHabits))
    }
  }, [])

  const [showAddForm, setShowAddForm] = useState(false)
  const [showHabitForm, setShowHabitForm] = useState(false)
  const [newHabit, setNewHabit] = useState<{
    name: string
    description: string
    frequency: 'daily' | 'weekly' | 'scheduled'
    reminder: string
    notifications: boolean
  }>({ 
    name: '', 
    description: '', 
    frequency: 'daily',
    reminder: '',
    notifications: true
  })
  const [selectedHabitName, setSelectedHabitName] = useState('')
  const [habitType, setHabitType] = useState<'good' | 'bad' | null>(null)


  const toggleHabit = (id: string) => {
    const habit = habits.find(h => h.id === id)
    if (!habit) return

    const wasCompleted = habit.completed
    const updatedHabits = habits.map(habit => 
      habit.id === id 
        ? { ...habit, completed: !habit.completed, streak: habit.completed ? habit.streak - 1 : habit.streak + 1 }
        : habit
    )
    setHabits(updatedHabits)
    localStorage.setItem('habits', JSON.stringify(updatedHabits))

    if (!wasCompleted) {
      const updatedProfile = addPoints(10)
      setUserProfile(updatedProfile)

      addHabitCompletion(id, 10)

      const newAchievements = checkAchievementConditions(updatedProfile, id)
      
      newAchievements.forEach(achievement => {
        addAchievement(achievement)
        
        const notification: ToastNotification = {
          id: Date.now().toString(),
          type: 'achievement',
          title: '🎉 Новое достижение!',
          message: `Получено достижение "${achievement.title}"`,
          icon: achievement.icon,
          points: achievement.points,
          achievement: achievement
        }
        
        setNotifications(prev => [...prev, notification])
      })

      const pointsNotification: ToastNotification = {
        id: (Date.now() + 1).toString(),
        type: 'points',
        title: '⭐ Очки получены!',
        message: `+10 очков за выполнение "${habit.name}"`,
        points: 10
      }
      
      setNotifications(prev => [...prev, pointsNotification])
    }
  }

  const addHabit = () => {
    if (newHabit.name.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        name: newHabit.name,
        description: newHabit.description,
        frequency: newHabit.frequency,
        reminder: newHabit.reminder,
        notifications: newHabit.notifications,
        streak: 0,
        completed: false,
        createdAt: new Date().toISOString(),
        habitType: habitType || undefined
      }
      const updatedHabits = [...habits, habit]
      setHabits(updatedHabits)
      localStorage.setItem('habits', JSON.stringify(updatedHabits))
      
      setNewHabit({ 
        name: '', 
        description: '', 
        frequency: 'daily',
        reminder: '',
        notifications: true
      })
      setShowAddForm(false)
      setHabitType(null)
    }
  }

  const handleSaveHabit = (habitData: any) => {
    const habit: Habit = {
      id: Date.now().toString(),
      name: habitData.name,
      description: habitData.description || '',
      streak: 0,
      completed: false,
      createdAt: new Date().toISOString(),
      habitType: habitData.habitType,
      frequency: habitData.frequency,
      reminder: habitData.reminder,
      notifications: habitData.notifications
    }
    const updatedHabits = [...habits, habit]
    setHabits(updatedHabits)
    localStorage.setItem('habits', JSON.stringify(updatedHabits))
    setHabitType(null)
  }

  const deleteHabit = (id: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== id)
    setHabits(updatedHabits)
    localStorage.setItem('habits', JSON.stringify(updatedHabits))
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }



  return (
    <div className="min-h-screen flex bg-gray-50">
      <motion.div 
        className="w-80 bg-gray-800 text-white flex flex-col"
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">{userProfile.name}</h3>
              <p className="text-sm text-gray-400">Уровень {userProfile.level}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Очки</span>
              </div>
              <span className="text-sm font-semibold text-white">
                {userProfile.points.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Достижения</span>
              </div>
              <span className="text-sm font-semibold text-white">
                {userProfile.achievements.length}
              </span>
            </div>
            
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(userProfile.points % 1000) / 10}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 text-center">
              {1000 - (userProfile.points % 1000)} до следующего уровня
            </p>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6">
          <div className="space-y-2">
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              ВСЕ ПРИВЫЧКИ
            </h4>
            <div className="space-y-2">
              <div 
                className={`flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'habits' 
                    ? 'text-white bg-gray-700 rounded-lg px-3 py-2' 
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setActiveTab('habits')}
              >
                <Target className="w-4 h-4" />
                <span>Все Привычки</span>
              </div>
              <div 
                className={`flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'goals' 
                    ? 'text-white bg-gray-700 rounded-lg px-3 py-2' 
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setActiveTab('goals')}
              >
                <Target className="w-4 h-4" />
                <span>Цели</span>
              </div>
              <Link to="/achievements" className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
                <Trophy className="w-4 h-4" />
                <span>Достижения</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              ВРЕМЯ ДНЯ
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-400 hover:text-blue-300 cursor-pointer">
                <Sun className="w-4 h-4" />
                <span>Утро</span>
              </div>
              <div className="flex items-center gap-2 text-white cursor-pointer">
                <Sun className="w-4 h-4" />
                <span>День</span>
                <span className="text-xs text-gray-400">• now</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
                <Moon className="w-4 h-4" />
                <span>Вечер</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              НАСТРОЙКИ
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
                <Heart className="w-4 h-4" />
                <span>Режим Каникулы</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
                <Target className="w-4 h-4" />
                <span>Оплата</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
                <Activity className="w-4 h-4" />
                <span>Настройки Приложения</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
                <Lightbulb className="w-4 h-4" />
                <span>Материалы</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700">
          <Button 
            onClick={() => {
              if (activeTab === 'habits') {
                setShowAddForm(true)
              } else {
              }
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {activeTab === 'habits' ? '+ Добавить привычку' : '+ Добавить цель'}
          </Button>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col">
      <motion.header 
          className="bg-white border-b border-gray-200 p-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select className="px-3 py-2 border border-gray-300 rounded-lg">
                <option>Сегодня</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Grid</span>
                <span className="text-sm text-gray-600">List</span>
                <Activity className="w-4 h-4 text-gray-600" />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.header>

        <div className="flex-1 p-8">
          {activeTab === 'goals' ? (
            <GoalsSection onGoalUpdate={() => {
              setUserProfile(getUserProfile())
            }} />
          ) : habits.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8 space-y-4">
                <div className="w-80 h-20 bg-gray-200 rounded-xl flex items-center gap-4 p-4 mx-auto">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🧘</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="w-80 h-20 bg-gray-200 rounded-xl flex items-center gap-4 p-4 mx-auto">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏃</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                  </div>
          </div>
        </div>

              <h2 className="text-2xl font-bold mb-4">Welcome to Journal</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Journal makes your habit progress visible day by day. It's empty now, but your journey can start with a single habit.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setHabitType('good')
                    setShowHabitForm(true)
                  }}
                >
                  <ThumbsUp className="w-5 h-5 mr-2" />
                  Good Habit
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => {
                    setHabitType('bad')
                    setShowHabitForm(true)
                  }}
                >
                  <Minus className="w-5 h-5 mr-2" />
                  Bad Habit
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {habits.map((habit, index) => (
        <motion.div 
                  key={habit.id}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          habit.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {habit.completed && <Check className="w-4 h-4" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-lg font-semibold ${habit.completed ? 'line-through text-gray-500' : ''}`}>
                            {habit.name}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                            habit.habitType === 'bad' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {habit.habitType === 'bad' ? (
                              <Minus className="w-3 h-3" />
                            ) : (
                              <ThumbsUp className="w-3 h-3" />
                            )}
                            {habit.habitType === 'bad' ? 'Bad' : 'Good'}
                          </span>
                        </div>
                        {habit.description && (
                          <p className="text-gray-600 text-sm mb-2">{habit.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {habit.frequency && (
                            <span>
                              {habit.frequency === 'daily' && 'Ежедневно'}
                              {habit.frequency === 'weekly' && 'Раз в неделю'}
                              {habit.frequency === 'scheduled' && 'По расписанию'}
                            </span>
                          )}
                          {habit.reminder && (
                            <span>Напоминание: {habit.reminder}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{habit.streak} days</span>
            </div>
          </div>
          
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteHabit(habit.id)}
                        className="text-red-500 hover:text-red-700 hover:border-red-500"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          </div>
          
        {activeTab === 'habits' && (
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Nothing selected</span>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Check className="w-4 h-4 mr-2" />
                  Закончить
                </Button>
                <Button variant="outline" size="sm">
                  <Activity className="w-4 h-4 mr-2" />
                  → Пропустить
                </Button>
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4 mr-2" />
                  Х Неудача
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

        {showAddForm && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowAddForm(false)
              setHabitType(null)
            }}
          >
            <motion.div 
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-6 text-center">Выберите тип привычки</h3>
              
              {!habitType ? (
                <div className="space-y-4">
                  <Button 
                    onClick={() => setHabitType('good')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-16 text-lg"
                  >
                    <Target className="w-5 h-5 mr-3" />
                    Создать хорошую привычку
                  </Button>
                  <Button 
                    onClick={() => setHabitType('bad')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white h-16 text-lg"
                  >
                    <Minus className="w-5 h-5 mr-3" />
                    Избавиться от плохой привычки
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false)
                      setHabitType(null)
                    }}
                    className="w-full"
                  >
                    Отменить
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      habitType === 'good' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {habitType === 'good' ? (
                        <Target className="w-5 h-5 text-green-600" />
                      ) : (
                        <Minus className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <h4 className="text-lg font-medium">
                      {habitType === 'good' ? 'Создать хорошую привычку' : 'Избавиться от плохой привычки'}
                    </h4>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Название привычки</label>
                    <input
                      type="text"
                      placeholder="Введите название привычки"
                      value={newHabit.name}
                      onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Описание</label>
                    <textarea
                      placeholder="Введите описание (необязательно)"
                      value={newHabit.description}
                      onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                      rows={3}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Частота выполнения</label>
                    <select
                      value={newHabit.frequency}
                      onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value as 'daily' | 'weekly' | 'scheduled' })}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="daily">Ежедневно</option>
                      <option value="weekly">Раз в неделю</option>
                      <option value="scheduled">По расписанию</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Напоминание</label>
                    <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <input
                        type="time"
                        value={newHabit.reminder}
                        onChange={(e) => setNewHabit({ ...newHabit, reminder: e.target.value })}
                        className="flex-1 border-none outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Уведомления</label>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-sm text-gray-600">Включить уведомления</span>
                      <button
                        onClick={() => setNewHabit({ ...newHabit, notifications: !newHabit.notifications })}
                        className="flex items-center"
                      >
                        {newHabit.notifications ? (
                          <ToggleRight className="w-6 h-6 text-blue-500" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => {
                        addHabit()
                        setHabitType(null)
                      }} 
                      disabled={!newHabit.name.trim()}
                      className={`flex-1 ${
                        habitType === 'good' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {habitType === 'good' ? 'Создать привычку' : 'Добавить привычку'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setHabitType(null)}
                      className="flex-1"
                    >
                      Назад
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}


      <HabitForm
        isOpen={showHabitForm}
        onClose={() => {
          setShowHabitForm(false)
          setSelectedHabitName('')
        }}
        onSave={handleSaveHabit}
        initialName={selectedHabitName}
        habitType={habitType || 'good'}
      />

      <ToastContainer 
        notifications={notifications}
        onRemoveNotification={removeNotification}
      />
    </div>
  )
}

export default HabitsPage
