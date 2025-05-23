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
      // Use UTC date methods for consistent date handling regardless of server timezone
      const startDate = new Date(userMealPlan.startDate);
      const startDateUTC = Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate(),
        0, 0, 0, 0
      );
      
      const today = new Date();
      const todayUTC = Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
        0, 0, 0, 0
      );
      
      // Calculate difference in days using UTC timestamps
      const diffDays = Math.floor((todayUTC - startDateUTC) / (1000 * 60 * 60 * 24));
      const currentDayKey = `day${diffDays + 1}`;
      
      // Add debug logging
      console.log({
        startDateUTC: new Date(startDateUTC).toISOString(),
        todayUTC: new Date(todayUTC).toISOString(),
        diffDays,
        currentDayKey,
        requestedDay: day
      });
      
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

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }
    
    await connectToDatabase();
    await MealTrackingModel.deleteMany({ userId });
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete tracking data" }, { status: 500 });
  }
}