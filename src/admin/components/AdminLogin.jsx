import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { User, Lock } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { setAuthenticated, selectLoading, selectError, selectIsAuthenticated, setLoading, setError } from '../../store/slices/adminSlice'
import { API_BASE_URL } from '../../store/api'

const AdminLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading = useSelector(selectLoading)
  const error = useSelector(selectError)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear any previous errors
    dispatch(setError(null))
    dispatch(setLoading(true))

    // Show loading toast
    const loadingToast = toast.loading('Signing in...')

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      })

      let data
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        // Handle non-JSON responses
        const text = await response.text()
        throw new Error(text || 'Server error: Invalid response format')
      }

      if (response.ok) {
        // Store auth token if provided
        if (data.token) {
          localStorage.setItem('adminToken', data.token)
        }
        
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast)
        toast.success('Welcome back! Redirecting to dashboard...')
        
        dispatch(setAuthenticated(true))
        setTimeout(() => navigate('/admin'), 1000) // Small delay to show success message
      } else {
        // Handle authentication errors
        toast.dismiss(loadingToast)
        toast.error(data.message || 'Invalid username or password')
        dispatch(setError(data.message || 'Invalid username or password'))
      }
    } catch (error) {
      console.error('Login error:', error)
      
      toast.dismiss(loadingToast)
      
      let errorMessage
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to server. Please ensure the server is running.'
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Server error: Invalid response. Please try again.'
      } else {
        errorMessage = error.message || 'An unexpected error occurred. Please try again.'
      }
      
      toast.error(errorMessage)
      dispatch(setError(errorMessage))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-3xl shadow-lg">
            🍽️
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">NeonFood Admin</h1>
          <p className="text-gray-600">Sign in to manage your restaurant</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Enter username"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Enter password"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.username || !formData.password}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              loading || !formData.username || !formData.password
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <strong>Admin Access Required</strong>
          </p>
          <p className="text-xs text-blue-700 mt-2 text-center">
            Contact the developer for login credentials
          </p>
        </div>
      </div>
      
      {/* Toast Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            fontWeight: '500',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#f59e0b',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  )
}

export default AdminLogin 