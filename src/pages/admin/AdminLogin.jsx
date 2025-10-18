import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        // Check if user is admin
        if (result.data.role === 'admin') {
          toast.success('Admin login successful!')
          navigate('/admin/dashboard')
        } else {
          toast.error('Access denied. Admin privileges required.')
        }
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-200">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
              Admin Portal
            </h2>
            <p className="text-gray-600">
              Sign in to manage ALGUD
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Admin Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="admin@algud.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="Enter admin password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-black text-white hover:bg-gray-800 transition-colors border-2 border-black"
              >
                {loading ? 'Signing in...' : 'Sign In as Admin'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Back to Store
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
