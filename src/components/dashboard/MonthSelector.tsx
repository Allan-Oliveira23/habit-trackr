import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addMonths } from 'date-fns'
import { useHabits } from '../../hooks/useHabits'
import { formatMonthLabel } from '../../utils/calendar'
import Button from '../ui/Button'

export default function MonthSelector() {
  const { state, dispatch } = useHabits()

  const go = (date: Date) => {
    dispatch({ type: 'SET_YEAR', payload: date.getFullYear() })
    dispatch({ type: 'SET_MONTH', payload: date.getMonth() })
  }
  const shift = (n: number) => go(addMonths(new Date(state.year, state.month, 1), n))

  return (
    <div className="flex items-center gap-2">
      <Button aria-label="Mês anterior" onClick={() => shift(-1)}>
        <ChevronLeft size={16} />
      </Button>
      <span aria-live="polite" className="min-w-40 text-center text-sm font-semibold capitalize">
        {formatMonthLabel(state.year, state.month)}
      </span>
      <Button aria-label="Próximo mês" onClick={() => shift(1)}>
        <ChevronRight size={16} />
      </Button>
      <Button onClick={() => go(new Date())}>Hoje</Button>
    </div>
  )
}
