import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Target, Menu, X, UserPlus, BarChart3, Users, Calendar, Flame, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen relative">
      <motion.nav 
        className="sticky top-0 z-50 glassmorphism border-b border-white/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Target className="w-8 h-8 text-primary" />
              </motion.div>
              <span className="text-2xl font-bold tracking-tight">Habitify</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-foreground hover:text-primary transition-colors duration-200">
                Главная
              </a>
              <a href="#features" className="text-foreground hover:text-primary transition-colors duration-200">
                Возможности
              </a>
              <a href="#prices" className="text-foreground hover:text-primary transition-colors duration-200">
                Цены
              </a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-colors duration-200">
                Отзывы
              </a>
              <a href="#contacts" className="text-foreground hover:text-primary transition-colors duration-200">
                Контакты
              </a>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate('/habits')}>
                  <Target className="w-4 h-4 mr-2" />
                  Мои привычки
                </Button>
                <Button size="sm" onClick={() => navigate('/coach')}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Помощь ИИ
                </Button>
              </div>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <motion.div
            className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isMobileMenuOpen ? 1 : 0, 
              height: isMobileMenuOpen ? 'auto' : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="py-4 space-y-4 border-t border-black/5">
              <a 
                href="#home" 
                className="block text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Главная
              </a>
              <a 
                href="#features" 
                className="block text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Возможности
              </a>
              <a 
                href="#prices" 
                className="block text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Цены
              </a>
              <a 
                href="#contacts" 
                className="block text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Контакты
              </a>
              <div className="flex flex-col gap-3 pt-4">
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/habits')}>
                  <Target className="w-4 h-4 mr-2" />
                  Мои привычки
                </Button>
                <Button size="sm" className="w-full" onClick={() => navigate('/coach')}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Помощь ИИ
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      <motion.section 
        id="home"
        className="py-20 md:py-32"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 2 
                }}
              >
                <Target className="w-12 h-12 text-primary" />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-enhanced"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Организуй, Выполняй,{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Побеждай
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto text-enhanced"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Начните свой день правильно с чётким, организованным расписанием, которое направит вас к успеху. Вот пример того, как мог бы выглядеть ваш день с Habitify:
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/app')}>
                  Начать отслеживание привычек
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/coach')}>
                  Помощь ИИ
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="py-20 bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="space-y-4"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="glass-card text-white p-4 rounded-xl flex items-center gap-3 bg-blue-500/80">
                  <Sun className="w-6 h-6" />
                  <span className="text-lg font-semibold">Утро</span>
                </div>
                <div className="space-y-3">
                  {[
                    { task: "Пробежка", time: "8 AM" },
                    { task: "Медитация", time: "8:30 AM" },
                    { task: "Планирование дня", time: "9 AM" },
                    { task: "Чтение", time: "10 AM" },
                    { task: "Питьё воды", time: "10:30 AM" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="glass-card p-4 rounded-xl border-2 border-blue-200/50 flex items-center justify-between"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <span className="font-medium">{item.task}</span>
                      <span className="text-sm text-gray-500">{item.time}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="glass-card text-white p-4 rounded-xl flex items-center gap-3 bg-orange-500/80">
                  <Sun className="w-6 h-6" />
                  <span className="text-lg font-semibold">День</span>
                </div>
                <div className="space-y-3">
                  {[
                    { task: "Здоровый обед", time: "12 PM" },
                    { task: "Общение с коллегой", time: "2 PM" },
                    { task: "Выразить благодарность", time: "4 PM" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="glass-card p-4 rounded-xl border-2 border-orange-200/50 flex items-center justify-between"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <span className="font-medium">{item.task}</span>
                      <span className="text-sm text-gray-500">{item.time}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="glass-card text-white p-4 rounded-xl flex items-center gap-3 bg-purple-500/80">
                  <Moon className="w-6 h-6" />
                  <span className="text-lg font-semibold">Вечер</span>
                </div>
                <div className="space-y-3">
                  {[
                    { task: "Размышления", time: "8 PM" },
                    { task: "Расслабление", time: "9 PM" },
                    { task: "Отключиться от экранов", time: "9:30 PM" },
                    { task: "Подготовка к завтрашнему дню", time: "10 PM" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="glass-card p-4 rounded-xl border-2 border-purple-200/50 flex items-center justify-between"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <span className="font-medium">{item.task}</span>
                      <span className="text-sm text-gray-500">{item.time}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                className="flex items-center justify-center gap-3 mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <BarChart3 className="w-12 h-12 text-primary" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Оставайтесь мотивированным своим прогрессом</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Научные исследования показывают, что отслеживание прогресса может значительно повысить ваши шансы на успешное формирование и поддержание привычек. Подпитывайте своё путешествие понятными метриками, отмечайте свои достижения и оставайтесь мотивированным на пути к успеху.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                className="glass-card p-6 rounded-2xl border border-white/20 shadow-sm"
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-4">Июнь 2023</h3>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                    <div key={day} className="text-sm font-medium text-gray-500 py-2">{day}</div>
                  ))}
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                    const isCompleted = [2, 5, 6, 7, 8, 9, 10, 14, 15, 20, 21, 22, 23].includes(day)
                    return (
                      <div
                        key={day}
                        className={`p-2 text-sm rounded-full ${
                          isCompleted 
                            ? 'bg-primary text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {day}
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              <motion.div
                className="glass-card p-6 rounded-2xl border border-white/20 shadow-sm"
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-4">Продолжительность</h3>
                <div className="space-y-4">
                  {[
                    { name: "Упражнения", streak: 155, color: "bg-blue-500" },
                    { name: "Чтение", streak: 56, color: "bg-green-500" },
                    { name: "Медитация", streak: 2, color: "bg-yellow-500" },
                    { name: "Вода", streak: 15, color: "bg-cyan-500" },
                    { name: "Сон", streak: 1, color: "bg-purple-500" }
                  ].map((habit, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{habit.name}</span>
                          <span className="text-sm text-gray-500">{habit.streak}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${habit.color}`}
                            style={{ width: `${Math.min((habit.streak / 155) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        id="features"
        className="py-20 bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Почему стоит выбрать наш трекер привычек?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Мощные функции, созданные для того, чтобы помочь вам выработать долгосрочные привычки и достичь своих целей.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Лёгкое отслеживание",
                description: "Простой и интуитивно понятный интерфейс для отслеживания ежедневных привычек всего несколькими нажатиями.",
                icon: "📊"
              },
              {
                title: "Аналитика прогресса",
                description: "Оцените свой прогресс с помощью подробной аналитики и отслеживания продолжительности.",
                icon: "📈"
              },
              {
                title: "Умные напоминания",
                description: "Никогда не пропускайте привычку с интеллектуальными напоминаниями и уведомлениями.",
                icon: "🔔"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 rounded-2xl glass-card border border-white/20"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        id="testimonials"
        className="py-20 bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Что говорят наши пользователи</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Присоединяйтесь к тысячам пользователей, которые изменили свою жизнь с Habitify
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Дженнифер Эллисон",
                title: "Продукт-менеджер",
                quote: "До Habitify я боролась с эффективным управлением временем и часто чувствовала себя подавленной. Но приложение помогло мне создать хорошо структурированный распорядок дня и придерживаться его. Я улучшила свою продуктивность и чувствую себя более сбалансированно и контролирую ситуацию. Оно оказало большое влияние как на мою профессиональную, так и на личную жизнь.",
                avatar: "👩‍💼"
              },
              {
                name: "Томас Максвелл",
                title: "Любитель фитнеса",
                quote: "Habitify кардинально изменило мою жизнь. Я смог поставить фитнес-цели и поддерживать постоянство, одновременно отслеживая свой прогресс. Приложение не только отслеживает мои привычки, но и мотивирует меня продолжать. Теперь я достиг своих фитнес-целей быстрее, чем когда-либо считал возможным.",
                avatar: "💪"
              },
              {
                name: "Джон Меламоро",
                title: "Предприниматель",
                quote: "Как предприниматель, мои дни крайне насыщены. Habitify помог мне создать ежедневную рутину, которая помогает мне оставаться сосредоточенным, сконцентрированным и продуктивным. Мне нравится встроенный таймер и возможность отслеживать моё настроение, что значительно улучшило баланс между работой и личной жизнью.",
                avatar: "👨‍💼"
              },
              {
                name: "Карол Хардисон",
                title: "Студентка",
                quote: "У меня были проблемы с балансом между учёбой, подработкой и личной жизнью. Habitify помог мне лучше организовать свой день, поддерживал мою мотивацию и коренным образом изменил мою жизнь. Мои оценки улучшились, и я всё ещё нахожу время на заботу о себе.",
                avatar: "👩‍🎓"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="glass-card p-6 rounded-2xl border border-white/20 shadow-sm"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div className="flex-1">
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex -space-x-2">
                    {['👩', '👨', '👩', '👨'].map((avatar, index) => (
                      <div key={index} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg border-2 border-white">
                        {avatar}
                      </div>
                    ))}
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Повысьте уровень веселья с <span className="text-orange-500">Вызовами.</span>
                </h2>
                
                <p className="text-xl text-muted-foreground mb-8">
                  Участвуйте в дружеских соревнованиях и ежемесячных вызовах, чтобы сделать формирование привычек более увлекательным путешествием.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Вызовите своих друзей.</h3>
                      <p className="text-muted-foreground">Подогрейте своё путешествие по формированию привычек немного дружеского соперничества.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Присоединяйтесь к месячному вызову.</h3>
                      <p className="text-muted-foreground">Поднимайтесь в таблицах лидеров, сделайте формирование привычек весёлым и благодарным.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-orange-400 to-yellow-400 p-1 rounded-2xl"
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="glass-card rounded-xl p-6">
                  <div className="bg-orange-500 text-white px-4 py-2 rounded-lg text-center font-semibold mb-6">
                    RUNNING CLUB
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { name: "David Dixon", points: 17, distance: "54 KM", avatar: "👨‍💼" },
                      { name: "Adela Barmore", points: 15, distance: "37.8 KM", avatar: "👩" },
                      { name: "Helen Judd", points: 13, distance: "32.1 KM", avatar: "👩" },
                      { name: "Dorothy Rodriquez", points: 10, distance: "22 KM", avatar: "👩" },
                      { name: "Andres Runkle", points: 8, distance: "36.5 KM", avatar: "👨" },
                      { name: "Bertha Muldoon", points: 2, distance: "5 KM", avatar: "👩" }
                    ].map((participant, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium">{participant.points}</span>
                        </div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                          {participant.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{participant.name}</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-orange-500 h-2 rounded-full"
                              style={{ width: `${(participant.points / 17) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-600">{participant.distance}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        id="prices"
        className="py-20 bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Простые цены</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Выберите план, который лучше всего подходит вам. Начните бесплатно и обновляйтесь в любое время.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Бесплатный",
                price: "0 руб.",
                period: "навсегда",
                features: ["До 5 привычек", "Основное отслеживание", "История на 7 дней", "Поддержка по email"],
                popular: false
              },
              {
                name: "Про",
                price: "590 руб.",
                period: "в месяц",
                features: ["Неограниченное количество привычек", "Продвинутая аналитика", "Неограниченная история", "Приоритетная поддержка", "Настраиваемые напоминания"],
                popular: true
              },
              {
                name: "Командный",
                price: "1890 руб.",
                period: "в месяц",
                features: ["Всё из Про-плана", "Командная работа", "Панель администратора", "Доступ к API", "Пользовательские интеграции"],
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`relative p-8 rounded-2xl border-2 ${
                  plan.popular 
                    ? 'border-primary glass-card bg-primary/20' 
                    : 'border-white/20 glass-card'
                }`}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
Самый популярный
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-1">{plan.price}</div>
                  <div className="text-muted-foreground">/{plan.period}</div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.name === 'Бесплатный' ? 'Начать' : 'Выбрать план'}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        id="contacts"
        className="py-20 bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Связаться с нами</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Есть вопросы? Мы с радостью услышим вас. Отправьте нам сообщение, и мы ответим как можно скорее.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Электронная почта</h3>
                  <p className="text-muted-foreground">hello@habittracker.com</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Телефон</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Адрес</h3>
                  <p className="text-muted-foreground">
                    ул. Привычек, 123<br />
                    Москва, 123456
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Ваше имя" 
                  className="w-full p-3 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
                <input 
                  type="email" 
                  placeholder="Ваш email" 
                  className="w-full p-3 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
                <textarea 
                  placeholder="Ваше сообщение" 
                  rows={4}
                  className="w-full p-3 rounded-lg border border-black/10 bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
                ></textarea>
                <Button className="w-full">Отправить сообщение</Button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <footer className="py-12 border-t border-white/20 glassmorphism">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold">Habitify</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 Habitify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
