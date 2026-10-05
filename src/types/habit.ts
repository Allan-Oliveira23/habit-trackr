export interface Habit {
  id: string
  name: string
  icon?: string
  color?: string
  active: boolean
  createdAt: string
  goal?: number
}

export interface HabitCompletion {
  habitId: string
  date: string // YYYY-MM-DD
  completed: boolean
}

export interface AppSettings {
  dailyGoal?: number
}

export interface PersistedData {
  habits: Habit[]
  completions: HabitCompletion[]
  settings: AppSettings
}

export interface HabitState extends PersistedData {
  year: number
  month: number // 0-11
}

export interface HabitInput {
  name: string
  icon?: string
  goal?: number
}
