"use client"

import FloatingText from "@/components/FloatingText"
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
    <main className="min-h-screen bg-gradient-to-br from-zinc-400 to-zinc-300 flex items-center justify-center">
      <div className="animate-pulse">
        <div className="h-56 w-96 bg-muted rounded mb-4"></div>
        <div className="h-4 w-96 bg-muted rounded"></div>
      </div>
    </main>
    )
  }


  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-400 to-zinc-300 flex  items-start justify-center  overflow-hidden">
        <FloatingText />
        <div className="max-w-3xl bg-slate-100 w-full bg-opacity-90 rounded-lg shadow-xl p-6 md:p-8 backdrop-blur-sm z-10 mt-4">
          <LoginForm />
        </div>
    </main>
    )
}

export default Login