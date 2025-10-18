import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

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
        toast.success('Login successful!')
        navigate(from, { replace: true })
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  // No client-side Google Identity button — using server-side OAuth only

  return (
  <div className="min-h-screen flex items-center justify-center bg-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-serif font-bold text-primary-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-primary-700">
            Sign in to your ALGUD account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
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
                placeholder="Enter your email"
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
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          <div className="text-center">
            <div className="mt-3">
              {/* Server-side Passport Google OAuth start (redirect flow) */}
              <a
                className="btn-secondary w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg"
                href={`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/auth/google`}
              >
                <span className="inline-flex items-center">
                  {/* Monochrome fallback icon for provider */}
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                    <circle cx="12" cy="12" r="10" fill="#000" />
                    <path d="M7 12a5 5 0 0 1 5-5v10a5 5 0 0 1-5-5z" fill="#fff" opacity="0.95" />
                  </svg>
                  <span>Sign in with Google</span>
                </span>
              </a>
            </div>
            {/* client-side GSI removed; server-side OAuth link above is used instead */}
            <p className="text-sm text-primary-700">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-900 hover:text-gold-500 transition-colors duration-200"
              >
                Sign up here
              </Link>
            </p>
          </div>

          <div className="text-center">
            <Link
              to="/admin/login"
              className="text-sm text-gold-500 hover:text-gold-700 font-medium transition-colors duration-200"
            >
              Admin Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
