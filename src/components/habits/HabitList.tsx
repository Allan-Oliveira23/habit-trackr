import { Pencil, Power, Trash2 } from 'lucide-react'
import type { Habit } from '../../types/habit'
import { calculateGoalProgress, calculateHabitProgress, type CompletionSet } from '../../utils/calculations'
import { formatPercent } from '../../utils/formatters'
import Button from '../ui/Button'
import ProgressBar from '../ui/ProgressBar'

interface Props {
  habits: Habit[]
  dates: string[]
  done: CompletionSet
  onEdit: (habit: Habit) => void
  onDelete: (habit: Habit) => void
  onToggleActive: (habit: Habit) => void
}

export default function HabitList({ habits, dates, done, onEdit, onDelete, onToggleActive }: Props) {
  return (
    <ul className="space-y-3">
      {habits.map((h) => {
        const p = calculateHabitProgress(h.id, done, dates)
        const goalPct = calculateGoalProgress(h, p.completed)
        return (
          <li key={h.id} className={`rounded-xl border border-line bg-card p-4 ${h.active ? '' : 'opacity-60'}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span aria-hidden className="text-xl">{h.icon}</span>
                <span className="font-medium">{h.name}</span>
                {!h.active && <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-muted">Inativo</span>}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => onEdit(h)} aria-label={`Editar ${h.name}`}>
                  <Pencil size={14} aria-hidden /> Editar
                </Button>
                <Button onClick={() => onToggleActive(h)} aria-label={`${h.active ? 'Desativar' : 'Ativar'} ${h.name}`}>
                  <Power size={14} aria-hidden /> {h.active ? 'Desativar' : 'Ativar'}
                </Button>
                <Button variant="danger" onClick={() => onDelete(h)} aria-label={`Excluir ${h.name}`}>
                  <Trash2 size={14} aria-hidden /> Excluir
                </Button>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-sm text-muted">
                <span>{p.completed} / {p.total} dias no mês</span>
                <span>{formatPercent(p.percent)}</span>
              </div>
              <ProgressBar value={p.percent} label={`Progresso de ${h.name}`} />
              <p className={`text-xs ${goalPct >= 100 ? 'text-ok' : 'text-muted'}`}>
                {h.goal
                  ? `Meta: ${p.completed} / ${h.goal} dias${goalPct >= 100 ? ' — atingida' : ` (${formatPercent(goalPct)})`}`
                  : 'Sem meta definida'}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
