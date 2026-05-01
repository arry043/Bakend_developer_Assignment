import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import TaskForm from '../components/tasks/TaskForm'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import { useTasks } from '../hooks/useTasks'
import { getTaskById } from '../api/task.api'
import { ROUTES } from '../utils/constants'
import toast from 'react-hot-toast'

const EditTaskPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateTask, isLoading: isUpdating } = useTasks()
  
  const [task, setTask] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const handleSubmit = async (data) => {
    try {
      await updateTask(id, data)
      toast.success('Task updated successfully!')
      navigate(ROUTES.TASKS)
    } catch (error) {
      toast.error(error.message || 'Failed to update task')
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
        message="The task you're trying to edit doesn't exist or you don't have permission to access it."
        action={
          <Button onClick={() => navigate(ROUTES.TASKS)}>
            Back to Tasks
          </Button>
        }
      />
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
          <p className="text-gray-500 mt-1">Update the details of your task.</p>
        </div>
      </div>

      <TaskForm 
        initialData={task} 
        onSubmit={handleSubmit} 
        isLoading={isUpdating} 
      />
    </div>
  )
}

export default EditTaskPage
