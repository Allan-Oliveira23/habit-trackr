import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import ErrorBoundary from './components/layout/ErrorBoundary'
import { HabitProvider } from './context/HabitContext'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Elemento #root não encontrado')

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <HabitProvider>
        <App />
      </HabitProvider>
    </ErrorBoundary>
  </StrictMode>,
)
