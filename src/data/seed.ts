import type { Habit } from '../types/habit'

export const createSeedHabits = (): Habit[] =>
  [
    { id: 'gym', name: 'Treinar no Gym', icon: '🏋️' },
    { id: 'water', name: 'Tomar água', icon: '💧' },
    { id: 'run', name: 'Correr mais de 5 km', icon: '🏃' },
    { id: 'gratitude', name: 'Agradecer a Deus', icon: '🙏' },
    { id: 'wake-up', name: 'Levantar às 5 AM', icon: '⏰' },
  ].map((h) => ({ ...h, active: true, createdAt: new Date().toISOString() }))
