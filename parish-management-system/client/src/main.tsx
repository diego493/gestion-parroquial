import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Error Boundary at the root level to catch critical JS/runtime errors
class RootErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: React.ReactNode}) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }
  componentDidCatch(error: any, errorInfo: any) {
    // eslint-disable-next-line no-console
    console.error('RootErrorBoundary error:', error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fef2f2'
        }}>
          <h1 style={{color: '#dc2626', fontWeight: 'bold', fontSize: '2rem'}}>¡Ocurrió un error crítico en la app!</h1>
          <pre style={{
            background: '#fee2e2',
            color: '#7f1d1d',
            padding: 16,
            borderRadius: 8,
            margin: 20,
            maxWidth: 500,
            textAlign: 'left',
            fontSize: 14,
            overflowX: 'auto'
          }}>
            {this.state.error?.message || 'Error desconocido'}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 24px',
              background: '#2563eb',
              color: '#fff',
              borderRadius: 4,
              border: 'none',
              fontSize: '1rem'
            }}
          >
            Recargar página
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>
)
