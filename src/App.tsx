import { useState } from 'react'
import NoticeBanner from './components/layout/NoticeBanner'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Dashboard from './pages/Dashboard'
import Habits from './pages/Habits'
import Settings from './pages/Settings'
import Statistics from './pages/Statistics'
import type { View } from './types/navigation'

export default function App() {
  const [view, setView] = useState<View>('dashboard')

  return (
    <div className="min-h-screen md:flex">
      <Sidebar current={view} onChange={setView} />
      <div className="min-w-0 flex-1">
        <Topbar view={view} />
        <NoticeBanner />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-24 sm:px-6 md:pb-6">
          {view === 'dashboard' ? (
            <Dashboard />
          ) : view === 'habits' ? (
            <Habits />
          ) : view === 'statistics' ? (
            <Statistics />
          ) : (
            <Settings />
          )}
        </main>
      </div>
    </div>
  )
}
