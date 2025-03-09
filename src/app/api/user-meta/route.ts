import { connectToDatabase } from "@/lib/db";
import Metadata from "@/models/Metadata";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{
        await connectToDatabase()
        const { age, weight, height, gender, userId, fitnessGoal, allergies, activities, activityLevel, mealsPerDay, dietaryPreferences } = await req.json()

        await Metadata.create({
            age: age,
            weight: weight,
            height: height,
            gender: gender,
            userId: userId,
            fitnessGoal: fitnessGoal,
            allergies: allergies,
            activities: activities,
            activityLevel: activityLevel,
            mealsPerDay: mealsPerDay,
            dietaryPreferences: dietaryPreferences
        })

        return NextResponse.json({
            message: "Metadata created successfully",
        }, { status: 201 });
    } 
    catch(error: any){
        return NextResponse.json({
            message: "Failed to create metadata"
        }, {status: 402})
    }
}