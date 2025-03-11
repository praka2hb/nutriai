import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import type { MealPlan } from '@/lib/mealPlan';
import { connectToDatabase } from "@/lib/db";
import MealModel from "@/models/MealModel";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const { userMetadata, planDuration, userId } = await request.json();

    // 1. Set a controller with timeout to prevent hanging requests
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 29000); // Abort after ~29 seconds
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }, { apiVersion: 'v1' });

    // 2. Simplified prompt to reduce response time
    const prompt = `Generate a ${planDuration}-day meal plan for a person with:
      - Fitness goal: ${userMetadata.fitnessGoal}
      - Allergies: ${JSON.stringify(userMetadata.allergies || [])}
      - Activity level: ${userMetadata.activityLevel}
      - Dietary preferences: ${JSON.stringify(userMetadata.dietaryPreferences || [])}

      Return ONLY a JSON object with no comments or formatting:
      {
        "day1": {
          "breakfast": {"meal": "meal description", "description": "optional details", "calories": 300, "protein": 20, "carbs": 30, "fats": 10},
          "lunch": {"meal": "meal description", "description": "optional details", "calories": 300, "protein": 20, "carbs": 30, "fats": 10},
          "dinner": {"meal": "meal description", "description": "optional details", "calories": 300, "protein": 20, "carbs": 30, "fats": 10},
          "snacks": {"meal": "meal description", "description": "optional details", "calories": 300, "protein": 20, "carbs": 30, "fats": 10},
          "calories": 1200, "protein": 80, "carbs": 120, "fats": 40
        }
      }`;
    
    try {
      // 3. Pass abort controller signal to AI request
      const result = await model.generateContent(prompt, { signal: abortController.signal });
      clearTimeout(timeoutId); // Clear timeout if successful
      
      const text = result.response.text();
      
      // Clean and parse the JSON
      const cleanedJSON = text.replace(/```json|```/g, '').trim();
      const mealPlan: MealPlan = JSON.parse(cleanedJSON);

      // 4. Insert the meal plan into the database
      await MealModel.insertOne({
        userId,
        mealPlan
      });

      return NextResponse.json({
        message: "Meal Plan created successfully",
      }, { status: 201 });
    } catch (genError: unknown) {
      if (genError instanceof Error) {
        if (genError.name === 'AbortError' || genError.message?.includes('timeout')) {
          return NextResponse.json({ 
            error: 'Request timed out. Please try again with fewer days or simplified requirements.' 
          }, { status: 504 });
        }
        // Re-throw other errors as needed.
        throw genError;
      } else {
        // If genError is not an instance of Error, throw a generic error
        throw new Error("An unknown error occurred during AI generation");
      }
    }
  } catch (error: unknown) {
    console.error("Meal plan generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    // Custom type guard to check if error has a numeric 'status' property.
    function hasStatus(err: unknown): err is Error & { status: number } {
      return err instanceof Error && "status" in err && typeof (err as { status: unknown }).status === "number";
    }

    const statusCode = hasStatus(error) ? error.status : 500;

    return NextResponse.json(
      { 
        error: "Failed to generate meal plan", 
        message: errorMessage,
        suggestion: "Try again with fewer days or simplified requirements"
      },
      { status: statusCode }
    );
  }
}