import { useContext } from 'react'
import { HabitContext } from '../context/HabitContext'

export function useHabits() {
  const ctx = useContext(HabitContext)
  if (!ctx) throw new Error('useHabits deve ser usado dentro de <HabitProvider>')
  return ctx
}
