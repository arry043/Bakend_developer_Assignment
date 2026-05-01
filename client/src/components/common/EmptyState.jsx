import { ClipboardList } from 'lucide-react'

const EmptyState = ({ 
  title = "No tasks found", 
  message = "Get started by creating a new task.", 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-xl border border-dashed border-gray-300">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        <ClipboardList size={48} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{message}</p>
      {action}
    </div>
  )
}

export default EmptyState
