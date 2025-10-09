import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Target, 
  Calendar, 
  Plus, 
  X, 
  Check, 
  Clock, 
  TrendingUp,
  Edit3,
  Trash2,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  getGoalProgress, 
  removeHabitFromGoal, 
  getAvailableHabitsForGoal,
  addHabitToGoal,
  updateGoal,
  deleteGoal
} from '@/utils/gamification'
import type { Goal } from '@/types/gamification'

interface GoalCardProps {
  goal: Goal
  onGoalUpdate: () => void
  onGoalDelete: (goalId: string) => void
}

const GoalCard = ({ goal, onGoalUpdate, onGoalDelete }: GoalCardProps) => {
  const [showAddHabit, setShowAddHabit] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState({
    title: goal.title,
    description: goal.description,
    targetDate: goal.targetDate,
    category: goal.category || ''
  })

  const progress = getGoalProgress(goal.id)
  const habits = JSON.parse(localStorage.getItem('habits') || '[]')
  const goalHabits = habits.filter((habit: any) => goal.habitIds.includes(habit.id))
  const availableHabits = getAvailableHabitsForGoal(goal.id)

  const handleAddHabit = (habitId: string) => {
    addHabitToGoal(goal.id, habitId)
    onGoalUpdate()
    setShowAddHabit(false)
  }

  const handleRemoveHabit = (habitId: string) => {
    removeHabitFromGoal(goal.id, habitId)
    onGoalUpdate()
  }

  const handleSaveEdit = () => {
    updateGoal(goal.id, editingGoal)
    onGoalUpdate()
    setShowEditForm(false)
  }

  const handleDeleteGoal = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту цель?')) {
      deleteGoal(goal.id)
      onGoalDelete(goal.id)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-yellow-500'
    if (progress >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <motion.div 
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-500" />
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
              onClick={() => setShowEditForm(true)}
              className="text-blue-500 hover:text-blue-700 hover:border-blue-500"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteGoal}
              className="text-red-500 hover:text-red-700 hover:border-red-500"
            >
              <Trash2 className="w-4 h-4" />
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

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Привычки цели</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddHabit(true)}
              className="text-blue-500 hover:text-blue-700 hover:border-blue-500"
            >
              <Plus className="w-4 h-4 mr-1" />
              Добавить
            </Button>
          </div>
          
          {goalHabits.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Нет связанных привычек</p>
              <p className="text-xs text-gray-400">Добавьте привычки для отслеживания прогресса</p>
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
                    onClick={() => handleRemoveHabit(habit.id)}
                    className="text-red-500 hover:text-red-700 hover:border-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddHabit && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAddHabit(false)}
        >
          <motion.div 
            className="bg-white rounded-2xl w-full max-w-md p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Добавить привычку к цели</h3>
            
            {availableHabits.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">Нет доступных привычек</p>
                <p className="text-xs text-gray-400">Создайте новые привычки в разделе "Привычки"</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableHabits.map((habit: any) => (
                  <div key={habit.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{habit.name}</p>
                      <p className="text-xs text-gray-500">{habit.description}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddHabit(habit.id)}
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
                onClick={() => setShowAddHabit(false)}
                className="flex-1"
              >
                Отменить
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showEditForm && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowEditForm(false)}
        >
          <motion.div 
            className="bg-white rounded-2xl w-full max-w-md p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Редактировать цель</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                <input
                  type="text"
                  value={editingGoal.title}
                  onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  value={editingGoal.description}
                  onChange={(e) => setEditingGoal({ ...editingGoal, description: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата окончания</label>
                <input
                  type="date"
                  value={editingGoal.targetDate}
                  onChange={(e) => setEditingGoal({ ...editingGoal, targetDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <input
                  type="text"
                  value={editingGoal.category}
                  onChange={(e) => setEditingGoal({ ...editingGoal, category: e.target.value })}
                  placeholder="Например: Здоровье, Образование"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={handleSaveEdit}
                disabled={!editingGoal.title.trim()}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                Сохранить
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowEditForm(false)}
                className="flex-1"
              >
                Отменить
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default GoalCard




