import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Mock data for orders
const mockOrders = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    tableNumber: 5,
    items: [
      { id: 1, name: 'Margherita Pizza', quantity: 2, price: 12.99 },
      { id: 10, name: 'Coca Cola', quantity: 1, price: 2.99 }
    ],
    total: 28.97,
    status: 'pending',
    isPriority: true,
    orderTime: new Date().toISOString(),
    estimatedTime: 15
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    tableNumber: 3,
    items: [
      { id: 4, name: 'Classic Cheeseburger', quantity: 1, price: 9.99 },
      { id: 7, name: 'French Fries', quantity: 1, price: 4.99 }
    ],
    total: 14.98,
    status: 'preparing',
    isPriority: false,
    orderTime: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    estimatedTime: 12
  }
]

const initialState = {
  isAuthenticated: false,
  user: null,
  orders: mockOrders,
  stats: {
    totalOrders: 2,
    activeOrders: 2,
    totalRevenue: 43.95,
    averageOrderTime: 13.5
  },
  loading: false,
  error: null
}

// Async thunks for API calls (simulated)
export const loginAdmin = createAsyncThunk(
  'admin/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (username === 'admin' && password === 'admin123') {
        return {
          id: 1,
          username: 'admin',
          name: 'Restaurant Manager',
          role: 'admin'
        }
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
    },
    
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload
      const order = state.orders.find(order => order.id === orderId)
      if (order) {
        order.status = status
        if (status === 'completed') {
          order.completedTime = new Date().toISOString()
        }
      }
    },
    
    addNewOrder: (state, action) => {
      const newOrder = {
        ...action.payload,
        id: `ORD-${String(state.orders.length + 1).padStart(3, '0')}`,
        orderTime: new Date().toISOString(),
        status: 'pending'
      }
      state.orders.unshift(newOrder)
      state.stats.totalOrders += 1
      state.stats.activeOrders += 1
      state.stats.totalRevenue += newOrder.total
    },
    
    updateStats: (state) => {
      const activeOrders = state.orders.filter(order => 
        order.status === 'pending' || order.status === 'preparing'
      ).length
      
      const totalRevenue = state.orders.reduce((sum, order) => sum + order.total, 0)
      
      state.stats = {
        ...state.stats,
        activeOrders,
        totalRevenue,
        totalOrders: state.orders.length
      }
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
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
  state.admin.orders.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
export const selectStats = (state) => state.admin.stats
export const selectLoading = (state) => state.admin.loading
export const selectError = (state) => state.admin.error

export const selectOrdersByStatus = (status) => (state) => 
  state.admin.orders.filter(order => order.status === status)

export const selectPendingOrders = (state) => 
  state.admin.orders.filter(order => order.status === 'pending')

export const { logout, updateOrderStatus, addNewOrder, updateStats } = adminSlice.actions

export default adminSlice.reducer 