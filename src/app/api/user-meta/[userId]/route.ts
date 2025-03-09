import { connectToDatabase } from "@/lib/db";
import Metadata from "@/models/Metadata";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    await connectToDatabase()   
    try {
        const { userId } = await params
        const userMeta = await Metadata.findOne({
            userId: userId
        }).select({
            _id: 0,
            __v: 0,
            userId: 0
        })
        if(!userMeta){
            return NextResponse.json({
                message: "User Meta not found"
            }, {status: 200})
        }
        return NextResponse.json(userMeta, {status: 201})
    }
    catch (error){
        return NextResponse.json({
            message: "Failed to Retrieve data",
            error
        }, {status: 402})
    }
}

export async function PUT(req: NextRequest, {params}: {params : {userId : string}}) {
    try{
        await connectToDatabase()
        const { userId } = await params
        const { age, weight, height, gender, fitnessGoal, allergies, activities, activityLevel, mealsPerDay, dietaryPreferences } = await req.json()

        const res = await Metadata.findOneAndUpdate({
            userId: userId
        }, {
            age: age,
            weight: weight,
            height: height,
            gender: gender,
            fitnessGoal: fitnessGoal,
            allergies: allergies,
            activities: activities,
            activityLevel: activityLevel,
            mealsPerDay: mealsPerDay,
            dietaryPreferences: dietaryPreferences
        })
        
        if(!res){
            return NextResponse.json({
                message: "User Meta not found"
            }, {status: 404})
        }

        return NextResponse.json({
            message: "Metadata updated successfully",
        }, { status: 201 });

    }
    catch(error: any){
        return NextResponse.json({
            message: "Failed to update metadata"
        }, {status: 402})
    }
}