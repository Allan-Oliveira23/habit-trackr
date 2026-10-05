import { isToday } from 'date-fns'
import { Pencil, Power, Trash2 } from 'lucide-react'
import type { Habit } from '../../types/habit'
import { calculateHabitProgress, completionKey, type CompletionSet } from '../../utils/calculations'
import { dateKey, getWeeks, weekdayInitial } from '../../utils/calendar'
import { formatPercent } from '../../utils/formatters'
import DayCell from './DayCell'

interface Props {
  habits: Habit[]
  days: Date[]
  done: CompletionSet
  onToggle: (habitId: string, date: string) => void
  onEdit: (habit: Habit) => void
  onDelete: (habit: Habit) => void
  onToggleActive: (habit: Habit) => void
}

const iconBtn = 'rounded p-1 text-muted hover:bg-white/10 hover:text-white'

export default function HabitTable({ habits, days, done, onToggle, onEdit, onDelete, onToggleActive }: Props) {
  const weeks = getWeeks(days)
  const dates = days.map(dateKey)

  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-x-0.5 border-spacing-y-1 text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-card" />
            {weeks.map((w, i) => (
              <th key={i} colSpan={w.length} className="border-b border-line pb-1 text-xs font-medium text-muted">
                Semana {i + 1}
              </th>
            ))}
            <th />
          </tr>
          <tr>
            <th className="sticky left-0 z-10 bg-card px-2 text-left text-xs font-medium text-muted">Hábito</th>
            {days.map((d) => (
              <th key={dateKey(d)} className={`w-8 text-center text-xs font-normal ${isToday(d) ? 'text-warn' : 'text-muted'}`}>
                <div>{weekdayInitial(d)}</div>
                <div>{String(d.getDate()).padStart(2, '0')}</div>
              </th>
            ))}
            <th className="px-2 text-xs font-medium text-muted">Progresso</th>
          </tr>
        </thead>
        <tbody>
          {habits.map((h) => {
            const p = calculateHabitProgress(h.id, done, dates)
            return (
              <tr key={h.id} className={h.active ? '' : 'opacity-50'}>
                <th scope="row" className="sticky left-0 z-10 bg-card px-2 text-left font-normal">
                  <div className="flex min-w-44 items-center gap-2">
                    <span aria-hidden>{h.icon}</span>
                    <span className="flex-1 truncate">{h.name}</span>
                    <button aria-label={`Editar ${h.name}`} className={iconBtn} onClick={() => onEdit(h)}>
                      <Pencil size={14} />
                    </button>
                    <button
                      aria-label={`${h.active ? 'Desativar' : 'Ativar'} ${h.name}`}
                      aria-pressed={h.active}
                      className={iconBtn}
                      onClick={() => onToggleActive(h)}
                    >
                      <Power size={14} />
                    </button>
                    <button aria-label={`Excluir ${h.name}`} className={iconBtn} onClick={() => onDelete(h)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </th>
                {days.map((d) => {
                  const key = dateKey(d)
                  return (
                    <td key={key} className="text-center">
                      <DayCell
                        habitName={h.name}
                        date={d}
                        completed={done.has(completionKey(h.id, key))}
                        today={isToday(d)}
                        onToggle={() => onToggle(h.id, key)}
                      />
                    </td>
                  )
                })}
                <td className="whitespace-nowrap px-2 text-right text-xs text-muted">
                  {p.completed}/{p.total} · {formatPercent(p.percent)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
