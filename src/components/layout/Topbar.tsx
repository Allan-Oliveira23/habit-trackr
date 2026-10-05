import type { View } from '../../types/navigation'

const titles: Record<View, string> = {
  dashboard: 'Dashboard',
  habits: 'Hábitos',
  statistics: 'Estatísticas',
  settings: 'Configurações',
}

/** Título da página atual; no mobile mostra também a marca (a navegação fica na barra inferior). */
export default function Topbar({ view }: { view: View }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-bg/90 px-4 py-3 backdrop-blur sm:px-6">
      <h1 className="text-lg font-semibold sm:text-xl">{titles[view]}</h1>
      <span className="text-sm text-muted md:hidden">✅ Habit Tracker</span>
    </header>
  )
}
