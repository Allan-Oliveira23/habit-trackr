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

/** Data real no formato YYYY-MM-DD (rejeita, por exemplo, 2026-02-30 e 2026-13-01). */
function isValidDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d
}

function normalizeCompletion(v: unknown): HabitCompletion | null {
  if (!isObject(v) || typeof v.habitId !== 'string') return null
  if (typeof v.date !== 'string' || !isValidDateKey(v.date)) return null
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
    // ids de hábito repetidos: mantém o primeiro
    const byId = new Map<string, Habit>()
    for (const raw of parsed.habits) {
      const habit = normalizeHabit(raw)
      if (habit && !byId.has(habit.id)) byId.set(habit.id, habit)
    }
    const habits = [...byId.values()]
    const ids = new Set(habits.map((h) => h.id))
    // descarta conclusões órfãs (hábito inexistente) e repetidas (a última prevalece)
    const unique = new Map<string, HabitCompletion>()
    for (const raw of Array.isArray(parsed.completions) ? parsed.completions : []) {
      const c = normalizeCompletion(raw)
      if (c && ids.has(c.habitId)) unique.set(`${c.habitId}|${c.date}`, c)
    }
    return { habits, completions: [...unique.values()], settings }
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

/** Conteúdo atual salvo, sem validação (para exportar antes de apagar). */
export function readRawData(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

/** Remove os dados salvos (usado na recuperação de erros graves). */
export function clearData(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // sem armazenamento: nada a limpar
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
