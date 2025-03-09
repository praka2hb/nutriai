"use client"

import { useEffect, useState } from "react"
import axios from "axios"
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

  const [userMetadata, setUserMetadata] = useState<FormData | null>(null)

  const [loading, setLoading] = useState(true)
  const [hasMealData, setHasMealData] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)
  useEffect(() => {
    if (status === "loading") return
    
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
  
    if (!userId) return

    setLoading(true)
    
    axios.get(`/api/mealplan/${userId}`)
      .then(res => {
        if (res.status === 200 || res.status === 201) {
          if (res.data?.mealPlan?.[0]) {
            setHasMealData(true)
          }
        }
      })
      .catch(()=>{
        setHasMealData(false)
      })
      .finally(()=>{
        setLoading(false)
      })
    
    axios.get(`/api/user-meta/${userId}`)
      .then(res => {
        if (res.status === 201) {
          setHasProfile(true)
          setUserMetadata(res.data)
        }
      })
      .catch(() => {
        setHasProfile(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [status, session, router, userId])



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
      <div className="ml-32 ">
      {userId && (
        <div>
          <NutriBot hasMealData={hasMealData} userMetadata={userMetadata} hasProfile={hasProfile} userId= {userId} />
        </div>
      )}
      </div>
    </main>
  )
}