export const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export const formatRelativeDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now - date
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  return formatDate(dateString)
}

export const isOverdue = (dateString) => {
  if (!dateString) return false
  const date = new Date(dateString)
  const now = new Date()
  // Strip time for accurate day comparison
  now.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  return date < now
}
