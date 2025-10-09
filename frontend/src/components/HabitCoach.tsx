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
  Lightbulb,
  Check,
  CheckSquare,
  Square,
  Sparkles,
  Zap
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

interface HabitPlan {
  id: string
  name: string
  description: string
  color: string
  icon: string
  schedule: string[]
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeRequired: string
}

interface DayPlan {
  day: number
  habits: string[]
}

interface AIPlan {
  goal: string
  habits: HabitPlan[]
  schedule: DayPlan[]
  totalDays: number
}

const HabitCoach = () => {
  const [existingHabits, setExistingHabits] = useState<ExistingHabit[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [suggestedHabits, setSuggestedHabits] = useState<SuggestedHabit[]>([])
  const [showHabitTips, setShowHabitTips] = useState(false)
  const [currentMode, setCurrentMode] = useState<'chat' | 'planner'>('chat')
  const [aiPlan, setAiPlan] = useState<AIPlan | null>(null)
  const [selectedHabits, setSelectedHabits] = useState<string[]>([])
  const [showPlanCalendar, setShowPlanCalendar] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const goalCategories: GoalCategory[] = [
    {
      id: 'health',
      name: 'Здоровье',
      emoji: '🏃',
      description: 'Физическая активность, питание и здоровый образ жизни'
    },
    {
      id: 'productivity',
      name: 'Продуктивность',
      emoji: '💻',
      description: 'Эффективность работы, управление временем и концентрация'
    },
    {
      id: 'balance',
      name: 'Баланс',
      emoji: '⚖️',
      description: 'Работа и личная жизнь, управление стрессом и осознанность'
    }
  ]

  const generateInitialMessage = (existingHabits: ExistingHabit[], mode: 'chat' | 'planner'): string => {
    let baseMessage = mode === 'planner' 
      ? "🤖 Привет! Я ваш AI-планировщик привычек. Я создам для вас персональный 30-дневный план с оптимальным расписанием привычек."
      : "🤖 Привет! Я ваш ИИ-тренер по привычкам. Я здесь, чтобы помочь вам выработать лучшие привычки и достичь ваших целей."
    
    if (existingHabits.length > 0) {
      const habitExamples = existingHabits.slice(0, 3).map(habit => `'${habit.name}'`).join(', ')
      baseMessage += ` Я вижу, что у вас уже есть отличные привычки, такие как ${habitExamples}.`
      
      if (mode === 'planner') {
        baseMessage += " Новый план идеально дополнит вашу существующую рутину."
      } else {
        baseMessage += " Хотите добавить похожие или изучить другие области?"
      }
    }
    
    baseMessage += " Давайте начнем с выбора категории целей, которая вас больше всего интересует:"
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
        content: generateInitialMessage(habits, currentMode),
        timestamp: new Date(),
        showGoalSelection: true
      }
      setMessages([initialMessage])
    } else {
      const initialMessage: Message = {
        id: '1',
        type: 'assistant',
        content: generateInitialMessage([], currentMode),
        timestamp: new Date(),
        showGoalSelection: true
      }
      setMessages([initialMessage])
    }
  }, [currentMode])

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
          name: 'Утренняя зарядка',
          description: 'Начните день с 30 минут физических упражнений',
          category: 'Здоровье',
          icon: '💪',
          difficulty: 'medium',
          timeRequired: '30 мин'
        },
        {
          id: 'h2',
          name: 'Ежедневные шаги',
          description: 'Проходите 10,000 шагов каждый день',
          category: 'Здоровье',
          icon: '🚶',
          difficulty: 'easy',
          timeRequired: '45 мин'
        },
        {
          id: 'h3',
          name: 'Пить воду',
          description: 'Выпивайте 8 стаканов воды ежедневно',
          category: 'Здоровье',
          icon: '💧',
          difficulty: 'easy',
          timeRequired: '2 мин'
        }
      ],
      productivity: [
        {
          id: 'p1',
          name: 'Глубокие рабочие сессии',
          description: 'Сосредоточьтесь на важных задачах 2 часа в день',
          category: 'Продуктивность',
          icon: '🎯',
          difficulty: 'medium',
          timeRequired: '2 часа'
        },
        {
          id: 'p2',
          name: 'Ежедневное планирование',
          description: 'Планируйте свой день каждое утро',
          category: 'Продуктивность',
          icon: '📋',
          difficulty: 'easy',
          timeRequired: '10 мин'
        },
        {
          id: 'p3',
          name: 'Временные блоки для email',
          description: 'Проверяйте почту только в определенное время',
          category: 'Продуктивность',
          icon: '📧',
          difficulty: 'medium',
          timeRequired: '30 мин'
        }
      ],
      balance: [
        {
          id: 'b1',
          name: 'Ежедневная медитация',
          description: 'Медитируйте 10 минут каждое утро',
          category: 'Баланс',
          icon: '🧘',
          difficulty: 'easy',
          timeRequired: '10 мин'
        },
        {
          id: 'b2',
          name: 'Дневник благодарности',
          description: 'Записывайте 3 вещи, за которые благодарны',
          category: 'Баланс',
          icon: '📝',
          difficulty: 'easy',
          timeRequired: '5 мин'
        },
        {
          id: 'b3',
          name: 'Цифровой детокс',
          description: 'Никаких экранов за 1 час до сна',
          category: 'Баланс',
          icon: '📱',
          difficulty: 'hard',
          timeRequired: '1 час'
        }
      ]
    }
    
    return habitSuggestions[goalCategory] || []
  }

  const generateAIPlan = (goalCategory: string): AIPlan => {
    const habitPlans: Record<string, HabitPlan[]> = {
      health: [
        {
          id: 'hp1',
          name: 'Утренняя зарядка',
          description: '30 минут физических упражнений',
          color: 'bg-green-500',
          icon: '💪',
          schedule: ['daily'],
          category: 'Здоровье',
          difficulty: 'medium',
          timeRequired: '30 мин'
        },
        {
          id: 'hp2',
          name: 'Медитация',
          description: '10 минут осознанности',
          color: 'bg-blue-500',
          icon: '🧘',
          schedule: ['Пн', 'Ср', 'Пт'],
          category: 'Здоровье',
          difficulty: 'easy',
          timeRequired: '10 мин'
        },
        {
          id: 'hp3',
          name: 'Здоровое питание',
          description: 'Сбалансированные приемы пищи',
          color: 'bg-orange-500',
          icon: '🥗',
          schedule: ['daily'],
          category: 'Здоровье',
          difficulty: 'medium',
          timeRequired: '15 мин'
        },
        {
          id: 'hp4',
          name: 'Дневник здоровья',
          description: 'Запись самочувствия и активности',
          color: 'bg-purple-500',
          icon: '📝',
          schedule: ['воскресенье'],
          category: 'Здоровье',
          difficulty: 'easy',
          timeRequired: '5 мин'
        }
      ],
      productivity: [
        {
          id: 'pp1',
          name: 'Глубокие рабочие сессии',
          description: '2 часа фокусированной работы',
          color: 'bg-indigo-500',
          icon: '🎯',
          schedule: ['daily'],
          category: 'Продуктивность',
          difficulty: 'hard',
          timeRequired: '2 часа'
        },
        {
          id: 'pp2',
          name: 'Ежедневное планирование',
          description: 'Планирование дня и приоритетов',
          color: 'bg-yellow-500',
          icon: '📋',
          schedule: ['daily'],
          category: 'Продуктивность',
          difficulty: 'easy',
          timeRequired: '10 мин'
        },
        {
          id: 'pp3',
          name: 'Изучение нового',
          description: '30 минут обучения и развития',
          color: 'bg-teal-500',
          icon: '📚',
          schedule: ['Пн', 'Вт', 'Чт', 'Пт'],
          category: 'Продуктивность',
          difficulty: 'medium',
          timeRequired: '30 мин'
        },
        {
          id: 'pp4',
          name: 'Анализ недели',
          description: 'Подведение итогов и планирование',
          color: 'bg-pink-500',
          icon: '📊',
          schedule: ['воскресенье'],
          category: 'Продуктивность',
          difficulty: 'medium',
          timeRequired: '20 мин'
        }
      ],
      balance: [
        {
          id: 'bp1',
          name: 'Медитация',
          description: '10 минут осознанности',
          color: 'bg-blue-500',
          icon: '🧘',
          schedule: ['daily'],
          category: 'Баланс',
          difficulty: 'easy',
          timeRequired: '10 мин'
        },
        {
          id: 'bp2',
          name: 'Дневник благодарности',
          description: 'Запись благодарностей',
          color: 'bg-green-500',
          icon: '🙏',
          schedule: ['daily'],
          category: 'Баланс',
          difficulty: 'easy',
          timeRequired: '5 мин'
        },
        {
          id: 'bp3',
          name: 'Цифровой детокс',
          description: 'Отдых от экранов',
          color: 'bg-red-500',
          icon: '📱',
          schedule: ['Сб', 'воскресенье'],
          category: 'Баланс',
          difficulty: 'hard',
          timeRequired: '2 часа'
        },
        {
          id: 'bp4',
          name: 'Природа и свежий воздух',
          description: 'Прогулка на свежем воздухе',
          color: 'bg-emerald-500',
          icon: '🌳',
          schedule: ['Сб', 'воскресенье'],
          category: 'Баланс',
          difficulty: 'easy',
          timeRequired: '30 мин'
        }
      ]
    }

    const habits = habitPlans[goalCategory] || []
    const schedule: DayPlan[] = []
    
    for (let day = 1; day <= 30; day++) {
      const dayHabits: string[] = []
      
      habits.forEach(habit => {
        if (habit.schedule.includes('daily')) {
          dayHabits.push(habit.id)
        } else {
          const dayOfWeek = ['воскресенье', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][day % 7]
          if (habit.schedule.includes(dayOfWeek)) {
            dayHabits.push(habit.id)
          }
        }
      })
      
      schedule.push({ day, habits: dayHabits })
    }

    return {
      goal: goalCategory,
      habits,
      schedule,
      totalDays: 30
    }
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
        if (currentMode === 'planner') {
          const plan = generateAIPlan(goalId)
          setAiPlan(plan)
          setShowPlanCalendar(true)
          
          const responseContent = `🤖 Отлично! Я создал для вас персональный 30-дневный план привычек в категории "${selectedCategory.name.toLowerCase()}". Этот план включает ${plan.habits.length} привычек с оптимальным расписанием для достижения ваших целей.`
          
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: responseContent,
            timestamp: new Date()
          }
          
          setMessages(prev => [...prev, assistantMessage])
        } else {
          const suggestions = generateSuggestedHabits(goalId)
          setSuggestedHabits(suggestions)
          
          let responseContent = `🤖 Отличный выбор! Я подготовил для вас несколько предложений по привычкам в категории "${selectedCategory.name.toLowerCase()}". Эти привычки помогут вам достичь лучшего ${selectedCategory.description.toLowerCase()}.`
          
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
              responseContent += ` Я заметил, что у вас уже есть похожие привычки, такие как '${relatedHabits[0].name}' - это замечательно! Эти новые предложения идеально дополнят вашу существующую рутину.`
            }
          }
          
          responseContent += ' Выберите те, которые вам подходят:'
          
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: responseContent,
            timestamp: new Date()
          }
          
          setMessages(prev => [...prev, assistantMessage])
        }
        
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
        content: "🤖 Это интересно! Я буду рад помочь вам выработать лучшие привычки. Спрашивайте меня о чем угодно, связанном с формированием привычек, или мы можем изучить более конкретные области, если хотите.",
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
      content: `🤖 Отличный выбор! Я добавил "${habit.name}" в вашу панель привычек. Это ${habit.difficulty === 'easy' ? 'легкая' : habit.difficulty === 'medium' ? 'средняя' : 'сложная'} привычка, которая займет около ${habit.timeRequired} каждый день. Теперь вы можете отслеживать её в своей панели (/app). Хотите добавить еще одну привычку?`,
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

  const handleHabitSelection = (habitId: string) => {
    setSelectedHabits(prev => 
      prev.includes(habitId) 
        ? prev.filter(id => id !== habitId)
        : [...prev, habitId]
    )
  }

  const handleAcceptAllHabits = () => {
    if (!aiPlan) return
    
    const existingHabits = JSON.parse(localStorage.getItem('habits') || '[]')
    const newHabits = aiPlan.habits.map(habit => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: habit.name,
      description: habit.description,
      streak: 0,
      completed: false,
      createdAt: new Date().toISOString(),
      habitType: 'good' as const,
      frequency: habit.schedule.includes('daily') ? 'daily' as const : 'weekly' as const,
      reminder: '',
      notifications: true
    }))
    
    const updatedHabits = [...existingHabits, ...newHabits]
    localStorage.setItem('habits', JSON.stringify(updatedHabits))
    
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `🤖 Отлично! Я добавил все ${aiPlan.habits.length} привычек в ваш Dashboard. Теперь вы можете отслеживать их выполнение в разделе "Мои привычки" (/app). Удачи в достижении ваших целей!`,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, confirmationMessage])
    setAiPlan(null)
    setShowPlanCalendar(false)
  }

  const handleAcceptSelectedHabits = () => {
    if (!aiPlan || selectedHabits.length === 0) return
    
    const existingHabits = JSON.parse(localStorage.getItem('habits') || '[]')
    const newHabits = aiPlan.habits
      .filter(habit => selectedHabits.includes(habit.id))
      .map(habit => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: habit.name,
        description: habit.description,
        streak: 0,
        completed: false,
        createdAt: new Date().toISOString(),
        habitType: 'good' as const,
        frequency: habit.schedule.includes('daily') ? 'daily' as const : 'weekly' as const,
        reminder: '',
        notifications: true
      }))
    
    const updatedHabits = [...existingHabits, ...newHabits]
    localStorage.setItem('habits', JSON.stringify(updatedHabits))
    
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `🤖 Отлично! Я добавил ${selectedHabits.length} выбранных привычек в ваш Dashboard. Теперь вы можете отслеживать их выполнение в разделе "Мои привычки" (/app). Удачи в достижении ваших целей!`,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, confirmationMessage])
    setAiPlan(null)
    setShowPlanCalendar(false)
    setSelectedHabits([])
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
              <h3 className="font-semibold text-gray-900">ИИ-тренер по привычкам</h3>
              <p className="text-sm text-gray-500">Ваш личный помощник</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Режимы работы
          </h4>
          <div className="space-y-2">
            <Button 
              variant={currentMode === 'chat' ? 'default' : 'outline'} 
              className="w-full justify-start"
              onClick={() => setCurrentMode('chat')}
            >
              <Bot className="w-4 h-4 mr-2" />
              Чат с ИИ
            </Button>
            <Button 
              variant={currentMode === 'planner' ? 'default' : 'outline'} 
              className="w-full justify-start"
              onClick={() => setCurrentMode('planner')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-планировщик
            </Button>
          </div>
          
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-6">
            Быстрые действия
          </h4>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/habits">
                <Target className="w-4 h-4 mr-2" />
                Мои привычки
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Heart className="w-4 h-4 mr-2" />
              Мой прогресс
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setShowHabitTips(true)}
            >
              <Brain className="w-4 h-4 mr-2" />
              Советы по привычкам
            </Button>
          </div>
        </div>

        {suggestedHabits.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Предлагаемые привычки
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
              На главную
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
                  На главную
                </Link>
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                {currentMode === 'planner' ? 'AI-планировщик привычек' : 'ИИ-тренер по привычкам'}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Онлайн
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Предлагаемые привычки</h3>
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
                      Добавить в мои привычки
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
              placeholder="Спросите меня о чем угодно, связанном с формированием привычек..."
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
                <h3 className="text-xl font-semibold text-gray-900">Советы по формированию привычек</h3>
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
                    <h4 className="text-lg font-semibold text-green-800 mb-2">Начните с малого</h4>
                    <p className="text-green-700">
                      Начните с крошечных привычек, которые занимают менее 2 минут. Хотите читать больше? Начните с одной страницы в день. 
                      Маленькие победы создают импульс и помогают привычкам закрепиться.
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
                    <h4 className="text-lg font-semibold text-blue-800 mb-2">Складывайте привычки</h4>
                    <p className="text-blue-700">
                      Связывайте новые привычки с существующими рутинами. "После того, как я налью утренний кофе, я запишу одну вещь, за которую благодарен." 
                      Это создает автоматические триггеры для ваших новых привычек.
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
                    <h4 className="text-lg font-semibold text-purple-800 mb-2">Создайте правильную среду</h4>
                    <p className="text-purple-700">
                      Сделайте хорошие привычки очевидными, а плохие - незаметными. Положите спортивную одежду рядом с кроватью. 
                      Спрячьте телефон, чтобы избежать бесконечного скроллинга. Ваша среда формирует ваше поведение.
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
                    <h4 className="text-lg font-semibold text-orange-800 mb-2">Фокусируйтесь на идентичности</h4>
                    <p className="text-orange-700">
                      Не просто ставьте цели, станьте тем типом человека, который делает эти вещи. Вместо "Я хочу пробежать марафон" 
                      думайте "Я бегун." Каждое действие - это голос за человека, которым вы хотите стать.
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
                Понятно! Давайте создадим несколько привычек
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showPlanCalendar && aiPlan && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setShowPlanCalendar(false)
            setAiPlan(null)
            setSelectedHabits([])
          }}
        >
          <motion.div 
            className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Ваш персональный план на 30 дней</h3>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowPlanCalendar(false)
                  setAiPlan(null)
                  setSelectedHabits([])
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Легенда привычек:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {aiPlan.habits.map((habit) => (
                  <div key={habit.id} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${habit.color}`}></div>
                    <span className="text-sm text-gray-600">{habit.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Календарь на 30 дней</h4>
              <div className="grid grid-cols-7 gap-2">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
                {aiPlan.schedule.map((dayPlan) => (
                  <motion.div
                    key={dayPlan.day}
                    className="aspect-square border border-gray-200 rounded-lg p-2 relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: dayPlan.day * 0.01 }}
                  >
                    <div className="text-xs font-medium text-gray-600 mb-1">
                      {dayPlan.day}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dayPlan.habits.map((habitId) => {
                        const habit = aiPlan.habits.find(h => h.id === habitId)
                        return habit ? (
                          <div
                            key={habitId}
                            className={`w-2 h-2 rounded-full ${habit.color}`}
                            title={habit.name}
                          />
                        ) : null
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Привычки в плане:</h4>
              <div className="space-y-3">
                {aiPlan.habits.map((habit) => (
                  <motion.div
                    key={habit.id}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedHabits.includes(habit.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleHabitSelection(habit.id)}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {selectedHabits.includes(habit.id) ? (
                          <CheckSquare className="w-5 h-5 text-blue-500" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                        <span className="text-lg">{habit.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{habit.name}</h5>
                        <p className="text-sm text-gray-600">{habit.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500">
                            Расписание: {habit.schedule.join(', ')}
                          </span>
                          <span className="text-xs text-gray-500">
                            Время: {habit.timeRequired}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(habit.difficulty)}`}>
                            {habit.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full ${habit.color}`}></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button 
                onClick={handleAcceptAllHabits}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Принять план целиком
              </Button>
              <Button 
                onClick={handleAcceptSelectedHabits}
                disabled={selectedHabits.length === 0}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 mr-2" />
                Выбрать привычки вручную ({selectedHabits.length})
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default HabitCoach