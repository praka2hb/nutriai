import { Leaf, Heart, Brain, Battery } from "lucide-react"

const nutritionFacts = [
  {
    icon: <Leaf className="w-6 h-6 text-green-500" />,
    title: "Balanced Diet",
    description: "A balanced diet provides your body with all the nutrients it needs to function properly.",
  },
  {
    icon: <Heart className="w-6 h-6 text-slate-500" />,
    title: "Heart Health",
    description:
      "Eating a diet rich in fruits, vegetables, and whole grains can help reduce the risk of heart disease.",
  },
  {
    icon: <Brain className="w-6 h-6 text-purple-800" />,
    title: "Brain Power",
    description: "Omega-3 fatty acids, found in fish and nuts, are crucial for brain function and development.",
  },
  {
    icon: <Battery className="w-6 h-6 text-yellow-500" />,
    title: "Energy Boost",
    description: "Complex carbohydrates provide sustained energy throughout the day, keeping you active and focused.",
  },
]

export default function NutritionInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {nutritionFacts.map((fact, index) => (
        <div key={index} className="flex items-start space-x-4">
          <div className="bg-white p-2 rounded-full shadow-md">{fact.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{fact.title}</h3>
            <p className="text-gray-600">{fact.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

