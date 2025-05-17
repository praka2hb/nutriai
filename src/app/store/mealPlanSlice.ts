import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface DayMeals {
  meal: string
  description: string
  calories: number
  protein: number
  carbs: number
  fats: number
}

export interface DayPlan {
  calories: number
  protein: number
  carbs: number
  fats: number
  breakfast?: DayMeals
  lunch?: DayMeals
  dinner?: DayMeals
  snacks?: DayMeals
}

export interface MealPlanType {
  [day: string]: DayPlan
}

interface MealPlanState {
  data: MealPlanType | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  regeneratingMeal: {
    isLoading: boolean
    day: string | null
    mealType: string | null
    error: string | null
  }
}

const initialState: MealPlanState = {
  data: null,
  status: 'idle',
  regeneratingMeal: {
    isLoading: false,
    day: null,
    mealType: null,
    error: null
  }
}

export const fetchMealPlan = createAsyncThunk(
  'mealPlan/fetch',
  async (userId: string) => {
    const res = await axios.get(`/api/mealplan/${userId}`)
    return res.data.mealPlan[0] as MealPlanType
  }
)

export const regenerateMeal = createAsyncThunk(
  'mealPlan/regenerateMeal',
  async ({ userId, userMetadata, day, mealType }: {
    userId: string,
    userMetadata: any,
    day: string,
    mealType: string
  }) => {
    const response = await axios.post('/api/regenerate-meal', {
      userId,
      userMetadata,
      day,
      mealType
    })
    return {
      day,
      mealType,
      updatedMeal: response.data.updatedMeal,
      dayTotals: response.data.dayTotals
    }
  }
)

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState,
  reducers: {
    updateMeal(
      state,
      action: PayloadAction<{ day: string; mealType: string; meal: DayMeals; dayTotals: Omit<DayPlan, 'breakfast' | 'lunch' | 'dinner' | 'snacks'> }>
    ) {
      if (state.data) {
        const { day, mealType, meal, dayTotals } = action.payload
        state.data[day][mealType as 'breakfast' | 'lunch' | 'dinner' | 'snacks'] = meal
        state.data[day].calories = dayTotals.calories
        state.data[day].protein = dayTotals.protein
        state.data[day].carbs = dayTotals.carbs
        state.data[day].fats = dayTotals.fats
      }
    },
    clearMealPlan(state) {
      state.data = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMealPlan.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchMealPlan.fulfilled, (state, action: PayloadAction<MealPlanType>) => {
        state.data = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchMealPlan.rejected, (state) => {
        state.status = 'failed'
      })
      // Add regenerate meal cases
      .addCase(regenerateMeal.pending, (state, action) => {
        state.regeneratingMeal.isLoading = true
        state.regeneratingMeal.day = action.meta.arg.day
        state.regeneratingMeal.mealType = action.meta.arg.mealType
        state.regeneratingMeal.error = null
      })
      .addCase(regenerateMeal.fulfilled, (state, action) => {
        if (state.data) {
          const { day, mealType, updatedMeal, dayTotals } = action.payload
          state.data[day][mealType as 'breakfast' | 'lunch' | 'dinner' | 'snacks'] = updatedMeal
          state.data[day].calories = dayTotals.calories
          state.data[day].protein = dayTotals.protein
          state.data[day].carbs = dayTotals.carbs
          state.data[day].fats = dayTotals.fats
        }
        state.regeneratingMeal.isLoading = false
        state.regeneratingMeal.day = null
        state.regeneratingMeal.mealType = null
      })
      .addCase(regenerateMeal.rejected, (state, action) => {
        state.regeneratingMeal.isLoading = false
        state.regeneratingMeal.error = action.error.message || 'Failed to regenerate meal'
      })
  },
})

export const { updateMeal, clearMealPlan } = mealPlanSlice.actions
export default mealPlanSlice.reducer