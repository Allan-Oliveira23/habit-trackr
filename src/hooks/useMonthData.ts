import { useMemo } from 'react'
import { useHabits } from './useHabits'
import { completionKey } from '../utils/calculations'
import { dateKey, getDaysOfMonth } from '../utils/calendar'

/** Dados derivados do mês selecionado: dias, chaves de data e conjunto de conclusões. */
export function useMonthData() {
  const { state } = useHabits()
  const { year, month, completions } = state
  const days = useMemo(() => getDaysOfMonth(year, month), [year, month])
  const dates = useMemo(() => days.map(dateKey), [days])
  const done = useMemo(
    () => new Set(completions.filter((c) => c.completed).map((c) => completionKey(c.habitId, c.date))),
    [completions],
  )
  return { days, dates, done }
}
