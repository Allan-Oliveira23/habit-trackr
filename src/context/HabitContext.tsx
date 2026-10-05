import { createContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import { saveData } from '../services/storage'
import type { HabitState } from '../types/habit'
import { createInitialState, habitReducer, type HabitAction } from './habitReducer'

interface HabitContextValue {
  state: HabitState
  dispatch: Dispatch<HabitAction>
}

export const HabitContext = createContext<HabitContextValue | null>(null)

export function HabitProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(habitReducer, undefined, createInitialState)

  // Auto-save: toda alteração de dados persistentes é gravada.
  useEffect(() => {
    saveData({ habits: state.habits, completions: state.completions, settings: state.settings })
  }, [state.habits, state.completions, state.settings])

  return <HabitContext.Provider value={{ state, dispatch }}>{children}</HabitContext.Provider>
}
