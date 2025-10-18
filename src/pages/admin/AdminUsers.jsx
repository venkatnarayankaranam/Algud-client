import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { Search, User, Mail, Calendar, Shield, UserCheck } from 'lucide-react'
import { pillClass, getRoleColor } from './themeHelpers'
import toast from 'react-hot-toast'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllUsers({ limit: 50 })
      setUsers(response.data.data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const name = user?.name || ''
    const email = user?.email || ''
    const lowerSearch = searchTerm ? searchTerm.toLowerCase() : ''

    const matchesSearch = name.toLowerCase().includes(lowerSearch) ||
                         email.toLowerCase().includes(lowerSearch)
    const matchesRole = roleFilter === 'all' || (user?.role === roleFilter)
    return matchesSearch && matchesRole
  })

  // role color moved to shared themeHelpers

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-800"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max section-padding py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
            User Management
          </h1>
          <p className="text-lg text-gray-600">
            View and manage user accounts
          </p>
        </div>

        {/* Filters */}
  <div className="bg-white rounded-lg shadow-sm border border-white/10 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
  <div className="bg-white rounded-lg shadow-sm border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user?._id || Math.random()} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-800" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user?.name || '—'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user?._id ? user._id.slice(-8) : '—'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{user?.email || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`${pillClass()} ${getRoleColor(user.role)}`}>
                        {user?.role === 'admin' ? (
                          <div className="flex items-center">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <UserCheck className="w-3 h-3 mr-1" />
                            User
                          </div>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {user?.createdAt ? formatDate(user.createdAt) : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`${pillClass()} bg-green-100 text-green-800 border-green-200`}>Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">
              {searchTerm || roleFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No users registered yet'
              }
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-white/10 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-primary-900" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-white/10 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mr-4">
                <UserCheck className="w-6 h-6 text-primary-900" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Regular Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => user.role === 'user').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-white/10 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-charcoal-900" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => user.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminUsers
