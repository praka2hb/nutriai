import type { UserFormData } from "@/app/(nutri)/home/page" 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FormSummaryProps {
  formData: UserFormData
}

export function FormSummary({ formData }: FormSummaryProps) {
  // Helper function to get readable labels for activities
  const getActivityLabels = () => {
    const activityMap: Record<string, string> = {
      running: "Running",
      cycling: "Cycling",
      swimming: "Swimming",
      weightlifting: "Weightlifting",
      yoga: "Yoga",
      hiit: "HIIT",
      pilates: "Pilates",
      boxing: "Boxing",
    }

    return formData.activities.map((id) => activityMap[id] || id).join(", ")
  }

  // Helper function to get readable labels for dietary preferences
  const getDietaryLabels = () => {
    const dietaryMap: Record<string, string> = {
      vegetarian: "Vegetarian",
      vegan: "Vegan",
      pescatarian: "Pescatarian",
      keto: "Keto",
      paleo: "Paleo",
      "gluten-free": "Gluten-Free",
      "dairy-free": "Dairy-Free",
      "no-restrictions": "No Restrictions",
    }

    return formData.dietaryPreferences.map((id) => dietaryMap[id] || id).join(", ")
  }

  // Helper function to get readable label for fitness goal
  const getFitnessGoalLabel = () => {
    const goalMap: Record<string, string> = {
      "weight-loss": "Weight Loss",
      "muscle-gain": "Muscle Gain",
      endurance: "Improve Endurance",
      strength: "Increase Strength",
      flexibility: "Improve Flexibility",
      "general-fitness": "General Fitness",
    }

    return goalMap[formData.fitnessGoal] || formData.fitnessGoal
  }

  // Helper function to get readable label for activity level
  const getActivityLevelLabel = () => {
    const levelMap: Record<string, string> = {
      sedentary: "Sedentary (little to no exercise)",
      light: "Light (1-3 days per week)",
      moderate: "Moderate (3-5 days per week)",
      active: "Active (6-7 days per week)",
      "very-active": "Very Active (twice per day)",
    }

    return levelMap[formData.activityLevel] || formData.activityLevel
  }

  return (
    <Card>
      <CardHeader className="text-zinc-800">
        <CardTitle >Your Fitness Profile</CardTitle>
        <CardDescription>Thank you for completing your profile! Here&apos;s a summary of your information.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-zinc-800">Personal Information</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p>{formData.age} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p>{formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Height</p>
                <p>{formData.height} cm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p>{formData.weight} kg</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-zinc-800">Fitness Goals & Activities</h3>
            <div className="grid grid-cols-1 gap-2 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Primary Fitness Goal</p>
                <p>{getFitnessGoalLabel()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preferred Activities</p>
                <p>{getActivityLabels()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Activity Level</p>
                <p>{getActivityLevelLabel()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Food Allergies</p>
                <p>{formData.allergies || "None specified"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-zinc-800">Nutrition Preferences</h3>
            <div className="grid grid-cols-1 gap-2 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Meals Per Day</p>
                <p>{formData.mealsPerDay}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dietary Preferences</p>
                <p>{getDietaryLabels()}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

