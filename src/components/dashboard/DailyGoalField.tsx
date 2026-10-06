import { useId } from 'react'

interface Props {
  goal?: number
  /** Valor máximo aceito: número de hábitos ativos. */
  maxGoal: number
  onChange: (goal: number | undefined) => void
}

export default function DailyGoalField({ goal, maxGoal, onChange }: Props) {
  const id = useId()
  const max = Math.max(maxGoal, 1)

  const handle = (raw: string) => {
    const n = Number(raw)
    onChange(raw === '' || !Number.isInteger(n) || n < 1 ? undefined : Math.min(n, max))
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor={id} className="text-muted">
        Objetivo diário (hábitos por dia)
      </label>
      <input
        id={id}
        type="number"
        min={1}
        max={max}
        value={goal ?? ''}
        onChange={(e) => handle(e.target.value)}
        className="w-16 rounded-lg border border-line bg-bg px-2 py-1.5 text-base md:text-sm"
      />
    </div>
  )
}
