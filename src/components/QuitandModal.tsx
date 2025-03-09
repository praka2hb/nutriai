"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function QuitButtonWithModal({userId}: {userId: string}) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleQuit = async (userId: string) => {
    const res = await axios.delete(`/api/mealplan/${userId}`)
    if (res.status === 200 || res.status === 201) {
      setIsOpen(false)
      toast.success(res.data.message,{
        description: "You can get a fresh, customized meal plan anytime—just say the word!",
      })
      router.push('/home')
    }
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={() => setIsOpen(true)} className="bg-gradient-to-b from-zinc-700 to-zinc-500 font-medium">
        <X className="mr-2 h-4 w-4" />
        Quit
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start gap-2 mt-4">
            <Button type="button" className="bg-zinc-700" onClick={() => handleQuit(userId)}>
              Yes, quit
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

