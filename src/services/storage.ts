import type { AppSettings, Habit, HabitCompletion, PersistedData } from '../types/habit'

const KEY = 'habit-tracker-data'

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null

function normalizeHabit(v: unknown): Habit | null {
  if (!isObject(v) || typeof v.id !== 'string' || typeof v.name !== 'string' || !v.name.trim()) return null
  return {
    id: v.id,
    name: v.name,
    icon: typeof v.icon === 'string' ? v.icon : undefined,
    color: typeof v.color === 'string' ? v.color : undefined,
    active: typeof v.active === 'boolean' ? v.active : true,
    createdAt: typeof v.createdAt === 'string' ? v.createdAt : new Date().toISOString(),
    goal: typeof v.goal === 'number' && v.goal > 0 ? v.goal : undefined,
  }
}

function normalizeCompletion(v: unknown): HabitCompletion | null {
  if (!isObject(v) || typeof v.habitId !== 'string') return null
  if (typeof v.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v.date)) return null
  return { habitId: v.habitId, date: v.date, completed: v.completed === true }
}

/** Retorna null quando não há dados válidos (vazio, JSON inválido ou formato inesperado). */
export function loadData(): PersistedData | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isObject(parsed) || !Array.isArray(parsed.habits)) return null
    const settings: AppSettings = {}
    if (isObject(parsed.settings) && typeof parsed.settings.dailyGoal === 'number') {
      settings.dailyGoal = parsed.settings.dailyGoal
    }
    return {
      habits: parsed.habits.map(normalizeHabit).filter((h): h is Habit => h !== null),
      completions: (Array.isArray(parsed.completions) ? parsed.completions : [])
        .map(normalizeCompletion)
        .filter((c): c is HabitCompletion => c !== null),
      settings,
    }
  } catch {
    return null
  }
}

export function saveData(data: PersistedData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // armazenamento indisponível/cheio: a aplicação continua funcionando em memória
  }
}
