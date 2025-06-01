import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunks for settings operations
export const loadSettings = createAsyncThunk(
  'settings/loadSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/settings')
      if (!response.ok) {
        // If no settings found, return default settings
        if (response.status === 404) {
          return getDefaultSettings()
        }
        throw new Error('Failed to load settings')
      }
      return await response.json()
    } catch (error) {
      // Fall back to localStorage if backend fails
      const localSettings = localStorage.getItem('restaurantSettings')
      if (localSettings) {
        return JSON.parse(localSettings)
      }
      return getDefaultSettings()
    }
  }
)

export const saveSettings = createAsyncThunk(
  'settings/saveSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      if (!response.ok) {
        throw new Error('Failed to save settings')
      }
      
      const savedSettings = await response.json()
      
      // Also save to localStorage as backup
      localStorage.setItem('restaurantSettings', JSON.stringify(savedSettings))
      
      return savedSettings
    } catch (error) {
      // Fall back to localStorage if backend fails
      localStorage.setItem('restaurantSettings', JSON.stringify(settings))
      return settings
    }
  }
)

export const changePassword = createAsyncThunk(
  'settings/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('http://localhost:5000/api/admin/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to change password')
      }
      
      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

function getDefaultSettings() {
  return {
    restaurantName: 'NeonFood Restaurant',
    address: '123 Food Street, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'contact@neonfood.com',
    website: 'https://neonfood.com',
    description: 'A modern restaurant serving delicious food with cutting-edge technology.',
    defaultPrepTime: 15,
    priorityUpcharge: 4.99,
    maxTables: 20,
    serviceFee: 2.50,
    taxRate: 8.5,
    operatingHours: {
      monday: { open: '09:00', close: '22:00', closed: false },
      tuesday: { open: '09:00', close: '22:00', closed: false },
      wednesday: { open: '09:00', close: '22:00', closed: false },
      thursday: { open: '09:00', close: '22:00', closed: false },
      friday: { open: '09:00', close: '23:00', closed: false },
      saturday: { open: '09:00', close: '23:00', closed: false },
      sunday: { open: '10:00', close: '21:00', closed: false }
    },
    notifications: {
      newOrders: true,
      orderReady: true,
      lowStock: true,
      dailyReport: false,
      weeklyReport: true,
      customerReviews: true,
      systemUpdates: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 60,
      passwordExpiry: 90
    }
  }
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    data: getDefaultSettings(),
    loading: false,
    saving: false,
    error: null,
    lastSaved: null,
    passwordChanging: false,
    passwordError: null,
    passwordSuccess: false
  },
  reducers: {
    updateSettings: (state, action) => {
      state.data = { ...state.data, ...action.payload }
    },
    updateNestedSettings: (state, action) => {
      const { parent, field, value } = action.payload
      state.data[parent] = {
        ...state.data[parent],
        [field]: value
      }
    },
    updateOperatingHours: (state, action) => {
      const { day, field, value } = action.payload
      state.data.operatingHours[day] = {
        ...state.data.operatingHours[day],
        [field]: value
      }
    },
    clearPasswordStatus: (state) => {
      state.passwordError = null
      state.passwordSuccess = false
    }
  },
  extraReducers: (builder) => {
    builder
      // Load settings
      .addCase(loadSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(loadSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      
      // Save settings
      .addCase(saveSettings.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.saving = false
        state.data = action.payload
        state.lastSaved = new Date().toISOString()
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.saving = false
        state.error = action.error.message
      })
      
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.passwordChanging = true
        state.passwordError = null
        state.passwordSuccess = false
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.passwordChanging = false
        state.passwordSuccess = true
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.passwordChanging = false
        state.passwordError = action.payload
      })
  }
})

export const { 
  updateSettings, 
  updateNestedSettings, 
  updateOperatingHours, 
  clearPasswordStatus
} = settingsSlice.actions

// Selectors
export const selectSettings = (state) => state.settings.data
export const selectSettingsLoading = (state) => state.settings.loading
export const selectSettingsSaving = (state) => state.settings.saving
export const selectSettingsError = (state) => state.settings.error
export const selectLastSaved = (state) => state.settings.lastSaved
export const selectPasswordChanging = (state) => state.settings.passwordChanging
export const selectPasswordError = (state) => state.settings.passwordError
export const selectPasswordSuccess = (state) => state.settings.passwordSuccess

// Helper selectors
export const selectRestaurantInfo = (state) => ({
  name: state.settings.data.restaurantName,
  address: state.settings.data.address,
  phone: state.settings.data.phone,
  email: state.settings.data.email,
  website: state.settings.data.website,
  description: state.settings.data.description
})

export const selectOperatingHours = (state) => state.settings.data.operatingHours
export const selectNotificationSettings = (state) => state.settings.data.notifications
export const selectSecuritySettings = (state) => state.settings.data.security

// Helper function to check if restaurant is open
export const selectIsRestaurantOpen = (state) => {
  const now = new Date()
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const currentTime = now.toTimeString().slice(0, 5) // HH:MM format
  
  const daySchedule = state.settings.data.operatingHours[currentDay]
  
  if (!daySchedule || daySchedule.closed) return false
  
  return currentTime >= daySchedule.open && currentTime <= daySchedule.close
}

export default settingsSlice.reducer 