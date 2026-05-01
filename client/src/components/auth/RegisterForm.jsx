import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input from '../common/Input'
import Button from '../common/Button'
import { ROUTES } from '../../utils/constants'
import toast from 'react-hot-toast'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[A-Z])(?=.*[0-9])/, 'Must contain at least one uppercase letter and one number'),
  confirmPassword: z.string(),
  role: z.enum(['USER', 'ADMIN']).default('USER')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const RegisterForm = () => {
  const { registerUser } = useAuth()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'USER' }
  })

  const password = watch('password', '')

  const getPasswordStrength = () => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength += 33
    if (/[A-Z]/.test(password)) strength += 33
    if (/[0-9]/.test(password)) strength += 34
    return strength
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    setApiError('')
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        role: data.role
      })
      toast.success('Registration successful! Please login.')
      navigate(ROUTES.LOGIN)
    } catch (err) {
      setApiError(err.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
        <p className="text-gray-500 text-sm mt-2">Start managing your tasks efficiently</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          id="email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-2">
          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          {password && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  getPasswordStrength() < 50 ? 'bg-red-500' : 
                  getPasswordStrength() < 100 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${getPasswordStrength()}%` }}
              ></div>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Account Role</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            {...register('role')}
          >
            <option value="USER">User (Manage own tasks)</option>
            <option value="ADMIN">Admin (Manage all tasks & users)</option>
          </select>
        </div>

        {apiError && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center mt-2">
            {apiError}
          </div>
        )}

        <Button
          type="submit"
          className="w-full mt-6 py-2.5"
          isLoading={isLoading}
        >
          Create Account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-primary hover:text-primary-dark">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default RegisterForm
