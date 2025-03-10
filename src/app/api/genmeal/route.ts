import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import type { MealPlan } from '@/lib/mealPlan';
import { connectToDatabase } from "@/lib/db";
import MealModel from "@/models/MealModel";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const { userMetadata, planDuration, userId } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }, { apiVersion: 'v1' });

    const prompt = `Generate a ${planDuration} meal plan based on the following:
      User Metadata: ${JSON.stringify(userMetadata)}
      Fitness Goal: ${userMetadata.fitnessGoal}
      Allergies: ${JSON.stringify(userMetadata.allergies)}
      Activities they want to do: ${userMetadata.activities}
      Activity Level They Do: ${userMetadata.activityLevel}
      dietaryPreferences: ${JSON.stringify(userMetadata.dietaryPreferences)}

      Provide the 4 meal plan for per day in a JSON format with breakfast, lunch, dinner, and snacks for each day.
      Also Provide the calorie Intake And Protein Intake and Carbs Intake and Fats Intake.
      Return ONLY the JSON object with no markdown formatting, code blocks, or additional text.
      Example output:
      {
        "day1": {
          "breakfast": {...
            "calories": 300,
            "protein": 20,
            "carbs": 30,
            "fats": 10
          },
          "lunch": {...
            "calories": 300,
            "protein": 20,
            "carbs": 30,
            "fats": 10
          },
          "dinner": {...
            "calories": 300,
            "protein": 20,
            "carbs": 30,
            "fats": 10
          },
          "snacks": {...
            "calories": 300,
            "protein": 20,
            "carbs": 30,
            "fats": 10
          },
          "calories": 1200,
          "protein": 80,
          "carbs": 120,
          "fats": 40
        },
        "day2": {...},
        "day3": {...},
        "day4": {...},
        "day5": {...},
        "day6": {...},
        "day7": {...}
      }
    `;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Remove any potential markdown code blocks
    const cleanedJSON = text.replace(/```json|```/g, '').trim();
    
    // Parse the JSON
    const mealPlan: MealPlan = JSON.parse(cleanedJSON);

    await MealModel.insertOne({
      userId: userId,
      mealPlan: mealPlan
    })

    return NextResponse.json({
        message: "Meal Plan created successfully",
    }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate meal plan' }, { status: 500 });
  }
}