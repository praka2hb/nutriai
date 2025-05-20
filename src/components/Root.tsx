"use client";

import { cn } from "@/lib/utils";
import { GeistSans } from "geist/font/sans";
import { ArrowRight, CheckCircle, Sparkles, BarChart3, TrendingUp as TrendingUpIcon, Target, Zap, Brain } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AuroraBackground from "@/components/AuroraBackground";
import ImageGallery from "@/components/ImageGallery";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: <CheckCircle className="w-7 h-7 text-emerald-600 group-hover:text-emerald-500 transition-colors duration-300" />,
    title: "Personalized Plans",
    description: "Nutrition plans tailored to your unique body composition and goals.",
  },
  {
    icon: <Sparkles className="w-7 h-7 text-purple-600 group-hover:text-purple-500 transition-colors duration-300" />,
    title: "AI-Powered Analysis",
    description: "Advanced algorithms that adapt to your progress and preferences.",
  },
  {
    icon: <Brain className="w-7 h-7 text-sky-600 group-hover:text-sky-500 transition-colors duration-300" />,
    title: "Expert Guidance",
    description: "Insights based on the latest nutritional science and research.",
  },
];

// Reverted trackingBenefits to original/neutral icon colors
const trackingBenefits = [
  {
    icon: <BarChart3 className="w-8 h-8 text-blue-600 group-hover:text-blue-500 transition-colors duration-300" />,
    title: "Visualize Your Progress",
    description: "See your daily and weekly intake with easy-to-read charts and summaries. Understand your eating habits at a glance.",
  },
  {
    icon: <TrendingUpIcon className="w-8 h-8 text-green-600 group-hover:text-green-500 transition-colors duration-300" />,
    title: "Stay on Target",
    description: "Monitor your macronutrient and calorie goals. Our tracking helps you stay aligned with your personalized nutrition plan.",
  },
  {
    icon: <Target className="w-8 h-8 text-red-600 group-hover:text-red-500 transition-colors duration-300" />, // Red can stay as a generic "target" color
    title: "Achieve Your Goals",
    description: "Consistent tracking is key to reaching your health and fitness milestones. Build healthy habits that last.",
  },
  {
    icon: <Zap className="w-8 h-8 text-yellow-500 group-hover:text-amber-500 transition-colors duration-300" />, // Yellow/Amber for Zap is fine
    title: "Gain Valuable Insights",
    description: "Discover patterns in your diet and make informed decisions to optimize your nutrition and well-being.",
  },
];

// CSS Keyframes for Aurora Background (no changes here)
const auroraKeyframes = `
  @keyframes aurora-1 { /* ... */ }
  @keyframes aurora-2 { /* ... */ }
  @keyframes aurora-3 { /* ... */ }
  @keyframes aurora-4 { /* ... */ }
`;

