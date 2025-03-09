"use client"

import type React from "react"

import { useState } from "react"
import type { FormData } from "@/app/(nutri)/home/page" 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner" 

interface NutritionFormProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  onComplete: () => void
  onPrev: () => void
}

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "pescatarian", label: "Pescatarian" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
  { id: "no-restrictions", label: "No Restrictions" },
]

export function NutritionForm({ formData, updateFormData, onComplete, onPrev }: NutritionFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.mealsPerDay) {
      newErrors.mealsPerDay = "Please select how many meals you eat per day"
    }

    if (formData.dietaryPreferences.length === 0) {
      newErrors.dietaryPreferences = "Please select at least one dietary preference"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onComplete()
    } else {
      toast.error("Error",{
        description: "Please fill in all required fields",
      })
    }
  }

  const handleDietaryChange = (dietId: string, checked: boolean) => {
    if (checked) {
      updateFormData({ dietaryPreferences: [...formData.dietaryPreferences, dietId] })
    } else {
      updateFormData({
        dietaryPreferences: formData.dietaryPreferences.filter((id) => id !== dietId),
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="bg-gradient-to-b from-zinc-800 to-zinc-600 bg-clip-text text-transparent">Nutrition Preferences</CardTitle>
        <CardDescription>Tell us about your eating habits and dietary preferences</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="text-zinc-800 space-y-6">
          <div className="space-y-2">
            <Label>How many meals do you eat per day?</Label>
            <RadioGroup
              value={formData.mealsPerDay}
              onValueChange={(value) => updateFormData({ mealsPerDay: value })}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="meals-2" />
                <Label htmlFor="meals-2">2 meals</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="meals-3" />
                <Label htmlFor="meals-3">3 meals</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="meals-4" />
                <Label htmlFor="meals-4">4 meals</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="meals-5" />
                <Label htmlFor="meals-5">5 meals</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6+" id="meals-6" />
                <Label htmlFor="meals-6">6+ meals</Label>
              </div>
            </RadioGroup>
            {errors.mealsPerDay && <p className="text-sm text-destructive">{errors.mealsPerDay}</p>}
          </div>

          <div className="space-y-3">
            <Label>Dietary Preferences</Label>
            <div className="grid grid-cols-2 gap-2">
              {dietaryOptions.map((diet) => (
                <div key={diet.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={diet.id}
                    checked={formData.dietaryPreferences.includes(diet.id)}
                    onCheckedChange={(checked) => handleDietaryChange(diet.id, checked as boolean)}
                  />
                  <Label htmlFor={diet.id}>{diet.label}</Label>
                </div>
              ))}
            </div>
            {errors.dietaryPreferences && <p className="text-sm text-destructive">{errors.dietaryPreferences}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onPrev}>
            Back
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-zinc-800 to-zinc-600">Complete</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

