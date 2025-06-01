import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { User, Lock, AlertCircle } from 'lucide-react'
import { setAuthenticated, selectLoading, selectError, selectIsAuthenticated } from '../../store/slices/adminSlice'

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

  const handleSubmit = (e) => {
    e.preventDefault()
    // Set isAuthenticated to true in Redux (simulate login)
    dispatch(setAuthenticated(true))
    navigate('/admin')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const fillDemoCredentials = () => {
    setFormData({
      username: 'admin',
      password: 'admin123'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🍜</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">NeonFood Admin</h1>
          <p className="text-gray-600">Sign in to manage your restaurant</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
              <AlertCircle size={20} className="text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter username"
                required
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600'
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

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-500">Username: <strong>admin</strong></p>
          <p className="text-xs text-gray-500">Password: <strong>admin123</strong></p>
          <button
            onClick={fillDemoCredentials}
            className="mt-2 text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-md hover:bg-primary-200 transition-colors"
          >
            Fill Demo Credentials
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Debug: Auth Status = {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin 