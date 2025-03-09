import { connectToDatabase } from "@/lib/db"
import MealPlan from "@/models/MealModel"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try{

    await connectToDatabase()

    const { userId, mealPlan } = await req.json()

        await MealPlan.insertOne({
            userId: userId,
            mealPlan: mealPlan
        })

        return NextResponse.json({
            message: "Meal Plan created successfully",
        }, { status: 201 });
    }
    catch(error: any){
        return NextResponse.json({
            message: "Failed to create meal plan",
            error: error.message
        }, {status: 402})
    }
}