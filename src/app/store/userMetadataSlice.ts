import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserMetadata {
  // Define your user metadata fields here
  userId: string
  fitnessGoal: string
  age: string
  height: string
  weight: string
  gender: string
  allergies: string[]
  activityLevel: string
  dietaryPreferences: string[]
  // ...add more as needed
}

interface UserMetadataState {
  data: UserMetadata | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: UserMetadataState = {
  data: null,
  status: 'idle',
}

export const fetchUserMetadata = createAsyncThunk(
  'userMetadata/fetch',
  async (userId: string) => {
    const res = await axios.get(`/api/user-meta/${userId}`)
    return res.data as UserMetadata
  }
)

const userMetadataSlice = createSlice({
  name: 'userMetadata',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserMetadata.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUserMetadata.fulfilled, (state, action: PayloadAction<UserMetadata>) => {
        state.data = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchUserMetadata.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export default userMetadataSlice.reducer