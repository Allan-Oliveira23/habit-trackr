import type { AppSettings, Habit, HabitCompletion, PersistedData } from '../types/habit'

const KEY = 'habit-tracker-data'
const BACKUP_KEY = 'habit-tracker-data-backup'

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

export interface LoadResult {
  data: PersistedData | null
  /** true quando havia conteúdo salvo, mas ilegível/inválido (uma cópia fica em BACKUP_KEY). */
  corrupted: boolean
}

function parseStored(raw: string): PersistedData | null {
  try {
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

export function loadData(): LoadResult {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { data: null, corrupted: false }
    const data = parseStored(raw)
    if (data) return { data, corrupted: false }
    localStorage.setItem(BACKUP_KEY, raw) // preserva o conteúdo antes de ser sobrescrito
    return { data: null, corrupted: true }
  } catch {
    return { data: null, corrupted: false }
  }
}

/** Conteúdo original guardado quando os dados salvos estavam inválidos. */
export function getBackup(): string | null {
  try {
    return localStorage.getItem(BACKUP_KEY)
  } catch {
    return null
  }
}

/** Retorna false quando não foi possível gravar (armazenamento indisponível ou cheio). */
export function saveData(data: PersistedData): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}
