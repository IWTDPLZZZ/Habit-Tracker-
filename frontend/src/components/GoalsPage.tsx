import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Target, 
  Plus, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Filter,
  Search,
  SortAsc,
  SortDesc
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import GoalCard from './GoalCard'
import GoalForm from './GoalForm'
import { 
  getGoals, 
  getGoalProgress 
} from '@/utils/gamification'
import type { Goal } from '@/types/gamification'

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'progress' | 'title'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterBy, setFilterBy] = useState<'all' | 'active' | 'completed'>('all')

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = () => {
    const goalsData = getGoals()
    setGoals(goalsData)
  }

  const handleGoalSave = (_goal: Goal) => {
    loadGoals()
  }

  const handleGoalDelete = (_goalId: string) => {
    loadGoals()
  }

  const handleGoalUpdate = () => {
    loadGoals()
  }

  const filteredAndSortedGoals = goals
    .filter(goal => {
      if (filterBy === 'active' && goal.completed) return false
      if (filterBy === 'completed' && !goal.completed) return false
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          goal.title.toLowerCase().includes(searchLower) ||
          goal.description.toLowerCase().includes(searchLower) ||
          (goal.category && goal.category.toLowerCase().includes(searchLower))
        )
      }
      
      return true
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
          break
        case 'progress':
          const progressA = getGoalProgress(a.id)?.averageProgress || 0
          const progressB = getGoalProgress(b.id)?.averageProgress || 0
          comparison = progressA - progressB
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const totalGoals = goals.length
  const completedGoals = goals.filter(g => g.completed).length
  const activeGoals = totalGoals - completedGoals
  const averageProgress = goals.length > 0 
    ? goals.reduce((sum, goal) => {
        const progress = getGoalProgress(goal.id)
        return sum + (progress?.averageProgress || 0)
      }, 0) / goals.length
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.header 
        className="bg-white border-b border-gray-200 p-6"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Target className="w-8 h-8 text-blue-500" />
                Мои цели
              </h1>
              <p className="text-gray-600 mt-1">Отслеживайте прогресс достижения ваших целей</p>
            </div>
            <Button 
              onClick={() => setShowGoalForm(true)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать цель
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto p-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalGoals}</p>
                <p className="text-sm text-gray-600">Всего целей</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedGoals}</p>
                <p className="text-sm text-gray-600">Завершено</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeGoals}</p>
                <p className="text-sm text-gray-600">В процессе</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{Math.round(averageProgress)}%</p>
                <p className="text-sm text-gray-600">Средний прогресс</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск целей..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as 'all' | 'active' | 'completed')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Все цели</option>
                <option value="active">В процессе</option>
                <option value="completed">Завершённые</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'progress' | 'title')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">По дате</option>
                <option value="progress">По прогрессу</option>
                <option value="title">По названию</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.div>

        {filteredAndSortedGoals.length === 0 ? (
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
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || filterBy !== 'all' ? 'Цели не найдены' : 'У вас пока нет целей'}
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm || filterBy !== 'all' 
                  ? 'Попробуйте изменить параметры поиска или фильтрации'
                  : 'Создайте свою первую цель и начните отслеживать прогресс!'
                }
              </p>
            </div>
            
            {!searchTerm && filterBy === 'all' && (
              <Button 
                onClick={() => setShowGoalForm(true)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Создать первую цель
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {filteredAndSortedGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <GoalCard
                  goal={goal}
                  onGoalUpdate={handleGoalUpdate}
                  onGoalDelete={handleGoalDelete}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <GoalForm
        isOpen={showGoalForm}
        onClose={() => setShowGoalForm(false)}
        onSave={handleGoalSave}
      />
    </div>
  )
}

export default GoalsPage
