import { progressTone, type Tone } from '../../utils/tone'

interface Props {
  value: number
  label: string
  tone?: Tone
}

const tones = { ok: 'bg-ok', warn: 'bg-warn', bad: 'bg-bad' }

export default function ProgressBar({ value, label, tone }: Props) {
  const color = tone ?? progressTone(value)
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="h-2 w-full overflow-hidden rounded-full bg-white/10"
    >
      <div className={`h-full rounded-full transition-all ${tones[color]}`} style={{ width: `${value}%` }} />
    </div>
  )
}
