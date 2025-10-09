import { motion } from 'framer-motion'
import { Lock, CheckCircle } from 'lucide-react'
import type { Achievement, UserAchievement } from '@/types/gamification'
import { isAchievementEarned, getAchievementProgress } from '@/utils/gamification'

interface AchievementCardProps {
  achievement: Achievement
  userAchievements: UserAchievement[]
  onClick?: () => void
  showProgress?: boolean
}

const AchievementCard = ({ 
  achievement, 
  onClick,
  showProgress = true 
}: AchievementCardProps) => {
  const isEarned = isAchievementEarned(achievement.id)
  const progress = getAchievementProgress(achievement)
  
  const getRarityColor = () => {
    switch (achievement.rarity) {
      case 'common':
        return 'border-gray-300 bg-gray-50'
      case 'rare':
        return 'border-blue-300 bg-blue-50'
      case 'epic':
        return 'border-purple-300 bg-purple-50'
      case 'legendary':
        return 'border-yellow-300 bg-yellow-50'
      default:
        return 'border-gray-300 bg-gray-50'
    }
  }

  const getRarityGlow = () => {
    switch (achievement.rarity) {
      case 'rare':
        return 'shadow-blue-200'
      case 'epic':
        return 'shadow-purple-200'
      case 'legendary':
        return 'shadow-yellow-200'
      default:
        return 'shadow-gray-200'
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
        ${isEarned ? getRarityColor() : 'border-gray-200 bg-gray-100'}
        ${isEarned ? `shadow-lg ${getRarityGlow()}` : 'shadow-sm'}
        ${onClick ? 'hover:shadow-md' : ''}
      `}
    >
      <div className="absolute top-2 right-2">
        {isEarned ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <Lock className="w-5 h-5 text-gray-400" />
        )}
      </div>

      <div className="text-center mb-3">
        <div className={`
          w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl
          ${isEarned ? 'bg-white shadow-md' : 'bg-gray-200'}
        `}>
          <span className={isEarned ? '' : 'grayscale opacity-50'}>
            {achievement.icon}
          </span>
        </div>
      </div>

      <div className="text-center mb-3">
        <h3 className={`font-semibold text-sm mb-1 ${isEarned ? 'text-gray-900' : 'text-gray-500'}`}>
          {achievement.title}
        </h3>
        <p className={`text-xs ${isEarned ? 'text-gray-600' : 'text-gray-400'}`}>
          {achievement.description}
        </p>
      </div>

      {showProgress && !isEarned && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Прогресс</span>
            <span>{progress.current}/{progress.max}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-blue-500 h-2 rounded-full"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-xs text-yellow-600">⭐</span>
          <span className={`text-xs font-medium ${isEarned ? 'text-yellow-700' : 'text-gray-500'}`}>
            {achievement.points}
          </span>
        </div>
        <span className={`
          text-xs px-2 py-1 rounded-full font-medium
          ${isEarned ? getRarityBadgeColor(achievement.rarity) : 'bg-gray-200 text-gray-500'}
        `}>
          {getRarityText(achievement.rarity)}
        </span>
      </div>
    </motion.div>
  )
}

const getRarityBadgeColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'bg-gray-100 text-gray-700'
    case 'rare':
      return 'bg-blue-100 text-blue-700'
    case 'epic':
      return 'bg-purple-100 text-purple-700'
    case 'legendary':
      return 'bg-yellow-100 text-yellow-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getRarityText = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'Обычное'
    case 'rare':
      return 'Редкое'
    case 'epic':
      return 'Эпическое'
    case 'legendary':
      return 'Легендарное'
    default:
      return 'Обычное'
  }
}

export default AchievementCard
