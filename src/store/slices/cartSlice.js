import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  isPriority: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existingItem = state.items.find(cartItem => cartItem.id === item.id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...item, quantity: 1 })
      }
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    
    updateQuantity: (state, action) => {
      const { itemId, newQuantity } = action.payload
      
      if (newQuantity === 0) {
        state.items = state.items.filter(item => item.id !== itemId)
      } else {
        const item = state.items.find(item => item.id === itemId)
        if (item) {
          item.quantity = newQuantity
        }
      }
    },
    
    togglePriority: (state, action) => {
      state.isPriority = action.payload
    },
    
    clearCart: (state) => {
      state.items = []
      state.isPriority = false
    },
  },
})

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectIsPriority = (state) => state.cart.isPriority

export const selectTotalItems = (state) => {
  return state.cart.items.reduce((total, item) => total + item.quantity, 0)
}

export const selectItemsTotal = (state) => {
  return state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

export const selectPriorityFee = (state) => {
  const priorityUpcharge = state.settings?.data?.priorityUpcharge || 4.99
  return state.cart.isPriority ? priorityUpcharge : 0
}

export const selectServiceFee = (state) => {
  const serviceFee = state.settings?.data?.serviceFee || 2.50
  return state.cart.items.length > 0 ? serviceFee : 0
}

export const selectSubtotal = (state) => {
  const itemsTotal = selectItemsTotal(state)
  const priorityFee = selectPriorityFee(state)
  const serviceFee = selectServiceFee(state)
  return itemsTotal + priorityFee + serviceFee
}

export const selectTaxAmount = (state) => {
  const taxRate = state.settings?.data?.taxRate || 8.5
  const subtotal = selectSubtotal(state)
  return subtotal * (taxRate / 100)
}

export const selectTotalPrice = (state) => {
  const subtotal = selectSubtotal(state)
  const tax = selectTaxAmount(state)
  return subtotal + tax
}

export const selectDeliveryTime = (state) => {
  if (state.cart.items.length === 0) return 0
  
  // Use default prep time from settings if available
  const defaultPrepTime = state.settings?.data?.defaultPrepTime || 15
  
  // Calculate based on items with fallback to default prep time
  const maxItemTime = state.cart.items.length > 0 
    ? Math.max(...state.cart.items.map(item => item.deliveryTime || defaultPrepTime))
    : defaultPrepTime
    
  return state.cart.isPriority ? Math.max(Math.ceil(maxItemTime * 0.5), 5) : maxItemTime
}

export const selectOrderSummary = (state) => ({
  itemCount: selectTotalItems(state),
  itemsTotal: selectItemsTotal(state),
  priorityFee: selectPriorityFee(state),
  serviceFee: selectServiceFee(state),
  subtotal: selectSubtotal(state),
  tax: selectTaxAmount(state),
  total: selectTotalPrice(state),
  deliveryTime: selectDeliveryTime(state),
  isPriority: state.cart.isPriority,
  items: state.cart.items
})

export const { addToCart, removeFromCart, updateQuantity, togglePriority, clearCart } = cartSlice.actions

export default cartSlice.reducer 