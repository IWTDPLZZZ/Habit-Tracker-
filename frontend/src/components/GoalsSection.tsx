import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Target, 
  Plus, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Check,
  Edit3,
  Trash2,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import GoalForm from './GoalForm'
import { 
  getGoals, 
  getGoalProgress,
  deleteGoal,
  addHabitToGoal,
  removeHabitFromGoal
} from '@/utils/gamification'
import type { Goal } from '@/types/gamification'

interface GoalsSectionProps {
  onGoalUpdate: () => void
}

const GoalsSection = ({ onGoalUpdate }: GoalsSectionProps) => {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null)
  const [showAddHabit, setShowAddHabit] = useState<string | null>(null)

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = () => {
    const goalsData = getGoals()
    setGoals(goalsData)
  }

  const handleGoalSave = (_goal: Goal) => {
    loadGoals()
    onGoalUpdate()
  }

  const handleGoalDelete = (_goalId: string) => {
    loadGoals()
    onGoalUpdate()
  }

  const handleGoalUpdate = () => {
    loadGoals()
    onGoalUpdate()
  }

  const toggleGoalExpansion = (goalId: string) => {
    setExpandedGoal(expandedGoal === goalId ? null : goalId)
  }

  const handleAddHabit = (goalId: string, habitId: string) => {
    addHabitToGoal(goalId, habitId)
    handleGoalUpdate()
    setShowAddHabit(null)
  }

  const handleRemoveHabit = (goalId: string, habitId: string) => {
    removeHabitFromGoal(goalId, habitId)
    handleGoalUpdate()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    })
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-yellow-500'
    if (progress >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const habits = JSON.parse(localStorage.getItem('habits') || '[]')

  if (goals.length === 0) {
    return (
      <motion.div 
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">У вас пока нет целей</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Создайте свою первую цель и свяжите её с привычками для отслеживания прогресса
          </p>
          
          <Button 
            onClick={() => setShowGoalForm(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Создать первую цель
          </Button>
        </div>

        <GoalForm
          isOpen={showGoalForm}
          onClose={() => setShowGoalForm(false)}
          onSave={handleGoalSave}
        />
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">Мои цели</h2>
          <span className="text-sm text-gray-500">({goals.length})</span>
        </div>
        <Button 
          onClick={() => setShowGoalForm(true)}
          size="sm"
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="w-4 h-4 mr-1" />
          Создать цель
        </Button>
      </div>

      <div className="space-y-4">
        {goals.map((goal, index) => {
          const progress = getGoalProgress(goal.id)
          const goalHabits = habits.filter((habit: any) => goal.habitIds.includes(habit.id))
          const isExpanded = expandedGoal === goal.id

          return (
            <motion.div 
              key={goal.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                      {goal.completed && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          <Check className="w-3 h-3" />
                          Завершено
                        </div>
                      )}
                    </div>
                    {goal.description && (
                      <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>До {formatDate(goal.targetDate)}</span>
                      </div>
                      {progress && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{progress.daysRemaining} дней</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleGoalExpansion(goal.id)}
                      className="text-blue-500 hover:text-blue-700 hover:border-blue-500"
                    >
                      {isExpanded ? 'Свернуть' : 'Подробнее'}
                    </Button>
                  </div>
                </div>

                {progress && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Прогресс</span>
                      <span className="text-sm text-gray-500">
                        {progress.completedHabits}/{progress.totalHabits} привычек
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress.averageProgress)}`}
                        style={{ width: `${Math.min(progress.averageProgress, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {Math.round(progress.averageProgress)}% выполнено
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <TrendingUp className="w-3 h-3" />
                        <span>Средний прогресс</span>
                      </div>
                    </div>
                  </div>
                )}

                {isExpanded && (
                  <motion.div 
                    className="space-y-4 pt-4 border-t border-gray-200"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700">Связанные привычки</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddHabit(goal.id)}
                          className="text-blue-500 hover:text-blue-700 hover:border-blue-500"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Добавить
                        </Button>
                      </div>
                      
                      {goalHabits.length === 0 ? (
                        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                          <Users className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">Нет связанных привычек</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {goalHabits.map((habit: any) => (
                            <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  habit.completed ? 'bg-green-500' : 'bg-gray-300'
                                }`} />
                                <div>
                                  <p className={`text-sm font-medium ${
                                    habit.completed ? 'text-green-700' : 'text-gray-700'
                                  }`}>
                                    {habit.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Серия: {habit.streak} дней
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveHabit(goal.id, habit.id)}
                                className="text-red-500 hover:text-red-700 hover:border-red-500"
                              >
                                Удалить
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log('Edit goal:', goal.id)
                        }}
                        className="text-blue-500 hover:text-blue-700 hover:border-blue-500"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Редактировать
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Вы уверены, что хотите удалить эту цель?')) {
                            deleteGoal(goal.id)
                            handleGoalDelete(goal.id)
                          }
                        }}
                        className="text-red-500 hover:text-red-700 hover:border-red-500"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <GoalForm
        isOpen={showGoalForm}
        onClose={() => setShowGoalForm(false)}
        onSave={handleGoalSave}
      />

      {showAddHabit && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAddHabit(null)}
        >
          <motion.div 
            className="bg-white rounded-2xl w-full max-w-md p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Добавить привычку к цели</h3>
            
            {habits.filter((habit: any) => !goals.find(g => g.id === showAddHabit)?.habitIds.includes(habit.id)).length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">Нет доступных привычек</p>
                <p className="text-xs text-gray-400">Создайте новые привычки</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {habits
                  .filter((habit: any) => !goals.find(g => g.id === showAddHabit)?.habitIds.includes(habit.id))
                  .map((habit: any) => (
                    <div key={habit.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{habit.name}</p>
                        <p className="text-xs text-gray-500">{habit.description}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddHabit(showAddHabit, habit.id)}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Добавить
                      </Button>
                    </div>
                  ))}
              </div>
            )}
            
            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowAddHabit(null)}
                className="flex-1"
              >
                Отменить
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default GoalsSection
