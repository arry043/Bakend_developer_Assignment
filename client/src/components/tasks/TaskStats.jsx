import { CheckCircle2, Circle, Clock, LayoutList } from 'lucide-react'

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-200">
    <div className={`p-3 rounded-lg ${bgClass}`}>
      <Icon className={`w-6 h-6 ${colorClass}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
    </div>
  </div>
)

const TaskStats = ({ tasks = [] }) => {
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'TODO').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    done: tasks.filter(t => t.status === 'DONE').length,
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        title="Total Tasks" 
        value={stats.total} 
        icon={LayoutList} 
        colorClass="text-primary"
        bgClass="bg-indigo-50"
      />
      <StatCard 
        title="To Do" 
        value={stats.todo} 
        icon={Circle} 
        colorClass="text-gray-600"
        bgClass="bg-gray-100"
      />
      <StatCard 
        title="In Progress" 
        value={stats.inProgress} 
        icon={Clock} 
        colorClass="text-blue-600"
        bgClass="bg-blue-50"
      />
      <StatCard 
        title="Completed" 
        value={stats.done} 
        icon={CheckCircle2} 
        colorClass="text-emerald-600"
        bgClass="bg-emerald-50"
      />
    </div>
  )
}

export default TaskStats
