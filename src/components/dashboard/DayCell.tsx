import { Check } from 'lucide-react'
import { formatFullDate } from '../../utils/calendar'
import Tooltip from '../ui/Tooltip'

interface Props {
  habitName: string
  date: Date
  completed: boolean
  today: boolean
  future: boolean
  onToggle: () => void
}

export default function DayCell({ habitName, date, completed, today, future, onToggle }: Props) {
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
    {/* biome-ignore lint/a11y/useSemanticElements: botão estilizado com role=checkbox/aria-checked (padrão ARIA); validado com axe e teclado */}
    <button
      type="button"
      role="checkbox"
      aria-checked={completed}
      aria-label={`${habitName}, ${formatFullDate(date)}: ${status}`}
      onClick={onToggle}
      className={`flex h-10 w-10 items-center justify-center rounded-md border transition-colors active:scale-95 md:h-8 md:w-8 ${
        completed
          ? 'border-ok bg-ok/20 text-ok'
          : future
            ? 'border-line/40 hover:border-muted hover:bg-white/5'
            : 'border-line bg-white/[0.03] hover:border-muted hover:bg-white/5'
      } ${today ? 'ring-1 ring-warn' : ''}`}
    >
      {completed && <Check size={14} aria-hidden />}
    </button>
    </Tooltip>
  )
}
