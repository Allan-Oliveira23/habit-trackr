import { Plus } from 'lucide-react'
import GoalSummary from '../components/dashboard/GoalSummary'
import HabitProgressList from '../components/dashboard/HabitProgressList'
import HabitTable from '../components/dashboard/HabitTable'
import MonthSelector from '../components/dashboard/MonthSelector'
import ProgressChart from '../components/dashboard/ProgressChart'
import WeeklySummary from '../components/dashboard/WeeklySummary'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import { useHabitDialogs } from '../hooks/useHabitDialogs'
import { useHabits } from '../hooks/useHabits'
import { useMonthData } from '../hooks/useMonthData'
import {
  calculateDailyProgress,
  calculateDaysGoalMet,
  calculateCompletedCount,
  calculateIncompleteCount,
  calculateMonthlyProgress,
  calculatePossibleCount,
} from '../utils/calculations'
import { dateKey } from '../utils/calendar'
import { formatPercent } from '../utils/formatters'
import { progressTone, toneTextClass } from '../utils/tone'

export default function Dashboard() {
  const { state, dispatch } = useHabits()
  const { habits } = state
  const { openCreate, openEdit, openDelete, dialogs } = useHabitDialogs()
  const { days, dates, weeks, done } = useMonthData()

  const todayKey = dateKey(new Date())
  const activeHabits = habits.filter((h) => h.active)
  const completed = calculateCompletedCount(habits, done, dates)
  const possible = calculatePossibleCount(habits, dates)
  const monthly = calculateMonthlyProgress(habits, done, dates)
  const chartData = dates.map((d, i) => ({ day: i + 1, percentage: d > todayKey ? null : calculateDailyProgress(habits, done, d) }))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MonthSelector />
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" onClick={() => openCreate()}>
            <Plus size={16} /> Novo hábito
          </Button>
        </div>
      </div>

      {habits.length === 0 ? (
        <Card>
          <p className="mb-3 text-muted">Você ainda não possui hábitos.</p>
          <Button variant="primary" onClick={() => openCreate()}>
            + Criar primeiro hábito
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Progresso do mês">
              {possible === 0 ? (
                <p className="text-sm text-muted">Nenhum hábito ativo. Ative ou crie um hábito para acompanhar o progresso do mês.</p>
              ) : (
                <>
                  <p className={`mb-2 text-4xl font-semibold ${toneTextClass[progressTone(monthly)]}`}>{formatPercent(monthly)}</p>
                  <ProgressBar value={monthly} label="Progresso mensal" />
                  <p className="mt-2 text-sm text-muted">
                    {completed} / {possible} possíveis · {calculateIncompleteCount(habits, done, dates)} incompletos · {activeHabits.length} hábitos ativos
                  </p>
                </>
              )}
            </Card>
            <Card title="Meta diária">
              <GoalSummary
                goal={state.settings.dailyGoal}
                maxGoal={activeHabits.length}
                todayCompleted={dates.includes(todayKey) ? calculateCompletedCount(habits, done, [todayKey]) : null}
                daysMet={state.settings.dailyGoal ? calculateDaysGoalMet(habits, done, dates, state.settings.dailyGoal) : 0}
                totalDays={dates.length}
                onChange={(goal) => dispatch({ type: 'SET_DAILY_GOAL', payload: goal })}
              />
            </Card>
          </div>

          <Card title="Hábitos">
            <HabitTable
              habits={habits}
              days={days}
              done={done}
              onToggle={(habitId, date) => dispatch({ type: 'TOGGLE_COMPLETION', payload: { habitId, date } })}
              onEdit={(habit) => openEdit(habit)}
              onDelete={(habit) => openDelete(habit)}
              onToggleActive={(h) => dispatch({ type: 'TOGGLE_HABIT_ACTIVE', payload: h.id })}
            />
          </Card>

          <Card title="Progresso diário">
            {activeHabits.length === 0 ? (
              <p className="text-sm text-muted">Ative ao menos um hábito para ver o gráfico.</p>
            ) : completed === 0 ? (
              <p className="text-sm text-muted">Nenhuma conclusão registrada neste mês. Marque um hábito na tabela para ver o gráfico.</p>
            ) : (
              <ProgressChart data={chartData} />
            )}
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <WeeklySummary habits={habits} done={done} weeks={weeks} />
            <HabitProgressList habits={habits} dates={dates} done={done} />
          </div>
        </>
      )}

      {dialogs}
    </div>
  )
}
