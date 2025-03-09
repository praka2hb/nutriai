"use client"

import { useEffect, useState } from "react"
import { UserMetadataForm } from "@/components/user-metadata" 
import { FitnessGoalsForm } from "@/components/fitness-goal-form" 
import { NutritionForm } from "@/components/nutrition-form"
import { FormSummary } from "@/components/form-summary"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import UserMetadataCard from "@/components/user-details"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const userId = session?.user?.id
  
  // States
  const [loading, setLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    age: "",
    height: "",
    weight: "",
    gender: "",
    fitnessGoal: "",
    allergies: "",
    activities: [],
    activityLevel: "",
    mealsPerDay: "",
    dietaryPreferences: [],
  })
  const [isComplete, setIsComplete] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // Fetch user metadata
  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/login")
      return
    }
    
    if (!userId) return
    
    setLoading(true)
    
    axios.get(`/api/user-meta/${userId}`)
      .then(res => {
        if (res.status === 201) {
          setHasProfile(true)
          setFormData(res.data)
        }
      })
      .catch(() => {
        setHasProfile(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [status, session, router, userId])

  // Form handling functions
  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)
  const completeForm = () => setIsComplete(true)
  
  const startEditProfile = () => {
    setIsEditing(true)
    setStep(0)
    setIsComplete(false)
  }
  
  const cancelEdit = () => {
    setIsEditing(false)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      if(hasProfile){
        const res = await axios.put(`/api/user-meta/${userId}`, {
          ...formData
        })
        if (res.status === 201) {
          toast.success("Profile updated successfully",{
            description: "Quit the current plan and try to generate a new one with the updated profile"
          })
          setHasProfile(true)
          setIsEditing(false)
        }
      }

      else{
          const res = await axios.post("/api/user-meta", {
            ...formData,
            userId: userId as string
          })
        
          if (res.status === 201) {
            router.push("/home")
            toast.success("Profile saved successfully",{
              description: "Now You can generate a personalized meal plan anytime!"
            })
            setHasProfile(true)
            setIsEditing(false)
          }
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to save profile")
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading && status !== "loading") {
    return (
      <div className="container mx-auto py-20 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-muted rounded mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className={`${hasProfile ? "flex justify-center": "flex justify-center"}`}>
      <div className="max-w-2xl w-full">
       {!hasProfile && <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-b from-neutral-800 to-neutral-600 bg-clip-text text-transparent">Fitness Profile</h1>
          <p className="text-muted-foreground mt-2">
              Complete your profile to get personalized fitness recommendations
          </p>
        </div>}

        {hasProfile && !isEditing ? (
          <Card>
            <CardHeader className="text-zinc-800">
              <CardTitle>Your Fitness Profile</CardTitle>
              <CardDescription>Profile information used for your recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <UserMetadataCard userData={formData} />
              <div className="mt-6 flex justify-end">
                <Button onClick={startEditProfile} className="bg-gradient-to-r from-zinc-800 to-zinc-600 p-3">Edit Profile</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {hasProfile && (
              <div className="flex justify-end mb-2">
                <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
              </div>
            )}
            
            {!isComplete ? (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step >= i ? "bg-zinc-700 text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Step {step + 1} of 3</p>
                </div>

                {step === 0 && <UserMetadataForm formData={formData} updateFormData={updateFormData} onNext={nextStep} />}

                {step === 1 && (
                  <FitnessGoalsForm
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={nextStep}
                    onPrev={prevStep}
                  />
                )}

                {step === 2 && (
                  <NutritionForm
                    formData={formData}
                    updateFormData={updateFormData}
                    onComplete={completeForm}
                    onPrev={prevStep}
                  />
                )}
              </>
            ) : (
              <div className="space-y-6">
                <FormSummary formData={formData} />
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => setIsComplete(false)}>Back</Button>
                  <Button onClick={handleSubmit} className="bg-gradient-to-br from-zinc-800 to-zinc-600 ">
                    {hasProfile ? "Update Profile" : "Create Profile"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
      <div className="flex justify-center mt-8 text-muted-foreground text-sm">
        Accurate metadata enables us to deliver the most relevant and tailored recommendations for you.
      </div>
    </main>
  )
}