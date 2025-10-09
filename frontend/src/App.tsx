import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import HabitsPage from './components/HabitsPage'
import HabitCoach from './components/HabitCoach'
import AchievementsPage from './components/AchievementsPage'
import GoalsPage from './components/GoalsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<HabitsPage />} />
      <Route path="/habits" element={<HabitsPage />} />
      <Route path="/coach" element={<HabitCoach />} />
      <Route path="/achievements" element={<AchievementsPage />} />
      <Route path="/goals" element={<GoalsPage />} />
    </Routes>
  )
}
