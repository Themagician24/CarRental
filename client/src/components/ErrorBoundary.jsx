import React from 'react'
import { toast } from 'react-hot-toast'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Log and surface error to user via toast
    console.error('Uncaught error:', error, info)
    toast.error(error?.message || 'Une erreur est survenue')
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-dark-panel p-8 rounded-xl max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold text-gold mb-4">Quelque chose s'est mal passé</h2>
            <p className="mb-6 text-muted">Nous avons automatiquement envoyé le rapport d'erreur.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => window.location.reload()} className="btn btn-primary">Recharger</button>
              <button onClick={() => this.setState({ hasError: false, error: null })} className="btn btn-ghost">Fermer</button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
