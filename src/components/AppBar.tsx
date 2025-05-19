"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Leaf, Menu, User } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { signOut, useSession } from "next-auth/react"

export default function AppBar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-zinc-700 to-zinc-500 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href={session?.user ? '/home': '/'} className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">NutriAI</span>
            </Link>
          </div>

          {/* Desktop Navigation
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/meal-plans" className="text-zinc-100 hover:text-white">
              Meal Plans
            </Link>
            <Link href="/recipes" className="text-zinc-100 hover:text-white">
              Recipes
            </Link>
            <Link href="/nutrition" className="text-zinc-100 hover:text-white">
              Nutrition
            </Link>
            <Link href="/about" className="text-zinc-100 hover:text-white">
              About
            </Link>
          </div> */}

          {/* User Profile Dropdown */}
          {session?.user ? (
            <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center space-x-1 rounded-full bg-zinc-800/50 p-2 text-white transition-colors hover:bg-zinc-700/50">
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
                    Saved Meal Plan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={'/meal-tracker'} className="flex w-full">
                    Meal Tracking
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div onClick={()=> signOut()} className="flex w-full">
                    Logout
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="ml-4 rounded-md p-2 text-white md:hidden">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-zinc-900 text-white">
                <div className="flex flex-col space-y-6 pt-6">
                  <div className="pt-4">
                    <div className="h-px w-full bg-zinc-700" />
                  </div>
                  <Link href={'/profile'} className="text-lg" onClick={() => setIsOpen(false)}>
                    Profile
                  </Link>
                  <div className="text-lg" onClick={() => setIsOpen(false)}>
                    Settings
                  </div>
                  <div className="text-lg" onClick={() => setIsOpen(false)}>
                    Saved Recipes
                  </div>
                  <div className="text-lg" onClick={() => signOut()}>
                    Logout
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          ) : (
            <Link href="/login" className="text-white">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

