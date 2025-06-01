import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Save, Bell, Clock, Users, DollarSign } from 'lucide-react'
import { selectAdminUser } from '../../store/slices/adminSlice'

const Settings = () => {
  const user = useSelector(selectAdminUser)
  const [settings, setSettings] = useState({
    restaurantName: 'NeonFood Restaurant',
    address: '123 Food Street, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'contact@neonfood.com',
    defaultPrepTime: 15,
    priorityUpcharge: 4.99,
    maxTables: 20,
    operatingHours: {
      open: '09:00',
      close: '22:00'
    },
    notifications: {
      newOrders: true,
      orderReady: true,
      dailyReport: false
    }
  })

  const [saved, setSaved] = useState(false)

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedChange = (parent, field, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }))
  }

  const handleSave = () => {
    // Here you would normally save to backend
    console.log('Saving settings:', settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your restaurant configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restaurant Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                value={settings.restaurantName}
                onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={settings.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Operating Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Operating Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-1" />
                Default Preparation Time (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={settings.defaultPrepTime}
                onChange={(e) => handleInputChange('defaultPrepTime', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign size={16} className="inline mr-1" />
                Priority Order Upcharge ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.50"
                value={settings.priorityUpcharge}
                onChange={(e) => handleInputChange('priorityUpcharge', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users size={16} className="inline mr-1" />
                Maximum Tables
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.maxTables}
                onChange={(e) => handleInputChange('maxTables', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opening Time
                </label>
                <input
                  type="time"
                  value={settings.operatingHours.open}
                  onChange={(e) => handleNestedChange('operatingHours', 'open', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Closing Time
                </label>
                <input
                  type="time"
                  value={settings.operatingHours.close}
                  onChange={(e) => handleNestedChange('operatingHours', 'close', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            <Bell size={20} className="inline mr-2" />
            Notification Preferences
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">New Order Alerts</label>
                <p className="text-xs text-gray-500">Get notified when new orders are placed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.newOrders}
                  onChange={(e) => handleNestedChange('notifications', 'newOrders', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Order Ready Alerts</label>
                <p className="text-xs text-gray-500">Alert when orders are ready for pickup</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.orderReady}
                  onChange={(e) => handleNestedChange('notifications', 'orderReady', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Daily Reports</label>
                <p className="text-xs text-gray-500">Receive daily sales and order reports</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.dailyReport}
                  onChange={(e) => handleNestedChange('notifications', 'dailyReport', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Profile</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.role}</p>
                <p className="text-sm text-gray-500">@{user?.username}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
        >
          <Save size={16} className="inline mr-2" />
          {saved ? 'Settings Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

export default Settings 