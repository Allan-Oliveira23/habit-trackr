import { eachDayOfInterval, endOfMonth, format, getDay, startOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const dateKey = (d: Date): string => format(d, 'yyyy-MM-dd')

export const getDaysOfMonth = (year: number, month: number): Date[] => {
  const start = new Date(year, month, 1)
  return eachDayOfInterval({ start, end: endOfMonth(start) })
}

/** Semana do mês (0-based), começando na segunda-feira. */
export const getWeekIndex = (d: Date): number => {
  const offset = (getDay(startOfMonth(d)) + 6) % 7
  return Math.floor((d.getDate() - 1 + offset) / 7)
}

export const getWeeks = (days: Date[]): Date[][] => {
  const weeks: Date[][] = []
  for (const d of days) (weeks[getWeekIndex(d)] ??= []).push(d)
  return weeks
}

export const formatMonthLabel = (year: number, month: number): string => {
  const label = format(new Date(year, month, 1), "MMMM 'de' yyyy", { locale: ptBR })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export const formatFullDate = (d: Date): string => format(d, 'dd/MM/yyyy')

export const weekdayInitial = (d: Date): string => format(d, 'EEEEE', { locale: ptBR }).toUpperCase()
