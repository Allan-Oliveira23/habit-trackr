import { describe, expect, it } from 'vitest'
import type { Habit, HabitState } from '../types/habit'
import { habitReducer } from './habitReducer'

const habit = (id: string): Habit => ({ id, name: id, active: true, createdAt: '' })
const base = (): HabitState => ({ habits: [habit('a'), habit('b')], completions: [], settings: {}, notice: null, year: 2026, month: 9 })
const completed = (s: HabitState) => s.completions.filter((c) => c.completed).length

describe('habitReducer', () => {
  it('ADD/UPDATE/DELETE de hábito', () => {
    let s = habitReducer(base(), { type: 'ADD_HABIT', payload: habit('c') })
    expect(s.habits).toHaveLength(3)
    s = habitReducer(s, { type: 'UPDATE_HABIT', payload: { id: 'c', name: 'Novo', goal: 5 } })
    expect(s.habits[2]).toMatchObject({ name: 'Novo', goal: 5 })
    s = habitReducer(s, { type: 'DELETE_HABIT', payload: 'c' })
    expect(s.habits.map((h) => h.id)).toEqual(['a', 'b'])
  })

  it('TOGGLE_COMPLETION marca e desmarca', () => {
    const t = { type: 'TOGGLE_COMPLETION', payload: { habitId: 'a', date: '2026-10-05' } } as const
    let s = habitReducer(base(), t)
    expect(completed(s)).toBe(1)
    s = habitReducer(s, t)
    expect(completed(s)).toBe(0)
    s = habitReducer(s, t)
    expect(completed(s)).toBe(1)
  })

  it('desativar mantém o histórico; excluir remove o histórico do hábito', () => {
    let s = habitReducer(base(), { type: 'TOGGLE_COMPLETION', payload: { habitId: 'a', date: '2026-10-05' } })
    s = habitReducer(s, { type: 'TOGGLE_HABIT_ACTIVE', payload: 'a' })
    expect(s.habits[0].active).toBe(false)
    expect(s.completions).toHaveLength(1)
    s = habitReducer(s, { type: 'DELETE_HABIT', payload: 'a' })
    expect(s.completions).toHaveLength(0)
  })

  it('SET_MONTH, SET_YEAR, SET_DAILY_GOAL e SET_NOTICE', () => {
    let s = habitReducer(base(), { type: 'SET_MONTH', payload: 1 })
    s = habitReducer(s, { type: 'SET_YEAR', payload: 2028 })
    s = habitReducer(s, { type: 'SET_DAILY_GOAL', payload: 3 })
    s = habitReducer(s, { type: 'SET_NOTICE', payload: 'save-failed' })
    expect(s).toMatchObject({ month: 1, year: 2028, notice: 'save-failed', settings: { dailyGoal: 3 } })
  })

  it('RESET_DATA restaura os hábitos de exemplo e limpa histórico, metas e aviso', () => {
    const dirty = { ...base(), completions: [{ habitId: 'a', date: '2026-10-05', completed: true }], settings: { dailyGoal: 2 }, notice: 'corrupted' as const }
    const s = habitReducer(dirty, { type: 'RESET_DATA' })
    expect(s.habits).toHaveLength(5)
    expect(s).toMatchObject({ completions: [], settings: {}, notice: null })
  })
})
