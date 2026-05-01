import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import Button from '../components/common/Button'
import { ROUTES } from '../utils/constants'

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-primary/10 p-4 rounded-full mb-6">
        <AlertCircle size={48} className="text-primary" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page not found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <Link to={ROUTES.DASHBOARD}>
        <Button size="lg">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  )
}

export default NotFoundPage
