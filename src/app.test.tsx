// @vitest-environment jsdom
import { act, createElement } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { HabitProvider } from './context/HabitContext'

// O Recharts não calcula layout no jsdom (largura 0); o gráfico é coberto por cálculo e por teste em navegador.
vi.mock('./components/dashboard/ProgressChart', () => ({ default: () => createElement('div', { role: 'img', 'aria-label': 'gráfico' }) }))

// React exige este flag para `act` em ambientes de teste.
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
;(globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

let container: HTMLElement
let root: Root

const must = <T,>(value: T | null | undefined, what: string): T => {
  if (value === null || value === undefined) throw new Error(`Não encontrado: ${what}`)
  return value
}
const mount = async () => {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  await act(async () => root.render(createElement(HabitProvider, null, createElement(App))))
}
const unmount = async () => {
  await act(async () => root.unmount())
  container.remove()
}
const reload = async () => {
  await unmount()
  await mount()
}
const text = () => container.textContent ?? ''
const btn = (label: string, scope: ParentNode = container) =>
  must(
    [...scope.querySelectorAll('button')].find((b) => b.textContent?.trim() === label || b.getAttribute('aria-label') === label),
    `botão "${label}"`,
  )
const click = (el: Element) => act(async () => (el as HTMLElement).click())
const dialog = () => document.querySelector('[role=dialog]')
const inDialog = (label: string) => btn(label, must(dialog(), 'diálogo'))
const nav = (label: string) => click(btn(label, must(container.querySelector('nav'), 'nav')))
const setValue = async (input: HTMLInputElement, value: string) => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, value)
  await act(async () => void input.dispatchEvent(new Event('input', { bubbles: true })))
}
const dialogInputs = () => [...document.querySelectorAll<HTMLInputElement>('[role=dialog] input')]
const cell = (habit: string, dd: string) =>
  must(container.querySelector<HTMLElement>(`[role=checkbox][aria-label^="${habit}, ${dd}/10/2026"]`), `célula ${habit} ${dd}`)
const checked = (el: Element) => el.getAttribute('aria-checked') === 'true'
const monthLabel = () => must(container.querySelector('[aria-live=polite]'), 'mês').textContent
const columns = () => container.querySelectorAll('tbody tr:first-child [role=checkbox]').length
const stored = () => JSON.parse(localStorage.getItem('habit-tracker-data') ?? 'null')
const goToMonth = async (label: string, direction: 'Próximo mês' | 'Mês anterior') => {
  for (let i = 0; i < 24 && monthLabel() !== label; i++) await click(btn(direction))
  expect(monthLabel()).toBe(label)
}

beforeEach(async () => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 9, 8, 12)) // quinta, 08/10/2026
  localStorage.clear()
  await mount()
})
afterEach(async () => {
  await unmount()
  vi.useRealTimers()
})

describe('primeiro acesso', () => {
  it('abre com os hábitos de exemplo no mês atual', () => {
    expect(monthLabel()).toBe('Outubro de 2026')
    expect(text()).toContain('Treinar no Gym')
    expect(columns()).toBe(31)
  })
})

describe('CRUD de hábitos', () => {
  it('criar: valida o nome, cria com ícone e meta e persiste', async () => {
    await click(btn('Novo hábito'))
    await click(inDialog('Criar hábito'))
    expect(must(document.querySelector('[role=alert]'), 'erro').textContent).toContain('Informe o nome')
    const [name, icon, goal] = dialogInputs()
    await setValue(name, 'Ler 20 páginas')
    await setValue(icon, '📚')
    await setValue(goal, '10')
    await click(inDialog('Criar hábito'))
    expect(dialog()).toBeNull()
    expect(text()).toContain('Ler 20 páginas')
    expect(stored().habits.at(-1)).toMatchObject({ name: 'Ler 20 páginas', icon: '📚', goal: 10 })
  })

  it('editar', async () => {
    await nav('Hábitos')
    await click(btn('Editar Tomar água'))
    await setValue(dialogInputs()[0], 'Beber 2 L de água')
    await click(inDialog('Salvar'))
    expect(text()).toContain('Beber 2 L de água')
    expect(text()).not.toContain('Tomar água')
  })

  it('ativar/desativar mantém o histórico e tira o hábito do cálculo', async () => {
    await click(cell('Treinar no Gym', '05'))
    expect(text()).toContain('1 / 155 possíveis')
    await click(btn('Desativar Treinar no Gym'))
    expect(text()).toContain('0 / 124 possíveis') // 4 hábitos ativos × 31 dias
    expect(stored().completions).toHaveLength(1) // histórico preservado
    await click(btn('Ativar Treinar no Gym'))
    expect(text()).toContain('1 / 155 possíveis')
  })

  it('excluir: cancelar não remove; confirmar remove hábito e histórico', async () => {
    await click(cell('Tomar água', '05'))
    await nav('Hábitos')
    await click(btn('Excluir Tomar água'))
    expect(must(dialog(), 'diálogo').textContent).toContain('histórico')
    await click(inDialog('Cancelar'))
    expect(text()).toContain('Tomar água')
    await click(btn('Excluir Tomar água'))
    await click(inDialog('Excluir'))
    expect(text()).not.toContain('Tomar água')
    expect(stored().completions).toHaveLength(0)
  })
})

