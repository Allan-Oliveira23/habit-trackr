import HabitProgressList from '../components/dashboard/HabitProgressList'
import MonthSelector from '../components/dashboard/MonthSelector'
import WeeklySummary from '../components/dashboard/WeeklySummary'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import { useHabits } from '../hooks/useHabits'
import { useMonthData } from '../hooks/useMonthData'
import {
  calculateBestDays,
  calculateCompletedCount,
  calculateMonthlyProgress,
  calculatePossibleCount,
  calculateTotalCompletions,
} from '../utils/calculations'
import { formatDateKey, formatPercent } from '../utils/formatters'
import { progressTone, toneTextClass } from '../utils/tone'

export default function Statistics() {
  const { state } = useHabits()
  const { habits } = state
  const { dates, weeks, done } = useMonthData()

  const hasActive = habits.some((h) => h.active)
  const monthly = calculateMonthlyProgress(habits, done, dates)
  const bestDays = calculateBestDays(habits, done, dates)

  return (
    <div className="space-y-4">
      <MonthSelector />
      {!hasActive ? (
        <Card>
          <p className="text-sm text-muted">Não há hábitos ativos. Crie ou ative um hábito para ver as estatísticas.</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card title="Progresso mensal">
              <p className={`mb-2 text-3xl font-semibold ${toneTextClass[progressTone(monthly)]}`}>{formatPercent(monthly)}</p>
              <ProgressBar value={monthly} label="Progresso mensal" />
              <p className="mt-2 text-sm text-muted">
                {calculateCompletedCount(habits, done, dates)} / {calculatePossibleCount(habits, dates)} possíveis
              </p>
            </Card>
            <Card title="Conclusões no mês">
              <p className="text-3xl font-semibold">{calculateCompletedCount(habits, done, dates)}</p>
              <p className="mt-2 text-sm text-muted">Somente hábitos ativos</p>
            </Card>
            <Card title="Total no histórico">
              <p className="text-3xl font-semibold">{calculateTotalCompletions(done)}</p>
              <p className="mt-2 text-sm text-muted">Todas as conclusões registradas</p>
            </Card>
          </div>

          <Card title="Melhores dias do mês">
            {bestDays.length === 0 ? (
              <p className="text-sm text-muted">Nenhuma conclusão registrada neste mês.</p>
            ) : (
              <ol className="space-y-1 text-sm">
                {bestDays.map((d, i) => (
                  <li key={d.date} className="flex justify-between">
                    <span>{i + 1}. {formatDateKey(d.date)}</span>
                    <span className="text-muted">{d.completed} concluídos · {formatPercent(d.percent)}</span>
                  </li>
                ))}
              </ol>
            )}
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <WeeklySummary habits={habits} done={done} weeks={weeks} />
            <HabitProgressList habits={habits} dates={dates} done={done} />
          </div>
        </>
      )}
    </div>
  )
}
