
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import {MotionConfig} from 'motion/react'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './utils/axiosSetup'
import { toast } from 'react-hot-toast'

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
