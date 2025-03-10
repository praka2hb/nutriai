"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Badge } from "@/components/ui/badge"
import { Utensils, Coffee, Pizza, Apple } from "lucide-react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link";
import QuitButtonWithModal from "@/components/QuitandModal";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function MealPlanPage() {
  const [activeDay, setActiveDay] = useState("day1")
  const { data: session, status } = useSession()
  const userId = session?.user?.id
  const [hasData, setHasData] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  interface DayMeals {
    meal: string
    description: string
    calories: number
    protein: number
    carbs: number
    fats: number
  }

  interface DayPlan {
    calories: number
    protein: number
    carbs: number
    fats: number
    breakfast?: DayMeals
    lunch?: DayMeals
    dinner?: DayMeals
    snacks?: DayMeals
  }

  interface MealPlanType {
    [day: string]: DayPlan
  }

  const [mealPlanData, setMealPlanData] = useState<MealPlanType | null>(null)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/login")
      return
    }
    
    if (!userId) return

    setIsLoading(true)
    setError(null)
    
    axios.get(`/api/mealplan/${userId}`)
      .then(res => {
        if (res.status === 200 || res.status === 201) {
          if (res.data?.mealPlan?.[0]) {
            setMealPlanData(res.data.mealPlan[0])
            setHasData(true)
          }
        }
      })
      .catch(err => {
        if (err.code === 'ECONNABORTED' || err.response?.status === 504) {
          setError("The request took too long to complete. Please try again later.")
        } else if (err.response?.status === 404) {
          setError("No meal plan found for your account.")
        } else {
          setError("An error occurred while fetching your meal plan.")
          console.error("Meal plan fetch error:", err)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [session, userId, router, status])

  const dayNames = {
    day1: "Day 1",
    day2: "Day 2",
    day3: "Day 3",
    day4: "Day 4",
    day5: "Day 5",
    day6: "Day 6",
    day7: "Day 7"
  }

  const mealIcons = {
    breakfast: <Coffee className="h-5 w-5 " />,
    lunch: <Utensils className="h-5 w-5" />,
    dinner: <Pizza className="h-5 w-5" />,
    snacks: <Apple className="h-5 w-5" />,
    snack: <Apple className="h-5 w-5" />,
  }

  const mealPhotos = {
    breakfast: "/breakfast.jpg",
    lunch: "/lunch.jpg",
    dinner: "/dinner.jpg",
    snacks: "/snacks.jpg",
    snack: "/snacks.jpg",
    snack1: "/snacks.jpg",
    snack2: "/snacks.jpg",
  }

  // Only access currentDay if mealPlanData exists
  const currentDay = mealPlanData && activeDay in mealPlanData 
    ? mealPlanData[activeDay] 
    : null

  if (!session) {
    return null 
  }

  function getGridColsClass(count: number) {
    // clamp to <=5 if you only need up to 5 columns
    const columns = Math.min(count, 7);
    switch (columns) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-3";
      case 4: return "grid-cols-4";
      case 5: return "grid-cols-5";
      case 6: return "grid-cols-6";
      case 7: return "grid-cols-7"
      default: return "grid-cols-1";
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl bg-gradient-to-b from-neutral-700 to-neutral-500 bg-clip-text text-transparent font-bold text-center mb-8">
        {mealPlanData ? (`${Object.keys(mealPlanData).length} Day Meal Plan`) : null} 
        <div className="flex justify-end">
          {mealPlanData && <QuitButtonWithModal userId={userId || ""} />}
        </div>
      </h1>
      
      {isLoading ? (
      <div className="flex flex-col space-y-4 justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-700"></div>
        <p className="text-sm text-neutral-500">Loading your meal plan...</p>
      </div>
    ) : error ? (
      <div className="flex flex-col space-y-2 justify-center items-center h-96">
        <ErrorOutlineIcon fontSize="large" className="text-neutral-500" />
        <p className="text-sm text-neutral-500">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline" 
          className="mt-4 bg-gradient-to-b from-zinc-700 to-zinc-500 hover:opacity-95"
        >
          Try Again
        </Button>
        <Link href="/home" className="text-sm text-blue-500 hover:underline mt-2">
          Return to Home
        </Link>
      </div>
      ) :
      hasData && mealPlanData && currentDay ? (
        <Tabs defaultValue="day1" value={activeDay} onValueChange={setActiveDay} className="w-full">
          <TabsList className={`grid ${getGridColsClass(Object.keys(mealPlanData).length)} mb-8`}>
            {mealPlanData && Object.keys(mealPlanData).map((day) => (
              <TabsTrigger key={day} value={day} className="text-sm md:text-base">
                {dayNames[day as keyof typeof dayNames] || day}
              </TabsTrigger>
            ))}
          </TabsList>
  
          {Object.keys(mealPlanData).map((day) => {
            const dayPlan = mealPlanData[day]
            
            return (
              <TabsContent key={day} value={day} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-zinc-100 to-zinc-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl bg-gradient-to-b from-neutral-800 to-neutral-500 bg-clip-text text-transparent">
                        {dayNames[day as keyof typeof dayNames] || day} Summary
                      </CardTitle>
                      <CardDescription className="bg-gradient-to-b from-neutral-700 to-neutral-500 bg-clip-text text-transparent">
                        Total: {dayPlan.calories} calories | {dayPlan.protein}g protein | 
                        {dayPlan.carbs}g carbs | {dayPlan.fats}g fats
                      </CardDescription>
                    </CardHeader>
                    <CardContent></CardContent>
                  </Card>
  
                  {Object.entries(dayPlan)
                    .filter(([key]) => !["calories", "protein", "carbs", "fats"].includes(key))
                    .map(([mealType, mealData]) => {
                      const meal = mealData as DayMeals
                      
                      return (
                        <Card key={mealType} className="overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-50">
                          <CardHeader className="pb-2">
                            <div>
                              {mealPhotos[mealType as keyof typeof mealPhotos] && (
                                <Image
                                width={400}
                                height={200}
                                src={mealPhotos[mealType as keyof typeof mealPhotos]}
                                alt={mealType}
                                className="w-full h-40 object-cover rounded-t-lg"
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-2 ">
                              {mealIcons[mealType as keyof typeof mealIcons]}
                              <CardTitle className="capitalize bg-gradient-to-b from-neutral-800 to-neutral-500 bg-clip-text text-transparent">{mealType}</CardTitle>
                            </div>
                            <CardDescription>{meal.calories} calories</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm mb-2 font-medium bg-gradient-to-b from-neutral-950 to-neutral-600 bg-clip-text text-transparent">{meal.meal}</p>
                            {meal.description && (
                              <p className="text-xs text-muted-foreground mb-4">{meal.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="bg-zinc-50 text-zinc-700 hover:bg-blue-50">
                                {meal.protein}g protein
                              </Badge>
                              <Badge variant="outline" className="bg-neutral-50 text-neutral-700 hover:bg-green-50">
                                {meal.carbs}g carbs
                              </Badge>
                              <Badge variant="outline" className="bg-stone-50 text-stone-700 hover:bg-yellow-50">
                                {meal.fats}g fats
                              </Badge>
                            </div>
                          </CardContent>
                          <CardFooter className="bg-muted/50 p-3">
                            <div className="flex justify-between w-full text-xs text-muted-foreground">
                              <span>P: {Math.round(((meal.protein * 4) / meal.calories) * 100)}%</span>
                              <span>C: {Math.round(((meal.carbs * 4) / meal.calories) * 100)}%</span>
                              <span>F: {Math.round(((meal.fats * 9) / meal.calories) * 100)}%</span>
                            </div>
                          </CardFooter>
                        </Card>
                      )
                    })}
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      ) : (
        <div className="flex flex-col space-y-2 justify-center items-center h-96">
          <ErrorOutlineIcon fontSize="large" className= "text-neutral-500" />
          <p className="text-sm text-neutral-500 ml-2">No meal plan found, <Link className="hover:underline" href={'/home'}>Generate One</Link> </p>
        </div>
      )}
    </div>
  )
}