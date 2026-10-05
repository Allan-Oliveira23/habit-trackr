import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import DailyGoalField from '../components/dashboard/DailyGoalField'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import { useHabits } from '../hooks/useHabits'

export default function Settings() {
  const { state, dispatch } = useHabits()
  const [confirmReset, setConfirmReset] = useState(false)
  const close = () => setConfirmReset(false)

  return (
    <div className="space-y-4">
      <Card title="Metas">
        <DailyGoalField
          goal={state.settings.dailyGoal}
          maxGoal={state.habits.filter((h) => h.active).length}
          onChange={(goal) => dispatch({ type: 'SET_DAILY_GOAL', payload: goal })}
        />
      </Card>

      <Card title="Dados" className="border-bad/40">
        <p className="mb-3 text-sm text-muted">
          Apaga todos os hábitos, o histórico de conclusões e as configurações deste navegador, e restaura os hábitos de exemplo.
          Esta ação não pode ser desfeita.
        </p>
        <Button variant="danger" onClick={() => setConfirmReset(true)}>
          <Trash2 size={16} aria-hidden /> Resetar dados
        </Button>
      </Card>

      {confirmReset && (
        <Modal title="Resetar todos os dados?" onClose={close}>
          <p className="mb-4 text-sm text-muted">
            Todos os seus hábitos e todo o histórico serão apagados permanentemente. Os hábitos de exemplo serão restaurados.
          </p>
          <div className="flex justify-end gap-2">
            <Button onClick={close}>Cancelar</Button>
            <Button
              variant="danger"
              onClick={() => {
                dispatch({ type: 'RESET_DATA' })
                close()
              }}
            >
              Apagar tudo e resetar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