export default function Root() {
    const router = useRouter();
    const {data: session,status} = useSession();
  
    const signInHandler = ()=>{
        if(status === 'loading') return;
        if(status === "authenticated" && session?.user){
            router.push('/home');
        } else {
            router.push('/login');
        }
    };

  return (
    <>
      <style jsx global>{`
        ${auroraKeyframes}
        .animate-aurora-1 { animation: aurora-1 28s infinite ease-in-out; }
        .animate-aurora-2 { animation: aurora-2 32s infinite ease-in-out; }
        .animate-aurora-3 { animation: aurora-3 30s infinite ease-in-out; }
        .animate-aurora-4 { animation: aurora-4 34s infinite ease-in-out; }
      `}</style>
    <main
      className={cn(
        GeistSans.className,
          // Reverted main background to the previous lighter one
          "min-h-screen bg-slate-200 flex flex-col items-center justify-start p-4 md:p-8 overflow-x-hidden relative text-slate-800", // Reverted text color
      )}
    >
        <AuroraBackground />

      {/* Hero Section */}
        <div className="w-full max-w-6xl mt-12 mb-16 md:mt-16 md:mb-24 text-center z-10">
          {/* Reverted Badge to previous style */}
          <Badge variant="outline" className="mb-6 py-2 px-4 border-amber-500/70 text-amber-700 bg-amber-50/80 text-sm font-medium shadow-sm hover:bg-amber-100/70 transition-colors">
            <Sparkles className="w-4 h-4 mr-2 text-amber-500" /> 
            New AI-Powered Features 
          </Badge>
          {/* Title with flame gradient colors */}
          <div className="flex space-x-2 items-center justify-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-br from-orange-600 via-red-600 to-amber-500 bg-clip-text text-transparent">
              FuelBlitz 
            </h1>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-br from-slate-800 via-zinc-900 to-neutral-900 bg-clip-text text-transparent">
              Ignite Your Nutrition
            </h1>
          </div>
          {/* Reverted paragraph text color */}
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Precision nutrition plans, AI-crafted to supercharge your unique profile. Get ready for peak performance!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Reverted Button styles */}
          <Button
            size="lg"
              className="bg-zinc-900 hover:bg-zinc-700 text-white text-lg py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={signInHandler}
          >
              Start Your Blitz <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
            <Button variant="outline" size="lg" className="border-slate-400 text-slate-700 hover:bg-slate-100 hover:border-slate-500 text-lg py-3 px-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
              Discover More
          </Button>
        </div>
      </div>

        {/* Main Content Container - Reverted to lighter, semi-transparent */}
        <div className="max-w-6xl w-full bg-white/60 backdrop-blur-lg rounded-xl shadow-2xl z-10 overflow-hidden mb-16 md:mb-24 border border-slate-200/60">
          
          {/* Data Tracking Benefits Section - Headings and text colors reverted */}
          <div className="p-8 md:p-12 border-b border-slate-200/50">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3"> 
                Unlock Your Nutrition Data
              </h2>
              <p className="text-md md:text-lg text-slate-500 max-w-2xl mx-auto">Track your meals, monitor progress, and gain insights for a healthier lifestyle.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {trackingBenefits.map((benefit, index) => (
                <Card 
                  key={index} 
                  // Reverted card styles
                  className="bg-white/70 border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden group hover:scale-[1.03] hover:border-slate-300/70 backdrop-blur-sm"
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start space-y-4 md:space-y-0 md:space-x-6">
                      {/* Reverted icon container style */}
                      <div className="flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 p-4 rounded-full shadow-md group-hover:scale-110 transition-transform duration-300 group-hover:shadow-slate-300/50">
                        {benefit.icon}
          </div>
                    <div>
                        <h3 className="text-xl font-semibold text-slate-800 group-hover:text-slate-700 transition-colors duration-300 mb-2">{benefit.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

          {/* Features Section - Headings and text colors reverted */}
          <div className="p-8 md:p-12 bg-slate-50/20 border-b border-slate-200/40 backdrop-blur-sm">
             <div className="text-center mb-10 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3"> 
                Why Choose FuelBlitz {/* Name stays, style reverted */}
              </h2>
              <p className="text-md md:text-lg text-slate-500 max-w-2xl mx-auto">Experience the difference with our intelligent and personalized approach.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                  // Reverted feature item style
                  className="bg-white/70 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] group border border-slate-200/50 hover:border-slate-300/70 backdrop-blur-sm"
              >
                   {/* Reverted icon container style */}
                  <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-slate-100 via-stone-100 to-zinc-100 rounded-full mb-5 shadow-md group-hover:scale-110 transition-transform duration-300 group-hover:shadow-slate-300/50">
                {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 group-hover:text-slate-700 transition-colors duration-300 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <ImageGallery />

          {/* CTA Section - modify heading */}
          <div className="p-10 md:p-16 bg-gradient-to-br from-slate-800 via-zinc-800 to-neutral-900 text-white text-center">
            <Sparkles className="w-10 h-10 text-yellow-400 mx-auto mb-4" /> {/* Sparkles icon is fine */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Transform</span> Your Nutrition?</h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-8 text-lg">Join thousands of users achieving their health goals with <span className="text-amber-400">FuelBlitz</span>.</p>
            {/* Reverted button to previous style (light on dark) */}
            <Button 
              size="lg" 
              className="bg-white text-zinc-900 hover:bg-zinc-100 text-lg py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-semibold transform hover:scale-105"
              onClick={signInHandler}
            >
              Start Fueling <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

        {/* Footer with flame-colored brand name */}
        <div className="w-full max-w-6xl mt-8 mb-8 text-center text-slate-500 text-sm z-10">
          <p>© Powered by <span className="bg-gradient-to-r from-amber-500 via-red-600 to-orange-500 bg-clip-text text-transparent font-bold">FuelBlitz</span></p>
      </div>
    </main>
    </>
  );
}