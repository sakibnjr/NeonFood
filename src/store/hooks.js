import { useDispatch, useSelector } from 'react-redux'
import { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  togglePriority, 
  clearCart 
} from './slices/cartSlice'
import { 
  openCart, 
  closeCart, 
  openPayment, 
  closePayment,
  openReview,
  closeReview
} from './slices/uiSlice'
import { addReview } from './slices/reviewsSlice'

// Custom hook for cart actions
export const useCartActions = () => {
  const dispatch = useDispatch()
  
  return {
    addToCart: (item) => dispatch(addToCart(item)),
    removeFromCart: (itemId) => dispatch(removeFromCart(itemId)),
    updateQuantity: (itemId, newQuantity) => dispatch(updateQuantity({ itemId, newQuantity })),
    togglePriority: (isPriority) => dispatch(togglePriority(isPriority)),
    clearCart: () => dispatch(clearCart()),
  }
}

// Custom hook for UI actions
export const useUIActions = () => {
  const dispatch = useDispatch()
  
  return {
    openCart: () => dispatch(openCart()),
    closeCart: () => dispatch(closeCart()),
    openPayment: () => dispatch(openPayment()),
    closePayment: () => dispatch(closePayment()),
    openReview: (data) => dispatch(openReview(data)),
    closeReview: () => dispatch(closeReview()),
  }
}

// Custom hook for review actions
export const useReviewActions = () => {
  const dispatch = useDispatch()
  
  return {
    addReview: (reviewData) => dispatch(addReview(reviewData)),
  }
}

// Custom hook for combined actions (commonly used together)
export const useAppActions = () => {
  const cartActions = useCartActions()
  const uiActions = useUIActions()
  const reviewActions = useReviewActions()
  
  return {
    ...cartActions,
    ...uiActions,
    ...reviewActions,
  }
} 