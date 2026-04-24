
import { MotionConfig } from 'motion/react'
import { createRoot } from 'react-dom/client'
import { toast } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { AppProvider } from './context/AppContext.jsx'
import './index.css'
import './utils/axiosSetup'

// Global handlers for uncaught errors and promise rejections
window.onerror = function (message, source, lineno, colno, error) {
  console.error('Global error', { message, source, lineno, colno, error })
  toast.error(message || 'Erreur inattendue')
}

window.onunhandledrejection = function (event) {
  console.error('Unhandled rejection', event.reason)
  toast.error(event.reason?.message || 'Erreur asynchrone non capturée')
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppProvider>
      <ErrorBoundary>
        <MotionConfig viewport={{once: true}}>
          <App />
        </MotionConfig>
      </ErrorBoundary>
    </AppProvider>
  </BrowserRouter>
)
