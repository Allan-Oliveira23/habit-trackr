import { describe, expect, it } from 'vitest'
import type { Habit } from '../types/habit'
import {
  calculateBestDays,
  calculateDailyGoalProgress,
  calculateDailyProgress,
  calculateDaysGoalMet,
  calculateGoalProgress,
  calculateHabitProgress,
  calculateIncompleteCount,
  calculateMonthlyProgress,
  calculatePossibleCount,
  calculateWeeklyProgress,
  completionKey,
  toPercent,
} from './calculations'
import { dateKey, getDaysOfMonth } from './calendar'

const habit = (id: string, active = true, goal?: number): Habit => ({ id, name: id, active, goal, createdAt: '' })
const doneSet = (...entries: [string, string][]) => new Set(entries.map(([id, d]) => completionKey(id, d)))
const feb = getDaysOfMonth(2026, 1).map(dateKey)

describe('toPercent', () => {
  it('arredonda a 1 casa, limita a 100 e trata total 0', () => {
    expect(toPercent(1, 3)).toBe(33.3)
    expect(toPercent(5, 3)).toBe(100)
    expect(toPercent(0, 0)).toBe(0)
  })
})

describe('progresso mensal / semanal / diário', () => {
  it('sem hábitos ou sem conclusões é 0', () => {
    expect(calculateMonthlyProgress([], new Set(), feb)).toBe(0)
    expect(calculateMonthlyProgress([habit('a')], new Set(), feb)).toBe(0)
  })

  it('todos os dias concluídos é 100 (fevereiro com 28 dias)', () => {
    const all = new Set(feb.map((d) => completionKey('a', d)))
    expect(calculatePossibleCount([habit('a')], feb)).toBe(28)
    expect(calculateMonthlyProgress([habit('a')], all, feb)).toBe(100)
  })

  it('hábito inativo não entra no cálculo', () => {
    const all = new Set(feb.map((d) => completionKey('a', d)))
    expect(calculateMonthlyProgress([habit('a'), habit('b', false)], all, feb)).toBe(100)
  })

  it('progresso diário e semanal usam só as datas do período', () => {
    const habits = [habit('a'), habit('b')]
    const done = doneSet(['a', '2026-02-01'], ['a', '2026-02-02'], ['b', '2026-02-02'])
    expect(calculateDailyProgress(habits, done, '2026-02-01')).toBe(50)
    expect(calculateDailyProgress(habits, done, '2026-02-02')).toBe(100)
    expect(calculateWeeklyProgress(habits, done, ['2026-02-01', '2026-02-02'])).toBe(75)
    expect(calculateIncompleteCount(habits, done, ['2026-02-01', '2026-02-02'])).toBe(1)
  })
})

describe('progresso por hábito e metas', () => {
  it('dias concluídos / dias do mês', () => {
    const done = doneSet(['a', '2026-02-01'], ['a', '2026-02-03'])
    expect(calculateHabitProgress('a', done, feb)).toEqual({ completed: 2, total: 28, percent: 7.1 })
  })

  it('meta do hábito', () => {
    expect(calculateGoalProgress(habit('a', true, 10), 5)).toBe(50)
    expect(calculateGoalProgress(habit('a'), 5)).toBe(0)
  })

  it('meta diária e dias com meta atingida', () => {
    const habits = [habit('a'), habit('b')]
    const done = doneSet(['a', '2026-02-01'], ['b', '2026-02-01'], ['a', '2026-02-02'])
    expect(calculateDailyGoalProgress(1, 3)).toBe(33.3)
    expect(calculateDaysGoalMet(habits, done, feb, 2)).toBe(1)
    expect(calculateDaysGoalMet(habits, done, feb, 0)).toBe(0)
  })
})

describe('calculateBestDays', () => {
  it('ordena por progresso, desempata pela data mais antiga e ignora dias sem conclusão', () => {
    const habits = [habit('a'), habit('b')]
    const done = doneSet(['a', '2026-10-01'], ['b', '2026-10-01'], ['a', '2026-10-02'], ['a', '2026-10-03'])
    const best = calculateBestDays(habits, done, ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'], 2)
    expect(best.map((d) => [d.date, d.percent])).toEqual([
      ['2026-10-01', 100],
      ['2026-10-02', 50],
    ])
  })
})
