import { createSlice } from '@reduxjs/toolkit'

// Mock initial reviews data
const mockReviews = [
  {
    id: 'REV-001',
    customerName: 'Sarah Johnson',
    orderId: 'ORD-001',
    rating: 5,
    comment: 'Amazing food! The pizza was perfectly cooked and arrived quickly. Great service!',
    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    aspects: {
      food: 5,
      service: 5,
      speed: 4,
      value: 5
    }
  },
  {
    id: 'REV-002',
    customerName: 'Mike Chen',
    orderId: 'ORD-002',
    rating: 4,
    comment: 'Really enjoyed the burger and fries. The priority order option is worth it!',
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    aspects: {
      food: 4,
      service: 4,
      speed: 5,
      value: 4
    }
  },
  {
    id: 'REV-003',
    customerName: 'Emily Davis',
    orderId: null,
    rating: 5,
    comment: 'Love the new admin system! As a restaurant owner, this makes managing orders so much easier.',
    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    aspects: {
      food: 5,
      service: 5,
      speed: 5,
      value: 5
    }
  }
]

const initialState = {
  reviews: mockReviews,
  stats: {
    totalReviews: mockReviews.length,
    averageRating: 4.7,
    aspectRatings: {
      food: 4.7,
      service: 4.7,
      speed: 4.7,
      value: 4.7
    }
  },
  loading: false,
  error: null
}

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReview: (state, action) => {
      const newReview = {
        ...action.payload,
        id: `REV-${String(state.reviews.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString()
      }
      
      state.reviews.unshift(newReview)
      
      // Update stats
      const totalReviews = state.reviews.length
      const totalRating = state.reviews.reduce((sum, review) => sum + review.rating, 0)
      state.stats.totalReviews = totalReviews
      state.stats.averageRating = (totalRating / totalReviews)
      
      // Update aspect ratings if provided
      if (newReview.aspects) {
        const aspectTotals = state.reviews.reduce((totals, review) => {
          if (review.aspects) {
            Object.keys(review.aspects).forEach(aspect => {
              totals[aspect] = (totals[aspect] || 0) + review.aspects[aspect]
            })
          }
          return totals
        }, {})
        
        Object.keys(aspectTotals).forEach(aspect => {
          state.stats.aspectRatings[aspect] = aspectTotals[aspect] / totalReviews
        })
      }
    },
    
    deleteReview: (state, action) => {
      const reviewId = action.payload
      state.reviews = state.reviews.filter(review => review.id !== reviewId)
      
      // Recalculate stats
      const totalReviews = state.reviews.length
      if (totalReviews > 0) {
        const totalRating = state.reviews.reduce((sum, review) => sum + review.rating, 0)
        state.stats.averageRating = totalRating / totalReviews
        state.stats.totalReviews = totalReviews
      } else {
        state.stats = {
          totalReviews: 0,
          averageRating: 0,
          aspectRatings: {
            food: 0,
            service: 0,
            speed: 0,
            value: 0
          }
        }
      }
    },
    
    updateReviewStats: (state) => {
      const totalReviews = state.reviews.length
      if (totalReviews > 0) {
        const totalRating = state.reviews.reduce((sum, review) => sum + review.rating, 0)
        state.stats.averageRating = totalRating / totalReviews
        state.stats.totalReviews = totalReviews
      }
    }
  }
})

// Selectors
export const selectReviews = (state) => state.reviews.reviews
export const selectReviewStats = (state) => state.reviews.stats
export const selectReviewsLoading = (state) => state.reviews.loading
export const selectReviewsError = (state) => state.reviews.error

export const selectRecentReviews = (limit = 5) => (state) => 
  state.reviews.reviews.slice(0, limit)

export const selectReviewsByRating = (rating) => (state) =>
  state.reviews.reviews.filter(review => review.rating === rating)

export const selectAverageRating = (state) => state.reviews.stats.averageRating

export const { addReview, deleteReview, updateReviewStats } = reviewsSlice.actions

export default reviewsSlice.reducer 