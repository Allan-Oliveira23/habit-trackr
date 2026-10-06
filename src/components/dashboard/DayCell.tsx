import { Check } from 'lucide-react'
import { formatFullDate } from '../../utils/calendar'
import Tooltip from '../ui/Tooltip'

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
    <Tooltip
      content={
        <>
          <div>{formatFullDate(date)}</div>
          <div>{habitName}</div>
          <div className={completed ? 'text-ok' : 'text-muted'}>{status}</div>
        </>
      }
    >
    <button
      type="button"
      role="checkbox"
      aria-checked={completed}
      aria-label={`${habitName}, ${formatFullDate(date)}: ${status}`}
      onClick={onToggle}
      className={`flex h-10 w-10 items-center md:h-8 md:w-8 justify-center rounded-md border transition-colors ${
        completed ? 'border-ok bg-ok/20 text-ok' : 'border-line hover:border-muted hover:bg-white/5'
      } ${today ? 'ring-1 ring-warn' : ''}`}
    >
      {completed && <Check size={14} aria-hidden />}
    </button>
    </Tooltip>
  )
}
