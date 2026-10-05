import type { Habit } from '../../types/habit'
import { calculateGoalProgress, calculateHabitProgress, type CompletionSet } from '../../utils/calculations'
import { formatPercent } from '../../utils/formatters'
import Card from '../ui/Card'
import ProgressBar from '../ui/ProgressBar'

interface Props {
  habits: Habit[]
  dates: string[]
  done: CompletionSet
}

/** Progresso mensal e meta de cada hábito ativo. */
export default function HabitProgressList({ habits, dates, done }: Props) {
  return (
    <Card title="Progresso por hábito e metas">
      <ul className="space-y-3">
        {habits.filter((h) => h.active).map((h) => {
          const p = calculateHabitProgress(h.id, done, dates)
          const goalPct = calculateGoalProgress(h, p.completed)
          return (
            <li key={h.id}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{h.icon} {h.name}</span>
                <span className="text-muted">{p.completed} / {p.total} dias · {formatPercent(p.percent)}</span>
              </div>
              <ProgressBar value={p.percent} label={`Progresso de ${h.name}`} />
              {h.goal && (
                <p className={`mt-1 text-xs ${goalPct >= 100 ? 'text-ok' : 'text-muted'}`}>
                  Meta: {p.completed} / {h.goal} dias{goalPct >= 100 ? ' — atingida' : ` (${formatPercent(goalPct)})`}
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
