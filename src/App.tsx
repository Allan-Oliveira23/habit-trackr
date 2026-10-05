import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Card from './components/ui/Card'
import Dashboard from './pages/Dashboard'
import type { View } from './types/navigation'

export default function App() {
  const [view, setView] = useState<View>('dashboard')

  return (
    <div className="min-h-screen md:flex">
      <Sidebar current={view} onChange={setView} />
      <div className="min-w-0 flex-1">
        <Topbar view={view} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-24 sm:px-6 md:pb-6">
          {view === 'dashboard' ? (
            <Dashboard />
          ) : (
            <Card>
              <p className="text-sm text-muted">Esta página ainda não foi implementada.</p>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
