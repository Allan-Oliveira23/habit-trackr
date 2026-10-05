import { Check } from 'lucide-react'
import { formatFullDate } from '../../utils/calendar'

interface Props {
  habitName: string
  date: Date
  completed: boolean
  today: boolean
  onToggle: () => void
}

export default function DayCell({ habitName, date, completed, today, onToggle }: Props) {
  const status = completed ? 'Concluído' : 'Não concluído'
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={completed}
      aria-label={`${habitName}, ${formatFullDate(date)}: ${status}`}
      title={`${formatFullDate(date)} · ${habitName} · ${status}`}
      onClick={onToggle}
      className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
        completed ? 'border-ok bg-ok/20 text-ok' : 'border-line hover:border-muted hover:bg-white/5'
      } ${today ? 'ring-1 ring-warn' : ''}`}
    >
      {completed && <Check size={14} aria-hidden />}
    </button>
  )
}
