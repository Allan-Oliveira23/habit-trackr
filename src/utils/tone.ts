export type Tone = 'ok' | 'warn' | 'bad'

/** Faixa de cor para um percentual de progresso (verde ≥70, amarelo ≥40, vermelho abaixo). */
export const progressTone = (value: number): Tone => (value >= 70 ? 'ok' : value >= 40 ? 'warn' : 'bad')

export const toneTextClass: Record<Tone, string> = { ok: 'text-ok', warn: 'text-warn', bad: 'text-bad' }
