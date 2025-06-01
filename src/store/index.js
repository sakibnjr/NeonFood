import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'
import uiReducer from './slices/uiSlice'
import adminReducer from './slices/adminSlice'
import reviewsReducer from './slices/reviewsSlice'
import settingsReducer from './slices/settingsSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    ui: uiReducer,
    admin: adminReducer,
    reviews: reviewsReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
}) 