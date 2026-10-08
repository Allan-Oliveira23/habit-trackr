import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getBackup, loadData, saveData } from './storage'

const KEY = 'habit-tracker-data'
let store: Map<string, string>

beforeEach(() => {
  store = new Map()
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  })
})
afterEach(() => vi.unstubAllGlobals())

describe('storage', () => {
  it('localStorage vazio: sem dados e sem erro', () => {
    expect(loadData()).toEqual({ data: null, corrupted: false })
  })

  it('grava e lê de volta', () => {
    const data = { habits: [{ id: 'a', name: 'A', active: true, createdAt: 'x' }], completions: [{ habitId: 'a', date: '2026-10-01', completed: true }], settings: { dailyGoal: 2 } }
    expect(saveData(data)).toBe(true)
    expect(loadData()).toEqual({ data, corrupted: false })
  })

  it('JSON inválido: sinaliza corrupção e guarda cópia do original', () => {
    store.set(KEY, '{quebrado')
    expect(loadData()).toEqual({ data: null, corrupted: true })
    expect(getBackup()).toBe('{quebrado')
  })

  it('formato inesperado (sem habits) também é tratado como corrompido', () => {
    store.set(KEY, '{"foo":1}')
    expect(loadData().corrupted).toBe(true)
  })

  it('campos ausentes ou inválidos são normalizados/descartados', () => {
    store.set(KEY, JSON.stringify({ habits: [{ id: 'x', name: 'Y' }, { foo: 1 }, { id: 'z', name: '  ' }], completions: [1, { habitId: 'x', date: 'ruim' }, { habitId: 'x', date: '2026-10-01' }] }))
    const { data } = loadData()
    expect(data?.habits).toHaveLength(1)
    expect(data?.habits[0].active).toBe(true)
    expect(data?.completions).toEqual([{ habitId: 'x', date: '2026-10-01', completed: false }])
  })

  it('saveData retorna false quando o armazenamento falha', () => {
    vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => { throw new Error('QuotaExceededError') } })
    expect(saveData({ habits: [], completions: [], settings: {} })).toBe(false)
  })
})
