import type { Habit, HabitInput } from '../types/habit'

export const createHabit = (input: HabitInput): Habit => ({
  id: crypto.randomUUID(),
  name: input.name.trim(),
  icon: input.icon?.trim() || undefined,
  goal: input.goal,
  active: true,
  createdAt: new Date().toISOString(),
})
