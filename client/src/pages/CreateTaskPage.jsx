import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import TaskForm from '../components/tasks/TaskForm'
import { useTasks } from '../hooks/useTasks'
import { ROUTES } from '../utils/constants'
import toast from 'react-hot-toast'

const CreateTaskPage = () => {
  const { createTask, isLoading } = useTasks()
  const navigate = useNavigate()

  const handleSubmit = async (data) => {
    try {
      await createTask(data)
      toast.success('Task created successfully!')
      navigate(ROUTES.TASKS)
    } catch (error) {
      toast.error(error.message || 'Failed to create task')
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-500 mt-1">Fill in the details below to add a new task.</p>
        </div>
      </div>

      <TaskForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}

export default CreateTaskPage
