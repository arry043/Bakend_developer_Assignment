const Badge = ({ type, value }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'DONE': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'MEDIUM': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'HIGH': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const colorClass = type === 'status' ? getStatusColor(value) : getPriorityColor(value)
  const displayValue = value.replace('_', ' ')

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass}`}>
      {displayValue}
    </span>
  )
}

export default Badge
