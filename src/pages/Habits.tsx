import { Plus } from 'lucide-react'
import MonthSelector from '../components/dashboard/MonthSelector'
import HabitList from '../components/habits/HabitList'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useHabitDialogs } from '../hooks/useHabitDialogs'
import { useHabits } from '../hooks/useHabits'
import { useMonthData } from '../hooks/useMonthData'

export default function Habits() {
  const { state, dispatch } = useHabits()
  const { dates, done } = useMonthData()
  const { openCreate, openEdit, openDelete, dialogs } = useHabitDialogs()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MonthSelector />
        <Button variant="primary" onClick={openCreate}>
          <Plus size={16} /> Novo hábito
        </Button>
      </div>
      {state.habits.length === 0 ? (
        <Card>
          <p className="mb-3 text-muted">Você ainda não possui hábitos.</p>
          <Button variant="primary" onClick={openCreate}>
            + Criar primeiro hábito
          </Button>
        </Card>
      ) : (
        <HabitList
          habits={state.habits}
          dates={dates}
          done={done}
          onEdit={openEdit}
          onDelete={openDelete}
          onToggleActive={(h) => dispatch({ type: 'TOGGLE_HABIT_ACTIVE', payload: h.id })}
        />
      )}
      {dialogs}
    </div>
  )
}
