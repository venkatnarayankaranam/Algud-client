import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [gsiAvailable, setGsiAvailable] = useState(true)

  const { register, googleSignIn } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      const result = await register(formData.name, formData.email, formData.password)
      
      if (result.success) {
        toast.success('Registration successful!')
        navigate('/')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const id = 'gsi-script'
    if (document.getElementById(id)) return
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.id = id
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.google) {
        try {
          const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              const idToken = response.credential
              if (!idToken) return
              setLoading(true)
              const res = await googleSignIn(idToken)
              setLoading(false)
              if (res?.success) {
                toast.success('Signed up with Google')
                navigate('/')
              } else {
                toast.error(res.message || 'Google signup failed')
              }
            }
          })

          // Render the Google Sign-In button and mark availability for dev diagnostics
          setTimeout(() => {
            const btn = document.getElementById('gsi-btn')
            try {
              if (btn) {
                if (typeof window.postMessage === 'function') {
                  window.google.accounts.id.renderButton(btn, { theme: 'outline', size: 'large' })
                  setGsiAvailable(true)
                } else {
                  setGsiAvailable(false)
                }
              } else {
                setGsiAvailable(false)
              }
            } catch (err) {
              console.warn('GSI renderButton blocked or failed:', err)
              setGsiAvailable(false)
            }
          }, 50)
        } catch (err) {
          console.warn('Google Identity Services initialization failed:', err)
          setGsiAvailable(false)
        }
      }
    }
    script.onerror = () => setGsiAvailable(false)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-serif font-bold text-gray-900">
            Join ALGUD
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your account to start shopping
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Enter your full name"
              />
            </div>
            
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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Create a password"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <div className="mt-3">
              {/* Server-side Passport Google OAuth (redirect flow) */}
              <a
                className="btn-secondary w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg"
                href={`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/auth/google`}
              >
                <span className="inline-flex items-center">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                    <circle cx="12" cy="12" r="10" fill="#000" />
                    <path d="M7 12a5 5 0 0 1 5-5v10a5 5 0 0 1-5-5z" fill="#fff" opacity="0.95" />
                  </svg>
                  <span>Sign in with Google</span>
                </span>
              </a>
            </div>
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-800 hover:text-primary-700 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
