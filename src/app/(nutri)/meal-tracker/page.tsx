"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Calendar, ArrowLeft, TrendingUp, Circle, ChevronLeft, ChevronRight, Coffee, Pizza, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Utensils } from "lucide-react";

// Define interfaces for type safety
interface MealData {
  meal: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface MealPlanDay {
  [key: string]: MealData | number;
}

interface MealPlan {
  [day: string]: MealPlanDay;
}

interface TrackingItem {
  day: string;
  mealType: string;
  completed: boolean;
  timestamp: string;
}

const mealIcons = {
  breakfast: <Coffee className="h-4 w-4" />,
  lunch: <Utensils className="h-4 w-4" />,
  dinner: <Pizza className="h-4 w-4" />,
  snacks: <Apple className="h-4 w-4" />,
  snack: <Apple className="h-4 w-4" />
};

const dayNames = {
  day1: "Day 1",
  day2: "Day 2",
  day3: "Day 3",
  day4: "Day 4",
  day5: "Day 5",
  day6: "Day 6",
  day7: "Day 7"
};

export default function MealTracker() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [mealPlanData, setMealPlanData] = useState<MealPlan | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [trackingData, setTrackingData] = useState<Record<string, Record<string, boolean>>>({});
  const [activeView, setActiveView] = useState("list");
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    streak: 0,
    todayCompleted: 0,
    todayTotal: 0
  });
  const [selectedDay, setSelectedDay] = useState<string>(
    Object.keys(mealPlanData || {})[0] || "day1"
  );
  const [error, setError] = useState<string | null>(null);

  // Load meal plan data
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    
    setIsLoading(true);
    
    axios.get(`/api/mealplan/${userId}`)
      .then(res => {
        if (res.data?.mealPlan?.[0]) {
          setMealPlanData(res.data.mealPlan[0]);
          if (res.data.startDate) setStartDate(new Date(res.data.startDate));
          if (res.data.expiryDate) setExpiryDate(new Date(res.data.expiryDate));
        }
      })
      .finally(() => setIsLoading(false));
  }, [userId, session, router, status]);

  // Improved tracking data loading function
  const loadTrackingData = useCallback(async () => {
    if (!userId || !mealPlanData) return;
    
    try {
      const response = await axios.get(`/api/mealtracking?userId=${userId}`);
      const trackedMeals = response.data?.completedMeals || [];
      
      // Create tracking map for latest status per meal
      const trackingMap: Record<string, Record<string, boolean>> = {};
      
      // Calculate total possible meals from the plan
      const totalPossibleMeals = Object.keys(mealPlanData).reduce((count, day) => {
        const dayMeals = Object.keys(mealPlanData[day]).filter(
          key => !["calories", "protein", "carbs", "fats"].includes(key)
        );
        return count + dayMeals.length;
      }, 0);
      
      // Process tracking data - keep only the latest status for each meal
      const uniqueMeals = new Map<string, TrackingItem>(); // Use Map to track latest status by meal key
      
      // Sort by timestamp to ensure latest entries are processed last
      trackedMeals
        .sort((a: TrackingItem, b: TrackingItem) => {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        })
        .forEach((item: TrackingItem) => {
          const { day, mealType, completed, timestamp } = item;
          const mealKey = `${day}-${mealType}`;
          
          // Track latest status for each unique meal
          uniqueMeals.set(mealKey, { day, mealType, completed, timestamp });
          
          // Also update the tracking map
          if (!trackingMap[day]) trackingMap[day] = {};
          trackingMap[day][mealType] = completed;
        });
      
      // Count only truly completed meals
      const completedCount = Array.from(uniqueMeals.values())
        .filter((meal: TrackingItem) => meal.completed)
        .length;
      
      let todayTotal = 0;
      let todayCompleted = 0;
      
      // Calculate today's meals from plan
      // Find which day of the plan corresponds to today using UTC dates
      let todayPlanDay = null;
      if (startDate) {
        // Use the same UTC calculation as isCurrentDay
        const planStart = new Date(startDate);
        const planStartUTC = Date.UTC(
          planStart.getUTCFullYear(),
          planStart.getUTCMonth(), 
          planStart.getUTCDate(),
          0, 0, 0, 0
        );
        
        const today = new Date();
        const todayUTC = Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate(),
          0, 0, 0, 0
        );
        
        // Calculate days since plan started using UTC dates
        const diffDays = Math.floor((todayUTC - planStartUTC) / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 0 && diffDays < Object.keys(mealPlanData).length) {
          todayPlanDay = `day${diffDays + 1}`;
        }
      }
      
      // If we found today's day in the plan, use it to calculate today's totals
      if (todayPlanDay && mealPlanData[todayPlanDay]) {
        const dayMealTypes = Object.keys(mealPlanData[todayPlanDay]).filter(
          key => !["calories", "protein", "carbs", "fats"].includes(key)
        );
        
        // Override todayTotal with the actual count from the plan
        todayTotal = dayMealTypes.length;
        
        // Recalculate todayCompleted based on the plan
        todayCompleted = dayMealTypes.filter(
          mealType => trackingMap[todayPlanDay]?.[mealType]
        ).length;
      }
      
      setTrackingData(trackingMap);
      setStats({
        total: totalPossibleMeals,
        completed: completedCount,
        streak: calculateStreak(trackedMeals, startDate),
        todayCompleted,
        todayTotal
      });
    } catch (err) {
      console.error("Failed to load tracking data", err);
    }
  }, [userId, mealPlanData, startDate]);

  // Streak calculation function
  const calculateStreak = (trackedMeals: TrackingItem[], startDate: Date | null) => {
    if (!startDate || !trackedMeals.length) return 0;
    
    // Group tracked meals by date
    const mealsByDate: Record<string, {total: number, completed: number}> = {};
    
    trackedMeals.forEach(meal => {
      if (!meal.timestamp) return;
      
      const dateStr = new Date(meal.timestamp).toISOString().split('T')[0];
      
      if (!mealsByDate[dateStr]) {
        mealsByDate[dateStr] = { total: 0, completed: 0 };
      }
      
      mealsByDate[dateStr].total++;
      if (meal.completed) {
        mealsByDate[dateStr].completed++;
      }
    });
    
    // Sort dates from newest to oldest
    const sortedDates = Object.keys(mealsByDate).sort().reverse();
    
    // Calculate streak (days where at least 50% of meals were completed)
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    // Check if user has any activity today
    const hasActivityToday = sortedDates[0] === today;
    
    // If no activity today, start checking from yesterday
    const startIndex = hasActivityToday ? 0 : 1;
    
    for (let i = startIndex; i < sortedDates.length; i++) {
      const dateData = mealsByDate[sortedDates[i]];
      const completionRate = dateData.completed / dateData.total;
      
      if (completionRate >= 0.5) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Add dependency for mealPlanData in useEffect
  useEffect(() => {
    if (userId && mealPlanData) {
      loadTrackingData();
    }
  }, [userId, mealPlanData, loadTrackingData]);

  // Toggle meal completion
  const toggleMealComplete = async (day: string, mealType: string) => {
    // Clear any previous errors
    setError(null);
    
    // Prevent toggling for days other than today
    if (!isCurrentDay(day)) {
      setError("You can only track meals for the current day");
      return;
    }
    
    try {
      const currentState = trackingData[day]?.[mealType] || false;
      const newState = !currentState;
      
      // Optimistic update
      setTrackingData((prev: Record<string, Record<string, boolean>>) => ({
        ...prev,
        [day]: {
          ...(prev[day] || {}),
          [mealType]: newState
        }
      }));
      
      setStats(prev => ({
        ...prev,
        completed: newState ? prev.completed + 1 : prev.completed - 1,
        todayCompleted: newState ? prev.todayCompleted + 1 : prev.todayCompleted - 1
      }));
      
      await axios.post('/api/mealtracking', {
        userId,
        day,
        mealType,
        completed: newState
      });
    } catch (err: unknown) {
      console.error("Failed to update tracking", err);
      
      // Display error message from API or a fallback
      const errorMessage = err instanceof Error ? err.message : "Failed to update meal tracking";
      setError(errorMessage);
      
      // Reload tracking data to revert changes
      loadTrackingData();
    }
  };

  const getDayDate = (dayKey: string) => {
    if (!startDate) return null;
    
    const dayNum = parseInt(dayKey.replace("day", "")) - 1;
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayNum);
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  // Update the isCurrentDay function to be timezone consistent
  const isCurrentDay = (day: string) => {
    if (!startDate || !mealPlanData) return false;
    
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
    const currentDayKey = `day${diffDays + 1}`;
    
    // For debugging
    console.log({
      planStartUTC: new Date(planStartUTC).toISOString(),
      todayUTC: new Date(todayUTC).toISOString(),
      diffDays,
      currentDayKey,
      checkedDay: day,
      isMatch: day === currentDayKey
    });
    
    // Compare with the requested day
    return day === currentDayKey;
  };

  // Move the getCurrentDayKey function above the useEffect that uses it
  const getCurrentDayKey = useCallback(() => {
    if (!startDate || !mealPlanData) return null;
    
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
    const currentDayKey = `day${diffDays + 1}`;
    
    // Check if this key exists in the meal plan
    if (diffDays >= 0 && mealPlanData && diffDays < Object.keys(mealPlanData).length) {
      return currentDayKey;
    }
    
    return null;
  }, [startDate, mealPlanData]);

  // Now the useEffect uses getCurrentDayKey defined above
  useEffect(() => {
    if (mealPlanData && Object.keys(mealPlanData).length > 0) {
      // Set current day if it exists in the plan
      const currentDay = getCurrentDayKey();
      if (currentDay && mealPlanData[currentDay]) {
        setSelectedDay(currentDay);
      } else {
        // Fall back to the first day
        setSelectedDay(Object.keys(mealPlanData)[0]);
      }
    }
  }, [mealPlanData, startDate, getCurrentDayKey]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-700"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <Link href="/meal-plan">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Meal Plan</span>
          </Button>
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <span className="mr-2">⚠️</span>
          <span>{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Plan Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            {startDate && expiryDate ? (
              <p className="text-sm">
                {new Date(startDate).toLocaleDateString()} - {new Date(expiryDate).toLocaleDateString()}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No dates available</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <Progress value={(stats.completed / (stats.total || 1)) * 100} className="h-2" />
            </div>
            <p className="text-sm">{stats.completed} of {stats.total} meals completed</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Today&apos;s Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <Progress value={(stats.todayCompleted / (stats.todayTotal || 1)) * 100} className="h-2" />
            </div>
            <p className="text-sm">{stats.todayCompleted} of {stats.todayTotal} meals completed today</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-6">
          {mealPlanData && (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {Object.keys(mealPlanData).map((day) => (
                <Card 
                  key={day} 
                  className={`overflow-hidden ${isCurrentDay(day) ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                >
                  <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-gray-100">
                    <CardTitle className="text-base flex justify-between items-center">
                      <span>Day {day.replace("day", "")}</span>
                      <span className="text-xs text-gray-500">{getDayDate(day)}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {Object.entries(mealPlanData[day])
                        .filter(([key]) => !["calories", "protein", "carbs", "fats"].includes(key))
                        .map(([mealType]) => (
                          <div 
                            key={mealType} 
                            className={`flex items-center justify-between p-2 rounded-md ${
                              isCurrentDay(day) ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-70 cursor-not-allowed'
                            }`}
                            onClick={() => isCurrentDay(day) && toggleMealComplete(day, mealType)}
                          >
                            <span className="capitalize text-sm">{mealType}</span>
                            <button
                              className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-200 ${
                                !isCurrentDay(day) ? 'opacity-50' : ''
                              }`}
                              disabled={!isCurrentDay(day)}
                              style={{
                                backgroundColor: trackingData[day]?.[mealType] ? 'rgba(52, 211, 153, 0.2)' : 'rgba(229, 231, 235, 0.5)',
                                border: trackingData[day]?.[mealType] ? '2px solid #10B981' : '2px solid #D1D5DB'
                              }}
                            >
                              {trackingData[day]?.[mealType] ? (
                                <Check className="h-3 w-3 text-emerald-500" />
                              ) : (
                                <Circle className="h-3 w-3 text-gray-400" />
                              )}
                            </button>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          {mealPlanData && (
            <div className="relative">
              {/* Day Navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    const days = Object.keys(mealPlanData);
                    const currentIndex = days.indexOf(selectedDay);
                    if (currentIndex > 0) {
                      setSelectedDay(days[currentIndex - 1]);
                    }
                  }}
                  disabled={selectedDay === Object.keys(mealPlanData)[0]}
                  className="h-9 w-9 p-0 rounded-full"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <select 
                  className="border-none bg-neutral-100 rounded-lg px-4 py-2 text-sm font-medium"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  {Object.keys(mealPlanData).map(day => (
                    <option 
                      key={day} 
                      value={day}
                      disabled={!isCurrentDay(day)} // Disable past/future days
                    >
                      {dayNames[day as keyof typeof dayNames]} ({getDayDate(day)})
                      {isCurrentDay(day) && " (Today)"}
                    </option>
                  ))}
                </select>

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    const days = Object.keys(mealPlanData);
                    const currentIndex = days.indexOf(selectedDay);
                    if (currentIndex < days.length - 1) {
                      setSelectedDay(days[currentIndex + 1]);
                    }
                  }}
                  disabled={selectedDay === Object.keys(mealPlanData)[Object.keys(mealPlanData).length - 1]}
                  className="h-9 w-9 p-0 rounded-full"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Current Day Card */}
              <div className="animate-in slide-in-from-right duration-300">
                <Card className="overflow-hidden border">
                  <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>{dayNames[selectedDay as keyof typeof dayNames]}</span>
                        <span className="text-sm font-normal text-gray-500">
                          ({getDayDate(selectedDay)})
                        </span>
                      </CardTitle>
                      
                      <Badge variant="outline" className="bg-white">
                        {Object.entries(mealPlanData[selectedDay])
                          .filter(([key]) => !["calories", "protein", "carbs", "fats"].includes(key))
                          .filter(([mealType]) => trackingData[selectedDay]?.[mealType])
                          .length} / {
                          Object.entries(mealPlanData[selectedDay])
                            .filter(([key]) => !["calories", "protein", "carbs", "fats"].includes(key))
                            .length
                        } completed
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {Object.entries(mealPlanData[selectedDay])
                        .filter(([key]) => !["calories", "protein", "carbs", "fats"].includes(key))
                        .map(([mealType, mealData]) => {
                          const typedMealData = mealData as MealData;
                          const isCompleted = trackingData[selectedDay]?.[mealType];
                          
                          return (
                            <div 
                              key={mealType} 
                              className={`p-4 transition-colors ${
                                isCompleted ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'
                              }`}
                              onClick={() => toggleMealComplete(selectedDay, mealType)}
                            >
                              <div className="flex items-center">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    {mealIcons[mealType as keyof typeof mealIcons] || <Utensils className="h-4 w-4" />}
                                    <h4 className="font-medium capitalize">{mealType}</h4>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{typedMealData.meal}</p>
                                  
                                  <div className="flex gap-2 mt-2">
                                    <Badge variant="outline" className="bg-white text-xs">
                                      {typedMealData.calories} cal
                                    </Badge>
                                    <Badge variant="outline" className="bg-white text-xs text-blue-600">
                                      P: {typedMealData.protein}g
                                    </Badge>
                                    <Badge variant="outline" className="bg-white text-xs text-green-600">
                                      C: {typedMealData.carbs}g
                                    </Badge>
                                    <Badge variant="outline" className="bg-white text-xs text-amber-600">
                                      F: {typedMealData.fats}g
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="ml-4">
                                  <button
                                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                                      isCompleted 
                                        ? 'bg-green-100 border-2 border-green-500' 
                                        : 'bg-gray-100 border-2 border-gray-300'
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Circle className="h-4 w-4 text-gray-400" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Day Progress Indicator */}
              <div className="flex justify-center mt-6 gap-1">
                {Object.keys(mealPlanData).map((day) => (
                  <button
                    key={day}
                    className={`w-2 h-2 rounded-full transition-all ${
                      selectedDay === day ? 'bg-neutral-800 w-4' : 'bg-neutral-300'
                    }`}
                    onClick={() => setSelectedDay(day)}
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}