import { createContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import { persistence } from '../services/persistence'
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
    const saved = persistence.save({ habits: state.habits, completions: state.completions, settings: state.settings })
    if (!saved) dispatch({ type: 'SET_NOTICE', payload: 'save-failed' })
  }, [state.habits, state.completions, state.settings])

  return <HabitContext.Provider value={{ state, dispatch }}>{children}</HabitContext.Provider>
}
