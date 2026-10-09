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

  describe('dados antigos ou malformados', () => {
    const load = (value: unknown) => {
      store.set(KEY, JSON.stringify(value))
      return loadData().data
    }

    it('formato antigo só com hábitos (sem completions nem settings)', () => {
      expect(load({ habits: [{ id: 'a', name: 'A' }] })).toEqual({
        habits: [expect.objectContaining({ id: 'a', active: true })],
        completions: [],
        settings: {},
      })
    })

    it('ignora campos desconhecidos e tipos errados em settings, goal e active', () => {
      const data = load({ versao: 1, habits: [{ id: 'a', name: 'A', active: 'sim', goal: '10', extra: true }], settings: 'x' })
      expect(data?.habits[0]).toMatchObject({ active: true, goal: undefined })
      expect(data?.settings).toEqual({})
    })

    it('entradas nulas ou de tipo errado nas listas não quebram a leitura', () => {
      const data = load({ habits: [null, 5, 'x', { id: 'a', name: 'A' }], completions: [null, 'x', [], { habitId: 'a', date: '2026-10-01', completed: true }] })
      expect(data?.habits).toHaveLength(1)
      expect(data?.completions).toHaveLength(1)
    })

    it('ids de hábito repetidos: mantém o primeiro', () => {
      const data = load({ habits: [{ id: 'a', name: 'Primeiro' }, { id: 'a', name: 'Segundo' }] })
      expect(data?.habits).toHaveLength(1)
      expect(data?.habits[0].name).toBe('Primeiro')
    })

    it('descarta conclusões órfãs, repetidas (a última prevalece) e de datas inexistentes', () => {
      const data = load({
        habits: [{ id: 'a', name: 'A' }],
        completions: [
          { habitId: 'fantasma', date: '2026-10-01', completed: true },
          { habitId: 'a', date: '2026-10-02', completed: true },
          { habitId: 'a', date: '2026-10-02', completed: false },
          { habitId: 'a', date: '2026-02-30', completed: true },
          { habitId: 'a', date: '2026-13-01', completed: true },
        ],
      })
      expect(data?.completions).toEqual([{ habitId: 'a', date: '2026-10-02', completed: false }])
    })

    it('aceita 29/02 de ano bissexto e rejeita em ano comum', () => {
      const data = load({
        habits: [{ id: 'a', name: 'A' }],
        completions: [
          { habitId: 'a', date: '2028-02-29', completed: true },
          { habitId: 'a', date: '2027-02-29', completed: true },
        ],
      })
      expect(data?.completions.map((c) => c.date)).toEqual(['2028-02-29'])
    })

    it('valores que não são objeto (array, número, null, string) são tratados como corrompidos', () => {
      for (const raw of ['[]', '42', 'null', '"texto"']) {
        store.set(KEY, raw)
        expect(loadData().corrupted).toBe(true)
      }
    })
  })
})
