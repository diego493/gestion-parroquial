import LoginForm from '../components/forms/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      
      <div className="w-full max-w-md card">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Iniciar Sesión
        </h1>

        <LoginForm />

      </div>
    </div>
  )
}
