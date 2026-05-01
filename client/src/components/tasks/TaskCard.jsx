import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit2, Trash2, Calendar, Clock } from 'lucide-react'
import Badge from '../common/Badge'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { formatDate, isOverdue } from '../../utils/format'
import { ROUTES } from '../../utils/constants'

const TaskCard = ({ task, onDelete, readOnly = false }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const overdue = isOverdue(task.dueDate) && task.status !== 'DONE'

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200 group flex flex-col h-full">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1">
            <Link to={ROUTES.TASK_DETAIL(task.id)} className="hover:text-primary transition-colors">
              {task.title}
            </Link>
          </h3>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!readOnly && (
              <>
                <Link
                  to={ROUTES.EDIT_TASK(task.id)}
                  className="p-1.5 text-gray-400 hover:text-primary hover:bg-indigo-50 rounded-md transition-colors"
                  aria-label="Edit task"
                >
                  <Edit2 size={16} />
                </Link>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-1.5 text-gray-400 hover:text-danger hover:bg-red-50 rounded-md transition-colors"
                  aria-label="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        {task.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {task.description}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-gray-50 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2">
            <Badge type="status" value={task.status} />
            <Badge type="priority" value={task.priority} />
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${overdue ? 'text-red-500 font-semibold bg-red-50 px-1.5 py-0.5 rounded' : ''}`}>
                <Calendar size={12} />
                <span>{formatDate(task.dueDate)}</span>
                {overdue && <span className="ml-0.5">(Overdue)</span>}
              </div>
            )}
            {!task.dueDate && (
              <div className="flex items-center gap-1 text-gray-400">
                <Clock size={12} />
                <span>{formatDate(task.createdAt)}</span>
              </div>
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
            <Button
              variant="danger"
              onClick={() => {
                onDelete(task.id)
                setIsDeleteModalOpen(false)
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default TaskCard
