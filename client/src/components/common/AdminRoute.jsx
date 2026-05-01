import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../utils/constants'
import toast from 'react-hot-toast'
import { useEffect, useRef } from 'react'

const AdminRoute = () => {
  const { user, isAuthenticated } = useAuth()
  const toastShown = useRef(false)

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'ADMIN' && !toastShown.current) {
      toast.error('Access denied. Admin privileges required.')
      toastShown.current = true
    }
  }, [user, isAuthenticated])

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return user?.role === 'ADMIN' ? (
    <Outlet />
  ) : (
    <Navigate to={ROUTES.DASHBOARD} replace />
  )
}

export default AdminRoute
