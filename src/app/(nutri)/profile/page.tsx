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
import { UserFormData } from "../home/page"
import { Flame, Edit3, ChevronLeft, User as UserIcon, Check } from "lucide-react"

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const userId = session?.user?.id
  
  // States
  const [loading, setLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<UserFormData>({
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
    
    if (!userId) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    
    axios.get(`/api/user-meta/${userId}`)
      .then(res => {
        if (res.status === 201 && res.data && Object.keys(res.data).length > 1) {
          setHasProfile(true)
          setFormData(res.data)
        } else {
          setHasProfile(false)
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
  const updateFormData = (data: Partial<UserFormData>) => {
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
    if (userId && hasProfile) {
      axios.get(`/api/user-meta/${userId}`).then(res => {
        if (res.status === 201) setFormData(res.data)
      })
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const apiEndpoint = hasProfile && isEditing ? `/api/user-meta/${userId}` : "/api/user-meta"
      const method = hasProfile && isEditing ? axios.put : axios.post
      const payload = hasProfile && isEditing ? { ...formData } : { ...formData, userId: userId as string }

      const res = await method(apiEndpoint, payload)
        
      if (res.status === 201) {
        const successMessage = (hasProfile && isEditing) ? "Profile updated successfully!" : "Profile created successfully!"
        toast.success(successMessage, {
          description: (hasProfile && isEditing)
            ? "Your FuelBlitz plan can now use your updated details."
            : "Your FuelBlitz profile is set! Generate a plan anytime."
        })
        setHasProfile(true)
        setIsEditing(false)
        setIsComplete(false)
        setStep(0)
        if (!(hasProfile && isEditing)) {
          router.push("/home")
        } else {
          axios.get(`/api/user-meta/${userId}`).then(profileRes => {
            if (profileRes.status === 201) setFormData(profileRes.data)
          })
        }
      } else {
        toast.error("Failed to save profile. Please try again.")
      }
    } catch (error) {
      console.error("Profile submission error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading && status !== "loading") {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center text-slate-600 p-4">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="h-10 w-72 bg-slate-300 rounded-md"></div>
          <div className="h-6 w-56 bg-slate-300 rounded-md"></div>
          <div className="mt-8">
            <Flame className="w-16 h-16 text-orange-500 animate-ping opacity-75" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800 py-10 px-4 md:px-6 flex flex-col items-center">
      <div className="max-w-2xl w-full">
       {!hasProfile && !isEditing && (
         <div className="text-center mb-10">
          <Flame className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
            Set Up Your FuelBlitz Profile
          </h1>
          <p className="text-slate-600 mt-2 text-lg">
              Unlock personalized nutrition and crush your goals!
          </p>
        </div>
       )}

        {hasProfile && !isEditing ? (
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <UserIcon className="w-8 h-8 text-sky-500" />
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-800">Your FuelBlitz Profile</CardTitle>
                  <CardDescription className="text-slate-500">This info fuels your personalized plans.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <UserMetadataCard userData={formData} />
              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={startEditProfile} 
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8 p-6 sm:p-8 bg-white border border-slate-200 rounded-xl shadow-xl">
            {isEditing && (
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-orange-600">Update Your Profile</h2>
                <Button 
                    variant="outline" 
                    onClick={cancelEdit}
                    className="text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Cancel
                </Button>
              </div>
            )}
            
            {!isComplete ? (
              <>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex space-x-2 sm:space-x-3">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
                          ${step === i ? "bg-gradient-to-br from-orange-500 to-red-500 text-white scale-110 shadow-lg" 
                          : step > i ? "bg-green-500 text-white" 
                          : "bg-slate-200 text-slate-500"}`}
                      >
                        {step > i ? <Check className="w-5 h-5"/> : i + 1}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500">Step {step + 1} of 3</p>
                </div>

                {step === 0 && <UserMetadataForm formData={formData} updateFormData={updateFormData} onNext={nextStep} />}
                {step === 1 && <FitnessGoalsForm formData={formData} updateFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />}
                {step === 2 && <NutritionForm formData={formData} updateFormData={updateFormData} onComplete={completeForm} onPrev={prevStep} />}
              </>
            ) : (
              <div className="space-y-6">
                <FormSummary formData={formData} />
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => { setIsComplete(false); setStep(2); }}
                    className="text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900 py-2.5 px-6 rounded-lg"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Edit
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : (hasProfile && isEditing ? "Update Profile" : "Create My FuelBlitz Profile")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="text-center mt-10 text-slate-500 text-sm max-w-md">
        Accurate info fuels precise recommendations, supercharging your FuelBlitz journey!
      </div>
    </main>
  )
}