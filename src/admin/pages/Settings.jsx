import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Save, 
  Bell, 
  Clock, 
  Users, 
  DollarSign, 
  MapPin,
  Phone,
  Mail,
  Shield,
  Eye,
  EyeOff,
  Camera,
  Globe,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { selectAdminUser } from '../../store/slices/adminSlice'
import {
  loadSettings,
  saveSettings,
  changePassword,
  updateSettings,
  updateNestedSettings,
  updateOperatingHours,
  clearPasswordStatus,
  selectSettings,
  selectSettingsLoading,
  selectSettingsSaving,
  selectSettingsError,
  selectLastSaved,
  selectPasswordChanging,
  selectPasswordError,
  selectPasswordSuccess
} from '../../store/slices/settingsSlice'

const Settings = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectAdminUser)
  const settings = useSelector(selectSettings)
  const loading = useSelector(selectSettingsLoading)
  const saving = useSelector(selectSettingsSaving)
  const error = useSelector(selectSettingsError)
  const lastSaved = useSelector(selectLastSaved)
  const passwordChanging = useSelector(selectPasswordChanging)
  const passwordError = useSelector(selectPasswordError)
  const passwordSuccess = useSelector(selectPasswordSuccess)

  const [activeTab, setActiveTab] = useState('restaurant')
  const [showSaveIndicator, setShowSaveIndicator] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordValidation, setPasswordValidation] = useState({
    mismatch: false,
    tooShort: false
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  // Load settings on component mount
  useEffect(() => {
    dispatch(loadSettings())
  }, [dispatch])

  // Auto-save functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (JSON.stringify(settings) !== localStorage.getItem('lastSavedSettings')) {
        handleSave()
      }
    }, 2000) // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId)
  }, [settings])

  // Show save indicator
  useEffect(() => {
    if (lastSaved) {
      setShowSaveIndicator(true)
      setTimeout(() => setShowSaveIndicator(false), 3000)
      localStorage.setItem('lastSavedSettings', JSON.stringify(settings))
    }
  }, [lastSaved])

  // Clear password status when tab changes
  useEffect(() => {
    if (activeTab !== 'security') {
      dispatch(clearPasswordStatus())
    }
  }, [activeTab, dispatch])

  const handleInputChange = (field, value) => {
    dispatch(updateSettings({ [field]: value }))
  }

  const handleNestedChange = (parent, field, value) => {
    dispatch(updateNestedSettings({ parent, field, value }))
  }

  const handleOperatingHoursChange = (day, field, value) => {
    dispatch(updateOperatingHours({ day, field, value }))
  }

  const handleSave = async () => {
    await dispatch(saveSettings(settings))
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    // Clear previous errors
    dispatch(clearPasswordStatus())
    setPasswordValidation({ mismatch: false, tooShort: false })
    
    // Validate form
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordValidation(prev => ({ ...prev, mismatch: true }))
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordValidation(prev => ({ ...prev, tooShort: true }))
      return
    }
    
    const result = await dispatch(changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }))
    
    // Only clear form if password change was successful
    if (changePassword.fulfilled.match(result)) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    }
  }

  const tabs = [
    { id: 'restaurant', name: 'Restaurant Info', icon: MapPin },
    { id: 'operations', name: 'Operations', icon: Clock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield }
  ]

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  const getSaveButtonContent = () => {
    if (saving) {
      return (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>Saving...</span>
        </>
      )
    }
    
    if (lastSaved && new Date() - new Date(lastSaved) < 3000) {
      return (
        <>
          <CheckCircle size={20} />
          <span>Settings Saved!</span>
        </>
      )
    }
    
    return (
      <>
        <Save size={20} />
        <span>Save Changes</span>
      </>
    )
  }

  const getSaveButtonClass = () => {
    if (saving) return 'bg-gray-400 text-white cursor-not-allowed'
    if (lastSaved && new Date() - new Date(lastSaved) < 3000) return 'bg-green-500 text-white'
    return 'bg-blue-600 text-white hover:bg-blue-700'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Manage your restaurant configuration and preferences</p>
              {lastSaved && (
                <p className="text-sm text-green-600 mt-1">
                  Last saved: {new Date(lastSaved).toLocaleString()}
                </p>
              )}
              {error && (
                <div className="flex items-center mt-2 text-red-600">
                  <AlertCircle size={16} className="mr-1" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${getSaveButtonClass()}`}
            >
              {getSaveButtonContent()}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>

            {/* Admin Profile Card */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                  <button className="absolute -bottom-1 -right-1 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-700">
                    <Camera size={12} />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{user?.name || 'Admin User'}</h3>
                <p className="text-sm text-gray-500 capitalize">{user?.role || 'Administrator'}</p>
                <p className="text-sm text-blue-600">@{user?.username || 'admin'}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Restaurant Information */}
            {activeTab === 'restaurant' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <MapPin className="mr-2" size={24} />
                      Restaurant Information
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Restaurant Name
                        </label>
                        <input
                          type="text"
                          value={settings.restaurantName}
                          onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="inline mr-1" size={16} />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={settings.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail className="inline mr-1" size={16} />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={settings.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Globe className="inline mr-1" size={16} />
                          Website
                        </label>
                        <input
                          type="url"
                          value={settings.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <textarea
                          value={settings.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={settings.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Brief description of your restaurant..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Operations */}
            {activeTab === 'operations' && (
              <div className="space-y-6">
                {/* Basic Operations */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <Clock className="mr-2" size={24} />
                      Operations Settings
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Prep Time (minutes)
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="120"
                          value={settings.defaultPrepTime}
                          onChange={(e) => handleInputChange('defaultPrepTime', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority Upcharge ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.50"
                          value={settings.priorityUpcharge}
                          onChange={(e) => handleInputChange('priorityUpcharge', parseFloat(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Tables
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="200"
                          value={settings.maxTables}
                          onChange={(e) => handleInputChange('maxTables', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Fee ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.25"
                          value={settings.serviceFee}
                          onChange={(e) => handleInputChange('serviceFee', parseFloat(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="25"
                          step="0.1"
                          value={settings.taxRate}
                          onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Operating Hours</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {days.map((day) => (
                        <div key={day} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-24">
                            <span className="font-medium text-gray-900 capitalize">{day}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={!settings.operatingHours[day].closed}
                              onChange={(e) => handleOperatingHoursChange(day, 'closed', !e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">Open</span>
                          </div>

                          {!settings.operatingHours[day].closed && (
                            <>
                              <div>
                                <input
                                  type="time"
                                  value={settings.operatingHours[day].open}
                                  onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <span className="text-gray-500">to</span>
                              <div>
                                <input
                                  type="time"
                                  value={settings.operatingHours[day].close}
                                  onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            </>
                          )}

                          {settings.operatingHours[day].closed && (
                            <span className="text-red-600 font-medium">Closed</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Bell className="mr-2" size={24} />
                    Notification Preferences
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {[
                      { key: 'newOrders', label: 'New Order Alerts', desc: 'Get notified when new orders are placed' },
                      { key: 'orderReady', label: 'Order Ready Alerts', desc: 'Alert when orders are ready for pickup' },
                      { key: 'lowStock', label: 'Low Stock Warnings', desc: 'Notify when ingredients are running low' },
                      { key: 'customerReviews', label: 'Customer Reviews', desc: 'Get notified about new customer reviews' },
                      { key: 'dailyReport', label: 'Daily Reports', desc: 'Receive daily sales and order reports' },
                      { key: 'weeklyReport', label: 'Weekly Reports', desc: 'Receive weekly business analytics' },
                      { key: 'systemUpdates', label: 'System Updates', desc: 'Notifications about system maintenance and updates' }
                    ].map((notification) => (
                      <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-700">{notification.label}</label>
                          <p className="text-xs text-gray-500">{notification.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications[notification.key]}
                            onChange={(e) => handleNestedChange('notifications', notification.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <Shield className="mr-2" size={24} />
                      Security Settings
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                          <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.security.twoFactorAuth}
                            onChange={(e) => handleNestedChange('security', 'twoFactorAuth', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Session Timeout (minutes)
                          </label>
                          <select
                            value={settings.security.sessionTimeout}
                            onChange={(e) => handleNestedChange('security', 'sessionTimeout', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={60}>1 hour</option>
                            <option value={120}>2 hours</option>
                            <option value={240}>4 hours</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password Expiry (days)
                          </label>
                          <select
                            value={settings.security.passwordExpiry}
                            onChange={(e) => handleNestedChange('security', 'passwordExpiry', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value={30}>30 days</option>
                            <option value={60}>60 days</option>
                            <option value={90}>90 days</option>
                            <option value={180}>180 days</option>
                            <option value={365}>1 year</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                  </div>
                  <div className="p-6">
                    {passwordError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center text-red-600">
                          <AlertCircle size={16} className="mr-2" />
                          <span className="text-sm">{passwordError}</span>
                        </div>
                      </div>
                    )}
                    
                    {passwordSuccess && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center text-green-600">
                          <CheckCircle size={16} className="mr-2" />
                          <span className="text-sm">Password changed successfully!</span>
                        </div>
                      </div>
                    )}
                    
                    {(passwordValidation.mismatch || passwordValidation.tooShort) && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center text-red-600">
                          <AlertCircle size={16} className="mr-2" />
                          <div className="text-sm">
                            {passwordValidation.mismatch && <div>New passwords do not match</div>}
                            {passwordValidation.tooShort && <div>New password must be at least 6 characters long</div>}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <button
                        onClick={handlePasswordChange}
                        disabled={passwordChanging || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {passwordChanging && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        <span>{passwordChanging ? 'Updating...' : 'Update Password'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings 