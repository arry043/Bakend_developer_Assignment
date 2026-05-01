import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit2, Trash2, Calendar, Clock, User } from 'lucide-react'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Modal from '../components/common/Modal'
import { useTasks } from '../hooks/useTasks'
import { getTaskById } from '../api/task.api'
import { formatDate, isOverdue } from '../utils/format'
import { ROUTES } from '../utils/constants'
import toast from 'react-hot-toast'

const TaskDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { deleteTask } = useTasks()
  
  const [task, setTask] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await getTaskById(id)
        setTask(res.data.task)
      } catch (err) {
        setError(err.message || 'Failed to fetch task')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchTask()
    }
  }, [id])

  const handleDelete = async () => {
    try {
      await deleteTask(id)
      toast.success('Task deleted successfully')
      navigate(ROUTES.TASKS)
    } catch (error) {
      toast.error(error.message || 'Failed to delete task')
      setIsDeleteModalOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !task) {
    return (
      <EmptyState 
        title="Task not found"
        message="The task you're looking for doesn't exist or you don't have permission to access it."
        action={
          <Button onClick={() => navigate(ROUTES.TASKS)}>
            Back to Tasks
          </Button>
        }
      />
    )
  }

  const overdue = isOverdue(task.dueDate) && task.status !== 'DONE'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Task Details</h1>
        </div>
        
        <div className="flex gap-2 pl-12 sm:pl-0">
          <Link to={ROUTES.EDIT_TASK(task.id)}>
            <Button variant="secondary" className="flex items-center gap-2">
              <Edit2 size={16} />
              Edit
            </Button>
          </Link>
          <Button 
            variant="danger" 
            className="flex items-center gap-2"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          <div>
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge type="status" value={task.status} />
              <Badge type="priority" value={task.priority} />
            </div>
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 break-words">
              {task.title}
            </h2>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Clock size={16} /> Created Date
              </span>
              <p className="font-medium text-gray-900">{formatDate(task.createdAt)}</p>
            </div>
            
            <div className="space-y-1">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar size={16} /> Due Date
              </span>
              {task.dueDate ? (
                <p className={`font-medium ${overdue ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatDate(task.dueDate)} {overdue && '(Overdue)'}
                </p>
              ) : (
                <p className="font-medium text-gray-500">Not set</p>
              )}
            </div>

            {task.user && (
              <div className="space-y-1 md:col-span-2">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <User size={16} /> Assigned To
                </span>
                <p className="font-medium text-gray-900">{task.user.email}</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Description
            </h3>
            {task.description ? (
              <div className="prose prose-sm md:prose-base max-w-none text-gray-600 whitespace-pre-wrap bg-gray-50 p-5 rounded-xl">
                {task.description}
              </div>
            ) : (
              <p className="text-gray-500 italic">No description provided for this task.</p>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Task"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold text-gray-900">"{task.title}"</span>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default TaskDetailPage
