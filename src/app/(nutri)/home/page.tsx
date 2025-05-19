// src/app/(nutri)/home/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronRight, PieChart as PieChartIcon, Calendar, Pizza, Clock, Trophy, Zap } from "lucide-react";
import { Utensils, Coffee } from "lucide-react";
import NutriBot from "@/components/NutriBot";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface DailyMacros {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface MealDataItem {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meal: string;
  // Add any other properties that exist on meal data items
}

interface MealPlanDay {
  [mealType: string]: MealDataItem | number; // Allow for nutrient summaries like 'calories', 'protein', etc.
                                       // and meal data objects
}

interface MealPlan {
  [day: string]: MealPlanDay;
}

interface MealPlanInfo {
  plan: MealPlan;
  startDate: Date | null;
  expiryDate: Date | null;
}

interface UpcomingMeal {
  type: string;
  data: MealDataItem; 
  day: string;
}

interface TrackingItem {
  day: string;
  mealType: string;
  completed: boolean;
  timestamp: string; 
}

export type UserFormData = { // Renamed from FormData to avoid conflict if FormData is a global type
  age: string;
  height: string;
  weight: string;
  gender: string;
  fitnessGoal: string;
  allergies: string;
  activities: string[];
  activityLevel: string;
  mealsPerDay: string;
  dietaryPreferences: string[];
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;
  
  const [trackingStats, setTrackingStats] = useState({
    completed: 0,
    total: 0,
    todayCompleted: 0,
    todayTotal: 0,
    streak: 0
  });
  
  const [mealPlanInfo, setMealPlanInfo] = useState<MealPlanInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingMeal, setUpcomingMeal] = useState<UpcomingMeal | null>(null);
  const [showNutriBot, setShowNutriBot] = useState(false);
  const [userMetadata, setUserMetadata] = useState<UserFormData | null>(null); 
  const [consumedMacros, setConsumedMacros] = useState<DailyMacros>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (userId) {
          // Assuming userMetaRes.data is directly the UserFormData object or has a structure to access it
          const userMetaRes = await axios.get<{ data: UserFormData } | UserFormData>(`/api/user-meta/${userId}`);
          // Check if 'data' property exists, typical for axios responses nesting data
          if ('data' in userMetaRes.data && typeof userMetaRes.data.data === 'object' && userMetaRes.data.data !== null) {
            setUserMetadata(userMetaRes.data.data as UserFormData);
          } else if (typeof userMetaRes.data === 'object' && userMetaRes.data !== null && !('data' in userMetaRes.data)) {
            // If the response is the metadata object directly
            setUserMetadata(userMetaRes.data as UserFormData);
          }
        }
        
        const mealPlanRes = await axios.get<{ mealPlan: MealPlan[], startDate: string, expiryDate: string }>(`/api/mealplan/${userId}`);
        let currentMealPlan: MealPlan | null = null;
        let planStartDate: Date | null = null;

        if (mealPlanRes.data?.mealPlan?.[0]) {
          currentMealPlan = mealPlanRes.data.mealPlan[0];
          planStartDate = mealPlanRes.data.startDate ? new Date(mealPlanRes.data.startDate) : null;
          setMealPlanInfo({
            plan: currentMealPlan,
            startDate: planStartDate,
            expiryDate: mealPlanRes.data.expiryDate ? new Date(mealPlanRes.data.expiryDate) : null
          });
          
          if (planStartDate && currentMealPlan) {
            const todayDate = new Date();
            const diffDays = Math.floor((todayDate.getTime() - planStartDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diffDays >= 0 && diffDays < Object.keys(currentMealPlan).length) {
              const todayKey = `day${diffDays + 1}`;
              
              const now = new Date();
              const hour = now.getHours();
              
              let nextMealType = "breakfast";
              if (hour >= 7 && hour < 12) nextMealType = "lunch";
              else if (hour >= 12 && hour < 18) nextMealType = "dinner";
              else if (hour >= 18) nextMealType = "breakfast"; 
              
              const mealData = currentMealPlan[todayKey]?.[nextMealType] as MealDataItem | undefined;
              if (mealData) {
                setUpcomingMeal({
                  type: nextMealType,
                  data: mealData,
                  day: todayKey
                });
              }
            }
          }
        }
        
        const trackingRes = await axios.get<{ completedMeals: TrackingItem[] }>(`/api/mealtracking?userId=${userId}`);
        if (trackingRes.data?.completedMeals) {
          const trackedMeals = trackingRes.data.completedMeals;
          
          const trackingMap: Record<string, Record<string, boolean>> = {};
          const uniqueMeals = new Map<string, TrackingItem>(); 
          
          trackedMeals
            .sort((a: TrackingItem, b: TrackingItem) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .forEach((item: TrackingItem) => {
              const { day, mealType, completed, timestamp } = item;
              const mealKey = `${day}-${mealType}`;
              
              if (!uniqueMeals.has(mealKey)) {
                uniqueMeals.set(mealKey, { day, mealType, completed, timestamp });
                
                if (!trackingMap[day]) trackingMap[day] = {};
                trackingMap[day][mealType] = completed;
              }
            });
          
          const completedCount = Array.from(uniqueMeals.values())
            .filter((meal: TrackingItem) => meal.completed)
            .length;
          
          let todayPlanDay = "";
          let todayMeals = 0;
          let todayCompletedCount = 0;
          
          let dailyConsumedCalories = 0;
          let dailyConsumedProtein = 0;
          let dailyConsumedCarbs = 0;
          let dailyConsumedFats = 0;

          if (currentMealPlan && planStartDate) {
            const todayDate = new Date();
            const diffTime = todayDate.getTime() - planStartDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays >= 0 && diffDays < Object.keys(currentMealPlan).length) {
              todayPlanDay = `day${diffDays + 1}`;
              
              const todayMealTypesFromPlan = Object.keys(currentMealPlan[todayPlanDay])
                .filter(key => !["calories", "protein", "carbs", "fats"].includes(key));
              
              todayMeals = todayMealTypesFromPlan.length;
              
              todayCompletedCount = todayMealTypesFromPlan.filter(
                mealType => todayPlanDay && trackingMap[todayPlanDay]?.[mealType]
              ).length;

              todayMealTypesFromPlan.forEach(mealType => {
                if (trackingMap[todayPlanDay]?.[mealType]) { 
                  const mealData = currentMealPlan![todayPlanDay][mealType] as MealDataItem; 
                  if (mealData) {
                    dailyConsumedCalories += mealData.calories || 0;
                    dailyConsumedProtein += mealData.protein || 0;
                    dailyConsumedCarbs += mealData.carbs || 0;
                    dailyConsumedFats += mealData.fats || 0;
                  }
                }
              });
            }
          }
          
          setConsumedMacros({
            calories: dailyConsumedCalories,
            protein: dailyConsumedProtein,
            carbs: dailyConsumedCarbs,
            fats: dailyConsumedFats,
          });
          
          setTrackingStats({
            completed: completedCount,
            total: Object.keys(currentMealPlan || {}).reduce((count, day) => {
              const dayMeals = Object.keys((currentMealPlan || {})[day])
                .filter(key => !["calories", "protein", "carbs", "fats"].includes(key));
              return count + dayMeals.length;
            }, 0),
            todayCompleted: todayCompletedCount,
            todayTotal: todayMeals,
            streak: planStartDate ? calculateStreak(trackedMeals, planStartDate) : 0,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userId, session, router, status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-700"></div>
      </div>
    );
  }

  const macroChartData = [
    { name: 'Protein', value: consumedMacros.protein, fill: '#3b82f6' }, 
    { name: 'Carbs', value: consumedMacros.carbs, fill: '#22c55e' },   
    { name: 'Fats', value: consumedMacros.fats, fill: '#f59e0b' },    
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
        Welcome, {session?.user?.name?.split(' ')[0]}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="overflow-hidden border-neutral-200">
            <CardHeader className="pb-2 bg-gradient-to-r from-neutral-50 to-white border-b">
              <CardTitle>Today&apos;s Overview</CardTitle>
              <CardDescription>Your nutrition progress for today</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {mealPlanInfo ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium">Today&apos;s Meals</span>
                      <span className="text-sm text-neutral-500">
                        {trackingStats.todayCompleted}/{trackingStats.todayTotal || 4} completed
                      </span>
                    </div>
                    <Progress 
                      value={(trackingStats.todayCompleted / (trackingStats.todayTotal || 4)) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-neutral-500">
                        {trackingStats.completed}/{trackingStats.total || 0} meals
                      </span>
                    </div>
                    <Progress 
                      value={(trackingStats.completed / (trackingStats.total || 1)) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <Calendar className="h-5 w-5 mb-1 mx-auto text-blue-500" />
                      <p className="text-xs text-blue-700 font-medium">
                        {mealPlanInfo.plan && Object.keys(mealPlanInfo.plan).length} Days
                      </p>
                      <p className="text-xs text-blue-500">Meal Plan</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <Check className="h-5 w-5 mb-1 mx-auto text-green-500" />
                      <p className="text-xs text-green-700 font-medium">
                        {Math.round((trackingStats.completed / (trackingStats.total || 1)) * 100)}%
                      </p>
                      <p className="text-xs text-green-500">Completion</p>
                    </div>
                    
                    <div className="bg-amber-50 rounded-lg p-3 text-center">
                      <Trophy className="h-5 w-5 mb-1 mx-auto text-amber-500" />
                      <p className="text-xs text-amber-700 font-medium">
                        {trackingStats.streak} Days
                      </p>
                      <p className="text-xs text-amber-500">Streak</p>
                    </div>
                  </div>
                  
                  { (consumedMacros.protein > 0 || consumedMacros.carbs > 0 || consumedMacros.fats > 0) && (
                    <div className="mt-6">
                      <h3 className="text-md font-medium mb-2">Today&apos;s Consumed Macros</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div>
                          <ResponsiveContainer width="100%" height={200}>
                            <RechartsPieChart>
                              <Pie
                                data={macroChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {macroChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value, name) => [`${value}g`, name]}/>
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total Calories:</span>
                            <span className="font-medium">{consumedMacros.calories.toFixed(0)} kcal</span>
                          </div>
                           <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                              <span>Protein:</span>
                            </div>
                            <span className="font-medium">{consumedMacros.protein.toFixed(1)}g</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="flex items-center">
                              <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                              <span>Carbohydrates:</span>
                            </div>
                            <span className="font-medium">{consumedMacros.carbs.toFixed(1)}g</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="h-3 w-3 rounded-full bg-amber-500 mr-2"></span>
                              <span>Fats:</span>
                            </div>
                            <span className="font-medium">{consumedMacros.fats.toFixed(1)}g</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-2">
                    <Link href="/meal-plan" className="flex-1">
                      <Button variant="outline" className="w-full">View Meal Plan</Button>
                    </Link>
                    <Link href="/meal-tracker" className="flex-1">
                      <Button className="w-full bg-neutral-800">Track Progress</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {!showNutriBot ? (
                    <div className="text-center py-6">
                      <div className="bg-neutral-100 p-4 rounded-full inline-block mb-4">
                        <Pizza className="h-8 w-8 text-neutral-400" />
                      </div>
                      <h3 className="font-medium mb-1">No Meal Plan Found</h3>
                      <p className="text-sm text-neutral-500 mb-4">
                        Create a meal plan to get started with your nutrition journey
                      </p>
                      <Button onClick={() => setShowNutriBot(true)}>Create Meal Plan</Button>
                    </div>
                  ) : (
                    <NutriBot 
                      hasMealData={false} 
                      userMetadata={userMetadata} 
                      hasProfile={!!userMetadata &&
                        !!userMetadata.fitnessGoal &&
                        !!userMetadata.age &&
                        !!userMetadata.height &&
                        !!userMetadata.weight &&
                        !!userMetadata.gender &&
                        !!userMetadata.activities &&
                        !!userMetadata.activityLevel &&
                        !!userMetadata.mealsPerDay &&
                        !!userMetadata.dietaryPreferences
                      }
                      userId={userId as string} 
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
          
          {upcomingMeal && (
            <Card className="overflow-hidden border-neutral-200">
              <CardHeader className="pb-2 bg-gradient-to-r from-neutral-50 to-white border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Coming Up Next</CardTitle>
                  <Clock className="h-5 w-5 text-neutral-400" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <div className="bg-neutral-100 p-3 rounded-full mr-4">
                    {upcomingMeal.type === 'breakfast' && <Coffee className="h-6 w-6 text-neutral-700" />}
                    {upcomingMeal.type === 'lunch' && <Utensils className="h-6 w-6 text-neutral-700" />}
                    {upcomingMeal.type === 'dinner' && <Pizza className="h-6 w-6 text-neutral-700" />}
                  </div>
                  <div>
                    <h3 className="font-medium capitalize">{upcomingMeal.type}</h3>
                    <p className="text-sm text-neutral-600">{upcomingMeal.data.meal}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-neutral-100 px-2 py-1 rounded">
                        {upcomingMeal.data.calories} cal
                      </span>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        P: {upcomingMeal.data.protein}g
                      </span>
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                        C: {upcomingMeal.data.carbs}g
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-neutral-50 py-3 px-4 flex justify-between">
                <Link href="/meal-plan" className="text-sm text-blue-600 flex items-center">
                  View full meal plan
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => {
                    alert(`Marked ${upcomingMeal.type} as completed!`);
                  }}
                >
                  Mark as Complete
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card className="overflow-hidden border-neutral-200">
            <CardHeader className="pb-2 bg-gradient-to-r from-neutral-50 to-white border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Nutrition Insights</CardTitle>
                <PieChartIcon className="h-5 w-5 text-neutral-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Protein Intake</h4>
                  <p className="text-xs text-blue-600">
                    Maintaining adequate protein intake helps muscle recovery and growth.
                  </p>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800 mb-1">Balanced Meals</h4>
                  <p className="text-xs text-green-600">
                    Your meal plan ensures each meal has a good balance of nutrients.
                  </p>
                </div>
                
                <div className="bg-amber-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-amber-800 mb-1">Meal Timing</h4>
                  <p className="text-xs text-amber-600">
                    Eating regular meals helps maintain energy levels throughout the day.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-neutral-200 bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-50">
            <CardHeader className="pb-2 border-b border-blue-100/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-indigo-900">Daily Motivation</CardTitle>
                <Zap className="h-5 w-5 text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <blockquote className="italic text-sm text-indigo-700 border-l-2 border-indigo-300 pl-3 py-1">
                &quot;The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison.&quot;
              </blockquote>
              <p className="text-xs text-indigo-500 mt-2 text-right">- Ann Wigmore</p>
              
              <div className="mt-4 bg-white/60 p-3 rounded-lg border border-blue-100">
                <h4 className="text-sm font-medium text-indigo-900 mb-1">Your Progress</h4>
                <p className="text-xs text-indigo-700">
                  Consistency is key! Keep tracking your meals to build healthy habits.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const calculateStreak = (trackedMealsInput: TrackingItem[], startDate: Date | null): number => {
  if (!startDate || !trackedMealsInput.length) return 0;
  
  // Clone to prevent mutation if trackedMealsInput is used elsewhere or is a state variable
  const trackedMeals = [...trackedMealsInput]; 

  const mealsByDate: Record<string, { day: string | null, completed: number, total: number }> = {};
  
  trackedMeals.forEach(meal => {
    if (!meal.timestamp) return;
    
    const dateStr = new Date(meal.timestamp).toISOString().split('T')[0];
    // Removed unused mealType from destructuring
    const { day, completed } = meal; 
    
    if (!mealsByDate[dateStr]) {
      // Initialize with null or a sensible default for 'day' if it's used meaningfully here
      mealsByDate[dateStr] = { day: day, completed: 0, total: 0 }; 
    }
    
    if (completed) {
      mealsByDate[dateStr].completed++;
    }
    mealsByDate[dateStr].total++;
  });
  
  let streak = 0;
  const todayString = new Date().toISOString().split('T')[0];
  
  const dates = [];
  // const startDateStr = new Date(startDate).toISOString().split('T')[0]; // Unused
  const currentDateIter = new Date(startDate); // Changed to const, and renamed
  
  // Ensure loop termination: check if currentDateIter is valid
  while (currentDateIter && currentDateIter.toISOString().split('T')[0] <= todayString) {
    dates.push(currentDateIter.toISOString().split('T')[0]);
    currentDateIter.setDate(currentDateIter.getDate() + 1);
  }
  
  for (const date of dates.reverse()) {
    if (mealsByDate[date]) {
      const { completed, total } = mealsByDate[date];
      if (total > 0 && (completed / total >= 0.5)) {
        streak++;
      } else if (total > 0) { 
        break;
      }
    } else {
      console.log("No tracking data for this date, breaking streak:", date);
      break;
    }
  }
  
  return streak;
};