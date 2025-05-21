"use client"

import AuroraBackground from "@/components/AuroraBackground"
import { LoginForm } from "@/components/login-form"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Login = () => {
  const{data:session, status} = useSession()
  const router = useRouter()

  useEffect(()=>{
    if(status === "authenticated" && session?.user){
      router.push('/home')
    }
  },[status, session, router])

  if(status === 'loading') {
    return (
    <main className="h-screen w-screen bg-slate-200 flex items-center justify-center overflow-hidden">
      <div className="animate-pulse">
        <div className="h-56 w-96 bg-muted rounded mb-4"></div>
        <div className="h-4 w-96 bg-muted rounded"></div>
      </div>
    </main>
    )
  }

  return (
    <main className="h-screen bg-slate-200 overflow-hidden">
        <AuroraBackground />
        <div className="h-full w-full">
          <LoginForm />
        </div>
    </main>
  )
}

export default Login