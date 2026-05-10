import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

// Páginas (placeholders por ahora)
const HomePage = () => <div className="p-8"><h1 className="text-3xl font-bold">Gestión Parroquial Maracaibo</h1></div>
const LoginPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Iniciar Sesión</h1></div>
const DashboardPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Dashboard</h1></div>
const ParishesPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Parroquias</h1></div>
const UsersPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Usuarios</h1></div>
const ReportsPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Reportes</h1></div>
const MunicipalBoardPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Directiva Municipal</h1></div>
const NotFoundPage = () => <div className="p-8"><h1 className="text-3xl font-bold">404 - Página no encontrada</h1></div>

// Crear cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
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
    </QueryClientProvider>
  )
}

export default App