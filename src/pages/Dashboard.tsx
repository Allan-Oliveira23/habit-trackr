import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import HabitForm from '../components/habits/HabitForm'
import HabitTable from '../components/dashboard/HabitTable'
import MonthSelector from '../components/dashboard/MonthSelector'
import ProgressChart from '../components/dashboard/ProgressChart'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import ProgressBar from '../components/ui/ProgressBar'
import { useHabits } from '../hooks/useHabits'
import type { Habit, HabitInput } from '../types/habit'
import {
  calculateDailyProgress,
  calculateGoalProgress,
  calculateHabitProgress,
  calculateCompletedCount,
  calculateIncompleteCount,
  calculateMonthlyProgress,
  calculatePossibleCount,
  calculateWeeklyProgress,
  completionKey,
} from '../utils/calculations'
import { dateKey, getDaysOfMonth, getWeeks } from '../utils/calendar'
import { formatPercent } from '../utils/formatters'
import { createHabit } from '../utils/habits'

type ModalState = { kind: 'form'; habit?: Habit } | { kind: 'delete'; habit: Habit } | null

export default function Dashboard() {
  const { state, dispatch } = useHabits()
  const { habits, completions, year, month } = state
  const [modal, setModal] = useState<ModalState>(null)

  const days = useMemo(() => getDaysOfMonth(year, month), [year, month])
  const dates = useMemo(() => days.map(dateKey), [days])
  const weeks = useMemo(() => getWeeks(days).map((w) => w.map(dateKey)), [days])
  const done = useMemo(
    () => new Set(completions.filter((c) => c.completed).map((c) => completionKey(c.habitId, c.date))),
    [completions],
  )

  const activeHabits = habits.filter((h) => h.active)
  const completed = calculateCompletedCount(habits, done, dates)
  const possible = calculatePossibleCount(habits, dates)
  const monthly = calculateMonthlyProgress(habits, done, dates)
  const chartData = dates.map((d, i) => ({ day: i + 1, percentage: calculateDailyProgress(habits, done, d) }))

  const close = () => setModal(null)
  const save = (input: HabitInput) => {
    if (modal?.kind === 'form' && modal.habit) {
      dispatch({ type: 'UPDATE_HABIT', payload: { id: modal.habit.id, ...input } })
    } else {
      dispatch({ type: 'ADD_HABIT', payload: createHabit(input) })
    }
    close()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MonthSelector />
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" onClick={() => setModal({ kind: 'form' })}>
            <Plus size={16} /> Novo hábito
          </Button>
        </div>
      </div>

      {habits.length === 0 ? (
        <Card>
          <p className="mb-3 text-muted">Você ainda não possui hábitos.</p>
          <Button variant="primary" onClick={() => setModal({ kind: 'form' })}>
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

          <Card title="Hábitos">
            <HabitTable
              habits={habits}
              days={days}
              done={done}
              onToggle={(habitId, date) => dispatch({ type: 'TOGGLE_COMPLETION', payload: { habitId, date } })}
              onEdit={(habit) => setModal({ kind: 'form', habit })}
              onDelete={(habit) => setModal({ kind: 'delete', habit })}
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
              <ul className="space-y-3">
                {weeks.map((w, i) => {
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

      {modal?.kind === 'form' && (
        <Modal title={modal.habit ? 'Editar hábito' : 'Novo hábito'} onClose={close}>
          <HabitForm initial={modal.habit} onSubmit={save} onCancel={close} />
        </Modal>
      )}
      {modal?.kind === 'delete' && (
        <Modal title="Excluir hábito?" onClose={close}>
          <p className="mb-4 text-sm text-muted">
            “{modal.habit.name}” será excluído e todo o histórico de conclusões dele também será removido. Para manter o histórico, desative o hábito.
          </p>
          <div className="flex justify-end gap-2">
            <Button onClick={close}>Cancelar</Button>
            <Button
              variant="danger"
              onClick={() => {
                dispatch({ type: 'DELETE_HABIT', payload: modal.habit.id })
                close()
              }}
            >
              Excluir
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
