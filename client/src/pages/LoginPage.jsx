import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoginForm from '../components/auth/LoginForm'
import { ROUTES } from '../utils/constants'

const LoginPage = () => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">TaskFlow</h1>
        <p className="mt-2 text-gray-500">Manage your tasks with ease and efficiency</p>
      </div>
      <LoginForm />
    </div>
  )
}

export default LoginPage
