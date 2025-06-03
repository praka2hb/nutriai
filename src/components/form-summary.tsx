import type { UserFormData } from "@/app/(nutri)/home/page" 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Zap, Flame, Heart, User } from "lucide-react"

interface FormSummaryProps {
  formData: UserFormData
}

// Helper function to render a detail item - for consistency
const DetailItem = ({ label, value }: { label: string; value: string | number | undefined | null }) => (
  <div>
    <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">{label}</p>
    <p className="text-gray-900 text-sm font-medium">{value || "N/A"}</p>
  </div>
);

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
    <Card className="shadow-xl bg-white border border-gray-200">
      <CardHeader className="pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Flame className="w-8 h-8 text-orange-600" />
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Your FuelBlitz Profile
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Awesome! Here&apos;s a summary of your high-octane profile.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 px-6 md:px-8">
        <div className="space-y-8">
          <div>
            <h3 className="flex items-center text-lg font-semibold text-blue-800 mb-3 border-b border-blue-300 pb-2">
              <User className="w-5 h-5 mr-2" />
              Core Stats
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-3">
              <DetailItem label="Age" value={`${formData.age} years`} />
              <DetailItem label="Gender" value={formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)} />
              <DetailItem label="Height" value={`${formData.height} cm`} />
              <DetailItem label="Weight" value={`${formData.weight} kg`} />
            </div>
          </div>

          <div>
            <h3 className="flex items-center text-lg font-semibold text-green-800 mb-3 border-b border-green-300 pb-2">
              <Zap className="w-5 h-5 mr-2" />
              Mission & Movement
            </h3>
            <div className="space-y-4 mt-3">
              <DetailItem label="Primary Fitness Goal" value={getFitnessGoalLabel()} />
              <DetailItem label="Preferred Activities" value={getActivityLabels()} />
              <DetailItem label="Activity Level" value={getActivityLevelLabel()} />
              <DetailItem label="Food Allergies" value={formData.allergies || "None specified"} />
            </div>
          </div>

          <div>
            <h3 className="flex items-center text-lg font-semibold text-purple-800 mb-3 border-b border-purple-300 pb-2">
              <Heart className="w-5 h-5 mr-2" />
              Fueling Strategy
            </h3>
            <div className="space-y-4 mt-3">
              <DetailItem label="Meals Per Day" value={formData.mealsPerDay} />
              <DetailItem label="Dietary Preferences" value={getDietaryLabels()} />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-gray-800 font-medium text-lg">
              Profile Ready to Blitz!
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Your personalized FuelBlitz experience is about to begin.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}