import { calculateDailyGoalProgress } from '../../utils/calculations'
import { formatPercent } from '../../utils/formatters'
import DailyGoalField from './DailyGoalField'
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
  return (
    <div className="space-y-3 text-sm">
      <DailyGoalField goal={goal} maxGoal={maxGoal} onChange={onChange} />
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
