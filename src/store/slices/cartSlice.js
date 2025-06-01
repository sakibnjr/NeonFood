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

export const selectTotalPrice = (state) => {
  const itemsTotal = selectItemsTotal(state)
  const priorityFee = state.cart.isPriority ? 4.99 : 0
  return itemsTotal + priorityFee
}

export const selectDeliveryTime = (state) => {
  if (state.cart.items.length === 0) return 0
  const standardTime = Math.max(...state.cart.items.map(item => item.deliveryTime))
  return state.cart.isPriority ? Math.max(Math.ceil(standardTime * 0.5), 5) : standardTime
}

export const selectOrderSummary = (state) => ({
  itemCount: selectTotalItems(state),
  subtotal: selectItemsTotal(state),
  total: selectTotalPrice(state),
  deliveryTime: selectDeliveryTime(state),
  isPriority: state.cart.isPriority,
  items: state.cart.items
})

export const { addToCart, removeFromCart, updateQuantity, togglePriority, clearCart } = cartSlice.actions

export default cartSlice.reducer 