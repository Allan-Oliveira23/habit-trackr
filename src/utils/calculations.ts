import type { Habit } from '../types/habit'

export type CompletionSet = ReadonlySet<string>

export const completionKey = (habitId: string, date: string): string => `${habitId}|${date}`

/** Percentual limitado a 100, com uma casa decimal. */
export const toPercent = (part: number, total: number): number =>
  total <= 0 ? 0 : Math.min(100, Math.round((part / total) * 1000) / 10)

const activeOf = (habits: Habit[]) => habits.filter((h) => h.active)

export function calculateCompletedCount(habits: Habit[], done: CompletionSet, dates: string[]): number {
  let count = 0
  for (const h of activeOf(habits)) for (const d of dates) if (done.has(completionKey(h.id, d))) count++
  return count
}

export const calculatePossibleCount = (habits: Habit[], dates: string[]): number =>
  activeOf(habits).length * dates.length

export const calculateIncompleteCount = (habits: Habit[], done: CompletionSet, dates: string[]): number =>
  calculatePossibleCount(habits, dates) - calculateCompletedCount(habits, done, dates)

/** Progresso de um conjunto de datas (dia, semana ou mês). */
export const calculatePeriodProgress = (habits: Habit[], done: CompletionSet, dates: string[]): number =>
  toPercent(calculateCompletedCount(habits, done, dates), calculatePossibleCount(habits, dates))

export const calculateDailyProgress = (habits: Habit[], done: CompletionSet, date: string): number =>
  calculatePeriodProgress(habits, done, [date])
export const calculateWeeklyProgress = calculatePeriodProgress
export const calculateMonthlyProgress = calculatePeriodProgress

export function calculateHabitProgress(habitId: string, done: CompletionSet, dates: string[]) {
  const completed = dates.filter((d) => done.has(completionKey(habitId, d))).length
  return { completed, total: dates.length, percent: toPercent(completed, dates.length) }
}

export const calculateGoalProgress = (habit: Habit, completedDays: number): number =>
  habit.goal ? toPercent(completedDays, habit.goal) : 0

/** Progresso de um dia em relação à meta diária (nº de hábitos a concluir por dia). */
export const calculateDailyGoalProgress = (completedInDay: number, dailyGoal: number): number =>
  toPercent(completedInDay, dailyGoal)

/** Quantidade de dias em que a meta diária foi atingida. */
export const calculateDaysGoalMet = (habits: Habit[], done: CompletionSet, dates: string[], dailyGoal: number): number =>
  dailyGoal > 0 ? dates.filter((d) => calculateCompletedCount(habits, done, [d]) >= dailyGoal).length : 0

/** Total de conclusões registradas no histórico (hábitos existentes). */
export const calculateTotalCompletions = (done: CompletionSet): number => done.size

/** Dias com mais conclusões, ordenados por progresso (empate: data mais antiga). Ignora dias sem conclusões. */
export function calculateBestDays(habits: Habit[], done: CompletionSet, dates: string[], limit = 3) {
  return dates
    .map((date) => ({
      date,
      completed: calculateCompletedCount(habits, done, [date]),
      percent: calculateDailyProgress(habits, done, date),
    }))
    .filter((d) => d.completed > 0)
    .sort((a, b) => b.percent - a.percent || a.date.localeCompare(b.date))
    .slice(0, limit)
}
