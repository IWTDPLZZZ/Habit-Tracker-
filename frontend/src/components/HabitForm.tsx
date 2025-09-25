import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  Target, 
  Clock,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HabitFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (habit: any) => void
  initialName?: string
  habitType?: 'good' | 'bad'
}

const HabitForm = ({ isOpen, onClose, onSave, initialName = '', habitType = 'good' }: HabitFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    reminder: '',
    notifications: true
  })


  useEffect(() => {
    if (initialName) {
      setFormData(prev => ({ ...prev, name: initialName }))
    }
  }, [initialName])

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        description: '',
        frequency: 'daily',
        reminder: '',
        notifications: true
      })
    }
  }, [isOpen])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }


  const validateForm = () => {
    if (!formData.name.trim()) {
      return false
    }
    return true
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }
    
    const habit = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      frequency: formData.frequency,
      reminder: formData.reminder,
      notifications: formData.notifications,
      habitType: habitType,
      streak: 0,
      completed: false,
      createdAt: new Date().toISOString()
    }
    onSave(habit)
    onClose()
  }

  if (!isOpen) return null

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Создание привычки</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-3">
            <div className={`flex items-center gap-3 p-4 rounded-lg border ${
              habitType === 'good' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                habitType === 'good' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <Target className={`w-4 h-4 ${
                  habitType === 'good' ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
              <span className={`font-medium ${
                habitType === 'good' ? 'text-green-800' : 'text-red-800'
              }`}>
                {habitType === 'good' ? 'Создать хорошую привычку' : 'Создать плохую привычку'}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Название привычки</label>
            <input
              type="text"
              placeholder="Введите название привычки"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Описание</label>
            <textarea
              placeholder="Введите описание (необязательно)"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Частота выполнения</label>
            <select
              value={formData.frequency}
              onChange={(e) => handleInputChange('frequency', e.target.value)}
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
                value={formData.reminder}
                onChange={(e) => handleInputChange('reminder', e.target.value)}
                className="flex-1 border-none outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Уведомления</label>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-600">Включить уведомления</span>
              <button
                onClick={() => handleInputChange('notifications', !formData.notifications)}
                className="flex items-center"
              >
                {formData.notifications ? (
                  <ToggleRight className="w-6 h-6 text-blue-500" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
          >
            Назад
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.name.trim()}
            className={`${
              habitType === 'good' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            } text-white disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            {habitType === 'good' ? 'Создать хорошую привычку' : 'Создать плохую привычку'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default HabitForm
