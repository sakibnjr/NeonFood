import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isCartOpen: false,
  isPaymentOpen: false,
  isReviewOpen: false,
  reviewData: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCart: (state) => {
      state.isCartOpen = true
    },
    
    closeCart: (state) => {
      state.isCartOpen = false
    },
    
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen
    },
    
    openPayment: (state) => {
      state.isPaymentOpen = true
      state.isCartOpen = false // Close cart when opening payment
    },
    
    closePayment: (state) => {
      state.isPaymentOpen = false
    },
    
    closeAllModals: (state) => {
      state.isCartOpen = false
      state.isPaymentOpen = false
    },
    
    openReview: (state, action) => {
      state.isReviewOpen = true
      state.reviewData = action.payload || null
      state.isPaymentOpen = false // Close payment when opening review
    },
    
    closeReview: (state) => {
      state.isReviewOpen = false
      state.reviewData = null
    },
  },
})

// Selectors
export const selectIsCartOpen = (state) => state.ui.isCartOpen
export const selectIsPaymentOpen = (state) => state.ui.isPaymentOpen
export const selectIsReviewOpen = (state) => state.ui.isReviewOpen
export const selectReviewData = (state) => state.ui.reviewData

export const { 
  openCart, 
  closeCart, 
  toggleCart, 
  openPayment, 
  closePayment,
  openReview,
  closeReview
} = uiSlice.actions

export default uiSlice.reducer 