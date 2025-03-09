import { connectToDatabase } from "@/lib/db";
import MealModel from "@/models/MealModel";
import { NextResponse } from "next/server";

export async function GET(req:Request, {params}: {params:{userId: string}}) {
    try{
        await connectToDatabase()
        const { userId } = await params
        const mealPlan = await MealModel.findOne({
            userId: userId
        }).select({
            _id: 0,
            __v: 0,
            userId: 0
        })
        if(!mealPlan){
            return NextResponse.json({
                message: "Meal Plan not found"
            }, {status: 200})
        }
        return NextResponse.json(mealPlan, {status: 201})
    } catch (error : any ){
        return NextResponse.json({
            message: "Failed to Retrieve data",
        }, {status: 402})
    }
}
export async function DELETE(req:Request, {params}: {params:{userId: string}}) {
    try{
        await connectToDatabase()
        const { userId } = await params
        const mealPlan = await MealModel.deleteOne({
            userId: userId
        })
        if(!mealPlan){
            return NextResponse.json({
                message: "Meal Plan not found"
            }, {status: 200})
        }
        return NextResponse.json({message: "Meal Plan Quitted Successfully"}, {status: 201})
    } catch (error : any ){
        return NextResponse.json({
            message: "Failed to Quit Meal Plan",
            error: error.message
        }, {status: 402})
    }
}