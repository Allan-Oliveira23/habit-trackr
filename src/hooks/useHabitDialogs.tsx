import { useCallback, useState } from 'react'
import HabitForm from '../components/habits/HabitForm'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import type { Habit, HabitInput } from '../types/habit'
import { createHabit } from '../utils/habits'
import { useHabits } from './useHabits'

type ModalState = { kind: 'form'; habit?: Habit } | { kind: 'delete'; habit: Habit } | null

/** Estado e diálogos de criar/editar/excluir hábito, compartilhados entre páginas. */
export function useHabitDialogs() {
  const { dispatch } = useHabits()
  const [modal, setModal] = useState<ModalState>(null)
  const close = useCallback(() => setModal(null), [])

  const save = (input: HabitInput) => {
    if (modal?.kind === 'form' && modal.habit) {
      dispatch({ type: 'UPDATE_HABIT', payload: { id: modal.habit.id, ...input } })
    } else {
      dispatch({ type: 'ADD_HABIT', payload: createHabit(input) })
    }
    close()
  }

  const dialogs = (
    <>
      {modal?.kind === 'form' && (
        <Modal title={modal.habit ? 'Editar hábito' : 'Novo hábito'} onClose={close}>
          <HabitForm initial={modal.habit} onSubmit={save} onCancel={close} />
        </Modal>
      )}
      {modal?.kind === 'delete' && (
        <Modal title="Excluir hábito?" onClose={close}>
          <p className="mb-4 text-sm text-muted">
            “{modal.habit.name}” será excluído e todo o histórico de conclusões dele também será removido. Para manter o histórico, desative o hábito.
          </p>
          <div className="flex justify-end gap-2">
            <Button onClick={close}>Cancelar</Button>
            <Button
              variant="danger"
              onClick={() => {
                dispatch({ type: 'DELETE_HABIT', payload: modal.habit.id })
                close()
              }}
            >
              Excluir
            </Button>
          </div>
        </Modal>
      )}
    </>
  )

  return {
    openCreate: () => setModal({ kind: 'form' }),
    openEdit: (habit: Habit) => setModal({ kind: 'form', habit }),
    openDelete: (habit: Habit) => setModal({ kind: 'delete', habit }),
    dialogs,
  }
}
