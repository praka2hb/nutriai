"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Badge } from "@/components/ui/badge"
import { Utensils, Coffee, Pizza, Apple, Calendar, ChartBar } from "lucide-react"
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
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [expiryDate, setExpiryDate] = useState<Date | null>(null)
  const [, setMealTracking] = useState<Record<string, Record<string, boolean>>>({});

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
    [mealType: string]: DayMeals | number | undefined
  }

  interface MealPlanType {
    [day: string]: DayPlan
  }

  interface CompletedMealItem {
    day: string
    mealType: string
    completed: boolean
    timestamp?: string
  }

  const [mealPlanData, setMealPlanData] = useState<MealPlanType | null>(null)

  const loadTrackingData = useCallback(async () => {
    if (!userId) return;
    
    try {
      const response = await axios.get<{ completedMeals: CompletedMealItem[] }>(`/api/mealtracking?userId=${userId}`);
      if (response.data?.completedMeals?.length) {
        const trackingMap: Record<string, Record<string, boolean>> = {};
        
        response.data.completedMeals.forEach((item: CompletedMealItem) => {
          if (!trackingMap[item.day]) trackingMap[item.day] = {};
          trackingMap[item.day][item.mealType] = item.completed;
        });
        
        setMealTracking(trackingMap);
      }
    } catch (err) {
      console.error("Failed to load tracking data", err);
    }
  }, [userId]);

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/login")
      return
    }
    
    if (!userId) return

    setIsLoading(true)
    setError(null)
    
    axios.get<{ mealPlan: MealPlanType[], startDate?: string, expiryDate?: string }>(`/api/mealplan/${userId}`)
      .then(res => {
        if (res.status === 200 || res.status === 201) {
          if (res.data?.mealPlan?.[0]) {
            setMealPlanData(res.data.mealPlan[0])
            setHasData(true)
            
            if (res.data.startDate) {
              setStartDate(new Date(res.data.startDate))
            }
            if (res.data.expiryDate) {
              setExpiryDate(new Date(res.data.expiryDate))
            }
            const firstDay = Object.keys(res.data.mealPlan[0])[0];
            if (firstDay) {
              setActiveDay(firstDay);
            }
          }
        }
      })
      .catch(err => {
        if (err.code === 'ECONNABORTED' || err.response?.status === 504) {
          setError("The request took too long to complete. Please try again later.")
        } else if (err.response?.status === 404) {
          setHasData(false);
        } else {
          setError("An error occurred while fetching your meal plan.")
          console.error("Meal plan fetch error:", err)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })

    if (userId) {
      loadTrackingData();
    }
  }, [session, userId, router, status, loadTrackingData])

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

  const currentDayPlan = mealPlanData && activeDay in mealPlanData 
    ? mealPlanData[activeDay] 
    : null

  const getCurrentDayKey = () => {
    if (!startDate) return null;
    const todayDate = new Date();
    const diffTime = todayDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 0 && diffDays < Object.keys(mealPlanData || {}).length) {
      return `day${diffDays + 1}`;
    }
    return null;
  };

  if (status === "loading" || isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-700"></div></div>;
  }

  if (!session) {
    return null 
  }

  const getDayDate = (dayKey: string) => {
    if (!startDate) return null;
    const dayNum = parseInt(dayKey.replace("day", "")) - 1;
    if (isNaN(dayNum)) return null;
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayNum);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  if (error && !hasData) {
    return <ErrorDisplay error={error} onRetry={() => router.refresh()} />;
  }
  
  if (!isLoading && !hasData && !error) {
    return <EmptyMealPlanState />;
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-gradient-to-b from-white to-neutral-50 min-h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
          {mealPlanData ? (`${Object.keys(mealPlanData).length} Day Meal Plan`) : "Meal Plan"}
        </h1>
        
        {startDate && expiryDate && (
          <p className="mt-2 text-sm text-neutral-500 flex items-center justify-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(startDate).toLocaleDateString()} - {new Date(expiryDate).toLocaleDateString()}</span>
          </p>
        )}
        
        <div className="flex justify-between items-center mt-6">
          <Link href="/meal-tracker">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 bg-white hover:bg-neutral-100 border-neutral-200">
              <ChartBar className="h-3.5 w-3.5" />
              <span>Track Progress</span>
            </Button>
          </Link>
          
          <div>
            {mealPlanData && <QuitButtonWithModal userId={userId || ""} />}
          </div>
        </div>
      </div>
      
      {error && hasData && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {mealPlanData && Object.keys(mealPlanData).length > 0 && (
        <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
          <TabsList className={`grid w-full mb-6 ${
            Object.keys(mealPlanData).length === 7 ? 'grid-cols-7' :
            Object.keys(mealPlanData).length === 6 ? 'grid-cols-6' : 
            Object.keys(mealPlanData).length === 5 ? 'grid-cols-5' :
            Object.keys(mealPlanData).length === 4 ? 'grid-cols-4' :
            Object.keys(mealPlanData).length === 3 ? 'grid-cols-3' :
            Object.keys(mealPlanData).length === 2 ? 'grid-cols-2' : 'grid-cols-1'
          }`}>
            {Object.keys(mealPlanData).map((day) => (
              <TabsTrigger 
                key={day} 
                value={day} 
                className={`capitalize text-xs sm:text-sm ${day === getCurrentDayKey() ? 
                  'bg-neutral-800 text-white hover:bg-neutral-700 ring-2 ring-neutral-300' : ''}`}
              >
                {dayNames[day as keyof typeof dayNames] || day}
                <span className="text-xs text-neutral-400 ml-1 block md:inline">({getDayDate(day)})</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(mealPlanData).map((day) => (
            <TabsContent key={day} value={day}>
              {currentDayPlan && day === activeDay && (
                <Card className="overflow-hidden shadow-lg bg-white">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b p-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                      <CardTitle className="text-xl font-semibold text-slate-700 mb-1 sm:mb-0">
                        {dayNames[activeDay as keyof typeof dayNames]} - Daily Totals
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs bg-white py-1 px-2">
                          <Calendar className="h-3 w-3 mr-1" /> {getDayDate(activeDay)}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-sm text-slate-500 mt-1">
                      Calories: {currentDayPlan.calories} kcal, Protein: {currentDayPlan.protein}g, Carbs: {currentDayPlan.carbs}g, Fats: {currentDayPlan.fats}g
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      {Object.entries(currentDayPlan)
                        .filter(([key]) => !["calories", "protein", "carbs", "fats"].includes(key))
                        .map(([mealType, mealDetails]) => {
                          if (!mealDetails || typeof mealDetails === 'number') return null;
                          const details = mealDetails as DayMeals;
                          const photoUrl = mealPhotos[mealType as keyof typeof mealPhotos] || "/default-meal.jpg";

                          return (
                            <div key={mealType} className="border-b md:border-r p-4 group hover:bg-slate-50/70 transition-colors duration-200 ease-in-out">
                              <div className="flex items-start space-x-3 sm:space-x-4">
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                                  <Image 
                                    src={photoUrl} 
                                    alt={mealType} 
                                    layout="fill" 
                                    objectFit="cover" 
                                    className="group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <div className="flex-grow">
                                  <div className="flex items-center mb-1 text-slate-700 group-hover:text-slate-800">
                                    {mealIcons[mealType as keyof typeof mealIcons] || <Utensils className="h-5 w-5" />}
                                    <h4 className="ml-2 text-md sm:text-lg font-semibold capitalize">{mealType}</h4>
                                  </div>
                                  <h5 className="font-medium text-sm sm:text-md text-slate-600">{details.meal}</h5>
                                  <p className="text-xs text-slate-500 mt-1 mb-2 leading-snug line-clamp-2 sm:line-clamp-none">{details.description}</p>
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">Cals: {details.calories}</Badge>
                                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">P: {details.protein}g</Badge>
                                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">C: {details.carbs}g</Badge>
                                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">F: {details.fats}g</Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
      
    </div>
  )
}

const ErrorDisplay = ({ error, onRetry }: { error: string, onRetry: () => void }) => (
  <div className="container mx-auto py-8 px-4 text-center min-h-[60vh] flex flex-col justify-center items-center">
    <ErrorOutlineIcon style={{ fontSize: 60, color: '#ef4444' }} />
    <h2 className="mt-4 text-2xl font-semibold text-neutral-700">Oops! Something went wrong.</h2>
    <p className="mt-2 text-neutral-500">{error}</p>
    <Button onClick={onRetry} className="mt-6">
      Try Again
    </Button>
    <Link href="/home" className="mt-4">
      <Button variant="outline">Create a New Plan</Button>
    </Link>
  </div>
);

const EmptyMealPlanState = () => (
  <div className="container mx-auto py-8 px-4 text-center min-h-[60vh] flex flex-col justify-center items-center">
    <Image src="/no-plan.svg" alt="No Meal Plan" width={200} height={200} className="mb-6" />
    <h2 className="text-2xl font-semibold text-neutral-700">No Meal Plan Found</h2>
    <p className="mt-2 text-neutral-500">
      It looks like you don&apos;t have an active meal plan yet.
    </p>
    <Link href="/home" className="mt-6">
      <Button>Create Your First Meal Plan</Button>
    </Link>
  </div>
);