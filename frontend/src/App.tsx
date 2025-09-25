import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import HabitsPage from './components/HabitsPage'
import HabitCoach from './components/HabitCoach'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/habits" element={<HabitsPage />} />
      <Route path="/app" element={<HabitsPage />} />
      <Route path="/coach" element={<HabitCoach />} />
    </Routes>
  )
}
