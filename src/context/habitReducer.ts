import { createSeedHabits } from '../data/seed'
import { loadData } from '../services/storage'
import type { Habit, HabitState } from '../types/habit'

export type HabitAction =
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: Pick<Habit, 'id'> & Partial<Omit<Habit, 'id'>> }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'TOGGLE_HABIT_ACTIVE'; payload: string }
  | { type: 'TOGGLE_COMPLETION'; payload: { habitId: string; date: string } }
  | { type: 'SET_MONTH'; payload: number }
  | { type: 'SET_YEAR'; payload: number }
  | { type: 'RESET_DATA' }

const currentPeriod = () => ({ year: new Date().getFullYear(), month: new Date().getMonth() })

export const createInitialState = (): HabitState => {
  const saved = loadData()
  return { ...(saved ?? { habits: createSeedHabits(), completions: [], settings: {} }), ...currentPeriod() }
}

export function habitReducer(state: HabitState, action: HabitAction): HabitState {
  switch (action.type) {
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] }
    case 'UPDATE_HABIT':
      return { ...state, habits: state.habits.map((h) => (h.id === action.payload.id ? { ...h, ...action.payload } : h)) }
    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter((h) => h.id !== action.payload),
        completions: state.completions.filter((c) => c.habitId !== action.payload),
      }
    case 'TOGGLE_HABIT_ACTIVE':
      return { ...state, habits: state.habits.map((h) => (h.id === action.payload ? { ...h, active: !h.active } : h)) }
    case 'TOGGLE_COMPLETION': {
      const { habitId, date } = action.payload
      const exists = state.completions.some((c) => c.habitId === habitId && c.date === date)
      const completions = exists
        ? state.completions.map((c) => (c.habitId === habitId && c.date === date ? { ...c, completed: !c.completed } : c))
        : [...state.completions, { habitId, date, completed: true }]
      return { ...state, completions }
    }
    case 'SET_MONTH':
      return { ...state, month: action.payload }
    case 'SET_YEAR':
      return { ...state, year: action.payload }
    case 'RESET_DATA':
      return { habits: createSeedHabits(), completions: [], settings: {}, ...currentPeriod() }
  }
}
