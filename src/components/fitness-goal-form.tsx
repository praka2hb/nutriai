"use client"

import type React from "react"

import { useState } from "react"
import type { UserFormData } from "@/app/(nutri)/home/page" 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner" 

interface FitnessGoalsFormProps {
  formData: UserFormData
  updateFormData: (data: Partial<UserFormData>) => void
  onNext: () => void
  onPrev: () => void
}

const activityOptions = [
  { id: "running", label: "Running" },
  { id: "cycling", label: "Cycling" },
  { id: "swimming", label: "Swimming" },
  { id: "weightlifting", label: "Weightlifting" },
  { id: "yoga", label: "Yoga" },
  { id: "hiit", label: "HIIT" },
  { id: "pilates", label: "Pilates" },
  { id: "boxing", label: "Boxing" },
]

export function FitnessGoalsForm({ formData, updateFormData, onNext, onPrev }: FitnessGoalsFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fitnessGoal) {
      newErrors.fitnessGoal = "Please select a fitness goal"
    }

    if (formData.activities.length === 0) {
      newErrors.activities = "Please select at least one activity"
    }

    if (!formData.activityLevel) {
      newErrors.activityLevel = "Please select your activity level"
    }

    // We don't make allergies required, as not everyone has allergies

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onNext()
    } else {
      toast.error("Error",{
        description: "Please fill in all required fields",
      })
    }
  }

  const handleActivityChange = (activityId: string, checked: boolean) => {
    if (checked) {
      updateFormData({ activities: [...formData.activities, activityId] })
    } else {
      updateFormData({
        activities: formData.activities.filter((id) => id !== activityId),
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="bg-gradient-to-b from-neutral-800 to-neutral-700 bg-clip-text text-transparent">Fitness Goals & Activities</CardTitle>
        <CardDescription>Tell us about your fitness goals and preferred activities</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 text-zinc-800">
          <div className="space-y-2">
            <Label htmlFor="fitness-goal">Primary Fitness Goal</Label>
            <Select value={formData.fitnessGoal} onValueChange={(value) => updateFormData({ fitnessGoal: value })}>
              <SelectTrigger id="fitness-goal">
                <SelectValue placeholder="Select your primary goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight-loss">Weight Loss</SelectItem>
                <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                <SelectItem value="endurance">Improve Endurance</SelectItem>
                <SelectItem value="strength">Increase Strength</SelectItem>
                <SelectItem value="flexibility">Improve Flexibility</SelectItem>
                <SelectItem value="general-fitness">General Fitness</SelectItem>
              </SelectContent>
            </Select>
            {errors.fitnessGoal && <p className="text-sm text-destructive">{errors.fitnessGoal}</p>}
          </div>

          <div className="space-y-3">
            <Label>Preferred Activities</Label>
            <div className="grid grid-cols-2 gap-2">
              {activityOptions.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={activity.id}
                    checked={formData.activities.includes(activity.id)}
                    onCheckedChange={(checked) => handleActivityChange(activity.id, checked as boolean)}
                  />
                  <Label htmlFor={activity.id}>{activity.label}</Label>
                </div>
              ))}
            </div>
            {errors.activities && <p className="text-sm text-destructive">{errors.activities}</p>}
          </div>

          <div className="space-y-2">
            <Label>Current Activity Level</Label>
            <RadioGroup
              value={formData.activityLevel}
              onValueChange={(value) => updateFormData({ activityLevel: value })}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sedentary" id="sedentary" />
                <Label htmlFor="sedentary">Sedentary (little to no exercise)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Light (1-3 days per week)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="moderate" />
                <Label htmlFor="moderate">Moderate (3-5 days per week)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active">Active (6-7 days per week)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-active" id="very-active" />
                <Label htmlFor="very-active">Very Active (twice per day)</Label>
              </div>
            </RadioGroup>
            {errors.activityLevel && <p className="text-sm text-destructive">{errors.activityLevel}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="allergies">Food Allergies</Label>
            <textarea
              id="allergies"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="List any food allergies or intolerances you have (e.g., nuts, dairy, gluten)"
              value={formData.allergies}
              onChange={(e) => updateFormData({ allergies: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">
              This helps us recommend appropriate meal plans for your fitness journey
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onPrev}>
            Back
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-zinc-800 to-zinc-600">Next</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

