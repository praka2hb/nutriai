"use client"

import type React from "react"

import { useState } from "react"
import type { FormData } from "@/app/(nutri)/home/page" 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner" 

interface UserMetadataFormProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  onNext: () => void
}

export function UserMetadataForm({ formData, updateFormData, onNext }: UserMetadataFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.age) {
      newErrors.age = "Age is required"
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = "Please enter a valid age"
    }

    if (!formData.height) {
      newErrors.height = "Height is required"
    }

    if (!formData.weight) {
      newErrors.weight = "Weight is required"
    } else if (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
      newErrors.weight = "Please enter a valid weight"
    }

    if (!formData.gender) {
      newErrors.gender = "Please select a gender"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onNext()
    } else {
      toast.error("Error",{
        description: "Please fill in all required fields correctly",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-zinc-800">Personal Information</CardTitle>
        <CardDescription>Let's start with some basic information about you</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 text-zinc-800">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              value={formData.age}
              onChange={(e) => updateFormData({ age: e.target.value })}
            />
            {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter your height"
                value={formData.height}
                onChange={(e) => updateFormData({ height: e.target.value })}
              />
              {errors.height && <p className="text-sm text-destructive">{errors.height}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter your weight"
                value={formData.weight}
                onChange={(e) => updateFormData({ weight: e.target.value })}
              />
              {errors.weight && <p className="text-sm text-destructive">{errors.weight}</p>}
            </div>
          </div>


          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => updateFormData({ gender: value })}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
            {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" className="bg-gradient-to-r from-zinc-800 to-zinc-600">Next</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

