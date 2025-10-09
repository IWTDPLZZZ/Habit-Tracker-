import { motion } from 'framer-motion'
import { Trophy, Star, Target, TrendingUp } from 'lucide-react'
import { getUserProfile, getNextLevelInfo } from '@/utils/gamification'

const DashboardStats = () => {
  const userProfile = getUserProfile()
  const levelInfo = getNextLevelInfo()

  const stats = [
    {
      title: 'Общие очки',
      value: userProfile.points.toLocaleString(),
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Достижения',
      value: userProfile.achievements.length,
      icon: Trophy,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Выполнено привычек',
      value: userProfile.totalHabitsCompleted,
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Текущий уровень',
      value: userProfile.level,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  ]

  return (
    <div className="space-y-6">
      <motion.div 
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Прогресс уровня</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">Уровень {userProfile.level}</div>
            <div className="text-sm text-gray-500">
              {levelInfo.pointsToNext} очков до следующего уровня
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelInfo.progress}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            className={`bg-white rounded-xl p-4 border ${stat.borderColor} shadow-sm`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default DashboardStats
