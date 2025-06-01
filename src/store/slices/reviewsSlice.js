import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_BASE_URL } from '../api'

const API_URL = `${API_BASE_URL}/reviews`

// Async thunks for review operations
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchReviewStats = createAsyncThunk(
  'reviews/fetchReviewStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/stats`)
      if (!response.ok) {
        throw new Error('Failed to fetch review stats')
      }
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const addReview = createAsyncThunk(
  'reviews/addReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })
      if (!response.ok) {
        throw new Error('Failed to add review')
      }
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, ...reviewData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })
      if (!response.ok) {
        throw new Error('Failed to update review')
      }
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${reviewId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete review')
      }
      return reviewId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  reviews: [],
  stats: {
    totalReviews: 0,
    averageRating: 0,
    aspectRatings: {
      food: 0,
      service: 0,
      speed: 0,
      value: 0
    }
  },
  loading: false,
  error: null
}

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false
        state.reviews = action.payload
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch review stats
      .addCase(fetchReviewStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReviewStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchReviewStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Add review
      .addCase(addReview.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false
        state.reviews.unshift(action.payload)
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update review
      .addCase(updateReview.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false
        const index = state.reviews.findIndex(review => review._id === action.payload._id)
        if (index !== -1) {
          state.reviews[index] = action.payload
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false
        state.reviews = state.reviews.filter(review => review._id !== action.payload)
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
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

export default reviewsSlice.reducer 