import { useState, useEffect } from 'react'
import { Trash2, UserCog, Calendar } from 'lucide-react'
import { getAllUsers, deleteUser } from '../api/user.api'
import Spinner from '../components/common/Spinner'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import { formatDate } from '../utils/format'
import toast from 'react-hot-toast'

const AdminUsersPage = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [userToDelete, setUserToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getAllUsers()
      setUsers(res.data.users)
    } catch (err) {
      setError(err.message || 'Failed to fetch users')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async () => {
    if (!userToDelete) return
    
    setIsDeleting(true)
    try {
      await deleteUser(userToDelete.id)
      toast.success('User and their tasks deleted successfully')
      setUsers(users.filter(u => u.id !== userToDelete.id))
      setUserToDelete(null)
    } catch (err) {
      toast.error(err.message || 'Failed to delete user')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <UserCog className="text-primary" />
          User Management
        </h1>
        <p className="text-gray-500 mt-1">View and manage all registered users in the system.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="p-4 pl-6">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 hidden md:table-cell">Joined</th>
                  <th className="p-4 text-center">Tasks</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 font-medium text-gray-900">
                      {user.email}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 hidden md:table-cell whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 font-semibold text-xs h-6 w-6 rounded-full">
                        {user.taskCount}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => setUserToDelete(user)}
                        disabled={user.role === 'ADMIN' && users.filter(u => u.role === 'ADMIN').length <= 1}
                        className="p-2 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                        title={user.role === 'ADMIN' && users.filter(u => u.role === 'ADMIN').length <= 1 ? "Cannot delete the last admin" : "Delete user"}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={!!userToDelete}
        onClose={() => !isDeleting && setUserToDelete(null)}
        title="Delete User"
      >
        <div className="space-y-4">
          <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm">
            <strong>Warning:</strong> This will permanently delete the user account and all of their 
            <span className="font-bold mx-1">{userToDelete?.taskCount}</span> 
            tasks.
          </div>
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold text-gray-900">{userToDelete?.email}</span>?
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button 
              variant="secondary" 
              onClick={() => setUserToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete User & Tasks
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminUsersPage
