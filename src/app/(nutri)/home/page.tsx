"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserMetadata } from '@/app/store/userMetadataSlice'
import { fetchMealPlan } from '@/app/store/mealPlanSlice'
import { RootState, AppDispatch } from '@/app/store'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import NutriBot from "@/components/NutriBot"

export type FormData = {
  age: string
  height: string
  weight: string
  gender: string
  fitnessGoal: string
  allergies: string
  activities: string[]
  activityLevel: string
  mealsPerDay: string
  dietaryPreferences: string[]
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const userId = session?.user?.id
  const dispatch = useDispatch<AppDispatch>()
  
  // Get data from Redux store
  const userMetadata = useSelector((state: RootState) => state.userMetadata.data)
  const userMetadataStatus = useSelector((state: RootState) => state.userMetadata.status)
  const mealPlan = useSelector((state: RootState) => state.mealPlan.data)
  const mealPlanStatus = useSelector((state: RootState) => state.mealPlan.status)

  // Loading state based on Redux status
  const loading = userMetadataStatus === 'loading' || mealPlanStatus === 'loading'
  
  // Derived states
  const hasProfile = !!userMetadata
  const hasMealData = !!mealPlan

  useEffect(() => {
    if (status === "loading") return
    
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
  
    if (!userId) return

    // Fetch data using Redux actions
    dispatch(fetchUserMetadata(userId))
    dispatch(fetchMealPlan(userId))
  }, [status, userId, router, dispatch])

  if (loading && status !== "loading") {
    return (
      <div className="container mx-auto py-20 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-20 w-80 bg-muted rounded mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="">
      {userId && (
        <div>
          <NutriBot 
            hasMealData={hasMealData} 
            userMetadata={userMetadata as unknown as FormData} 
            hasProfile={hasProfile} 
            userId={userId} 
          />
        </div>
      )}
      </div>
    </main>
  )
}