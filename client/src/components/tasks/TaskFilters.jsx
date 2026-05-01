import { Search, SlidersHorizontal, X } from 'lucide-react'
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants'

const TaskFilters = ({ filters, setFilters, onClear }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }))
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col gap-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search tasks by title or description..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center text-sm text-gray-500 gap-1.5 font-medium">
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filters:</span>
          </div>
          
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg text-sm py-1.5 px-3 focus:ring-2 focus:ring-primary outline-none bg-white text-gray-700 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {TASK_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          <select
            name="priority"
            value={filters.priority}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg text-sm py-1.5 px-3 focus:ring-2 focus:ring-primary outline-none bg-white text-gray-700 cursor-pointer"
          >
            <option value="">All Priorities</option>
            {TASK_PRIORITY.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg text-sm py-1.5 px-3 focus:ring-2 focus:ring-primary outline-none bg-white text-gray-700 cursor-pointer"
          >
            <option value="createdAt">Created Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>

          <select
            name="order"
            value={filters.order}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg text-sm py-1.5 px-3 focus:ring-2 focus:ring-primary outline-none bg-white text-gray-700 cursor-pointer"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>

          <button
            onClick={onClear}
            className="ml-auto md:ml-0 flex items-center gap-1 text-sm text-gray-500 hover:text-danger font-medium transition-colors p-1.5 rounded-md hover:bg-gray-50"
            title="Clear all filters"
          >
            <X size={16} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskFilters
