"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { clearMealPlan } from "@/app/store/mealPlanSlice"
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
  const dispatch = useDispatch()

  const handleQuit = async (userId: string) => {
  try {
  // First delete the meal plan
      const mealPlanRes = await axios.delete(`/api/mealplan/${userId}`);
      
      if (mealPlanRes.status === 200 || mealPlanRes.status === 201) {
        // Then delete the tracking data
        const trackingRes = await axios.delete(`/api/mealtracking?userId=${userId}`);
        
        if (trackingRes.status === 200) {
          setIsOpen(false);
          dispatch(clearMealPlan());
          toast.success(mealPlanRes.data.message || "Meal plan deleted", {
            description: "You can get a fresh, customized meal plan anytime—just say the word!",
          });
          router.push('/home');
        } else {
          toast.error("Failed to delete tracking data");
        }
      } else {
        toast.error("Failed to delete meal plan");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Something went wrong when deleting your data");
    }
    };

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
            <Button type="button" className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900" onClick={() => handleQuit(userId)}>
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

