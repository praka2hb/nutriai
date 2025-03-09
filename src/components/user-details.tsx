"use client"

import {
  Activity,
  AlertCircle,
  Apple,
  Calendar,
  Coffee,
  Heart,
  Ruler,
  Scale,
  Target,
  User,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface UserMetadata {
  age: string
  weight: string
  height: string
  gender: string
  fitnessGoal: string
  allergies: string
  activities: string[]
  activityLevel: string
  mealsPerDay: string
  dietaryPreferences: string[]
}

interface UserMetadataCardProps {
  userData: UserMetadata
}

export default function UserMetadataCard(
  { userData }: UserMetadataCardProps
) {
  return (
    <Card className="w-full max-w-3xl shadow-md">
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <User className="h-5 w-5" />
          <div className="bg-gradient-to-b from-zinc-800 to-zinc-600 bg-clip-text text-transparent">
          User Profile Information
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-6 text-zinc-800 sm:grid-cols-2">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="space-y-2">
              {/* <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">User ID:</span>
                <span className="text-sm text-muted-foreground">{userData.userId}</span>
              </div> */}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Age:</span>
                <span className="text-sm text-muted-foreground">{userData.age} years</span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Gender:</span>
                <span className="text-sm text-muted-foreground">{userData.gender}</span>
              </div>
            </div>

            <Separator />

            {/* Physical Metrics */}
            <h3 className="text-lg font-medium">Physical Metrics</h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Weight:</span>
                <span className="text-sm text-muted-foreground">{userData.weight} kg</span>
              </div>

              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Height:</span>
                <span className="text-sm text-muted-foreground">{userData.height} cm</span>
              </div>
            </div>

            <Separator />

            {/* Fitness Information */}
            <h3 className="text-lg font-medium">Fitness Information</h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Fitness Goal:</span>
                <span className="text-sm text-muted-foreground">{userData.fitnessGoal}</span>
              </div>

              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Activity Level:</span>
                <span className="text-sm text-muted-foreground">{userData.activityLevel}</span>
              </div>
            </div>
          </div>

          {/* Diet and Activities */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Diet Information</h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Meals Per Day:</span>
                <span className="text-sm text-muted-foreground">{userData.mealsPerDay}</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Apple className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Dietary Preferences:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-6">
                  {userData.dietaryPreferences.map((preference) => (
                    <Badge key={preference} variant="secondary" className="text-xs">
                      {preference}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Allergies:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-6">
                    {userData.allergies.split(",").map((allergy) => (
                      <Badge key={allergy} variant="secondary" className="text-xs bg-red-100 text-red-700">
                        {allergy}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Activities */}
            <h3 className="text-lg font-medium">Activities</h3>

            <div className="space-y-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Preferred Activities:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-6">
                  {userData.activities.map((activity) => (
                    <Badge key={activity} variant="secondary" className="text-xs">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

