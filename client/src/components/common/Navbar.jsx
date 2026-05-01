import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Menu, X, CheckSquare } from 'lucide-react'
import { ROUTES } from '../../utils/constants'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} className="flex items-center gap-2">
              <div className="bg-primary text-white p-1.5 rounded-lg">
                <CheckSquare size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">TaskFlow</span>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                <Link
                  to={ROUTES.DASHBOARD}
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to={ROUTES.TASKS}
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Tasks
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to={ROUTES.ADMIN_USERS}
                    className="text-primary hover:text-primary-dark px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="hidden sm:flex sm:items-center sm:gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-500 truncate max-w-[200px]">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-500 hover:text-danger transition-colors px-3 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to={ROUTES.LOGIN}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="text-sm font-medium text-white bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-gray-500 p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white">
          {isAuthenticated ? (
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to={ROUTES.DASHBOARD}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <Link
                to={ROUTES.TASKS}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              >
                Tasks
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  to={ROUTES.ADMIN_USERS}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-base font-medium text-primary hover:bg-indigo-50"
                >
                  Admin Panel
                </Link>
              )}
              <div className="px-4 py-3 border-t border-gray-100 mt-2">
                <p className="text-sm text-gray-500 mb-3 truncate">{user?.email}</p>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-base font-medium text-danger"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2 pb-3 space-y-1 px-4">
              <Link
                to={ROUTES.LOGIN}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-gray-900"
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-primary"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