describe('marcação e progresso', () => {
  it('marcar e desmarcar atualizam a célula e o progresso', async () => {
    const c = cell('Treinar no Gym', '05')
    expect(checked(c)).toBe(false)
    await click(c)
    expect(checked(c)).toBe(true)
    expect(text()).toContain('1 / 155 possíveis')
    await click(c)
    expect(checked(c)).toBe(false)
    expect(text()).toContain('0 / 155 possíveis')
  })

  it('persiste após reload', async () => {
    await click(cell('Treinar no Gym', '05'))
    await reload()
    expect(checked(cell('Treinar no Gym', '05'))).toBe(true)
  })

  it('meta diária aparece no dashboard e persiste', async () => {
    await setValue(must(container.querySelector<HTMLInputElement>('input[type=number]'), 'meta'), '3')
    await click(cell('Treinar no Gym', '08'))
    expect(text()).toContain('Hoje: 1 / 3')
    await reload()
    expect(must(container.querySelector<HTMLInputElement>('input[type=number]'), 'meta').value).toBe('3')
  })
})

describe('calendário e navegação de mês', () => {
  it.each([
    ['Novembro de 2026', 30],
    ['Dezembro de 2026', 31],
    ['Janeiro de 2027', 31], // virada de ano
    ['Fevereiro de 2027', 28],
    ['Fevereiro de 2028', 29], // bissexto
  ])('avançar até %s mostra %i colunas', async (label, days) => {
    await goToMonth(label, 'Próximo mês')
    expect(columns()).toBe(days)
  })

  it('voltar mês e virada de ano para trás', async () => {
    await goToMonth('Janeiro de 2026', 'Mês anterior')
    expect(columns()).toBe(31)
    await click(btn('Mês anterior'))
    expect(monthLabel()).toBe('Dezembro de 2025')
  })

  it('"Hoje" volta ao mês atual', async () => {
    await click(btn('Próximo mês'))
    await click(btn('Hoje'))
    expect(monthLabel()).toBe('Outubro de 2026')
  })
})

describe('configurações', () => {
  it('resetar dados exige confirmação e restaura o estado inicial', async () => {
    await click(cell('Treinar no Gym', '05'))
    await nav('Hábitos')
    await click(btn('Excluir Tomar água'))
    await click(inDialog('Excluir'))
    await nav('Configurações')
    await click(btn('Resetar dados'))
    await click(inDialog('Cancelar'))
    expect(stored().habits).toHaveLength(4)
    await click(btn('Resetar dados'))
    await click(inDialog('Apagar tudo e resetar'))
    expect(stored()).toMatchObject({ habits: expect.any(Array), completions: [] })
    expect(stored().habits).toHaveLength(5)
  })
})

describe('estados de erro', () => {
  it('dados corrompidos: avisa, preserva cópia e abre com dados de exemplo', async () => {
    await unmount()
    localStorage.setItem('habit-tracker-data', '{quebrado')
    await mount()
    expect(must(container.querySelector('[role=alert]'), 'aviso').textContent).toContain('Não foi possível ler')
    expect(localStorage.getItem('habit-tracker-data-backup')).toBe('{quebrado')
    expect(text()).toContain('Treinar no Gym')
  })
})
