import { configureStore } from '@reduxjs/toolkit'
import userMetadataReducer from './userMetadataSlice'
import mealPlanReducer from './mealPlanSlice'

export const store = configureStore({
  reducer: {
    userMetadata: userMetadataReducer,
    mealPlan: mealPlanReducer,
  },
})

// Types for use throughout your app
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch