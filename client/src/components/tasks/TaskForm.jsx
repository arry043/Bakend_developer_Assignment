import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import Input from '../common/Input'
import Button from '../common/Button'
import { TASK_STATUS, TASK_PRIORITY, ROUTES } from '../../utils/constants'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional().nullable(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  dueDate: z.string().optional().nullable().transform(val => val === '' ? null : val)
})

const TaskForm = ({ initialData, onSubmit, isLoading }) => {
  const navigate = useNavigate()
  
  // Format dates for date input (YYYY-MM-DDThh:mm)
  const defaultDueDate = initialData?.dueDate 
    ? new Date(initialData.dueDate).toISOString().slice(0, 16) 
    : ''

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || 'TODO',
      priority: initialData?.priority || 'MEDIUM',
      dueDate: defaultDueDate
    }
  })

  // Format payload before submitting
  const handleFormSubmit = (data) => {
    const payload = { ...data }
    if (payload.dueDate) {
      payload.dueDate = new Date(payload.dueDate).toISOString()
    } else {
      payload.dueDate = null
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="space-y-6">
          <Input
            label="Task Title *"
            id="title"
            placeholder="e.g., Complete project presentation"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none ${
                errors.description 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
              placeholder="Add more details about this task..."
              {...register('description')}
            ></textarea>
            {errors.description && <span className="text-xs text-red-500 mt-0.5">{errors.description.message}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                {...register('status')}
              >
                {TASK_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="priority" className="text-sm font-medium text-gray-700">Priority</label>
              <select
                id="priority"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                {...register('priority')}
              >
                {TASK_PRIORITY.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            <Input
              label="Due Date"
              id="dueDate"
              type="datetime-local"
              error={errors.dueDate?.message}
              {...register('dueDate')}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button 
          variant="secondary" 
          onClick={() => navigate(-1)} 
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          isLoading={isLoading}
        >
          {initialData ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}

export default TaskForm
