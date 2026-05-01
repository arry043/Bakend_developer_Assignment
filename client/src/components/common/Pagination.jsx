import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import Button from './Button'

const Pagination = ({ pagination, onPageChange }) => {
  const { page, limit, total, totalPages } = pagination

  if (totalPages <= 1) return null

  const startCount = (page - 1) * limit + 1
  const endCount = Math.min(page * limit, total)

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    let start = Math.max(1, page - Math.floor(maxVisiblePages / 2))
    let end = Math.min(totalPages, start + maxVisiblePages - 1)

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-gray-100 mt-6">
      <div className="text-sm text-gray-500">
        Showing <span className="font-medium text-gray-900">{startCount}</span> to{' '}
        <span className="font-medium text-gray-900">{endCount}</span> of{' '}
        <span className="font-medium text-gray-900">{total}</span> tasks
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="px-2"
          aria-label="First page"
        >
          <ChevronsLeft size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-2"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </Button>

        <div className="flex gap-1 px-2">
          {getPageNumbers().map(pageNum => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                pageNum === page
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-2"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="px-2"
          aria-label="Last page"
        >
          <ChevronsRight size={16} />
        </Button>
      </div>
    </div>
  )
}

export default Pagination
