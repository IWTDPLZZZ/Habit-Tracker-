import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  Plus,
  Clock,
  Target,
  Heart,
  Brain,
  X,
  Lightbulb
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  showGoalSelection?: boolean
}

interface SuggestedHabit {
  id: string
  name: string
  description: string
  category: string
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeRequired: string
}

interface GoalCategory {
  id: string
  name: string
  emoji: string
  description: string
}

interface ExistingHabit {
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

const HabitCoach = () => {
  const [existingHabits, setExistingHabits] = useState<ExistingHabit[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [suggestedHabits, setSuggestedHabits] = useState<SuggestedHabit[]>([])
  const [showHabitTips, setShowHabitTips] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const goalCategories: GoalCategory[] = [
    {
      id: 'health',
      name: 'Health',
      emoji: '🏃',
      description: 'Physical fitness, nutrition, and wellness'
    },
    {
      id: 'productivity',
      name: 'Productivity',
      emoji: '💻',
      description: 'Work efficiency, time management, and focus'
    },
    {
      id: 'balance',
      name: 'Balance',
      emoji: '⚖️',
      description: 'Work-life balance, stress management, and mindfulness'
    }
  ]

  const generateInitialMessage = (existingHabits: ExistingHabit[]): string => {
    let baseMessage = "🤖 Hello! I'm your AI habit coach. I'm here to help you build better habits and achieve your goals."
    
    if (existingHabits.length > 0) {
      const habitExamples = existingHabits.slice(0, 3).map(habit => `'${habit.name}'`).join(', ')
      baseMessage += ` I can see you already have some great habits like ${habitExamples}. Would you like to add similar ones or explore different areas?`
    }
    
    baseMessage += " Let's start by selecting a goal category that interests you the most:"
    return baseMessage
  }

  useEffect(() => {
    const storedHabits = localStorage.getItem('habits')
    if (storedHabits) {
      const habits: ExistingHabit[] = JSON.parse(storedHabits)
      setExistingHabits(habits)
      
      const initialMessage: Message = {
        id: '1',
        type: 'assistant',
        content: generateInitialMessage(habits),
        timestamp: new Date(),
        showGoalSelection: true
      }
      setMessages([initialMessage])
    } else {
      const initialMessage: Message = {
        id: '1',
        type: 'assistant',
        content: generateInitialMessage([]),
        timestamp: new Date(),
        showGoalSelection: true
      }
      setMessages([initialMessage])
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateSuggestedHabits = (goalCategory: string) => {
    const habitSuggestions: Record<string, SuggestedHabit[]> = {
      health: [
        {
          id: 'h1',
          name: 'Morning Workout',
          description: 'Start your day with 30 minutes of exercise',
          category: 'Health',
          icon: '💪',
          difficulty: 'medium',
          timeRequired: '30 min'
        },
        {
          id: 'h2',
          name: 'Daily Steps',
          description: 'Walk 10,000 steps every day',
          category: 'Health',
          icon: '🚶',
          difficulty: 'easy',
          timeRequired: '45 min'
        },
        {
          id: 'h3',
          name: 'Drink Water',
          description: 'Drink 8 glasses of water daily',
          category: 'Health',
          icon: '💧',
          difficulty: 'easy',
          timeRequired: '2 min'
        }
      ],
      productivity: [
        {
          id: 'p1',
          name: 'Deep Work Sessions',
          description: 'Focus on important tasks for 2 hours daily',
          category: 'Productivity',
          icon: '🎯',
          difficulty: 'medium',
          timeRequired: '2 hours'
        },
        {
          id: 'p2',
          name: 'Daily Planning',
          description: 'Plan your day every morning',
          category: 'Productivity',
          icon: '📋',
          difficulty: 'easy',
          timeRequired: '10 min'
        },
        {
          id: 'p3',
          name: 'Email Time Blocks',
          description: 'Check emails only at specific times',
          category: 'Productivity',
          icon: '📧',
          difficulty: 'medium',
          timeRequired: '30 min'
        }
      ],
      balance: [
        {
          id: 'b1',
          name: 'Daily Meditation',
          description: 'Meditate for 10 minutes each morning',
          category: 'Balance',
          icon: '🧘',
          difficulty: 'easy',
          timeRequired: '10 min'
        },
        {
          id: 'b2',
          name: 'Gratitude Journal',
          description: 'Write down 3 things you\'re grateful for',
          category: 'Balance',
          icon: '📝',
          difficulty: 'easy',
          timeRequired: '5 min'
        },
        {
          id: 'b3',
          name: 'Digital Detox',
          description: 'No screens 1 hour before bedtime',
          category: 'Balance',
          icon: '📱',
          difficulty: 'hard',
          timeRequired: '1 hour'
        }
      ]
    }
    
    return habitSuggestions[goalCategory] || []
  }

  const handleGoalSelection = (goalId: string) => {
    const selectedCategory = goalCategories.find(g => g.id === goalId)
    
    if (selectedCategory) {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `${selectedCategory.emoji} ${selectedCategory.name}`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, userMessage])
      setIsTyping(true)
      
      setTimeout(() => {
        const suggestions = generateSuggestedHabits(goalId)
        setSuggestedHabits(suggestions)
        
        let responseContent = `🤖 Great choice! I've prepared some ${selectedCategory.name.toLowerCase()} habit suggestions for you. These habits are designed to help you achieve better ${selectedCategory.description.toLowerCase()}.`
        
        // Mention existing habits if any match the selected category
        if (existingHabits.length > 0) {
          const categoryKeywords: Record<string, string[]> = {
            health: ['exercise', 'workout', 'water', 'sleep', 'run', 'walk', 'fitness'],
            productivity: ['work', 'plan', 'focus', 'study', 'read', 'write'],
            balance: ['meditat', 'journal', 'relax', 'gratitude', 'mindful']
          }
          
          const keywords = categoryKeywords[goalId] || []
          const relatedHabits = existingHabits.filter(habit => 
            keywords.some(keyword => habit.name.toLowerCase().includes(keyword))
          )
          
          if (relatedHabits.length > 0) {
            responseContent += ` I notice you already have similar habits like '${relatedHabits[0].name}' - that's awesome! These new suggestions will complement your existing routine perfectly.`
          }
        }
        
        responseContent += ' Choose any that resonate with you:'
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: responseContent,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, assistantMessage])
        setIsTyping(false)
      }, 1500)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "🤖 That's interesting! I'd love to help you build better habits. Feel free to ask me anything about habit formation, or we can explore more specific areas if you'd like.",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleAddHabit = (habit: SuggestedHabit) => {
    const existingHabits = JSON.parse(localStorage.getItem('habits') || '[]')
    const newHabit = {
      id: Date.now().toString(),
      name: habit.name,
      description: habit.description,
      streak: 0,
      completed: false,
      createdAt: new Date().toISOString(),
      habitType: 'good',
      frequency: 'daily',
      reminder: '',
      notifications: true
    }
    
    const updatedHabits = [...existingHabits, newHabit]
    localStorage.setItem('habits', JSON.stringify(updatedHabits))
    
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `🤖 Excellent choice! I've added "${habit.name}" to your habits dashboard. This is a ${habit.difficulty} habit that will take about ${habit.timeRequired} each day. You can now track it in your Dashboard (/app). Would you like to add another habit?`,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, confirmationMessage])
    
    setSuggestedHabits(prev => prev.filter(h => h.id !== habit.id))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      <motion.div 
        className="w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200 flex flex-col"
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Habit Coach</h3>
              <p className="text-sm text-gray-500">Your personal guide</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Quick Actions
          </h4>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/habits">
                <Target className="w-4 h-4 mr-2" />
                View My Habits
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Heart className="w-4 h-4 mr-2" />
              My Progress
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setShowHabitTips(true)}
            >
              <Brain className="w-4 h-4 mr-2" />
              Habit Tips
            </Button>
          </div>
        </div>

        {suggestedHabits.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Suggested Habits
            </h4>
            <div className="space-y-2">
              {suggestedHabits.map((habit) => (
                <div key={habit.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{habit.icon}</span>
                    <span className="text-sm font-medium">{habit.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{habit.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(habit.difficulty)}`}>
                      {habit.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">{habit.timeRequired}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 border-t border-gray-200 mt-auto">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col">
        <motion.header 
          className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-6"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">AI Habit Coach</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Online
            </div>
          </div>
        </motion.header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-2xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-gray-500' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-lg">🤖</span>
                    )}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gray-500 text-white'
                      : 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    
                    {message.showGoalSelection && (
                      <div className="mt-4 space-y-2">
                        {goalCategories.map((goal) => (
                          <Button
                            key={goal.id}
                            onClick={() => handleGoalSelection(goal.id)}
                            className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200"
                            size="sm"
                          >
                            <span className="text-lg mr-2">{goal.emoji}</span>
                            <div className="text-left">
                              <div className="font-medium">{goal.name}</div>
                              <div className="text-xs text-gray-600">{goal.description}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-gray-100' : 'text-purple-100'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {suggestedHabits.length > 0 && (
          <motion.div 
            className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-6"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Habits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestedHabits.map((habit) => (
                <motion.div
                  key={habit.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{habit.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{habit.name}</h4>
                      <p className="text-sm text-gray-600">{habit.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">{habit.category}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(habit.difficulty)}`}>
                      {habit.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {habit.timeRequired}
                    </span>
                    <Button 
                      size="sm" 
                      onClick={() => handleAddHabit(habit)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add to my habits
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about building habits..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {showHabitTips && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowHabitTips(false)}
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
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Habit Building Tips</h3>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowHabitTips(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-green-800 mb-2">Start Small</h4>
                    <p className="text-green-700">
                      Begin with tiny habits that take less than 2 minutes. Want to read more? Start with just one page a day. 
                      Small wins build momentum and make habits stick easier.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-blue-800 mb-2">Stack Your Habits</h4>
                    <p className="text-blue-700">
                      Link new habits to existing routines. "After I pour my morning coffee, I will write down one thing I'm grateful for." 
                      This creates automatic triggers for your new habits.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-purple-800 mb-2">Design Your Environment</h4>
                    <p className="text-purple-700">
                      Make good habits obvious and bad habits invisible. Put your workout clothes next to your bed. 
                      Hide your phone to avoid endless scrolling. Your environment shapes your behavior.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-orange-800 mb-2">Focus on Identity</h4>
                    <p className="text-orange-700">
                      Don't just set goals, become the type of person who does these things. Instead of "I want to run a marathon," 
                      think "I am a runner." Every action is a vote for the person you want to become.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button 
                onClick={() => setShowHabitTips(false)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Got it! Let's build some habits
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default HabitCoach