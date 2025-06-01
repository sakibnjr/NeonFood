import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_BASE_URL } from '../api'

// Async thunks for real API calls
export const fetchOrders = createAsyncThunk('admin/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`)
    if (!res.ok) throw new Error('Failed to fetch orders')
    return await res.json()
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const addOrder = createAsyncThunk('admin/addOrder', async (order, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    })
    if (!res.ok) throw new Error('Failed to add order')
    return await res.json()
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const updateOrder = createAsyncThunk('admin/updateOrder', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to update order')
    return await res.json()
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const deleteOrder = createAsyncThunk('admin/deleteOrder', async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete order')
    return id
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const initialState = {
  isAuthenticated: false,
  user: null,
  orders: [],
  stats: {
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    averageOrderTime: 0
  },
  loading: false,
  error: null
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      // Clear auth token from localStorage
      localStorage.removeItem('adminToken')
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload
      if (action.payload) {
        state.user = {
          id: 1,
          username: 'user',
          name: 'Restaurant Manager',
          role: 'admin'
        }
      } else {
        state.user = null
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Helper function to calculate average order time
    const calculateAverageOrderTime = (orders) => {
      const completedOrders = orders.filter(order => order.status === 'completed' && order.completedTime && order.orderTime)
      if (completedOrders.length > 0) {
        const totalPrepTime = completedOrders.reduce((sum, order) => {
          const orderTime = new Date(order.orderTime)
          const completedTime = new Date(order.completedTime)
          const prepTime = (completedTime - orderTime) / (1000 * 60) // Convert to minutes
          return sum + prepTime
        }, 0)
        return Math.round(totalPrepTime / completedOrders.length)
      }
      return 0
    }

    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
        // Update stats
        state.stats.totalOrders = action.payload.length
        state.stats.activeOrders = action.payload.filter(order => order.status === 'pending' || order.status === 'preparing').length
        state.stats.totalRevenue = action.payload.reduce((sum, order) => sum + order.total, 0)
        state.stats.averageOrderTime = calculateAverageOrderTime(action.payload)
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload)
        state.stats.totalOrders += 1
        state.stats.activeOrders += 1
        state.stats.totalRevenue += action.payload.total
        state.stats.averageOrderTime = calculateAverageOrderTime(state.orders)
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.orders = state.orders.map(order => order._id === action.payload._id ? action.payload : order)
        // Recalculate stats since order status might have changed
        state.stats.activeOrders = state.orders.filter(order => order.status === 'pending' || order.status === 'preparing').length
        state.stats.averageOrderTime = calculateAverageOrderTime(state.orders)
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(order => order._id !== action.payload)
        state.stats.totalOrders -= 1
        state.stats.averageOrderTime = calculateAverageOrderTime(state.orders)
      })
  }
})

// Selectors
export const selectIsAuthenticated = (state) => state.admin.isAuthenticated
export const selectAdminUser = (state) => state.admin.user
export const selectOrders = (state) => state.admin.orders
export const selectActiveOrders = (state) => 
  state.admin.orders.filter(order => 
    order.status === 'pending' || order.status === 'preparing' || order.status === 'ready'
  )
export const selectRecentOrders = (state) => 
  state.admin.orders.slice().sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime))
export const selectStats = (state) => state.admin.stats
export const selectLoading = (state) => state.admin.loading
export const selectError = (state) => state.admin.error

export const selectOrdersByStatus = (status) => (state) => 
  state.admin.orders.filter(order => order.status === status)

export const selectPendingOrders = (state) => 
  state.admin.orders.filter(order => order.status === 'pending')

export const { logout, setAuthenticated, setLoading, setError, clearError } = adminSlice.actions

export default adminSlice.reducer 