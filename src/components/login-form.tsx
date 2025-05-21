"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import SignupModal from "./SignupModal"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { Sparkles } from "lucide-react"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [signInError, setSignInError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault()
    try{
      const result = await signIn("credentials", {
        redirect: false,
        email: (e.currentTarget as HTMLFormElement).email.value,
        password: (e.currentTarget as HTMLFormElement).password.value
      })

      if (result?.error) {
        setSignInError(result.error)
      }
    }
    catch(e){
      console.log(e)
    }
  }  

  const googleSignIn = async () => {
    try{
      const result = await signIn('google', {
        redirect: false
      })

      if(result?.error){
        setSignInError(result.error)
      }
    }
    catch(e){
      console.log(e)
    }
  }

  return (
    <div className={cn("w-full h-full flex overflow-hidden", className)} {...props}>
      <div className="grid w-full h-full grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Form Side */}
        <div className="flex items-center justify-center h-full overflow-auto">
          <div className="w-full max-w-md p-6 bg-white/75 backdrop-blur-md rounded-lg shadow-lg m-4">
            <div className="mb-4 flex flex-col items-center">
              <Image 
                src="/flame.png" 
                alt="FuelBlitz Logo" 
                width={48} 
                height={48} 
                className="mb-1"
              />
              <h1 className="text-2xl text-center bg-gradient-to-br from-orange-600 via-red-600 to-amber-500 bg-clip-text text-transparent font-bold mt-1">
                FuelBlitz
              </h1>
              <h2 className="mt-1 text-center text-lg font-medium text-neutral-900">
                Sign in to your account
              </h2>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-neutral-900">
                  Email address
                </Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  className="h-9 mt-1 border-slate-300 focus:border-amber-500 focus:ring-amber-500/20" 
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-neutral-900">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-9 mt-1 border-slate-300 focus:border-amber-500 focus:ring-amber-500/20"
                />
              </div>

              {(error || signInError) && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs flex items-center">
                  <span className="mr-2">⚠️</span>
                  <span>{error || signInError}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-zinc-900 hover:bg-zinc-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300"
              >
                Sign In
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-neutral-500">Or continue with</span>
                </div>
              </div>

              <Button
                onClick={googleSignIn}
                variant="outline" 
                className="w-full border-slate-300 hover:bg-slate-50 h-9 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Sign in with Google
              </Button>

              <div className="flex justify-between items-center pt-2 text-xs">
                <span className="text-neutral-600">
                  Don&apos;t have an account?{" "}
                  <SignupModal />
                </span>
                
                <span className="text-neutral-500">
                  <span className="bg-gradient-to-r from-amber-500 via-red-600 to-orange-500 bg-clip-text text-transparent font-bold">FuelBlitz</span>
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* Image Side */}
        <div className="relative hidden md:block h-full">
          <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-orange-500/30 to-amber-500/30 z-10"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/nutriAI.jpg"
              alt="Nutrition"
              fill
              priority
              className="object-cover"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6 text-center">
            <Sparkles className="h-10 w-10 text-amber-400 mb-3" />
            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg max-w-md">
              Fuel Your Journey
            </h3>
            <p className="text-white/90 max-w-sm text-sm drop-shadow-md">
              Personalized nutrition plans to achieve your fitness goals
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

