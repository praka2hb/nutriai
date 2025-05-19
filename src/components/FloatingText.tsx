"use client"

import { useEffect, useState } from "react"
import {
  Apple,
  Salad,
  Dumbbell,
  MonitorIcon as Running,
  Heart,
  Carrot,
  Bike,
  Droplets,
  Flame,
  Timer,
} from "lucide-react"

// Array of icons related to nutrition and workout
const icons = [
  { name: "Apple", component: Apple },
  { name: "Salad", component: Salad },
  { name: "Dumbbell", component: Dumbbell },
  { name: "Running", component: Running },
  { name: "Heart", component: Heart },
  { name: "Carrot", component: Carrot },
  { name: "Bike", component: Bike },
  { name: "Droplets", component: Droplets },
  { name: "Flame", component: Flame },
  { name: "Timer", component: Timer },
]

export default function FloatingIcons() {
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([])

  useEffect(() => {
    // Generate random positions across the entire viewport for each icon
    const newPositions = icons.map(() => ({
      // x position between 5% and 95% to avoid edges slightly
      x: Math.random() * 90 + 5, 
      // y position between 5% and 95%
      y: Math.random() * 90 + 5, 
    }));

    setPositions(newPositions);
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    // Using z-0 and relying on other elements having z-10 or higher
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0"> 
      {icons.map((icon, index) => {
        const IconComponent = icon.component;
        // Ensure positions[index] exists before trying to access x and y
        if (!positions[index]) {
          return null; // Or some fallback UI / initial position
        }
        return (
          <div
            key={index}
            // Using a fairly visible style for now, can be tuned down later
            className="absolute text-slate-400 text-opacity-30" // Adjusted opacity for subtlety
            style={{
              left: `${positions[index].x}%`,
              top: `${positions[index].y}%`,
              transform: "translate(-50%, -50%)",
              animation: `float 12s ease-in-out infinite alternate`, // Added alternate direction
              animationDelay: `${index * 0.7}s`, // Slightly increased delay staggering
            }}
          >
            <IconComponent className="w-10 h-10 md:w-16 md:h-16" /> 
          </div>
        );
      })}
    </div>
  );
}

