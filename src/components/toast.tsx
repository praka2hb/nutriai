"use client"

import * as React from "react"
import { X } from "lucide-react"

const SuccessToast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="fixed bottom-4 right-4 flex items-center space-x-4 rounded-md border border-green-200 bg-green-50 p-4 text-green-800 shadow-lg">
    <div className="flex-1">
      <p className="font-medium">{message}</p>
    </div>
    <button onClick={onClose} className="text-green-600 hover:text-green-800">
      <X size={18} />
    </button>
  </div>
)

const SuccessToaster = () => {
  const [isVisible, setIsVisible] = React.useState(false)
  const [message, setMessage] = React.useState("")

  const showToast = (msg: string) => {
    setMessage(msg)
    setIsVisible(true)
    setTimeout(() => setIsVisible(false), 3000) // Auto-hide after 3 seconds
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <button
        onClick={() => showToast("Action completed successfully!")}
        className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Show Success Toast
      </button>
      {isVisible && <SuccessToast message={message} onClose={() => setIsVisible(false)} />}
    </div>
  )
}

export default SuccessToaster

