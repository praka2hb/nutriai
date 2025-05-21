"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { toast } from "sonner"
import Image from "next/image"

// Improved Spinner component
const SignupSpinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

export default function SignupModal() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState("")

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(false)
    setMessage("")
    try {
      const form = event.currentTarget as HTMLFormElement;
      const res = await axios.post("/api/auth/register", {
        name: (form.elements.namedItem("name") as HTMLInputElement).value,
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
        password: (form.elements.namedItem("password") as HTMLInputElement).value
      })

      if (res.status === 200) {
        setMessage(res.data.message || "Sign-up successful!")
        toast.success("Registered Successfully", {
          description: "Unlock the Next Step! 🚀 Enter Your Email & Password to Continue.",
        })
        setOpen(false)
      } else {
        setError(true)
        setMessage(res.data.message || "Sign-up failed")
      }
    } catch (err: unknown) {
      setError(true);
      if (axios.isAxiosError(err)) {
        setMessage(
          err.response?.data?.message || err.message || "An error occurred during registration"
        );
      } else if (err instanceof Error) {
        setMessage(err.message || "An unexpected error occurred");
      } else {
        setMessage("An unknown error occurred");
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span
          className="cursor-pointer text-sm font-medium bg-gradient-to-r from-amber-500 via-red-600 to-orange-500 bg-clip-text text-transparent hover:underline focus-visible:outline-none"
          tabIndex={0}
          role="button"
        >
          Sign Up
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-800 p-6">
          <div className="flex items-center mb-4">
            <Image 
              src="/flame.png" 
              alt="FuelBlitz Logo" 
              width={36} 
              height={36} 
              className="mr-3"
            />
            <DialogTitle className="text-xl text-white">Join FuelBlitz</DialogTitle>
          </div>
          <p className="text-white/90 text-sm">Create your account and start your nutrition journey</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-neutral-900">
                Name
              </Label>
              <Input 
                id="name" 
                placeholder="Enter your name" 
                className="border-slate-300 focus:border-amber-500 focus:ring-amber-500/20" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-neutral-900">
                Email
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                className="border-slate-300 focus:border-amber-500 focus:ring-amber-500/20" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-neutral-900">
                Password
              </Label>
              <Input 
                id="password" 
                type="password" 
                autoComplete="new-password" 
                placeholder="Create a password" 
                className="border-slate-300 focus:border-amber-500 focus:ring-amber-500/20" 
                required 
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                {message}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-800 hover:bg-zinc-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <SignupSpinner />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

