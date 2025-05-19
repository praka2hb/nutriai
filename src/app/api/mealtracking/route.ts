// 2. Create API endpoint in src/app/api/mealtracking/route.ts
import { connectToDatabase } from "@/lib/db";
import MealTrackingModel from "@/models/MealTrackingModel";
import { NextResponse } from "next/server";
import MealPlanModel from "@/models/MealModel";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { userId, day, mealType, completed } = await request.json();
    
    // Get the user's meal plan to check the start date
    const userMealPlan = await MealPlanModel.findOne({ userId });
    
    if (userMealPlan?.startDate) {
      const startDate = new Date(userMealPlan.startDate);
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const currentDayKey = `day${diffDays + 1}`;
      
      // Only allow tracking for the current day
      if (day !== currentDayKey) {
        return NextResponse.json({ 
          error: "Can only track meals for the current day" 
        }, { status: 403 });
      }
    }
    
    await MealTrackingModel.findOneAndUpdate(
      { userId },
      { 
        $push: { 
          completedMeals: { 
            day, 
            mealType, 
            completed,
            timestamp: new Date() 
          } 
        } 
      },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update tracking" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }
    
    await connectToDatabase();
    const tracking = await MealTrackingModel.findOne({ userId });
    
    return NextResponse.json(tracking || { completedMeals: [] });
  } catch {
    return NextResponse.json({ error: "Failed to get tracking data" }, { status: 500 });
  }
}