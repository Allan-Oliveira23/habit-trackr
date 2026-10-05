import { useId } from 'react'
import { calculateDailyGoalProgress } from '../../utils/calculations'
import { formatPercent } from '../../utils/formatters'
import ProgressBar from '../ui/ProgressBar'

interface Props {
  goal?: number
  maxGoal: number
  /** Concluídos hoje; null quando o mês exibido não contém o dia atual. */
  todayCompleted: number | null
  daysMet: number
  totalDays: number
  onChange: (goal: number | undefined) => void
}

export default function GoalSummary({ goal, maxGoal, todayCompleted, daysMet, totalDays, onChange }: Props) {
  const id = useId()
  const handle = (raw: string) => {
    const n = Number(raw)
    onChange(raw === '' || !Number.isInteger(n) || n < 1 ? undefined : Math.min(n, Math.max(maxGoal, 1)))
  }

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center gap-2">
        <label htmlFor={id} className="text-muted">
          Objetivo diário (hábitos por dia)
        </label>
        <input
          id={id}
          type="number"
          min={1}
          max={Math.max(maxGoal, 1)}
          value={goal ?? ''}
          onChange={(e) => handle(e.target.value)}
          className="w-16 rounded-lg border border-line bg-bg px-2 py-1.5"
        />
      </div>
      {goal === undefined ? (
        <p className="text-muted">Defina um objetivo diário para acompanhar sua meta.</p>
      ) : (
        <>
          {todayCompleted !== null && (
            <div>
              <div className="mb-1 flex justify-between">
                <span>Hoje: {todayCompleted} / {goal}</span>
                <span>{formatPercent(calculateDailyGoalProgress(todayCompleted, goal))}</span>
              </div>
              <ProgressBar value={calculateDailyGoalProgress(todayCompleted, goal)} label="Progresso da meta diária de hoje" />
            </div>
          )}
          <p className="text-muted">
            Meta atingida em {daysMet} de {totalDays} dias neste mês.
          </p>
        </>
      )}
    </div>
  )
}
