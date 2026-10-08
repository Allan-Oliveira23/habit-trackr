import { AlertTriangle } from 'lucide-react'
import { useHabits } from '../../hooks/useHabits'
import { getBackup } from '../../services/storage'
import { downloadTextFile } from '../../utils/download'
import Button from '../ui/Button'

const messages = {
  corrupted:
    'Não foi possível ler os dados salvos neste navegador (formato inválido). Iniciamos com os hábitos de exemplo e guardamos uma cópia do conteúdo original.',
  'save-failed':
    'Não foi possível salvar seus dados no navegador (armazenamento indisponível ou cheio). As alterações podem ser perdidas ao fechar a página.',
} as const

export default function NoticeBanner() {
  const { state, dispatch } = useHabits()
  if (!state.notice) return null

  const download = () => {
    const content =
      state.notice === 'corrupted'
        ? (getBackup() ?? '')
        : JSON.stringify({ habits: state.habits, completions: state.completions, settings: state.settings }, null, 2)
    downloadTextFile('habit-tracker-backup.json', content)
  }

  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 border-b border-warn/40 bg-warn/10 px-4 py-3 text-sm sm:px-6">
      <AlertTriangle size={18} aria-hidden className="shrink-0 text-warn" />
      <p className="min-w-0 flex-1 basis-56">{messages[state.notice]}</p>
      <Button onClick={download}>Baixar cópia dos dados</Button>
      <Button onClick={() => dispatch({ type: 'SET_NOTICE', payload: null })}>Fechar</Button>
    </div>
  )
}
