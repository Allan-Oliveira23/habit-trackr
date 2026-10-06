import { BarChart3, LayoutDashboard, ListChecks, Settings, type LucideIcon } from 'lucide-react'
import type { View } from '../../types/navigation'

const items: { view: View; label: string; icon: LucideIcon }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { view: 'habits', label: 'Hábitos', icon: ListChecks },
  { view: 'statistics', label: 'Estatísticas', icon: BarChart3 },
  { view: 'settings', label: 'Configurações', icon: Settings },
]

interface Props {
  current: View
  onChange: (view: View) => void
}

/** Sidebar fixa no desktop; barra inferior no mobile. */
export default function Sidebar({ current, onChange }: Props) {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-line bg-card p-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] md:static md:w-56 md:shrink-0 md:flex-col md:justify-start md:gap-1 md:border-r md:border-t-0 md:p-3"
    >
      <span className="hidden px-3 py-2 text-sm font-semibold md:block">✅ Habit Tracker</span>
      {items.map(({ view, label, icon: Icon }) => {
        const active = view === current
        return (
          <button
            key={view}
            type="button"
            aria-current={active ? 'page' : undefined}
            onClick={() => onChange(view)}
            className={`flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs transition-colors md:flex-none md:flex-row md:gap-3 md:px-3 md:text-sm ${
              active ? 'bg-ok/15 text-ok' : 'text-muted hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon size={18} aria-hidden />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
