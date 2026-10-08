import { useState } from 'react'
import type { Habit } from '../../types/habit'
import { calculateWeeklyProgress, type CompletionSet } from '../../utils/calculations'
import { dateKey } from '../../utils/calendar'
import { formatPercent } from '../../utils/formatters'
import Card from '../ui/Card'
import ProgressBar from '../ui/ProgressBar'
import Select from '../ui/Select'

interface Props {
  habits: Habit[]
  done: CompletionSet
  /** Chaves de data de cada semana do mês. */
  weeks: string[][]
}

export default function WeeklySummary({ habits, done, weeks }: Props) {
  const [week, setWeek] = useState('all')
  const todayKey = dateKey(new Date())
  const selected = week !== 'all' && weeks[Number(week)] ? week : 'all'

  return (
    <Card title="Resumo semanal">
      <div className="mb-3">
        <Select
          label="Semana:"
          value={selected}
          onChange={setWeek}
          options={[{ value: 'all', label: 'Todas' }, ...weeks.map((_, i) => ({ value: String(i), label: `Semana ${i + 1}` }))]}
        />
      </div>
      <ul className="space-y-3">
        {weeks.map((w, i) => {
          if (selected !== 'all' && selected !== String(i)) return null
          const future = w.every((d) => d > todayKey)
          const p = calculateWeeklyProgress(habits, done, w)
          return (
            <li key={w[0]}>
              <div className="mb-1 flex justify-between text-sm">
                <span>Semana {i + 1}</span>
                <span className={future ? 'text-muted' : ''}>{future ? 'Ainda não começou' : formatPercent(p)}</span>
              </div>
              <ProgressBar value={future ? 0 : p} label={`Progresso da semana ${i + 1}`} />
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
