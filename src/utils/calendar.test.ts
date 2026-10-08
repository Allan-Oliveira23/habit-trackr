import { describe, expect, it } from 'vitest'
import { dateKey, formatMonthLabel, getDaysOfMonth, getWeeks } from './calendar'

describe('getDaysOfMonth', () => {
  it.each([
    [2026, 0, 31],
    [2026, 1, 28],
    [2028, 1, 29], // bissexto
    [2000, 1, 29], // divisível por 400
    [2100, 1, 28], // divisível por 100, não por 400
    [2026, 3, 30],
    [2026, 11, 31],
  ])('ano %i, mês %i tem %i dias', (year, month, expected) => {
    expect(getDaysOfMonth(year, month)).toHaveLength(expected)
  })

  it('começa no dia 1 e termina no último dia, em ordem', () => {
    const days = getDaysOfMonth(2026, 9)
    expect(dateKey(days[0])).toBe('2026-10-01')
    expect(dateKey(days[days.length - 1])).toBe('2026-10-31')
  })

  it('virada de ano: dezembro termina em 31/12 e janeiro seguinte começa em 01/01', () => {
    const dec = getDaysOfMonth(2026, 11)
    const jan = getDaysOfMonth(2027, 0)
    expect(dateKey(dec[dec.length - 1])).toBe('2026-12-31')
    expect(dateKey(jan[0])).toBe('2027-01-01')
  })
})

describe('getWeeks', () => {
  it('outubro/2026 começa numa quinta: 5 semanas, a primeira com 4 dias', () => {
    const weeks = getWeeks(getDaysOfMonth(2026, 9))
    expect(weeks).toHaveLength(5)
    expect(weeks[0]).toHaveLength(4)
    expect(weeks.flat()).toHaveLength(31)
  })

  it('fevereiro/2027 começa numa segunda e tem 28 dias: exatamente 4 semanas', () => {
    const weeks = getWeeks(getDaysOfMonth(2027, 1))
    expect(weeks).toHaveLength(4)
    expect(weeks.every((w) => w.length === 7)).toBe(true)
  })
})

describe('formatMonthLabel', () => {
  it('capitaliza só a primeira letra', () => {
    expect(formatMonthLabel(2026, 9)).toBe('Outubro de 2026')
  })
})
