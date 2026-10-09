import { Component, type ErrorInfo, type ReactNode } from 'react'
import { clearData, readRawData } from '../../services/storage'
import { downloadTextFile } from '../../utils/download'
import Button from '../ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/** Última linha de defesa: um erro inesperado de renderização não deixa a tela em branco. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erro inesperado na aplicação:', error, info.componentStack)
  }

  private downloadData = () => downloadTextFile('habit-tracker-backup.json', readRawData() ?? '')

  private resetAndReload = () => {
    if (window.confirm('Apagar todos os dados salvos neste navegador e recarregar? Esta ação não pode ser desfeita.')) {
      clearData()
      window.location.reload()
    }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 px-4">
        <div role="alert" className="rounded-xl border border-bad/40 bg-card p-5">
          <h1 className="mb-2 text-lg font-semibold">Algo deu errado</h1>
          <p className="mb-4 text-sm text-muted">
            Ocorreu um erro inesperado e a tela não pôde ser exibida. Seus dados continuam salvos neste navegador. Tente novamente ou recarregue a página.
            Se o problema persistir, baixe uma cópia dos dados antes de apagá-los.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => this.setState({ error: null })}>
              Tentar novamente
            </Button>
            <Button onClick={() => window.location.reload()}>Recarregar página</Button>
            <Button onClick={this.downloadData}>Baixar cópia dos dados</Button>
            <Button variant="danger" onClick={this.resetAndReload}>
              Apagar dados e recarregar
            </Button>
          </div>
        </div>
      </main>
    )
  }
}
