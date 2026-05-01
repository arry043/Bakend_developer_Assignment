import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTasks } from '../hooks/useTasks'
import TaskStats from '../components/tasks/TaskStats'
import TaskCard from '../components/tasks/TaskCard'
import SkeletonLoader from '../components/common/SkeletonLoader'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import { ROUTES } from '../utils/constants'
import toast from 'react-hot-toast'

const DashboardPage = () => {
  const { user } = useAuth()
  const { tasks, isLoading, fetchTasks, deleteTask } = useTasks()
  const [recentTasks, setRecentTasks] = useState([])

  useEffect(() => {
    fetchTasks({ limit: 5, sortBy: 'createdAt', order: 'desc' })
  }, [fetchTasks])

  useEffect(() => {
    setRecentTasks(tasks.slice(0, 5))
  }, [tasks])

  const handleDelete = async (id) => {
    try {
      await deleteTask(id)
      toast.success('Task deleted successfully')
      fetchTasks({ limit: 5, sortBy: 'createdAt', order: 'desc' })
    } catch (error) {
      toast.error(error.message || 'Failed to delete task')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.email.split('@')[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your tasks today.</p>
        </div>
        <Link to={ROUTES.CREATE_TASK}>
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <Plus size={20} />
            Create New Task
          </Button>
        </Link>
      </div>

      <TaskStats tasks={tasks} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
          <Link 
            to={ROUTES.TASKS} 
            className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            View all
          </Link>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <SkeletonLoader count={3} />
          ) : recentTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onDelete={handleDelete} 
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No tasks yet"
              message="You haven't created any tasks. Create your first task to get started."
              action={
                <Link to={ROUTES.CREATE_TASK}>
                  <Button variant="secondary" className="mt-2">Create Task</Button>
                </Link>
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
