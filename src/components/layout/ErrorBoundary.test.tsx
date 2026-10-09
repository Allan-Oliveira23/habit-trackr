// @vitest-environment jsdom
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ErrorBoundary from './ErrorBoundary'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let shouldThrow = true
const Bomb = () => {
  if (shouldThrow) throw new Error('boom')
  return createElement('p', null, 'tudo certo')
}

afterEach(() => {
  shouldThrow = true
  vi.restoreAllMocks()
})

describe('ErrorBoundary', () => {
  it('mostra fallback com ações de recuperação e permite tentar novamente', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)
    await act(async () => root.render(createElement(ErrorBoundary, null, createElement(Bomb))))

    expect(container.querySelector('[role=alert]')?.textContent).toContain('Algo deu errado')
    const labels = [...container.querySelectorAll('button')].map((b) => b.textContent)
    expect(labels).toEqual(['Tentar novamente', 'Recarregar página', 'Baixar cópia dos dados', 'Apagar dados e recarregar'])

    shouldThrow = false
    await act(async () => (container.querySelector('button') as HTMLButtonElement).click())
    expect(container.textContent).toContain('tudo certo')
    await act(async () => root.unmount())
  })

  it('não renderiza fallback quando não há erro', async () => {
    shouldThrow = false
    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)
    await act(async () => root.render(createElement(ErrorBoundary, null, createElement(Bomb))))
    expect(container.querySelector('[role=alert]')).toBeNull()
    await act(async () => root.unmount())
  })
})
