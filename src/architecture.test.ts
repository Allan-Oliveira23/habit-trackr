import { describe, expect, it } from 'vitest'

// Guardas de arquitetura: mantêm a persistência trocável (localStorage → API) sem reescrever componentes.
const all = import.meta.glob('/src/**/*.{ts,tsx}', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const sources = Object.entries(all).filter(([path]) => !/\.test\.tsx?$/.test(path))
const outside = (folder: string) => sources.filter(([path]) => !path.startsWith(`/src/${folder}/`))
const importsOf = (code: string) => [...code.matchAll(/from\s+'([^']+)'/g)].map((m) => m[1])

describe('arquitetura de persistência', () => {
  it('nenhum arquivo fora de services acessa localStorage/sessionStorage', () => {
    const offenders = outside('services').filter(([, code]) => /\b(localStorage|sessionStorage)\b/.test(code))
    expect(offenders.map(([path]) => path)).toEqual([])
  })

  it('fora de services, só se usa a interface (persistence), nunca o módulo concreto storage', () => {
    const offenders = outside('services').filter(([, code]) => importsOf(code).some((i) => /(^|\/)storage$/.test(i)))
    expect(offenders.map(([path]) => path)).toEqual([])
  })

  it('componentes e páginas não importam services diretamente, exceto a interface de persistência', () => {
    const ui = sources.filter(([path]) => path.startsWith('/src/components/') || path.startsWith('/src/pages/'))
    const offenders = ui.filter(([, code]) => importsOf(code).some((i) => /services\//.test(i) && !/services\/persistence$/.test(i)))
    expect(offenders.map(([path]) => path)).toEqual([])
  })
})

describe('domínio e cálculos independentes de persistência e de React', () => {
  it.each(['/src/utils/calculations.ts', '/src/utils/calendar.ts'])('%s só importa types, date-fns e utils', (file) => {
    const code = all[file]
    const bad = importsOf(code).filter((i) => !/^(date-fns|\.\.?\/(types|utils)\/|\.\/)/.test(i) && !i.startsWith('date-fns'))
    expect(bad).toEqual([])
  })

  it('types não importam nada além de types', () => {
    const typeFiles = sources.filter(([path]) => path.startsWith('/src/types/'))
    const bad = typeFiles.flatMap(([path, code]) => importsOf(code).filter((i) => !i.startsWith('./')).map((i) => `${path}: ${i}`))
    expect(bad).toEqual([])
  })
})
