import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { useDebounce } from '../hooks/useDebounce'
import TaskCard from '../components/tasks/TaskCard'
import TaskFilters from '../components/tasks/TaskFilters'
import SkeletonLoader from '../components/common/SkeletonLoader'
import Pagination from '../components/common/Pagination'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import { ROUTES } from '../utils/constants'
import toast from 'react-hot-toast'

const TasksPage = () => {
  const { tasks, pagination, isLoading, fetchTasks, deleteTask } = useTasks()
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    status: '',
    priority: '',
    sortBy: 'createdAt',
    order: 'desc'
  })

  const debouncedSearch = useDebounce(filters.search, 500)

  useEffect(() => {
    fetchTasks({
      ...filters,
      search: debouncedSearch
    })
  }, [fetchTasks, debouncedSearch, filters.status, filters.priority, filters.sortBy, filters.order, filters.page, filters.limit])

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      search: '',
      status: '',
      priority: '',
      sortBy: 'createdAt',
      order: 'desc'
    })
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const handleDelete = async (id) => {
    try {
      await deleteTask(id)
      toast.success('Task deleted successfully')
      fetchTasks({ ...filters, search: debouncedSearch })
    } catch (error) {
      toast.error(error.message || 'Failed to delete task')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
          <p className="text-gray-500 mt-1">Manage and organize your workload.</p>
        </div>
        <Link to={ROUTES.CREATE_TASK}>
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <Plus size={20} />
            Create New Task
          </Button>
        </Link>
      </div>

      <TaskFilters 
        filters={filters} 
        setFilters={setFilters} 
        onClear={handleClearFilters} 
      />

      {isLoading && tasks.length === 0 ? (
        <SkeletonLoader count={4} />
      ) : tasks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
          <Pagination 
            pagination={pagination} 
            onPageChange={handlePageChange} 
          />
        </>
      ) : (
        <EmptyState 
          title="No tasks found"
          message={debouncedSearch || filters.status || filters.priority 
            ? "We couldn't find any tasks matching your filters. Try adjusting them." 
            : "You don't have any tasks yet. Create one to get started!"}
          action={
            (debouncedSearch || filters.status || filters.priority) 
              ? <Button variant="secondary" onClick={handleClearFilters}>Clear Filters</Button>
              : <Link to={ROUTES.CREATE_TASK}><Button>Create Task</Button></Link>
          }
        />
      )}
      
      {/* Mobile FAB */}
      <div className="sm:hidden fixed bottom-6 right-6 z-40">
        <Link to={ROUTES.CREATE_TASK}>
          <button className="bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg transition-transform active:scale-95">
            <Plus size={24} />
          </button>
        </Link>
      </div>
    </div>
  )
}

export default TasksPage
