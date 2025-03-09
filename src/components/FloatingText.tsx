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
    // Define the four corners with their position ranges
    const corners = [
      { xMin: 5, xMax: 20, yMin: 5, yMax: 20 }, // Top-left
      { xMin: 80, xMax: 95, yMin: 5, yMax: 20 }, // Top-right
      { xMin: 5, xMax: 20, yMin: 80, yMax: 95 }, // Bottom-left
      { xMin: 80, xMax: 95, yMin: 80, yMax: 95 }, // Bottom-right
    ]

    const newPositions = icons.map((_, index) => {
      // Determine which corner this icon belongs to
      const cornerIndex = index % corners.length
      const corner = corners[cornerIndex]

      // Generate random position within the corner's range
      return {
        x: Math.random() * (corner.xMax - corner.xMin) + corner.xMin,
        y: Math.random() * (corner.yMax - corner.yMin) + corner.yMin,
      }
    })

    setPositions(newPositions)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {icons.map((icon, index) => {
        const IconComponent = icon.component
        return (
          <div
            key={index}
            className="absolute text-white text-opacity-20"
            style={{
              left: `${positions[index]?.x}%`,
              top: `${positions[index]?.y}%`,
              transform: "translate(-50%, -50%)",
              animation: `float 10s ease-in-out infinite`,
              animationDelay: `${index * 0.5}s`,
            }}
          >
            <IconComponent className="w-8 h-8 md:w-12 md:h-12" />
          </div>
        )
      })}
    </div>
  )
}

