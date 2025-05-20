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
            
            const plan = res.data.mealPlan[0];
            if (res.data.startDate) {
              const startDateObj = new Date(res.data.startDate);
              const todayObj = new Date();
              
              const planStartUTC = Date.UTC(
                startDateObj.getUTCFullYear(),
                startDateObj.getUTCMonth(),
                startDateObj.getUTCDate(),
                0, 0, 0, 0
              );
              
              const todayUTC = Date.UTC(
                todayObj.getUTCFullYear(),
                todayObj.getUTCMonth(),
                todayObj.getUTCDate(),
                0, 0, 0, 0
              );
              
              const diffDays = Math.floor((todayUTC - planStartUTC) / (1000 * 60 * 60 * 24));
              const currentDayKey = `day${diffDays + 1}`;
              
              if (diffDays >= 0 && diffDays < Object.keys(plan).length && plan[currentDayKey]) {
                setActiveDay(currentDayKey);
              } else {
                const firstDay = Object.keys(plan)[0];
                if (firstDay) {
                  setActiveDay(firstDay);
                }
              }
            } else {
              const firstDay = Object.keys(plan)[0];
            if (firstDay) {
              setActiveDay(firstDay);
              }
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
    
    // Get plan start date and convert to UTC date components
    const planStart = new Date(startDate);
    const planStartUTC = Date.UTC(
      planStart.getUTCFullYear(),
      planStart.getUTCMonth(),
      planStart.getUTCDate(),
      0, 0, 0, 0
    );
    
    // Get today in UTC
    const today = new Date();
    const todayUTC = Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0, 0, 0, 0
    );
    
    // Calculate days since plan started using UTC dates
    const diffDays = Math.floor((todayUTC - planStartUTC) / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 0 && diffDays < Object.keys(mealPlanData || {}).length) {
      return `day${diffDays + 1}`;
    }
    return null;
  };

  const ErrorDisplay = ({ error, onRetry }: { error: string, onRetry: () => void }) => (
    <div className="container mx-auto py-8 px-4 text-center min-h-[60vh] flex flex-col justify-center items-center">
      <ErrorOutlineIcon style={{ fontSize: 60, color: '#ef4444' }} />
      <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-neutral-700">Oops! Something went wrong.</h2>
      <p className="mt-2 text-sm sm:text-base text-neutral-500">{error}</p>
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
      <Image src="/no-plan-fallback.png" alt="No Meal Plan" width={150} height={150} className="mb-6 sm:w-[200px] sm:h-[200px]" />
      <h2 className="text-xl sm:text-2xl font-semibold text-neutral-700">No Meal Plan Found</h2>
      <p className="mt-2 text-sm sm:text-base text-neutral-500">
        It looks like you don&apos;t have an active meal plan yet.
      </p>
      <Link href="/home" className="mt-6">
        <Button>Create Your First Meal Plan</Button>
      </Link>
    </div>
  );

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
    const fetchData = () => {
        if (!userId) return;
        setIsLoading(true);
        setError(null);
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
                
                const plan = res.data.mealPlan[0];
                if (res.data.startDate) {
                  const startDateObj = new Date(res.data.startDate);
                  const todayObj = new Date();
                  
                  const planStartUTC = Date.UTC(
                    startDateObj.getUTCFullYear(),
                    startDateObj.getUTCMonth(),
                    startDateObj.getUTCDate(),
                    0, 0, 0, 0
                  );
                  
                  const todayUTC = Date.UTC(
                    todayObj.getUTCFullYear(),
                    todayObj.getUTCMonth(),
                    todayObj.getUTCDate(),
                    0, 0, 0, 0
                  );
                  
                  const diffDays = Math.floor((todayUTC - planStartUTC) / (1000 * 60 * 60 * 24));
                  const currentDayKey = `day${diffDays + 1}`;
                  
                  if (diffDays >= 0 && diffDays < Object.keys(plan).length && plan[currentDayKey]) {
                    setActiveDay(currentDayKey);
                  } else {
                    const firstDay = Object.keys(plan)[0];
                    if (firstDay) {
                      setActiveDay(firstDay);
                    }
                  }
                } else {
                  const firstDay = Object.keys(plan)[0];
                  if (firstDay) {
                    setActiveDay(firstDay);
                  }
                }
              } else {
                setHasData(false);
              }
            } else {
               setHasData(false);
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
          });
        loadTrackingData();
    };
    return <ErrorDisplay error={error} onRetry={fetchData} />;
  }
  
  if (!isLoading && !hasData && !error) {
    return <EmptyMealPlanState />;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-neutral-50 min-h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
          {mealPlanData ? (`${Object.keys(mealPlanData).length} Day Meal Plan`) : "Meal Plan"}
        </h1>
        
        {startDate && expiryDate && (
          <p className="mt-2 text-sm text-neutral-500 flex items-center justify-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(startDate).toLocaleDateString()} - {new Date(expiryDate).toLocaleDateString()}</span>
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 sm:gap-0">
          <Link href="/meal-tracker">
            <Button variant="outline" size="sm" className="w-full sm:w-auto flex items-center gap-1.5 bg-white hover:bg-neutral-100 border-neutral-200">
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
          <div className="w-full">
            <TabsList className="w-full grid grid-cols-7 bg-transparent p-0 h-auto rounded-none border-b border-neutral-200 gap-0 [&>*]:flex-1">
              {Object.keys(mealPlanData).map((day) => {
                const isCurrentDay = day === getCurrentDayKey();
                return (
                  <TabsTrigger 
                    key={day} 
                    value={day} 
                    className={`
                      flex-1 min-w-0 w-full
                      flex flex-col items-center justify-center py-3 px-1
                      rounded-none
                      text-xs leading-tight whitespace-nowrap
                      focus-visible:outline-none focus-visible:ring-0
                      border-0 border-b-2 border-transparent
                      data-[state=active]:rounded-none
                      data-[state=active]:text-orange-600 
                      data-[state=active]:border-orange-600 
                      data-[state=active]:font-semibold
                      data-[state=active]:bg-orange-50/50
                      ${isCurrentDay && 'border-b-2 border-sky-500'}
                      ${day === activeDay ? '' : isCurrentDay ? 'text-sky-700 font-semibold' : 'text-neutral-500'}
                    `}
                  >
                    <span className="text-center truncate w-full">
                      {isCurrentDay && !isNaN(parseInt(day.replace("day", ""))) && "• "}
                      {dayNames[day as keyof typeof dayNames] || day}
                    </span>
                    <span className={`text-[9px] text-center mt-0.5 truncate w-full ${
                      isCurrentDay ? 'text-sky-600 font-medium' : 'text-neutral-400'
                    }`}>
                      {getDayDate(day)}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {Object.keys(mealPlanData).map((day) => (
            <TabsContent key={day} value={day}>
              {currentDayPlan && day === activeDay && (
                <Card className="overflow-hidden shadow-lg bg-white dark:bg-neutral-800 dark:border-neutral-700">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-neutral-700/30 dark:to-neutral-750/30 border-b dark:border-neutral-700 p-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                      <CardTitle className="text-lg sm:text-xl font-semibold text-slate-700 dark:text-neutral-200 mb-1 sm:mb-0">
                        {dayNames[activeDay as keyof typeof dayNames]} - Daily Totals
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1 sm:mt-0">
                        <Badge variant="outline" className="text-xs bg-white dark:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-600 py-1 px-2">
                          <Calendar className="h-3 w-3 mr-1" /> {getDayDate(activeDay)}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1 leading-tight">
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
                            <div key={mealType} className="border-b md:border-r dark:border-neutral-700 p-3 sm:p-4 group hover:bg-slate-50/70 dark:hover:bg-neutral-750/50 transition-colors duration-200 ease-in-out">
                              <div className="flex items-start space-x-3 sm:space-x-4">
                                <div className="relative w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                                      <Image
                                    src={photoUrl} 
                                        alt={mealType}
                                    layout="fill" 
                                    objectFit="cover" 
                                    className="group-hover:scale-105 transition-transform duration-300"
                                      />
                                    </div>
                                <div className="flex-grow">
                                  <div className="flex items-center mb-0.5 sm:mb-1 text-slate-700 dark:text-neutral-300 group-hover:text-slate-800 dark:group-hover:text-neutral-100">
                                    {mealIcons[mealType as keyof typeof mealIcons] || <Utensils className="h-4 w-4 sm:h-5 sm:w-5" />}
                                    <h4 className="ml-1.5 sm:ml-2 text-sm sm:text-md md:text-lg font-semibold capitalize">{mealType}</h4>
                                  </div>
                                  <h5 className="font-medium text-xs sm:text-sm md:text-md text-slate-600 dark:text-neutral-400">{details.meal}</h5>
                                  <p className="text-xs text-slate-500 dark:text-neutral-400/80 mt-1 mb-1.5 sm:mb-2 leading-snug line-clamp-2 sm:line-clamp-3 md:line-clamp-none">{details.description}</p>
                                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
                                    <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0.5 dark:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-600">{details.calories} Cals</Badge>
                                    <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0.5 dark:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-600">{details.protein}g P</Badge>
                                    <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0.5 dark:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-600">{details.carbs}g C</Badge>
                                    <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0.5 dark:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-600">{details.fats}g F</Badge>
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