import { useState, type FormEvent } from 'react'
import type { Habit, HabitInput } from '../../types/habit'
import Button from '../ui/Button'

interface Props {
  initial?: Habit
  onSubmit: (input: HabitInput) => void
  onCancel: () => void
}

const field = 'w-full rounded-lg border border-line bg-bg px-3 py-2 text-base md:text-sm'

export default function HabitForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [icon, setIcon] = useState(initial?.icon ?? '')
  const [goal, setGoal] = useState(initial?.goal?.toString() ?? '')
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return setError('Informe o nome do hábito.')
    if (trimmed.length > 50) return setError('O nome deve ter no máximo 50 caracteres.')
    const goalNum = goal === '' ? undefined : Number(goal)
    if (goalNum !== undefined && (!Number.isInteger(goalNum) || goalNum < 1 || goalNum > 31)) {
      return setError('A meta deve ser um número de 1 a 31 dias.')
    }
    onSubmit({ name: trimmed, icon: icon.trim() || undefined, goal: goalNum })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm">
        Nome
        <input className={`${field} mt-1`} value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm">
          Ícone (emoji)
          <input className={`${field} mt-1`} value={icon} maxLength={4} onChange={(e) => setIcon(e.target.value)} />
        </label>
        <label className="block text-sm">
          Meta (dias/mês)
          <input className={`${field} mt-1`} inputMode="numeric" value={goal} onChange={(e) => setGoal(e.target.value)} />
        </label>
      </div>
      {error && (
        <p role="alert" className="text-sm text-bad">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="primary">
          {initial ? 'Salvar' : 'Criar hábito'}
        </Button>
      </div>
    </form>
  )
}
