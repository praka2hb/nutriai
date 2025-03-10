// Remove the enterprise-only config export since you're on the free plan

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import type { MealPlan } from "@/lib/mealPlan";
import { connectToDatabase } from "@/lib/db";
import MealModel from "@/models/MealModel";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  // Save userId for checking in the outer catch
  let userId: string | undefined;

  try {
    await connectToDatabase();

    const { userMetadata, planDuration, userId: parsedUserId } = await request.json();
    userId = parsedUserId; // persist for later use

    // Set a timeout that fits within Vercel's free plan limits (e.g. 9 seconds)
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 9000);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }, { apiVersion: "v1" });

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
      // Call the AI service with the abort signal
      const result = await model.generateContent(prompt, { signal: abortController.signal });
      clearTimeout(timeoutId);

      const text = result.response.text();
      const cleanedJSON = text.replace(/```json|```/g, "").trim();
      const mealPlan: MealPlan = JSON.parse(cleanedJSON);

      // Insert the meal plan into the database
      await MealModel.insertOne({ userId, mealPlan });

      return NextResponse.json({ message: "Meal Plan created successfully" }, { status: 201 });
    } catch (genError: unknown) {
      if (genError instanceof Error) {
        if (genError.name === "AbortError" || genError.message?.includes("timeout")) {
          return NextResponse.json(
            { error: "Request timed out. Please try again with fewer days or simplified requirements." },
            { status: 504 }
          );
        }
        // Re-throw other errors
        throw genError;
      } else {
        throw new Error("An unknown error occurred during AI generation");
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    // Custom type guard to check if error has a numeric 'status' property.
    function hasStatus(err: unknown): err is Error & { status: number } {
      return err instanceof Error && "status" in err && typeof (err as { status: unknown }).status === "number";
    }
    const statusCode = hasStatus(error) ? error.status : 500;

    // Twist: Check if a meal plan was inserted already.
    if (userId) {
      const existingPlan = await MealModel.findOne({ userId });
      if (existingPlan) {
        return NextResponse.json({ message: "Meal Plan created successfully" }, { status: 201 });
      }
    }

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