"use client"

import Link from "next/link"
import { ChevronDown, Flame, User } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"

export default function AppBar() {
  const { data: session } = useSession()

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-100 shadow-sm border-b border-slate-300/70">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href={session?.user ? '/home': '/'} className="flex items-center space-x-1">
              <Flame className="h-6 w-6 text-orange-700" />
              <span className="text-xl font-bold bg-gradient-to-r from-slate-800 via-zinc-900 to-neutral-900 bg-clip-text text-transparent">
                FuelBlitz
              </span>
            </Link>
          </div>

          {/* User Profile Dropdown */}
          {session?.user ? (
            <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center space-x-1 rounded-full bg-slate-200 hover:bg-slate-300/70 p-2 text-slate-700 transition-colors">
                  <User className="h-5 w-5" />
                  <ChevronDown className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Link href={'/profile'} className="flex w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={'/meal-plan'} className="flex w-full">
                    Meal Plan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={'/meal-tracker'} className="flex w-full">
                    Meal Tracking
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=> signOut()} className="w-full cursor-pointer">
                    Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          ) : (
            <Link href="/login" className="text-slate-700 hover:text-slate-900 font-medium">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

