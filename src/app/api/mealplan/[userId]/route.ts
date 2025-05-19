import { connectToDatabase } from "@/lib/db";
import MealModel from "@/models/MealModel";
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectToDatabase()

    const resolvedParams = await Promise.resolve(params);
    const { userId } = resolvedParams;

    const mealPlan = await MealModel.findOne({ userId }).select({
      _id: 0,
      __v: 0,
      userId: 0,
    })

    const startDate = mealPlan?.startDate
    const expiryDate = mealPlan?.expiryDate

    if (!mealPlan) {
      return NextResponse.json(
        { message: "Meal Plan not found" },
        { status: 200 }
      )
    }

    return NextResponse.json({
      ...mealPlan.toJSON(),
      startDate,
      expiryDate
    }, { status: 201 })
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      {
        message: "Failed to retrieve Meal Plan",
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request, {params}: { params: Promise<{ userId: string }> }) {
    try{
        await connectToDatabase()

        const resolvedParams = await Promise.resolve(params);
        const { userId } = resolvedParams;

        const mealPlan = await MealModel.deleteOne({
            userId: userId
        })
        if(!mealPlan){
            return NextResponse.json({
                message: "Meal Plan not found"
            }, {status: 200})
        }
        return NextResponse.json({message: "Meal Plan Quitted Successfully"}, {status: 201})
    } catch(error: Error | unknown) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : "Unknown error occurred";
          
        return NextResponse.json({
          message: "Failed to Quit Meal Plan",
          error: errorMessage
        }, {status: 500}); 
      }
}