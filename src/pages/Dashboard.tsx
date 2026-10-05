import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import GoalSummary from '../components/dashboard/GoalSummary'
import HabitTable from '../components/dashboard/HabitTable'
import MonthSelector from '../components/dashboard/MonthSelector'
import ProgressChart from '../components/dashboard/ProgressChart'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import Select from '../components/ui/Select'
import { useHabitDialogs } from '../hooks/useHabitDialogs'
import { useHabits } from '../hooks/useHabits'
import { useMonthData } from '../hooks/useMonthData'
import {
  calculateDailyProgress,
  calculateDaysGoalMet,
  calculateGoalProgress,
  calculateHabitProgress,
  calculateCompletedCount,
  calculateIncompleteCount,
  calculateMonthlyProgress,
  calculatePossibleCount,
  calculateWeeklyProgress,
} from '../utils/calculations'
import { dateKey, getWeeks } from '../utils/calendar'
import { formatPercent } from '../utils/formatters'

export default function Dashboard() {
  const { state, dispatch } = useHabits()
  const { habits } = state
  const { openCreate, openEdit, openDelete, dialogs } = useHabitDialogs()
  const { days, dates, done } = useMonthData()
  const [week, setWeek] = useState('all')

  const weeks = useMemo(() => getWeeks(days).map((w) => w.map(dateKey)), [days])
  const selectedWeek = week !== 'all' && weeks[Number(week)] ? week : 'all'
  const activeHabits = habits.filter((h) => h.active)
  const completed = calculateCompletedCount(habits, done, dates)
  const possible = calculatePossibleCount(habits, dates)
  const monthly = calculateMonthlyProgress(habits, done, dates)
  const chartData = dates.map((d, i) => ({ day: i + 1, percentage: calculateDailyProgress(habits, done, d) }))

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
          <div className="grid gap-4 md:grid-cols-3">
            <Card title="Progresso do mês" className="md:col-span-2">
              <p className="mb-2 text-4xl font-semibold text-ok">{formatPercent(monthly)}</p>
              <ProgressBar value={monthly} label="Progresso mensal" />
              <p className="mt-2 text-sm text-muted">
                {completed} / {possible} possíveis
              </p>
            </Card>
            <Card title="Resumo">
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-muted">Concluídos</dt><dd className="text-ok">{completed}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Incompletos</dt><dd className="text-bad">{calculateIncompleteCount(habits, done, dates)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Hábitos ativos</dt><dd>{activeHabits.length}</dd></div>
              </dl>
            </Card>
          </div>

          <Card title="Meta diária">
            <GoalSummary
              goal={state.settings.dailyGoal}
              maxGoal={activeHabits.length}
              todayCompleted={dates.includes(dateKey(new Date())) ? calculateCompletedCount(habits, done, [dateKey(new Date())]) : null}
              daysMet={state.settings.dailyGoal ? calculateDaysGoalMet(habits, done, dates, state.settings.dailyGoal) : 0}
              totalDays={dates.length}
              onChange={(goal) => dispatch({ type: 'SET_DAILY_GOAL', payload: goal })}
            />
          </Card>

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
            ) : (
              <ProgressChart data={chartData} />
            )}
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Resumo semanal">
              <div className="mb-3">
                <Select
                  label="Semana:"
                  value={selectedWeek}
                  onChange={setWeek}
                  options={[{ value: 'all', label: 'Todas' }, ...weeks.map((_, i) => ({ value: String(i), label: `Semana ${i + 1}` }))]}
                />
              </div>
              <ul className="space-y-3">
                {weeks.map((w, i) => {
                  if (selectedWeek !== 'all' && selectedWeek !== String(i)) return null
                  const p = calculateWeeklyProgress(habits, done, w)
                  return (
                    <li key={i}>
                      <div className="mb-1 flex justify-between text-sm"><span>Semana {i + 1}</span><span>{formatPercent(p)}</span></div>
                      <ProgressBar value={p} label={`Progresso da semana ${i + 1}`} />
                    </li>
                  )
                })}
              </ul>
            </Card>
            <Card title="Progresso por hábito e metas">
              <ul className="space-y-3">
                {activeHabits.map((h) => {
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
          </div>
        </>
      )}

      {dialogs}
    </div>
  )
}
