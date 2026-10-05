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
