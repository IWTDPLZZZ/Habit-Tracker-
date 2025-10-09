import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, Search, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import AchievementCard from './AchievementCard'
import type { 
  UserAchievement 
} from '@/types/gamification'
import { PREDEFINED_ACHIEVEMENTS } from '@/types/gamification'
import { getUserAchievements, getUserProfile } from '@/utils/gamification'

const AchievementsPage = () => {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [userProfile, setUserProfile] = useState(getUserProfile())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedRarity, setSelectedRarity] = useState<string>('all')

  useEffect(() => {
    const achievements = getUserAchievements()
    const profile = getUserProfile()
    setUserAchievements(achievements)
    setUserProfile(profile)
  }, [])

  const categories = [
    { id: 'all', name: 'Все', icon: '🏆' },
    { id: 'streak', name: 'Серии', icon: '🔥' },
    { id: 'milestone', name: 'Вехи', icon: '🎯' },
    { id: 'special', name: 'Особые', icon: '⭐' },
    { id: 'social', name: 'Социальные', icon: '👥' }
  ]

  const rarities = [
    { id: 'all', name: 'Все', color: 'gray' },
    { id: 'common', name: 'Обычные', color: 'gray' },
    { id: 'rare', name: 'Редкие', color: 'blue' },
    { id: 'epic', name: 'Эпические', color: 'purple' },
    { id: 'legendary', name: 'Легендарные', color: 'yellow' }
  ]

  const filteredAchievements = PREDEFINED_ACHIEVEMENTS.filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory
    const matchesRarity = selectedRarity === 'all' || achievement.rarity === selectedRarity
    
    return matchesSearch && matchesCategory && matchesRarity
  })

  const earnedAchievements = userAchievements.length
  const totalAchievements = PREDEFINED_ACHIEVEMENTS.length
  const completionPercentage = Math.round((earnedAchievements / totalAchievements) * 100)

  const topAchievements = userAchievements
    .sort((a, b) => {
      const achievementA = PREDEFINED_ACHIEVEMENTS.find(ach => ach.id === a.achievementId)
      const achievementB = PREDEFINED_ACHIEVEMENTS.find(ach => ach.id === b.achievementId)
      return (achievementB?.points || 0) - (achievementA?.points || 0)
    })
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.header 
        className="bg-white border-b border-gray-200 p-6"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/habits">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад к привычкам
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Достижения</h1>
                  <p className="text-sm text-gray-600">
                    {earnedAchievements} из {totalAchievements} получено ({completionPercentage}%)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  {userProfile.points.toLocaleString()} очков
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Уровень {userProfile.level}</div>
                <div className="text-xs text-gray-500">
                  {userProfile.points % 1000} / 1000 до следующего уровня
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto p-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Получено достижений</h3>
                <p className="text-2xl font-bold text-green-600">{earnedAchievements}</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="bg-green-500 h-2 rounded-full"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Общие очки</h3>
                <p className="text-2xl font-bold text-blue-600">{userProfile.points.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Уровень {userProfile.level}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎯</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Выполнено привычек</h3>
                <p className="text-2xl font-bold text-purple-600">{userProfile.totalHabitsCompleted}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Всего выполнений
            </div>
          </div>
        </motion.div>

        {topAchievements.length > 0 && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Топ достижения</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topAchievements.map((userAchievement) => {
                const achievement = PREDEFINED_ACHIEVEMENTS.find(a => a.id === userAchievement.achievementId)
                if (!achievement) return null
                
                return (
                  <div key={userAchievement.id} className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                        <span className="text-xl">{achievement.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-yellow-600 font-medium">
                            {achievement.points} очков
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        <motion.div 
          className="bg-white rounded-xl p-6 border border-gray-200 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск достижений..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                    ${selectedCategory === category.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {rarities.map((rarity) => (
                <button
                  key={rarity.id}
                  onClick={() => setSelectedRarity(rarity.id)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                    ${selectedRarity === rarity.id 
                      ? `bg-${rarity.color}-500 text-white` 
                      : `bg-gray-100 text-gray-700 hover:bg-gray-200`
                    }
                  `}
                >
                  {rarity.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <AchievementCard
                achievement={achievement}
                userAchievements={userAchievements}
                showProgress={true}
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredAchievements.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">Достижения не найдены</h3>
            <p className="text-gray-400">Попробуйте изменить фильтры поиска</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AchievementsPage
