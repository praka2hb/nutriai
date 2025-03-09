"use client"

import { cn } from "@/lib/utils"
import { GeistSans } from "geist/font/sans"
import { Leaf, Heart, Brain, Battery, ArrowRight, CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import FloatingIcons from "@/components/FloatingText"
import ImageGallery from "@/components/ImageGallery"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

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

const features = [
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    title: "Personalized Plans",
    description: "Nutrition plans tailored to your unique body composition and goals",
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    title: "AI-Powered Analysis",
    description: "Advanced algorithms that adapt to your progress and preferences",
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    title: "Expert Guidance",
    description: "Insights based on the latest nutritional science and research",
  },
]

export default function Root() {
    const router = useRouter()
    const {data: session,status} = useSession()
  
    const signInHandler = ()=>{
        if(status === 'loading') return

        if(status === "authenticated" && session?.user){
            router.push('/home')
        }
        else{
            router.push('/login')
        }
    }

  return (
    <main
      className={cn(
        GeistSans.className,
        "min-h-screen bg-zinc-400 flex flex-col items-center justify-start p-4 overflow-hidden",
      )}
    >
      <FloatingIcons />

      {/* Hero Section */}
      <div className="w-full max-w-6xl mt-8 mb-12 text-center z-10">
        <Badge className="mb-4 bg-zinc-700 text-white hover:bg-zinc-600">New AI-Powered Features</Badge>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-b bg-clip-text text-transparent  from-zinc-800 to-zinc-600 mb-4">
          Your Personal <span className="bg-gradient-to-b bg-clip-text text-transparent from-emerald-700 to-green-600">Nutrition</span> Assistant
        </h1>
        <p className="text-xl text-zinc-700 max-w-3xl mx-auto mb-8">
          Unlock the ultimate personalized nutrition plan, scientifically crafted to match your unique profile for
          unstoppable health!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-zinc-700 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500 text-white"
            onClick={signInHandler}
          >
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="border-zinc-600 text-zinc-700 hover:bg-zinc-100">
            Learn More
          </Button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl w-full bg-zinc-200 bg-opacity-90 rounded-lg shadow-xl backdrop-blur-sm z-10 overflow-hidden">
        {/* Nutrition Facts Section - Enhanced */}
        <div className="p-8 border-b border-zinc-300">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-800">Nutrition Essentials</h2>
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nutritionFacts.map((fact, index) => (
              <Card key={index} className="border-none bg-gradient-to-b from-zinc-50 to-zinc-300 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-white p-3 rounded-full shadow-md">{fact.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{fact.title}</h3>
                      <p className="text-gray-600">{fact.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section - New */}
        <div className="p-8 bg-zinc-300 bg-opacity-50">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-8">Why Choose NutriAI</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-zinc-100 to-zinc-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px]"
              >
                {feature.icon}
                <h3 className="text-lg font-semibold text-zinc-800 mt-4 mb-2">{feature.title}</h3>
                <p className="text-zinc-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>


        {/* Image Gallery - Enhanced */}
        <ImageGallery />

        {/* CTA Section - Enhanced */}
        <div className="p-8 bg-gradient-to-r from-zinc-700 to-zinc-600 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-b bg-clip-text text-transparent from-zinc-200 to-zinc-300">Ready to Transform Your Nutrition?</h2>
          <Button size="lg" className="bg-gradient-to-b from-zinc-100 to-zinc-400 text-zinc-800 hover:bg-zinc-100" onClick={signInHandler}>
            Get Started Now
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-6xl mt-8 text-center text-zinc-700 text-sm z-10">
        <p>© Made With ❤</p>
      </div>
    </main>
  )
}

