"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import Spinner from "./Spinner"
import { toast } from "sonner"


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
        setMessage( res.data.message || "Sign-up failed")
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
          className="cursor-pointer text-sm font-medium text-primary transition-all hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          tabIndex={0}
          role="button"
        >
          Sign Up
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create an account</DialogTitle>
          <DialogDescription>Enter your details to create your account</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSignup} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" placeholder="Enter your name" className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" type="email" placeholder="Enter your email" className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input id="password" type="password" autoComplete="new-password" placeholder="Enter your password" className="col-span-3" required />
          </div>
          <div className="w-full items-center justify-center flex">
            {error && <span className="text-sm font-normal text-red-500 text-center">{message}</span>}
          </div>
          <Button type="submit" className="ml-auto">
            {isLoading ? <Spinner /> : "Sign Up"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
  }

