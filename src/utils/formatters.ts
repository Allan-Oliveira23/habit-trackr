export const formatPercent = (value: number): string => `${value.toLocaleString('pt-BR')}%`

/** 'YYYY-MM-DD' → 'DD/MM/YYYY' */
export const formatDateKey = (key: string): string => key.split('-').reverse().join('/')
