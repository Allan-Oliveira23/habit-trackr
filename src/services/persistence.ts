import type { PersistedData } from '../types/habit'
import {
  clearData as clearLocal,
  getBackup as getLocalBackup,
  loadData as loadLocal,
  readRawData as readLocalRaw,
  saveData as saveLocal,
  type LoadResult,
} from './storage'

export type { LoadResult }

/**
 * Contrato de persistência usado pelo restante da aplicação.
 *
 * Hoje a única implementação é o `localStorage` (services/storage.ts). Para usar uma API,
 * crie outro adapter com este mesmo formato e troque o valor de `persistence` abaixo.
 *
 * Observação: uma API é assíncrona. Nesse caso `load` passaria a retornar `Promise<LoadResult>`
 * e o `HabitProvider` ganharia um estado de carregamento — a mudança fica restrita ao provider e
 * à criação do estado inicial; componentes e páginas só falam com o contexto e não são afetados.
 */
export interface PersistenceAdapter {
  /** Lê os dados salvos. `corrupted` indica conteúdo existente, mas inválido. */
  load(): LoadResult
  /** Grava os dados. Retorna false quando não foi possível gravar. */
  save(data: PersistedData): boolean
  /** Cópia do conteúdo ilegível guardada ao detectar corrupção, se houver. */
  getBackup(): string | null
  /** Conteúdo bruto atual, para exportar antes de apagar. */
  exportRaw(): string | null
  /** Remove os dados salvos. */
  clear(): void
}

const localStorageAdapter: PersistenceAdapter = {
  load: loadLocal,
  save: saveLocal,
  getBackup: getLocalBackup,
  exportRaw: readLocalRaw,
  clear: clearLocal,
}

export const persistence: PersistenceAdapter = localStorageAdapter
