import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import RegisterForm from '../components/auth/RegisterForm'
import { ROUTES } from '../utils/constants'

const RegisterPage = () => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">TaskFlow</h1>
        <p className="mt-2 text-gray-500">Join us and boost your productivity</p>
      </div>
      <RegisterForm />
    </div>
  )
}

export default RegisterPage
