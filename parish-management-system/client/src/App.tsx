import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

// Simple Error Boundary to prevent blank screens on runtime errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: React.ReactNode}) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }
  componentDidCatch(error: any, errorInfo: any) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
          <h1 className="text-2xl font-bold text-red-600 mb-4">¡Ocurrió un error inesperado!</h1>
          <pre className="text-sm text-gray-700 bg-red-100 p-4 rounded">
            {this.state.error?.message || 'Error desconocido'}
          </pre>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => window.location.reload()}
          >
            Recargar página
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// All pages defined here, no external import
const LoginPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
    {/* Aquí iría el formulario real */}
  </div>
)

const DashboardPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Dashboard</h1>
  </div>
)

const ParishesPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Parroquias</h1>
  </div>
)

const UsersPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Usuarios</h1>
  </div>
)

const ReportsPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Reportes</h1>
  </div>
)

const MunicipalBoardPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Directiva Municipal</h1>
  </div>
)

const NotFoundPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">404 - Página no encontrada</h1>
  </div>
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Redirigir raíz al login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/parishes" element={<ParishesPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/municipal-board" element={<MunicipalBoardPage />} />

              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}

export default App
