"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import SignupModal from "./SignupModal"
import { useSearchParams } from "next/navigation"
import {  useState } from "react"
import Image from "next/image"

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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="flex flex-col">
            <form className="flex flex-col justify-between p-6 md:p-8" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl bg-gradient-to-b bg-clip-text text-transparent  from-zinc-800 to-zinc-600 font-bold">Welcome back</h1>
                  <p className="text-balance text-muted-foreground">Login to your NutriAI account</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                {(error || signInError) && (
                  <p className="text-red-500 pr-4 text-sm text-muted-foreground rounded">
                    {error || signInError}
                  </p>
                )}
                <Button type="submit" className="w-full bg-gradient-to-r hover:opacity-95 from-zinc-700 to-zinc-500">
                  Login
                </Button>
              </div>
              <div className="space-y-2">
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
                <div className="grid grid-cols-1 ">
                  <Button variant="outline" onClick={googleSignIn} className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Login with Google</span>
                  </Button>
                </div>
              </div>
            </form>
            <div className="text-center text-sm p-4">
                Don&apos;t have an account?{" "}
                <SignupModal />
            </div>
          </div>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/nutriAI.jpg"
              width={500}
              height={500}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

