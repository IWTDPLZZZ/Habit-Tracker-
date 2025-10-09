import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, X, Calendar, FileText, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createGoal } from '@/utils/gamification'
import type { Goal } from '@/types/gamification'

interface GoalFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (goal: Goal) => void
}

const GoalForm = ({ isOpen, onClose, onSave }: GoalFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: '',
    habitIds: [] as string[]
  })

  const [availableHabits, setAvailableHabits] = useState<any[]>([])
  const [selectedHabits, setSelectedHabits] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      const habits = JSON.parse(localStorage.getItem('habits') || '[]')
      setAvailableHabits(habits)
      
      const defaultDate = new Date()
      defaultDate.setMonth(defaultDate.getMonth() + 1)
      setFormData(prev => ({
        ...prev,
        targetDate: defaultDate.toISOString().split('T')[0]
      }))
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) return

    const goal = createGoal({
      title: formData.title.trim(),
      description: formData.description.trim(),
      targetDate: formData.targetDate,
      category: formData.category.trim() || undefined,
      habitIds: selectedHabits
    })

    onSave(goal)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      targetDate: '',
      category: '',
      habitIds: []
    })
    setSelectedHabits([])
    onClose()
  }

  const toggleHabitSelection = (habitId: string) => {
    setSelectedHabits(prev => 
      prev.includes(habitId) 
        ? prev.filter(id => id !== habitId)
        : [...prev, habitId]
    )
  }

  if (!isOpen) return null

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <motion.div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">Создать новую цель</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название цели *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Например: Подготовиться к марафону"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Опишите свою цель подробнее..."
                rows={3}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата окончания *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Например: Здоровье, Образование"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Связать с привычками
            </label>
            
            {availableHabits.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">У вас пока нет привычек</p>
                <p className="text-xs text-gray-400">Создайте привычки в разделе "Привычки"</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {availableHabits.map((habit) => (
                  <div 
                    key={habit.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedHabits.includes(habit.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleHabitSelection(habit.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedHabits.includes(habit.id)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedHabits.includes(habit.id) && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{habit.name}</p>
                        {habit.description && (
                          <p className="text-xs text-gray-500">{habit.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Серия: {habit.streak} дней
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {selectedHabits.length > 0 && (
              <div className="mt-3 text-sm text-blue-600">
                Выбрано привычек: {selectedHabits.length}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button 
              type="submit"
              disabled={!formData.title.trim() || !formData.targetDate}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              <Target className="w-4 h-4 mr-2" />
              Создать цель
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
            >
              Отменить
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default GoalForm




